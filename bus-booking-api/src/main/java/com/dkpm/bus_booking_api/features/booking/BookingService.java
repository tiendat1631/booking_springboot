package com.dkpm.bus_booking_api.features.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dkpm.bus_booking_api.domain.booking.Booking;
import com.dkpm.bus_booking_api.domain.booking.BookingDetail;
import com.dkpm.bus_booking_api.domain.booking.BookingRepository;
import com.dkpm.bus_booking_api.domain.booking.BookingStatus;
import com.dkpm.bus_booking_api.domain.booking.CancellationToken;
import com.dkpm.bus_booking_api.domain.booking.CancellationTokenRepository;
import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.domain.security.Account;
import com.dkpm.bus_booking_api.domain.security.AccountRepository;
import com.dkpm.bus_booking_api.domain.security.Role;
import com.dkpm.bus_booking_api.domain.trip.Ticket;
import com.dkpm.bus_booking_api.domain.trip.TicketRepository;
import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripRepository;
import com.dkpm.bus_booking_api.domain.trip.TripStatus;
import com.dkpm.bus_booking_api.features.booking.dto.BookingResponse;
import com.dkpm.bus_booking_api.features.booking.dto.CreateBookingRequest;
import com.dkpm.bus_booking_api.infrastructure.email.IEmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class BookingService implements IBookingService {

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final TicketRepository ticketRepository;
    private final AccountRepository accountRepository;
    private final CancellationTokenRepository cancellationTokenRepository;
    private final IEmailService emailService;

    private static final int BOOKING_EXPIRY_MINUTES = 15;

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, UUID customerId) {
        // 1. Validate trip exists and is available
        Trip trip = tripRepository.findById(request.tripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + request.tripId()));

        if (trip.getStatus() != TripStatus.SCHEDULED) {
            throw new IllegalStateException("Trip is not available for booking");
        }

        // Check if departure time is in the future
        if (trip.getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot book a trip that has already departed");
        }

        // 2. Lock and validate tickets (seats)
        List<Ticket> tickets = ticketRepository.findAndLockByTripIdAndSeatIds(
                request.tripId(), request.seatIds());

        if (tickets.size() != request.seatIds().size()) {
            throw new IllegalArgumentException("Some seats were not found");
        }

        // Check all tickets are available
        for (Ticket ticket : tickets) {
            if (!ticket.isAvailable()) {
                throw new IllegalStateException("Seat " + ticket.getSeatId() + " is not available");
            }
        }

        // 3. Calculate total amount
        BigDecimal totalAmount = tickets.stream()
                .map(Ticket::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. Get customer if logged in
        Account customer = null;
        if (customerId != null) {
            customer = accountRepository.findById(customerId).orElse(null);
        }

        // 5. Create booking
        LocalDateTime now = LocalDateTime.now();
        Booking booking = Booking.builder()
                .bookingCode(generateBookingCode())
                .customer(customer)
                .trip(trip)
                .passengerName(request.passengerName())
                .passengerPhone(request.passengerPhone())
                .passengerEmail(request.passengerEmail())
                .totalAmount(totalAmount)
                .discountAmount(BigDecimal.ZERO)
                .finalAmount(totalAmount)
                .status(BookingStatus.PENDING)
                .bookingTime(now)
                .expiryTime(now.plusMinutes(BOOKING_EXPIRY_MINUTES))
                .notes(request.notes())
                .build();

        // 6. Create booking details and reserve tickets
        for (Ticket ticket : tickets) {
            // Reserve the ticket
            ticket.reserve();
            ticketRepository.save(ticket);

            // Create booking detail
            BookingDetail detail = BookingDetail.builder()
                    .ticket(ticket)
                    .seatId(ticket.getSeatId())
                    .seatPrice(ticket.getPrice())
                    .build();
            booking.addDetail(detail);
        }

        booking = bookingRepository.save(booking);

        // 7. Update trip available seats
        trip.setAvailableSeats(trip.getAvailableSeats() - tickets.size());
        tripRepository.save(trip);

        // 8. Send confirmation email
        emailService.sendBookingConfirmation(booking);

        log.info("Created booking {} for {} seats on trip {}",
                booking.getBookingCode(), tickets.size(), trip.getId());

        return BookingResponse.from(booking);
    }

    @Override
    public BookingResponse getBookingById(UUID bookingId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        return BookingResponse.from(booking);
    }

    @Override
    public BookingResponse getBookingByCode(String bookingCode) {
        Booking booking = bookingRepository.findByBookingCodeWithDetails(bookingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with code: " + bookingCode));
        return BookingResponse.from(booking);
    }

    @Override
    public Page<BookingResponse> getCustomerBookings(UUID customerId, Pageable pageable) {
        return bookingRepository.findByCustomerId(customerId, pageable)
                .map(BookingResponse::from);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(UUID bookingId, UUID callerId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Validate caller authorization
        // - Admin: can cancel any booking
        // - Customer: can only cancel their own booking
        Account caller = accountRepository.findById(callerId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + callerId));

        boolean isAdmin = caller.getRole() == Role.ADMIN;

        if (!isAdmin) {
            // Non-admin logic
            if (booking.getCustomer() == null) {
                throw new IllegalArgumentException("Guest bookings must be cancelled via OTP verification");
            }
            if (!booking.getCustomer().getId().equals(callerId)) {
                throw new IllegalArgumentException("Not authorized to cancel this booking");
            }
        }

        if (!booking.canBeCancelled()) {
            throw new IllegalStateException("Booking cannot be cancelled with status: " + booking.getStatus());
        }

        // Check if trip has already departed
        if (booking.getTrip().getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot cancel booking after trip has departed");
        }

        // Release tickets
        releaseBookingTickets(booking);

        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);

        // Send cancellation email
        emailService.sendBookingCancellation(booking);

        log.info("Cancelled booking {}", booking.getBookingCode());

        return BookingResponse.from(booking);
    }

    @Override
    public Page<BookingResponse> searchBookings(BookingStatus status, String keyword, Pageable pageable) {
        return bookingRepository.searchBookings(status, keyword, pageable)
                .map(BookingResponse::from);
    }

    @Override
    @Transactional
    public void processExpiredBookings() {
        List<Booking> expiredBookings = bookingRepository.findExpiredPendingBookings(LocalDateTime.now());

        for (Booking booking : expiredBookings) {
            try {
                // Release tickets
                releaseBookingTickets(booking);

                // Update status
                booking.setStatus(BookingStatus.EXPIRED);
                bookingRepository.save(booking);

                log.info("Expired booking {}", booking.getBookingCode());
            } catch (Exception e) {
                log.error("Failed to process expired booking {}: {}",
                        booking.getBookingCode(), e.getMessage());
            }
        }

        if (!expiredBookings.isEmpty()) {
            log.info("Processed {} expired bookings", expiredBookings.size());
        }
    }

    @Override
    @Transactional
    public BookingResponse confirmBooking(UUID bookingId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Booking is not in PENDING status");
        }

        // Update ticket status from RESERVED to BOOKED
        for (BookingDetail detail : booking.getDetails()) {
            Ticket ticket = detail.getTicket();
            ticket.book();
            ticketRepository.save(ticket);
        }

        // Update booking status
        booking.setStatus(BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);

        log.info("Confirmed booking {}", booking.getBookingCode());

        return BookingResponse.from(booking);
    }

    @Override
    @Transactional
    public void requestCancelBooking(String bookingCode, String passengerPhone) {
        Booking booking = bookingRepository.findByBookingCodeWithDetails(bookingCode)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with code: " + bookingCode));

        // Verify phone number
        if (!booking.getPassengerPhone().equals(passengerPhone)) {
            throw new IllegalArgumentException("Phone number does not match");
        }

        if (!booking.canBeCancelled()) {
            throw new IllegalStateException("Booking cannot be cancelled with status: " + booking.getStatus());
        }

        // Delete existing token if any
        cancellationTokenRepository.deleteByBookingId(booking.getId());

        // Generate OTP
        String otpCode = generateOtpCode();

        // Create and save token
        CancellationToken token = CancellationToken.create(booking, otpCode);
        cancellationTokenRepository.save(token);

        // Send OTP via email
        emailService.sendCancellationOtp(booking, otpCode);

        log.info("Sent cancellation OTP for booking {}", bookingCode);
    }

    @Override
    @Transactional
    public BookingResponse confirmCancelBooking(String bookingCode, String otpCode) {
        CancellationToken token = cancellationTokenRepository.findByBookingCode(bookingCode)
                .orElseThrow(() -> new IllegalStateException(
                        "No cancellation request found. Please request cancellation first."));

        // Check if expired
        if (token.isExpired()) {
            cancellationTokenRepository.delete(token);
            throw new IllegalStateException("OTP has expired. Please request a new one.");
        }

        // Check max attempts
        if (token.hasExceededMaxAttempts()) {
            cancellationTokenRepository.delete(token);
            throw new IllegalStateException("Maximum attempts exceeded. Please request a new OTP.");
        }

        // Verify OTP
        if (!token.getOtpCode().equals(otpCode)) {
            token.incrementAttempts();
            cancellationTokenRepository.save(token);
            throw new IllegalArgumentException("Invalid OTP code");
        }

        // OTP verified - proceed with cancellation
        Booking booking = token.getBooking();

        // Check if trip has already departed
        if (booking.getTrip().getDepartureTime().isBefore(LocalDateTime.now())) {
            cancellationTokenRepository.delete(token);
            throw new IllegalStateException("Cannot cancel booking after trip has departed");
        }

        // Release tickets
        releaseBookingTickets(booking);

        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);

        // Delete token
        cancellationTokenRepository.delete(token);

        // Send cancellation confirmation email
        emailService.sendBookingCancellation(booking);

        log.info("Guest cancelled booking {} via OTP", booking.getBookingCode());

        return BookingResponse.from(booking);
    }

    /**
     * Release tickets when booking is cancelled or expired
     */
    private void releaseBookingTickets(Booking booking) {
        for (BookingDetail detail : booking.getDetails()) {
            Ticket ticket = detail.getTicket();
            ticket.release();
            ticketRepository.save(ticket);
        }

        // Update trip available seats
        Trip trip = booking.getTrip();
        trip.setAvailableSeats(trip.getAvailableSeats() + booking.getDetails().size());
        tripRepository.save(trip);
    }

    /**
     * Generate unique booking code
     * Format: BK + YYYYMMDD + 5 random digits
     */
    private String generateBookingCode() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = String.format("%05d", ThreadLocalRandom.current().nextInt(100000));
        String code = "BK" + datePart + randomPart;

        // Ensure uniqueness
        while (bookingRepository.existsByBookingCode(code)) {
            randomPart = String.format("%05d", ThreadLocalRandom.current().nextInt(100000));
            code = "BK" + datePart + randomPart;
        }

        return code;
    }

    @Override
    @Transactional
    public void expireBooking(UUID bookingId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Only expire if booking is in PENDING status and actually expired
        if (booking.getStatus() != BookingStatus.PENDING) {
            log.warn("Attempted to expire booking {} with status {}", booking.getBookingCode(), booking.getStatus());
            return;
        }

        if (!booking.isExpired()) {
            log.warn("Attempted to expire booking {} that is not yet expired", booking.getBookingCode());
            return;
        }

        // Release seats
        releaseBookingSeats(booking);

        // Update status
        booking.setStatus(BookingStatus.EXPIRED);
        bookingRepository.save(booking);

        log.info("Expired booking {}", booking.getBookingCode());
    }

    /**
     * Generate 6-digit OTP code
     */
    private String generateOtpCode() {
        return String.format("%06d", ThreadLocalRandom.current().nextInt(1000000));
    }
}

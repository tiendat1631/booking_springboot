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
import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.domain.security.Account;
import com.dkpm.bus_booking_api.domain.security.AccountRepository;
import com.dkpm.bus_booking_api.domain.trip.Trip;
import com.dkpm.bus_booking_api.domain.trip.TripRepository;
import com.dkpm.bus_booking_api.domain.trip.TripSeat;
import com.dkpm.bus_booking_api.domain.trip.TripSeatRepository;
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
    private final TripSeatRepository tripSeatRepository;
    private final AccountRepository accountRepository;
    private final IEmailService emailService;

    private static final int BOOKING_EXPIRY_MINUTES = 15;

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, UUID customerId) {
        // 1. Validate trip exists and is available
        Trip trip = tripRepository.findByIdWithDetails(request.tripId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + request.tripId()));

        if (trip.getStatus() != com.dkpm.bus_booking_api.domain.trip.TripStatus.SCHEDULED) {
            throw new IllegalStateException("Trip is not available for booking");
        }

        // Check if departure time is in the future
        if (trip.getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot book a trip that has already departed");
        }

        // 2. Lock and validate seats
        List<TripSeat> tripSeats = tripSeatRepository.findAndLockByTripIdAndSeatIds(
                request.tripId(), request.seatIds());

        if (tripSeats.size() != request.seatIds().size()) {
            throw new IllegalArgumentException("Some seats were not found");
        }

        // Check all seats are available
        for (TripSeat seat : tripSeats) {
            if (!seat.isAvailable()) {
                throw new IllegalStateException("Seat " + seat.getSeatId() + " is not available");
            }
        }

        // 3. Calculate total amount
        BigDecimal totalAmount = tripSeats.stream()
                .map(seat -> seat.getFinalPrice(trip.getPrice()))
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

        // 6. Create booking details and reserve seats
        for (TripSeat tripSeat : tripSeats) {
            // Reserve the seat
            tripSeat.reserve();
            tripSeatRepository.save(tripSeat);

            // Create booking detail
            BookingDetail detail = BookingDetail.builder()
                    .tripSeat(tripSeat)
                    .seatId(tripSeat.getSeatId())
                    .seatPrice(tripSeat.getFinalPrice(trip.getPrice()))
                    .build();
            booking.addDetail(detail);
        }

        booking = bookingRepository.save(booking);

        // 7. Update trip available seats
        trip.setAvailableSeats(trip.getAvailableSeats() - tripSeats.size());
        tripRepository.save(trip);

        // 8. Send confirmation email
        emailService.sendBookingConfirmation(booking);

        log.info("Created booking {} for {} seats on trip {}",
                booking.getBookingCode(), tripSeats.size(), trip.getId());

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
    public BookingResponse cancelBooking(UUID bookingId, UUID customerId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Validate owner (skip if admin - customerId is null)
        if (customerId != null && booking.getCustomer() != null &&
                !booking.getCustomer().getId().equals(customerId)) {
            throw new IllegalArgumentException("Not authorized to cancel this booking");
        }

        if (!booking.canBeCancelled()) {
            throw new IllegalStateException("Booking cannot be cancelled with status: " + booking.getStatus());
        }

        // Release seats
        releaseBookingSeats(booking);

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
                // Release seats
                releaseBookingSeats(booking);

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

        // Update seat status from RESERVED to BOOKED
        for (BookingDetail detail : booking.getDetails()) {
            TripSeat tripSeat = detail.getTripSeat();
            tripSeat.book();
            tripSeatRepository.save(tripSeat);
        }

        // Update booking status
        booking.setStatus(BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);

        log.info("Confirmed booking {}", booking.getBookingCode());

        return BookingResponse.from(booking);
    }

    /**
     * Release seats when booking is cancelled or expired
     */
    private void releaseBookingSeats(Booking booking) {
        for (BookingDetail detail : booking.getDetails()) {
            TripSeat tripSeat = detail.getTripSeat();
            tripSeat.release();
            tripSeatRepository.save(tripSeat);
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
}

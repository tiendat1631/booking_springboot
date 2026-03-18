package com.dkpm.bus_booking_api.features.statistic;

import com.dkpm.bus_booking_api.domain.booking.BookingRepository;
import com.dkpm.bus_booking_api.domain.payment.PaymentRepository;
import com.dkpm.bus_booking_api.domain.trip.TicketRepository;
import com.dkpm.bus_booking_api.domain.trip.TripRepository;
import com.dkpm.bus_booking_api.features.statistic.dto.DashboardStatisticResponse;
import com.dkpm.bus_booking_api.features.statistic.dto.TripStatisticResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
@Service
@RequiredArgsConstructor
public class StatisticService implements IStatisticService{
    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final TicketRepository ticketRepository;
    private final PaymentRepository paymentRepository;
    @Override
    public DashboardStatisticResponse getDashboardStats(){
        long totalBookings = bookingRepository.count();
        long totalTrips = tripRepository.count();
        long totalTicketsSold = ticketRepository.getTicketsSold();
        BigDecimal revenueToday = paymentRepository.getRevenueToday();
        BigDecimal revenueThisMonth = paymentRepository.getRevenueThisMonth();
        BigDecimal revenueThisYear = paymentRepository.getRevenueThisYear();
        BigDecimal totalRevenueByTrip = paymentRepository.getTotalRevenueByTrip();
        return new DashboardStatisticResponse(
                totalBookings,
                totalTrips,
                totalTicketsSold,
                revenueToday,
                revenueThisMonth,
                revenueThisYear,
                totalRevenueByTrip

        );
    }

//    @Override
//    DashboardStatisticResponse getStatisticsByRange(LocalDate startDate, LocalDate endDate){
//
//    }
//
    @Override
    public TripStatisticResponse getStatisticsByTrip(){
        long totalTicketsSold = ticketRepository.getTicketsSold();
        long totalTicketsCancelled = ticketRepository.getTotalTicketsCancelled();
        BigDecimal revenue = paymentRepository.getTotalRevenueByTrip();
        return new TripStatisticResponse(
                totalTicketsSold,
                totalTicketsCancelled,
                revenue
        );
    }

}

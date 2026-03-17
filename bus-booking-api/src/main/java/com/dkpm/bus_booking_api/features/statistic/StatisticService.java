package com.dkpm.bus_booking_api.features.statistic;

import com.dkpm.bus_booking_api.domain.booking.BookingRepository;
import com.dkpm.bus_booking_api.domain.payment.PaymentRepository;
import com.dkpm.bus_booking_api.domain.trip.TicketRepository;
import com.dkpm.bus_booking_api.domain.trip.TripRepository;
import com.dkpm.bus_booking_api.features.statistic.dto.DashboardStatisticResponse;
import com.dkpm.bus_booking_api.features.trip.dto.PopularTripResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
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
        long totalTicketsSold = ticketRepository.countSoldTickets();
        BigDecimal revenueToday = paymentRepository.getRevenueToday();
        BigDecimal revenueThisMonth = paymentRepository.getRevenueThisMonth();
        BigDecimal revenueThisYear = paymentRepository.getRevenueThisYear();
        BigDecimal totalRevenueByTrip = paymentRepository.getTotalRevenueByTrip();
        Pageable pageable = PageRequest.of(0,5);
        List<PopularTripResponse> popularTrips= tripRepository.findPopularTrips( pageable);
        return new DashboardStatisticResponse(
                totalBookings,
                totalTrips,
                totalTicketsSold,
                revenueToday,
                revenueThisMonth,
                revenueThisYear,
                totalRevenueByTrip,
                popularTrips
        );
    }

//    @Override
//    DashboardStatisticResponse getStatisticsByRange(LocalDate startDate, LocalDate endDate){
//
//    }
//
//    @Override
//    DashboardStatisticResponse getStatisticsByTrip(UUID tripId){
//
//    }

}

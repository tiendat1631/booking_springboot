package org.application.booking.application.feature.bus;

import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.repository.BusRepository;
import org.springframework.stereotype.Service;

@Service
public class AddBusUseCase {
    private final BusRepository busRepository;

    public AddBusUseCase(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    public void addBus (AddBusRequest addBusRequest) {
        Bus bus = new Bus(addBusRequest.numberOfSeats, addBusRequest.busType);

        busRepository.save(bus);
    }
}

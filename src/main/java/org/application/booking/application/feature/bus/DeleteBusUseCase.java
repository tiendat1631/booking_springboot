package org.application.booking.application.feature.bus;

import org.application.booking.repository.BusRepository;
import org.springframework.stereotype.Service;

@Service
public class DeleteBusUseCase {
    private final BusRepository busRepository;
    public DeleteBusUseCase(BusRepository busRepository) {
        this.busRepository = busRepository;
    }
    public void deleteBus(DeleteBusRequest deleteBusRequest) {
        busRepository.deleteById(deleteBusRequest.getBusId());
    }
}

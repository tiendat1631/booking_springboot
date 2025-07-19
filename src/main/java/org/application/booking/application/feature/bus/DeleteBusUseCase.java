package org.application.booking.application.feature.bus;

import lombok.RequiredArgsConstructor;
import org.application.booking.repository.BusRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeleteBusUseCase {

    private final BusRepository busRepository;

    public void deleteBus(UUID busId) {
        if (!busRepository.existsById(busId)) {
            throw new IllegalArgumentException("Bus with ID " + busId + " does not exist.");
        }

        busRepository.deleteById(busId);
    }
}

package org.application.booking.application.feature.bus;

import lombok.AllArgsConstructor;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.repository.BusRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class BusService {
    private final BusRepository busRepository;

    public List<Bus> getBuses(Pageable request) {
        return busRepository.findAll(request).getContent();
    }

    public Bus getBus(UUID busId) {
        return busRepository.getReferenceById(busId);
    }

    public void addBus(AddBusRequest request) {
        Bus bus = Bus.Create(request.busType(), request.licensePlate());
        busRepository.save(bus);
    }

    public void deleteBus(UUID busId) {
        busRepository.deleteById(busId);
    }

    public void updateLicensePlate(UUID busId, UpdateLicensePlateRequest request) {
        Bus bus = busRepository.getReferenceById(busId);
        bus.setLicensePlate(request.licensePlate());
        busRepository.save(bus);
    }
}

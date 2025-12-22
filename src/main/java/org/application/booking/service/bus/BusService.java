package org.application.booking.service.bus;

import lombok.AllArgsConstructor;
import org.application.booking.controller.dto.AddBusRequest;
import org.application.booking.controller.dto.UpdateLicensePlateRequest;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.exception.DuplicateFieldException;
import org.application.booking.exception.NotFoundException;
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
        return busRepository.findById(busId)
                .orElseThrow(() -> new NotFoundException(Bus.class, busId));
    }

    public Bus addBus(AddBusRequest request) {
        String licensePlate = request.licensePlate();
        if (busRepository.existsByLicensePlate(licensePlate))
            throw new DuplicateFieldException("LicensePlate", licensePlate);

        Bus bus = Bus.Create(request.busType(), licensePlate);
        return busRepository.save(bus);
    }

    public void deleteBus(UUID busId) {
        busRepository.deleteById(busId);
    }

    public Bus updateLicensePlate(UUID busId, UpdateLicensePlateRequest request) {
        String licensePlate = request.licensePlate();
        if (busRepository.existsByLicensePlate(licensePlate))
            throw new DuplicateFieldException("LicensePlate", licensePlate);

        Bus bus = busRepository.getReferenceById(busId);
        bus.setLicensePlate(licensePlate);
        return busRepository.save(bus);
    }
}

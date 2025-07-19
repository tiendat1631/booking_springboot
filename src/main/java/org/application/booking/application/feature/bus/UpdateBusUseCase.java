package org.application.booking.application.feature.bus;

import lombok.RequiredArgsConstructor;
import org.application.booking.domain.aggregates.BusModel.Bus;
import org.application.booking.domain.aggregates.BusModel.BusType;
import org.application.booking.repository.BusRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UpdateBusUseCase {

    private final BusRepository busRepository;

    public void updateBus(UUID id, UpdateBusRequest request) {
        Optional<Bus> optionalBus = busRepository.findById(id);

        if (optionalBus.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy xe buýt với ID: " + id);
        }

        Bus bus = optionalBus.get();

        // Cập nhật loại xe
        BusType newType = request.getType();
        bus.setType(newType);

        // Cập nhật số ghế theo loại xe
        if (newType == BusType.normal) {
            bus.setNumberOfSeats(40);
        } else if (newType == BusType.limousine) {
            bus.setNumberOfSeats(22);
        }

        // Không tạo lại danh sách ghế (seats) ở đây để tránh lỗi liên kết trip/ticket cũ

        busRepository.save(bus);
    }
}

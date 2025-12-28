package com.dkpm.bus_booking_api.features.station;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dkpm.bus_booking_api.features.station.dto.CreateStationRequest;
import com.dkpm.bus_booking_api.features.station.dto.StationResponse;
import com.dkpm.bus_booking_api.features.station.dto.UpdateStationRequest;

public interface IStationService {

    Page<StationResponse> searchStations(String name, String provinceName, Boolean active,
            Pageable pageable);

    StationResponse getStationById(UUID id);

    StationResponse createStation(CreateStationRequest request);

    StationResponse updateStation(UUID id, UpdateStationRequest request);

    void deleteStation(UUID id);
}

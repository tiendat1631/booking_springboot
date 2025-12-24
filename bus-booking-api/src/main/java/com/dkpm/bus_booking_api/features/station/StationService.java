package com.dkpm.bus_booking_api.features.station;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.domain.station.Station;
import com.dkpm.bus_booking_api.domain.station.StationRepository;
import com.dkpm.bus_booking_api.features.station.dto.CreateStationRequest;
import com.dkpm.bus_booking_api.features.station.dto.StationResponse;
import com.dkpm.bus_booking_api.features.station.dto.UpdateStationRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StationService implements IStationService {

    private final StationRepository stationRepository;

    @Override
    public Page<StationResponse> searchStations(String keyword, Pageable pageable) {
        return stationRepository.searchStations(keyword, pageable)
                .map(StationResponse::from);
    }

    @Override
    public StationResponse getStationById(UUID id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with id: " + id));
        return StationResponse.from(station);
    }

    @Override
    public StationResponse getStationByCode(String code) {
        Station station = stationRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with code: " + code));
        return StationResponse.from(station);
    }

    @Override
    public Page<StationResponse> getStationsByCity(String city, Pageable pageable) {
        return stationRepository.findByCity(city, pageable)
                .map(StationResponse::from);
    }

    @Override
    public Page<StationResponse> getAllActiveStations(Pageable pageable) {
        return stationRepository.findByActiveTrueAndDeletedFalse(pageable)
                .map(StationResponse::from);
    }

    @Override
    @Transactional
    public StationResponse createStation(CreateStationRequest request) {
        if (stationRepository.existsByCode(request.code())) {
            throw new IllegalArgumentException("Station code already exists: " + request.code());
        }

        Station station = Station.builder()
                .name(request.name())
                .code(request.code().toUpperCase())
                .address(request.address())
                .city(request.city())
                .province(request.province())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .active(true)
                .build();

        station = stationRepository.save(station);
        return StationResponse.from(station);
    }

    @Override
    @Transactional
    public StationResponse updateStation(UUID id, UpdateStationRequest request) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with id: " + id));

        if (request.name() != null) {
            station.setName(request.name());
        }
        if (request.code() != null) {
            if (!station.getCode().equals(request.code()) && stationRepository.existsByCode(request.code())) {
                throw new IllegalArgumentException("Station code already exists: " + request.code());
            }
            station.setCode(request.code().toUpperCase());
        }
        if (request.address() != null) {
            station.setAddress(request.address());
        }
        if (request.city() != null) {
            station.setCity(request.city());
        }
        if (request.province() != null) {
            station.setProvince(request.province());
        }
        if (request.latitude() != null) {
            station.setLatitude(request.latitude());
        }
        if (request.longitude() != null) {
            station.setLongitude(request.longitude());
        }
        if (request.active() != null) {
            station.setActive(request.active());
        }

        station = stationRepository.save(station);
        return StationResponse.from(station);
    }

    @Override
    @Transactional
    public void deleteStation(UUID id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with id: " + id));

        station.setDeleted(true);
        station.setActive(false);
        stationRepository.save(station);
    }
}

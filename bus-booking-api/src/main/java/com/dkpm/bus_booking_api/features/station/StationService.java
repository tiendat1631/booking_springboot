package com.dkpm.bus_booking_api.features.station;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.domain.station.Province;
import com.dkpm.bus_booking_api.domain.station.Station;
import com.dkpm.bus_booking_api.domain.station.StationRepository;
import com.dkpm.bus_booking_api.features.station.dto.CreateStationRequest;
import com.dkpm.bus_booking_api.features.station.dto.StationResponse;
import com.dkpm.bus_booking_api.features.station.dto.UpdateStationRequest;
import com.dkpm.bus_booking_api.infrastructure.geocoding.IGeocodingService;
import com.dkpm.bus_booking_api.infrastructure.geocoding.dto.GeoCoordinates;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class StationService implements IStationService {

    private final StationRepository stationRepository;
    private final IGeocodingService geocodingService;

    @Override
    public Page<StationResponse> searchStations(String name, List<String> provinces, Boolean active,
            Pageable pageable) {
        return stationRepository.searchStations(name, provinces, active, pageable)
                .map(StationResponse::from);
    }

    @Override
    public StationResponse getStationById(UUID id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Station not found with id: " + id));
        return StationResponse.from(station);
    }

    @Override
    @Transactional
    public StationResponse createStation(CreateStationRequest request) {
        Province province = Province.builder()
                .code(request.province().code())
                .name(request.province().name())
                .codename(request.province().codename())
                .build();

        String fullAddressForSearch = request.address() + ", " + request.province().name();
        GeoCoordinates coords = geocodingService.getCoordinates(fullAddressForSearch);

        Station station = Station.builder()
                .name(request.name())
                .address(request.address())
                .province(province)
                .latitude(coords.latitude())
                .longitude(coords.longitude())
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

        boolean needToRecalculateCoordinates = false;

        if (request.name() != null) {
            station.setName(request.name());
        }
        if (request.address() != null) {
            station.setAddress(request.address());
        }

        if (request.province() != null) {
            Province currentProvince = station.getProvince();

            if (currentProvince == null)
                currentProvince = new Province();

            if (request.province().code() != null)
                currentProvince.setCode(request.province().code());
            if (request.province().name() != null)
                currentProvince.setName(request.province().name());
            if (request.province().codename() != null)
                currentProvince.setCodename(request.province().codename());

            station.setProvince(currentProvince);
            needToRecalculateCoordinates = true;
        }

        if (needToRecalculateCoordinates) {
            String fullAddress = station.getAddress() + ", " + station.getProvince().getName();
            log.info("Address changed. Recalculating coordinates via OSM for: {}", fullAddress);

            GeoCoordinates coords = geocodingService.getCoordinates(fullAddress);
            station.setLatitude(coords.latitude());
            station.setLongitude(coords.longitude());
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

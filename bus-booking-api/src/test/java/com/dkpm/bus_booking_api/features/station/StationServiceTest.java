package com.dkpm.bus_booking_api.features.station;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import com.dkpm.bus_booking_api.domain.exception.ResourceNotFoundException;
import com.dkpm.bus_booking_api.domain.station.Station;
import com.dkpm.bus_booking_api.domain.station.StationRepository;
import com.dkpm.bus_booking_api.features.station.dto.CreateStationRequest;
import com.dkpm.bus_booking_api.features.station.dto.StationResponse;
import com.dkpm.bus_booking_api.features.station.dto.UpdateStationRequest;
import com.dkpm.bus_booking_api.test.TestDataFactory;

import java.util.List;

@ExtendWith(MockitoExtension.class)
@DisplayName("StationService Unit Tests")
class StationServiceTest {

    @Mock
    private StationRepository stationRepository;

    @InjectMocks
    private StationService stationService;

    private Station testStation;

    @BeforeEach
    void setUp() {
        testStation = TestDataFactory.createStation("Test Station", "TST001");
    }

    @Test
    @DisplayName("createStation - success")
    void createStation_success() {
        // Given
        CreateStationRequest request = new CreateStationRequest(
                "New Station", "NST001", "123 New St", "New City", "New Province", null, null);

        when(stationRepository.existsByCode("NST001")).thenReturn(false);
        when(stationRepository.save(any(Station.class))).thenAnswer(invocation -> {
            Station saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });

        // When
        StationResponse response = stationService.createStation(request);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.name()).isEqualTo("New Station");
        assertThat(response.code()).isEqualTo("NST001");
        verify(stationRepository).save(any(Station.class));
    }

    @Test
    @DisplayName("createStation - duplicate code throws exception")
    void createStation_duplicateCode_throwsException() {
        // Given
        CreateStationRequest request = new CreateStationRequest(
                "New Station", "TST001", "123 New St", "New City", "New Province", null, null);

        when(stationRepository.existsByCode("TST001")).thenReturn(true);

        // When/Then
        assertThatThrownBy(() -> stationService.createStation(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    @DisplayName("getStationById - not found throws exception")
    void getStationById_notFound_throwsException() {
        // Given
        UUID id = UUID.randomUUID();
        when(stationRepository.findById(id)).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> stationService.getStationById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not found");
    }

    @Test
    @DisplayName("getStationById - success")
    void getStationById_success() {
        // Given
        when(stationRepository.findById(testStation.getId())).thenReturn(Optional.of(testStation));

        // When
        StationResponse response = stationService.getStationById(testStation.getId());

        // Then
        assertThat(response).isNotNull();
        assertThat(response.name()).isEqualTo(testStation.getName());
    }

    @Test
    @DisplayName("updateStation - partial update success")
    void updateStation_partialUpdate_success() {
        // Given
        UpdateStationRequest request = new UpdateStationRequest(
                "Updated Name", null, null, null, null, null, null, null);

        when(stationRepository.findById(testStation.getId())).thenReturn(Optional.of(testStation));
        when(stationRepository.save(any(Station.class))).thenReturn(testStation);

        // When
        StationResponse response = stationService.updateStation(testStation.getId(), request);

        // Then
        assertThat(response).isNotNull();
        verify(stationRepository).save(any(Station.class));
    }

    @Test
    @DisplayName("deleteStation - soft deletes")
    void deleteStation_softDeletes() {
        // Given
        when(stationRepository.findById(testStation.getId())).thenReturn(Optional.of(testStation));
        when(stationRepository.save(any(Station.class))).thenReturn(testStation);

        // When
        stationService.deleteStation(testStation.getId());

        // Then
        verify(stationRepository).save(any(Station.class));
        assertThat(testStation.isDeleted()).isTrue();
        assertThat(testStation.isActive()).isFalse();
    }

    @Test
    @DisplayName("searchStations - returns paginated results")
    void searchStations_returnsPaginatedResults() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Station> stationPage = new PageImpl<>(List.of(testStation));
        when(stationRepository.searchStations("test", pageable)).thenReturn(stationPage);

        // When
        Page<StationResponse> response = stationService.searchStations("test", pageable);

        // Then
        assertThat(response).isNotEmpty();
        assertThat(response.getContent()).hasSize(1);
    }
}

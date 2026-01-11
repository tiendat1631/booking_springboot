package com.dkpm.bus_booking_api.infrastructure.geocoding;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.dkpm.bus_booking_api.infrastructure.geocoding.dto.GeoCoordinates;
import com.dkpm.bus_booking_api.infrastructure.geocoding.dto.NominatimResponse;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class OpenStreetMapService implements IGeocodingService {

    private final RestClient restClient;

    public OpenStreetMapService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://nominatim.openstreetmap.org")
                .defaultHeader("User-Agent", "BusBookingApp/1.0 (contact@domain.com)")
                .build();
    }

    @Override
    public GeoCoordinates getCoordinates(String fullAddress) {
        try {
            Thread.sleep(1000);

            String uri = UriComponentsBuilder.fromPath("/search")
                    .queryParam("q", fullAddress)
                    .queryParam("format", "json")
                    .queryParam("limit", "1")
                    .build()
                    .toUriString();

            NominatimResponse[] response = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(NominatimResponse[].class);

            if (response != null && response.length > 0) {
                return new GeoCoordinates(
                        Double.valueOf(response[0].lat()),
                        Double.valueOf(response[0].lon()));
            }
        } catch (Exception e) {
            log.error("OSM Geocoding error: " + e.getMessage());
        }

        return new GeoCoordinates(null, null);
    }

}

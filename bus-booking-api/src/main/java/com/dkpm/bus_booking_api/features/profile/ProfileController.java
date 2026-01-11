package com.dkpm.bus_booking_api.features.profile;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dkpm.bus_booking_api.application.response.ApiResponse;
import com.dkpm.bus_booking_api.features.profile.dto.ProfileResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final IProfileService profileService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        UUID accountId = UUID.fromString(jwt.getSubject());
        ProfileResponse profile = profileService.getProfile(accountId);
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile retrieved successfully"));
    }
}

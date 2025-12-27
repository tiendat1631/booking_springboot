package com.dkpm.bus_booking_api.features.profile;

import com.dkpm.bus_booking_api.features.profile.dto.ProfileResponse;

import java.util.UUID;

public interface IProfileService {

    ProfileResponse getProfile(UUID accountId);
}

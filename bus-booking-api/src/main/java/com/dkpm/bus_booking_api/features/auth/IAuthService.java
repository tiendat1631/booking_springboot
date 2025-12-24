package com.dkpm.bus_booking_api.features.auth;

import com.dkpm.bus_booking_api.features.auth.dto.RegisterRequest;

public interface IAuthService {
    void register(RegisterRequest request);

    void verifyEmail(String token);
}

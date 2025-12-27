package com.dkpm.bus_booking_api.features.auth;

import com.dkpm.bus_booking_api.features.auth.dto.LoginRequest;
import com.dkpm.bus_booking_api.features.auth.dto.RegisterRequest;
import com.dkpm.bus_booking_api.features.auth.dto.TokenResponse;

public interface IAuthService {
    void register(RegisterRequest request);

    void verifyEmail(String token);

    TokenResponse login(LoginRequest request);

    TokenResponse refreshToken(String refreshToken);

    void logout(String refreshToken);
}

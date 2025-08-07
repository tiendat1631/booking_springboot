package org.application.booking.presentation.DTO;

import lombok.Getter;

@Getter
public class LoginResponse {
    private String token;
//    private String refreshToken;
    public LoginResponse(String token){
        this.token = token;
//        this.refreshToken = refreshToken;
    }


}

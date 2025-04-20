package presentation.DTO;

import lombok.Getter;

@Getter
public class LoginResponse {
    private String token;
    private String refreshToken;
    public LoginResponse(String token, String refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
    }


}

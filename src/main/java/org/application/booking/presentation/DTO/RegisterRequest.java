package org.application.booking.presentation.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String username;
    @NotBlank
    private String email;
    @NotNull(message = "Age is required")
    @Min(value = 18, message = "Age cannot be negative!!")
    private int age;
    @NotBlank
    private String password;
   /* @NotBlank
    private String phoneNum;*/
}

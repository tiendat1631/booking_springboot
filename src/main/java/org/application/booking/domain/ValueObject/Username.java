package org.application.booking.domain.ValueObject;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Embeddable
@EqualsAndHashCode
@Getter
public class Username {
    @Column(name = "username", nullable = false, unique = true)
    private String username;

    public static Username CreateUsername(String username) {

        //logic
        if(isValidUsername(username)) {
            return new Username(username);
        }else{
            throw new IllegalArgumentException("Invalid username");
        }
    }
    private static boolean isValidUsername(String username) {
        String regex = "^[a-zA-Z][a-zA-Z0-9_]{2,19}$";
        return username != null && username.matches(regex);
    }

}

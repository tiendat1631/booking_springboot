package org.application.booking.domain.aggregates.UserModel;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import org.application.booking.domain.aggregates.UserModel.exception.InvalidEmailException;

@AllArgsConstructor
@NoArgsConstructor
@Embeddable
@Getter
@EqualsAndHashCode
public class Email {
    @Column(unique = true, nullable = false)
    private String email;

    // vi sao lai static ở đây (Tien Dat)
    public static Email createEmail(String email) {
        if (isValidEmail(email)) {
            return new Email(email);
        }else {
            throw new InvalidEmailException();
        }
    }
    private static boolean isValidEmail(String email) {
        String regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email != null && email.matches(regex);
    }
}

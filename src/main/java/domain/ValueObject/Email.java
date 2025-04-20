package domain.ValueObject;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;

@Embeddable
@Getter
public class Email {
    @Column(unique = true, nullable = false)
    private String email;
    private Email(String email) {
        this.email = email;
    }

    public Email(){}
    public static Email email(String email) {
        if (isValidEmail(email)) {
            return new Email(email);
        }else {
            throw new IllegalArgumentException("Invalid email");
        }
    }
    private static boolean isValidEmail(String email) {
        String regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        return email != null && email.matches(regex);
    }
}

package domain.ValueObject;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;

@Embeddable
@Getter
public class Username {
    @Column(unique = true, nullable = false)
    private String username;

    private Username(String username) {
        this.username = username;
    }

    public Username() {
    }

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

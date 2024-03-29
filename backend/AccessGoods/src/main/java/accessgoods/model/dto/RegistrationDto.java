package accessgoods.model.dto;

import accessgoods.model.Localization;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.regex.Pattern;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class RegistrationDto {

    private static final String regexPattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
    private static final Pattern emailRegex = Pattern.compile(regexPattern);
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String photo;
    private Double longitude;
    private Double latitude;
    private String locationName;

    public static boolean validateEmail(String emailAddress) {
        return emailRegex
                .matcher(emailAddress)
                .matches();
    }
}

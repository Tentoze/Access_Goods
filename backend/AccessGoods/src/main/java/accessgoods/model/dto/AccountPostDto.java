package accessgoods.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountPostDto {
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String photo;
    private Double longitude;
    private Double latitude;
    private String locationName;
}

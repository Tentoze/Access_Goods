package accessgoods.model.dto;

import accessgoods.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AccountDto {

    private Long id;

    private String email;

    private String firstName;

    private String lastName;

    private String phoneNumber;

    private boolean isEnabled = true;

    private Role role = Role.CLIENT;

    private String password;

}

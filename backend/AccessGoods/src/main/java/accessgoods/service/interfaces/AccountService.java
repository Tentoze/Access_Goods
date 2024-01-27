package accessgoods.service.interfaces;



import accessgoods.model.Account;
import accessgoods.model.AccountDetails;
import accessgoods.model.Role;
import accessgoods.model.dto.AccountPostDto;
import accessgoods.model.dto.RegistrationDto;
import accessgoods.model.dto.SignInDto;

import java.util.List;

public interface AccountService {

    Account getAccount(Long id);
    Account getAccount(String username);

    List<Account> getAccounts();

    AccountDetails signIn(SignInDto singInForm);

    String generateJwtToken(AccountDetails clientDetails, String password);

    void changePass(String email, String oldPassword, String newPassword);

    void archive(String username);

    void active(String username);

    void changeRole(Long accountId, Role role);

    List<Account> getAllArchivedClients();

    List<Account> getAllActiveClients();

    Long register(RegistrationDto registrationForm);

    Long deleteUser(Long accountId);
    Account updateAccount(AccountPostDto accountPostDto, Long accountId);
}

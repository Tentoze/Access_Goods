package accessgoods.service;

import accessgoods.model.Account;
import accessgoods.model.AccountDetails;
import accessgoods.model.Localization;
import accessgoods.model.Role;
import accessgoods.model.dto.AccountPostDto;
import accessgoods.model.dto.RegistrationDto;
import accessgoods.model.dto.SignInDto;
import accessgoods.repository.AccountRepository;
import accessgoods.service.interfaces.AccountService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final AuthenticationManager authenticationManager;
    @Autowired
    private final AccountDetailsService accountDetailsService;
    private final JwtEncoder jwtEncoder;
    @Autowired
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    @Value("${jwt.expiration.seconds}")
    private long expirationTime;

    @Override
    @Transactional
    public Long register(RegistrationDto registrationForm) {
        boolean isValidLogin = RegistrationDto.validateEmail(registrationForm.getEmail());
        boolean checkLogin = accountRepository.findByEmail(registrationForm.getEmail()).isPresent();
        if (!isValidLogin) {
            throw new IllegalStateException("email not valid");
        }

        if (checkLogin && !accountRepository.findByEmail(registrationForm.getEmail()).get().isEnabled()) {
            Account account = accountRepository.findByEmail(registrationForm.getEmail())
                    .orElseThrow(IllegalStateException::new);
            account.setEnabled(true);
            account.setModifiedAt(LocalDateTime.now());
            accountRepository.save(account);
            return accountRepository.findByEmail(registrationForm.getEmail()).get().getId();
        } else {
            if (checkLogin) {
                throw new IllegalStateException("Email is taken by another user");
            }
        }

        return accountRepository.save(Account.builder()
                .email(registrationForm.getEmail())
                .firstName(registrationForm.getFirstName())
                .lastName(registrationForm.getLastName())
                .phoneNumber(registrationForm.getPhoneNumber())
                .photo(registrationForm.getPhoto())
                .role(Role.CLIENT)
                .createdAt(LocalDateTime.now())
                .localization(new Localization(registrationForm.getLongitude(), registrationForm.getLatitude(), registrationForm.getLocationName()))
                .isEnabled(true)
                .password(bCryptPasswordEncoder.encode(registrationForm.getPassword())).build()).getId();
    }


    @Override
    public AccountDetails signIn(SignInDto singInForm) {
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(singInForm.getEmail(), singInForm.getPassword()));

        return (AccountDetails) authentication.getPrincipal();
    }

    @Override
    public String generateJwtToken(AccountDetails accountDetails, String password) {
        Instant now = Instant.now();
        long expiry = expirationTime;

        String roles = accountDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.joining(" "));

        JwtClaimsSet claims =
                JwtClaimsSet.builder()
                        .issuedAt(now)
                        .expiresAt(now.plusSeconds(expiry))
                        .subject(accountDetails.getUsername())
                        .claim("scp", roles)
                        .claim("pas", password)
                        .build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    @Transactional
    public void changeEmail(String email) {
        if (RegistrationDto.validateEmail(email) && accountRepository.findByEmail(email).isEmpty()) {
            Account client = accountRepository.findByEmail(email).orElseThrow(IllegalStateException::new);
            client.setEmail(email);
            client.setModifiedAt(LocalDateTime.now());
            accountRepository.save(client);
        } else {
            throw new IllegalStateException("Wrong email.");
        }
    }

    @Override
    public Account updateAccount(AccountPostDto accountPostDto, Long accountId) {
        Account account = accountDetailsService.getCurrentUser();
        if (account.getId().equals(accountId)) {
            if (RegistrationDto.validateEmail(accountPostDto.getEmail())) {
                if (accountRepository.findByEmail(accountPostDto.getEmail()).isEmpty()) {
                    account.setEmail(accountPostDto.getEmail());
                    account.setFirstName(accountPostDto.getFirstName());
                    account.setLastName(accountPostDto.getLastName());
                    account.setPhoneNumber(accountPostDto.getPhoneNumber());
                    account.setPhoto(accountPostDto.getPhoto());
                    account.setLocalization(new Localization(accountPostDto.getLongitude(), accountPostDto.getLatitude(), accountPostDto.getLocationName()));
                    account.setModifiedAt(LocalDateTime.now());
                    return accountRepository.save(account);
                } else {
                    throw new IllegalStateException("Email is already taken.");
                }
            } else {
                throw new IllegalStateException("Wrong email.");
            }
        } else {
            throw new IllegalStateException("You can't change other users data");
        }
    }

    @Override
    @Transactional
    public void changePass(String email, String oldPassword, String newPassword) {
        Account client = accountRepository.findByEmail(email)
                .orElseThrow(IllegalStateException::new);
        String hashedOldPassword = bCryptPasswordEncoder.encode(oldPassword);
        if (hashedOldPassword.equals(client.getPassword())) {
            client.setPassword(bCryptPasswordEncoder.encode(newPassword));
            client.setModifiedAt(LocalDateTime.now());
            accountRepository.save(client);
        } else {
            throw new IllegalStateException("Old password is incorrect");
        }

    }

    @Transactional
    public void saveAccount(Account account) {
        accountRepository.save(account);
    }

    @Override
    public Account getAccount(String email) {
        return accountRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Client does not exist"));
    }

    public Account getAccount(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Client does not exist"));
    }

    @Override
    public List<Account> getAccounts() {
        return accountRepository.findAll();
    }

    @Override
    public void archive(String email) {
        Account client = accountRepository.findByEmail(email)
                .orElseThrow(IllegalStateException::new);
        client.setEnabled(false);
        client.setModifiedAt(LocalDateTime.now());
        accountRepository.save(client);
    }

    @Override
    public void active(String email) {
        Account client = accountRepository.findByEmail(email)
                .orElseThrow(IllegalStateException::new);
        client.setEnabled(true);
        client.setModifiedAt(LocalDateTime.now());
        accountRepository.save(client);
    }

    @Override
    public void changeRole(Long accountId, Role role) {
        Account client = accountRepository.findById(accountId)
                .orElseThrow(IllegalStateException::new);
        client.setRole(role);
        client.setModifiedAt(LocalDateTime.now());
        accountRepository.save(client);
    }

    @Override
    public List<Account> getAllArchivedClients() {
        return accountRepository.findByIsEnabled(false);
    }

    @Override
    public List<Account> getAllActiveClients() {
        return accountRepository.findByIsEnabled(true);
    }

    @Override
    public Long deleteUser(Long accountId) {
        accountRepository.deleteById(accountId);
        return accountId;
    }
}

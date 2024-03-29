package accessgoods.service;

import accessgoods.model.Account;
import accessgoods.model.AccountDetails;
import accessgoods.model.Role;
import accessgoods.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountDetailsService implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.findByEmail(username).orElseThrow(() ->
                new UsernameNotFoundException(username));

        List<SimpleGrantedAuthority> grantedAuthorities = new ArrayList<>();
        Role userRole = account.getRole();

        // Dodaj rolę użytkownika
        grantedAuthorities.add(new SimpleGrantedAuthority(userRole.name()));

        // Sprawdź i dodaj role poniżej
        if (userRole == Role.ADMIN) {
            grantedAuthorities.add(new SimpleGrantedAuthority(Role.MANAGER.name()));
            grantedAuthorities.add(new SimpleGrantedAuthority(Role.EMPLOYEE.name()));
            grantedAuthorities.add(new SimpleGrantedAuthority(Role.CLIENT.name()));
        } else if (userRole == Role.MANAGER) {
            grantedAuthorities.add(new SimpleGrantedAuthority(Role.EMPLOYEE.name()));
            grantedAuthorities.add(new SimpleGrantedAuthority(Role.CLIENT.name()));
        } else if (userRole == Role.EMPLOYEE) {
            grantedAuthorities.add(new SimpleGrantedAuthority(Role.CLIENT.name()));
        }

        return new AccountDetails(account, grantedAuthorities);
    }

    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
            return ((Jwt) authentication.getPrincipal()).getClaim("sub");
        }
        return null;
    }

    public Account getCurrentUser() {
        String email = getCurrentUserEmail();
        if (email != null) {
            return accountRepository.findByEmail(getCurrentUserEmail()).orElse(null);
        }
        return null;
    }


}

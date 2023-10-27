package accessgoods.controllers;

import accessgoods.model.AccountDetails;
import accessgoods.model.dto.LoginDto;
import accessgoods.model.dto.RegistrationDto;
import accessgoods.model.dto.SignInDto;
import accessgoods.service.interfaces.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import static org.springframework.http.ResponseEntity.ok;


@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AccountService accountService;

    @PostMapping("login")
    public ResponseEntity<LoginDto> login(@RequestBody SignInDto request, HttpServletResponse response) {
        try {
            AccountDetails user = accountService.signIn(request);
            String token = accountService.generateJwtToken(user, request.password);

            return ok()
                    .body(LoginDto.builder()
                            .id(user.getId())
                            .credentialsNonExpired(user.isCredentialsNonExpired())
                            .accountLocked(user.isAccountNonLocked())
                            .accountNonExpired(user.isAccountNonExpired())
                            .authorities(user.getAuthorities())
                            .autorizationToken(token)
                            .email(user.getUsername())
                            .isEnabled(user.isEnabled())
                            .build());
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @PostMapping("register")
    public ResponseEntity<Object> register(@RequestBody RegistrationDto request) {
        try {
            Long id = accountService.register(request);
            request.setPassword("*****");
            return ok(request);
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                    .body(ex.getMessage());
        }
    }

}

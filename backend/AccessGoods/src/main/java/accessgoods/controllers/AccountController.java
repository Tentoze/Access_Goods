package accessgoods.controllers;


import accessgoods.model.Account;
import accessgoods.model.Role;
import accessgoods.model.dto.AccountDto;
import accessgoods.model.mapper.AccountMapper;
import accessgoods.service.interfaces.AccountService;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;



import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/accounts")
public class AccountController {
    private final AccountService accountService;
    private final AccountMapper mapper = Mappers.getMapper(AccountMapper.class);


    @GetMapping("/self")
    public ResponseEntity<Object> getClient(Principal principal) {
        try {
            return ResponseEntity.ok(accountService.getAccount(principal.getName()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN')")
    public ResponseEntity<List<AccountDto>> getClients() {
        List<Account> accounts = accountService.getAccounts();
        List<AccountDto> accountDtos = accounts.stream()
                .map(mapper::entityToDto)
                .toList();
        return ResponseEntity.ok(accountDtos);
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @PutMapping("{username}/archive")
    public ResponseEntity<Object> archiveClient(@PathVariable String username) {
        try {
            accountService.archive(username);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }

    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @PutMapping("{username}/active")
    public ResponseEntity<Object> activeClient(@PathVariable String username) {
        try {
            accountService.active(username);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }

    }

    @PutMapping("/change-role")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Object> changeRole(Long accountId, Role role) {
        try {
            accountService.changeRole(accountId, role);
            return ResponseEntity.ok("Role changed");
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @GetMapping("/archived-clients")
    public ResponseEntity<Object> getAllArchivedClients() {
        try {
            return ResponseEntity.ok(accountService.getAllArchivedClients());
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }

    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @GetMapping("/active-clients")
    public ResponseEntity<Object> getAllActiveClients() {
        try {
            return ResponseEntity.ok(accountService.getAllActiveClients());
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @DeleteMapping("/{accountId}")
    public ResponseEntity<Object> deleteUser(@PathVariable Long accountId) {
        try {
            return ResponseEntity.ok(accountService.deleteUser(accountId));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

}
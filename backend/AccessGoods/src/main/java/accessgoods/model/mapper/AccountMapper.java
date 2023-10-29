package accessgoods.model.mapper;

import accessgoods.model.Account;
import accessgoods.model.dto.AccountDto;
import accessgoods.model.dto.RegistrationDto;
import org.mapstruct.Mapper;
import org.mapstruct.MapperConfig;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AccountMapper extends MapperBase<Account, AccountDto, RegistrationDto>{
    @Override
    default AccountDto entityToDto(Account entity){
        return AccountDto.builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .role(entity.getRole())
                .phoneNumber(entity.getPhoneNumber())
                .lastName(entity.getLastName())
                .isEnabled(entity.isEnabled())
                .password(entity.getPassword())
                .email(entity.getEmail()).build();
    }

}

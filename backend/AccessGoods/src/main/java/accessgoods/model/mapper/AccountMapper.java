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
                .photo(entity.getPhoto())
                .phoneNumber(entity.getPhoneNumber())
                .longitude(entity.getLocalization().getLongitude())
                .latitude(entity.getLocalization().getLatitude())
                .locationName(entity.getLocalization().getName())
                .lastName(entity.getLastName())
                .isEnabled(entity.isEnabled())
                .avgRating(entity.getAverageRating())
                .email(entity.getEmail()).build();
    }

}

package accessgoods.model.mapper;

import accessgoods.model.Account;
import accessgoods.model.Item;
import accessgoods.model.Rent;
import accessgoods.model.dto.RentDto;
import accessgoods.model.dto.RentPostDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface RentMapper extends MapperBase<Rent, RentDto, RentPostDto> {
    AccountMapper accountMapper = Mappers.getMapper(AccountMapper.class);
    ItemMapper itemMapper = Mappers.getMapper(ItemMapper.class);


    @Override
    default RentDto entityToDto(Rent rent) {
        return RentDto.builder()
                .id(rent.getId())
                .rentStatus(rent.getRentStatus())
                .rentTime(rent.getRentTime().toString())
                .itemName(rent.getItem().getName())
                .itemPhoto(rent.getItem().getImages() != null ? rent.getItem().getImages().get(0).getImage() : "")
                .borrowingAccountId(rent.getBorrowingAccount().getId())
                .lendingAccountId(rent.getLendingAccount().getId())
                .itemId(rent.getId())
                .totalCost(rent.getTotalCost())
                .returnTime(rent.getReturnTime().toString())
                .build();
    }

    @Override
    default Rent postDtoToEntity(RentPostDto rentPostDto) {
        return Rent.builder()
                .rentTime(rentPostDto.getRentTime())
                .returnTime(rentPostDto.getReturnTime())
                .item(Item.builder().id(rentPostDto.getItemId()).build())
                .build();
    }
}

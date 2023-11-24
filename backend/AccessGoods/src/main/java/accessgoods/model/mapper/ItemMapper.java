package accessgoods.model.mapper;

import accessgoods.model.Image;
import accessgoods.model.Item;
import accessgoods.model.dto.ImageDto;
import accessgoods.model.dto.ImagePostDto;
import accessgoods.model.dto.ItemDto;
import accessgoods.model.dto.ItemPostDto;
import org.mapstruct.Mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Mapper
public interface ItemMapper extends MapperBase<Item, ItemDto, ItemPostDto> {
    @Override
    default Item postDtoToEntity(ItemPostDto itemPostDto) {
        Item item = Item.builder().cost(itemPostDto.getCost())
                .description(itemPostDto.getDescription())
                .name(itemPostDto.getName())
                .isActive(itemPostDto.isActive())
                .build();
        item.setImages(itemPostDto.getImages().stream().map(imagePostDto -> Image.builder().image(imagePostDto.getImage()).item(item).build()).collect(Collectors.toList()));
        return item;
    }

    @Override
    default ItemDto entityToDto(Item item) {
        return ItemDto.builder()
                .id(item.getId())
                .images(item.getImages().stream().map(image -> ImageDto.builder().image(image.getImage()).id(image.getId()).build()).collect(Collectors.toList()))
                .description(item.getDescription())
                .name(item.getDescription())
                .isActive(item.isActive())
                .cost(item.getCost()).build();
    }
}

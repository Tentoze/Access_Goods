package accessgoods.model.mapper;

import accessgoods.model.Category;
import accessgoods.model.dto.CategoryDto;
import accessgoods.model.dto.PostCategoryDto;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CategoryMapper extends MapperBase<Category, CategoryDto, PostCategoryDto> {
    CategoryMapper MAPPER = Mappers.getMapper(CategoryMapper.class);

}

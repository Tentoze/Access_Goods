package accessgoods.model.mapper;


import javax.swing.text.html.parser.Entity;

public interface MapperBase<TEntity, TDto, TPostDto> {
    TDto entityToDto(TEntity entity);

    TEntity dtoToEntity(TDto dto);

    TDto postDtoToDto(TPostDto postDto);

    TEntity postDtoToEntity(TPostDto postDto);

    TPostDto dtoToPostDto(TDto dto);

    TPostDto entityToPostDto(TEntity entity);

}

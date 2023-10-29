package accessgoods.model.mapper;


public interface MapperBase<TEntity, TDto, TPostDto> {
    TDto entityToDto(TEntity entity);

    TEntity dtoToEntity(TDto dto);

    TDto postDtoToDto(TPostDto postDto);

    TEntity postDtoToEntity(TPostDto postDto);
}

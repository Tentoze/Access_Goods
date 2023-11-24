package accessgoods.controllers;

import accessgoods.model.Category;
import accessgoods.model.dto.CategoryDto;
import accessgoods.model.dto.CategoryPostDto;
import accessgoods.model.mapper.CategoryMapper;
import accessgoods.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.mapstruct.factory.Mappers;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper = Mappers.getMapper(CategoryMapper.class);

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<Category> categories = categoryService.getAll();
        return ok(categories.stream().map(categoryMapper::entityToDto).toList());
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<CategoryDto> getCategory(@PathVariable Long categoryId) {
        Category category = categoryService.getById(categoryId);
        return ok(categoryMapper.entityToDto(category));
    }

    @PostMapping("/add")
    @Transactional
    public ResponseEntity<CategoryDto> addCategory(@RequestBody CategoryPostDto categoryPostDto) {
        try {
            Category category = categoryService.create(categoryMapper.postDtoToEntity(categoryPostDto));
            return ok(categoryMapper.entityToDto(category));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }
}

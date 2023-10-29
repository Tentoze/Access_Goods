package accessgoods.service;

import accessgoods.model.Category;
import accessgoods.repository.CategoryRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoryService extends CrudService<Long, Category> {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        super(categoryRepository, Category.class);
        this.categoryRepository = categoryRepository;
    }

}

package accessgoods.service;

import accessgoods.model.Category;
import accessgoods.model.Item;
import accessgoods.repository.CategoryRepository;
import accessgoods.repository.ItemRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class ItemService extends CrudService<Long, Item> {

    private final ItemRepository itemRepository;

    protected ItemService(ItemRepository itemRepository) {
        super(itemRepository, Item.class);
        this.itemRepository = itemRepository;
    }

}


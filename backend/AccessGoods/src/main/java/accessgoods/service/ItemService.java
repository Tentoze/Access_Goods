package accessgoods.service;

import accessgoods.model.Account;
import accessgoods.model.Category;
import accessgoods.model.Image;
import accessgoods.model.Item;
import accessgoods.model.dto.FilterSearchDto;
import accessgoods.model.dto.ItemDto;
import accessgoods.model.dto.ItemPostDto;
import accessgoods.repository.ItemRepository;
import jakarta.persistence.Id;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService extends CrudService<Long, Item> {

    private final ItemRepository itemRepository;
    private final AccountDetailsService accountDetailsService;

    protected ItemService(ItemRepository itemRepository, AccountDetailsService accountDetailsService) {
        super(itemRepository, Item.class);
        this.itemRepository = itemRepository;
        this.accountDetailsService = accountDetailsService;
    }

    @Override
    public Item create(Item item) {
        Account currentAccount = accountDetailsService.getCurrentUser();
        if (currentAccount != null) {
            item.setAccount(currentAccount);
        }
        return super.create(item);
    }

    public Item updateItem(Long id, ItemPostDto itemToSave) throws AccessDeniedException {
        Account currentAccount = accountDetailsService.getCurrentUser();
        if (currentAccount == null) {
            throw new AccessDeniedException("You have to be login in");
        }
        Item item = getById(id);
        if (!item.getAccount().equals(currentAccount)) {
            throw new AccessDeniedException("You can only change yours items");
        }
        List<Image> newImages = itemToSave.getImages().stream()
                .map(imagePostDto -> Image.builder().image(imagePostDto.getImage()).item(item).build())
                .collect(Collectors.toList());

        item.getImages().clear();
        item.getImages().addAll(newImages);
        item.setCost(itemToSave.getCost());
        item.setName(itemToSave.getName());
        item.setDescription(itemToSave.getDescription());
        item.setCategory(Category.builder().id(itemToSave.getCategoryId()).build());
        return super.update(id, item);
    }

    public List<Item> showCurrentUserItems() throws AccessDeniedException {
        Account currentAccount = accountDetailsService.getCurrentUser();
        if (currentAccount == null) {
            throw new AccessDeniedException("You have to be login in");
        }
        List<Item> items = itemRepository.findByAccount_Id(currentAccount.getId());
        return items;
    }

    public List<Item> search(FilterSearchDto filterSearchDto) {
        return itemRepository.searchItems(filterSearchDto.getSearchTerm() == null ? null : filterSearchDto.getSearchTerm().toLowerCase(), filterSearchDto.getCategoryId(), filterSearchDto.getPriceFrom(), filterSearchDto.getPriceTo(), filterSearchDto.getUserHasPhoto(), filterSearchDto.getSortOption().name());
    }
}


package accessgoods.service;

import accessgoods.model.Account;
import accessgoods.model.Item;
import accessgoods.model.dto.FilterSearchDto;
import accessgoods.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

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


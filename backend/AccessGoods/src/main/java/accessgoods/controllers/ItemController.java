package accessgoods.controllers;

import accessgoods.model.Account;
import accessgoods.model.Item;
import accessgoods.model.dto.FilterSearchDto;
import accessgoods.model.dto.ItemDto;
import accessgoods.model.dto.ItemPostDto;
import accessgoods.model.mapper.ItemMapper;
import accessgoods.service.ItemService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.mapstruct.factory.Mappers;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

import static org.springframework.http.ResponseEntity.badRequest;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/items")
public class ItemController {
    private final ItemService itemService;
    private final ItemMapper itemMapper = Mappers.getMapper(ItemMapper.class);

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ItemDto>> getAllItems() {
        List<Item> items = itemService.getAll();
        return ok(items.stream().map(itemMapper::entityToDto).toList());
    }
    @GetMapping("/search")
    public ResponseEntity<List<ItemDto>> searchForItems(@ModelAttribute FilterSearchDto filterSearchDto) {
        List<Item> items = itemService.search(filterSearchDto);
        return ok(items.stream().map(itemMapper::entityToDto).toList());
    }

    @GetMapping("/{ItemId}")
    public ResponseEntity<ItemDto> getItem(@PathVariable Long ItemId) {
        Item item = itemService.getById(ItemId);
        return ok(itemMapper.entityToDto(item));
    }

    @GetMapping("/showMyItems")
    public ResponseEntity<List<ItemDto>> getCurrentUserItems() {
        try {
            List<Item> items = itemService.showCurrentUserItems();
            return ok(items.stream().map(itemMapper::entityToDto).toList());
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

    @GetMapping("/byAccount/{accountId}")
    public ResponseEntity<List<ItemDto>> getAccountIdItems(@PathVariable Long accountId) {
        try {
            List<Item> items = itemService.showUserItems(accountId);
            return ok(items.stream().map(itemMapper::entityToDto).toList());
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

    @PostMapping("/add")
    @Transactional
    public ResponseEntity<ItemDto> addItem(@RequestBody ItemPostDto itemPostDto) {
        try {
            Item item = itemMapper.postDtoToEntity(itemPostDto);
            itemService.create(item);
            return ok(itemMapper.entityToDto(item));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

    @PostMapping("/add/{accountId}")
    @Transactional
    public ResponseEntity<ItemDto> addItemForSpecificUser(@RequestBody ItemPostDto itemPostDto, @PathVariable Long accountId) {
        try {
            Item item = itemMapper.postDtoToEntity(itemPostDto);
            item.setAccount(Account.builder().id(accountId).build());
            itemService.create(item);
            return ok(itemMapper.entityToDto(item));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    @Transactional
    public ResponseEntity<ItemDto> updateItem(@PathVariable Long id, @RequestBody ItemPostDto itemPostDto) {
        try {
            Item Item = itemService.updateItem(id, itemPostDto);
            return ok(itemMapper.entityToDto(Item));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<ItemDto> deleteItem(@PathVariable Long id) {
        try {
            Item Item = itemService.delete(id);
            return ok(itemMapper.entityToDto(Item));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }
}

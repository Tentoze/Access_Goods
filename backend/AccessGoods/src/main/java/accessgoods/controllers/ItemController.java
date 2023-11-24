package accessgoods.controllers;

import accessgoods.model.Item;
import accessgoods.model.dto.ItemDto;
import accessgoods.model.dto.ItemPostDto;
import accessgoods.model.mapper.ItemMapper;
import accessgoods.service.ItemService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.mapstruct.factory.Mappers;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<ItemDto>> getAllCategories() {
        List<Item> items = itemService.getAll();
        return ok(items.stream().map(itemMapper::entityToDto).toList());
    }

    @GetMapping("/{ItemId}")
    public ResponseEntity<ItemDto> getItem(@PathVariable Long ItemId) {
        Item item = itemService.getById(ItemId);
        return ok(itemMapper.entityToDto(item));
    }

    @PostMapping("/add")
    @Transactional
    public ResponseEntity<ItemDto> addItem(@RequestBody ItemPostDto itemPostDto) {
        try {
            Item Item = itemService.create(itemMapper.postDtoToEntity(itemPostDto));
            return ok(itemMapper.entityToDto(Item));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    @Transactional
    public ResponseEntity<ItemDto> updateItem(@PathVariable Long id, @RequestBody ItemPostDto itemPostDto) {
        try {
            Item Item = itemService.update(id, itemMapper.postDtoToEntity(itemPostDto));
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

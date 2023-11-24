package accessgoods.controllers;

import accessgoods.model.Item;
import accessgoods.model.Rent;
import accessgoods.model.RentStatus;
import accessgoods.model.dto.ItemDto;
import accessgoods.model.dto.ItemPostDto;
import accessgoods.model.dto.RentDto;
import accessgoods.model.dto.RentPostDto;
import accessgoods.model.mapper.RentMapper;
import accessgoods.service.RentService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.mapstruct.factory.Mappers;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/rents")
public class RentController {
    private final RentService rentService;
    private final RentMapper rentMapper = Mappers.getMapper(RentMapper.class);

    public RentController(RentService rentService) {
        this.rentService = rentService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<RentDto>> getAllRents() {
        List<Rent> rents = rentService.getAll();
        return ok(rents.stream().map(rentMapper::entityToDto).toList());
    }

    @GetMapping("/{ItemId}")
    public ResponseEntity<RentDto> getRent(@PathVariable Long ItemId) {
        Rent rent = rentService.getById(ItemId);
        return ok(rentMapper.entityToDto(rent));
    }

    @PostMapping("/add")
    @Transactional
    public ResponseEntity<RentDto> addRent(@RequestBody RentPostDto rentPostDto) {
        try {
            Rent rent = rentService.create(rentMapper.postDtoToEntity(rentPostDto));
            return ok(rentMapper.entityToDto(rent));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    @Transactional
    public ResponseEntity<RentDto> updateRent(@PathVariable Long id, @RequestBody RentPostDto rentPostDto) {
        try {
            Rent rent = rentService.update(id, rentMapper.postDtoToEntity(rentPostDto));
            return ok(rentMapper.entityToDto(rent));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<RentDto> deleteItem(@PathVariable Long id) {
        try {
            Rent rent = rentService.delete(id);
            return ok(rentMapper.entityToDto(rent));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

}

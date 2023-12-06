package accessgoods.controllers;

import accessgoods.model.Item;
import accessgoods.model.Rent;
import accessgoods.model.RentStatus;
import accessgoods.model.dto.ItemDto;
import accessgoods.model.dto.ItemPostDto;
import accessgoods.model.dto.RentDto;
import accessgoods.model.dto.RentPostDto;
import accessgoods.model.mapper.RentMapper;
import accessgoods.repository.RentRepository;
import accessgoods.service.RentService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.mapstruct.factory.Mappers;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/rents")
public class RentController {
    private final RentService rentService;
    private final RentMapper rentMapper = Mappers.getMapper(RentMapper.class);
    private final RentRepository rentRepository;

    public RentController(RentService rentService,
                          RentRepository rentRepository) {
        this.rentService = rentService;
        this.rentRepository = rentRepository;
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<RentDto>> getAllRents() {
        List<Rent> rents = rentService.getAll();
        return ok(rents.stream().map(rentMapper::entityToDto).toList());
    }

    @GetMapping("/getById/{rentId}")
    public ResponseEntity<RentDto> getRent(@PathVariable Long rentId) {
        Rent rent = rentService.getById(rentId);
        return ok(rentMapper.entityToDto(rent));
    }

    @GetMapping("/getByAccountId/{ItemId}")
    public ResponseEntity<RentDto> getRentByAccountId(@PathVariable Long accountId) {
        Rent rent = rentService.getById(accountId);
        return ok(rentMapper.entityToDto(rent));
    }

    @PostMapping("/add")
    @Transactional
    public ResponseEntity<RentDto> addRent(@RequestBody RentPostDto rentPostDto) {
        try {
            Rent rent = rentService.createRent(rentMapper.postDtoToEntity(rentPostDto));
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

    @PutMapping("/changeStatus/{id}")
    @Transactional
    public ResponseEntity<RentDto> changeStatus(@PathVariable Long id, @RequestParam RentStatus rentStatus) {
        try {
            Rent rent = rentService.changeStatus(id, rentStatus);
            return ok(rentMapper.entityToDto(rent));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

    @GetMapping("/getPossibleStatusFlow/{id}")
    @Transactional
    public ResponseEntity<List<RentStatus>> getStatusFlowForRentId(@PathVariable Long id) {
        try {
            List<RentStatus> rentStatusList = rentService.getStatusFlowForRentId(id);
            return ok(rentStatusList);
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

}

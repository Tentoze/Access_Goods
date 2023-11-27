package accessgoods.controllers;

import accessgoods.model.Opinion;
import accessgoods.model.dto.OpinionDto;
import accessgoods.model.dto.OpinionPostDto;
import accessgoods.model.mapper.OpinionMapper;
import accessgoods.service.OpinionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.mapstruct.factory.Mappers;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequestMapping("/opinions")
public class OpinionController {
    private final OpinionService opinionService;
    private final OpinionMapper opinionMapper = Mappers.getMapper(OpinionMapper.class);

    public OpinionController(OpinionService OpinionService) {
        this.opinionService = OpinionService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<OpinionDto>> getAllOpinions() {
        List<Opinion> opinions = opinionService.getAll();
        return ok(opinions.stream().map(opinionMapper::entityToDto).toList());
    }

    @GetMapping("/{ItemId}")
    public ResponseEntity<OpinionDto> getOpinion(@PathVariable Long ItemId) {
        Opinion opinion = opinionService.getById(ItemId);
        return ok(opinionMapper.entityToDto(opinion));
    }

    @PostMapping("/add")
    @Transactional
    public ResponseEntity<OpinionDto> addOpinion(@RequestBody OpinionPostDto OpinionPostDto) {
        try {
            Opinion opinion = opinionService.create(opinionMapper.postDtoToEntity(OpinionPostDto));
            return ok(opinionMapper.entityToDto(opinion));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    @Transactional
    public ResponseEntity<OpinionDto> updateOpinion(@PathVariable Long id, @RequestBody OpinionPostDto OpinionPostDto) {
        try {
            Opinion opinion = opinionService.update(id, opinionMapper.postDtoToEntity(OpinionPostDto));
            return ok(opinionMapper.entityToDto(opinion));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    @Transactional
    public ResponseEntity<OpinionDto> deleteItem(@PathVariable Long id) {
        try {
            Opinion opinion = opinionService.delete(id);
            return ok(opinionMapper.entityToDto(opinion));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }
}

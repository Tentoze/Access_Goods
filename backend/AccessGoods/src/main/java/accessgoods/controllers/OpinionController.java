package accessgoods.controllers;

import accessgoods.model.FeedbackTarget;
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
import java.util.Optional;

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

    @GetMapping("/byAccount/{accountId}")
    public ResponseEntity<List<OpinionDto>> getOpinionsByAccountId(@PathVariable Long accountId) {
        List<Opinion> opinions = opinionService.getByAccountId(accountId);
        return ok(opinions.stream().map(opinionMapper::entityToDto).toList());
    }

    @GetMapping("/{itemId}")
    public ResponseEntity<OpinionDto> getOpinion(@PathVariable Long itemId) {
        Opinion opinion = opinionService.getById(itemId);
        return ok(opinionMapper.entityToDto(opinion));
    }

    @GetMapping("/currentUserOpinionForSpecificUserAndFeedbackTarget/{accountId}/{feedbackTarget}")
    public ResponseEntity<OpinionDto> getCurrentUserOpinionToSpecificUser(@PathVariable Long accountId, @PathVariable FeedbackTarget feedbackTarget) {
        Opinion opinion = opinionService.getCurrentUserOpinionByAccountIdAndFeedbackTarget(accountId, feedbackTarget);
        return ok(opinionMapper.entityToDto(opinion));
    }

    @PostMapping("/add")
    @Transactional
    public ResponseEntity<OpinionDto> addOpinion(@RequestBody OpinionPostDto OpinionPostDto) {
        try {
            Opinion opinion = opinionService.createOpinion(opinionMapper.postDtoToEntity(OpinionPostDto));
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
    public ResponseEntity<OpinionDto> deleteOpinion(@PathVariable Long id) {
        try {
            Opinion opinion = opinionService.delete(id);
            return ok(opinionMapper.entityToDto(opinion));
        } catch (Exception e) {
            throw new EntityNotFoundException(e.getMessage());
        }
    }
}

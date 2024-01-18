package accessgoods.service;

import accessgoods.model.FeedbackTarget;
import accessgoods.model.Opinion;
import accessgoods.repository.OpinionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OpinionService extends CrudService<Long, Opinion> {
    private final OpinionRepository opinionRepository;
    private final AccountServiceImpl accountService;
    private final RentService rentService;


    public OpinionService(OpinionRepository opinionRepository, AccountServiceImpl accountService, RentService rentService) {
        super(opinionRepository, Opinion.class);
        this.opinionRepository = opinionRepository;
        this.accountService = accountService;
        this.rentService = rentService;
    }

    public Opinion createOpinion(Opinion opinion) {
        if (opinionRepository.findByOpinionGiverAccount_IdAndFeedbackTarget(opinion.getOpinionGiverAccount().getId(), opinion.getFeedbackTarget()).isEmpty()) {
            throw new IllegalStateException("Opinion cannot be send twice at the same rent");
        }
        if (getCurrentUserId().equals(opinion.getOpinionReceiverAccount().getId())) {
            throw new IllegalStateException("You cannot send opinion to yourself");
        }
        return create(opinion);
    }

    private Long getCurrentUserId() {
        String email = AccountDetailsService.getCurrentUserEmail();
        if (email == null) {
            throw new IllegalStateException("User is not logged in");
        }
        return accountService.getAccount(email).getId();
    }

    public Opinion getCurrentUserOpinionByAccountIdAndFeedbackTarget(Long accountId, FeedbackTarget feedbackTarget) {
        return opinionRepository.findByOpinionGiverAccount_IdAndOpinionReceiverAccount_IdAndFeedbackTarget(getCurrentUserId(), accountId, feedbackTarget).orElseThrow(() -> new EntityNotFoundException("There is no opinion"));
    }
}

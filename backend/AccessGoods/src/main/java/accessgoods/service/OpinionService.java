package accessgoods.service;

import accessgoods.model.Account;
import accessgoods.model.FeedbackTarget;
import accessgoods.model.Opinion;
import accessgoods.model.dto.OpinionMethodDto;
import accessgoods.repository.OpinionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        if (opinionRepository.findByOpinionGiverAccount_IdAndOpinionReceiverAccount_IdAndFeedbackTarget(opinion.getOpinionGiverAccount().getId(), opinion.getOpinionReceiverAccount().getId(), opinion.getFeedbackTarget()).isPresent()) {
            throw new IllegalStateException("Opinion cannot be send twice at the same rent");
        }
        if (getCurrentUserId().equals(opinion.getOpinionReceiverAccount().getId())) {
            throw new IllegalStateException("You cannot send opinion to yourself");
        }
        Opinion opinion1 = create(opinion);
        recalculateAverageRating(opinion.getOpinionReceiverAccount().getId(), opinion, OpinionMethodDto.CREATE_OPINION);
        return opinion1;
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

    public List<Opinion> getByAccountId(Long accountId) {
        return opinionRepository.findByOpinionReceiverAccount_Id(accountId);
    }

    @Override
    public Opinion update(Long aLong, Opinion opinion) {
        opinion.setId(aLong);
        Opinion opinionAfterUpdate = super.update(aLong, opinion);
        recalculateAverageRating(opinion.getOpinionReceiverAccount().getId(), opinionAfterUpdate, OpinionMethodDto.UPDATE_OPINION);
        return opinionAfterUpdate;
    }

    @Override
    public Opinion delete(Long aLong) {
        Opinion opinionAfterDelete = super.delete(aLong);
        recalculateAverageRating(opinionAfterDelete.getOpinionReceiverAccount().getId(), opinionAfterDelete, OpinionMethodDto.DELETE_OPINION);
        return opinionAfterDelete;
    }

    private void recalculateAverageRating(Long accountId, Opinion opinion, OpinionMethodDto methodDto) {
        Account account = accountService.getAccount(accountId);
        switch (methodDto) {
            case CREATE_OPINION -> {
                int sumOfRatings = account.getListOfTakenOpinions().stream()
                        .mapToInt(Opinion::getRating)
                        .sum();

                float newRating = (((float) sumOfRatings + opinion.getRating().floatValue()) / (account.getListOfTakenOpinions().size() + 1));
                float roundedRating = (float) (Math.round(newRating * 10.0) / 10.0);
                account.setAverageRating(roundedRating);
            }
            case DELETE_OPINION -> {
                List<Opinion> opinions = (account.getListOfTakenOpinions().stream()
                        .filter(opinionFromStream -> !opinionFromStream.getId().equals(opinion.getId()))
                        .toList());
                int avgRating;
                if (opinions.size() != 0) {
                    avgRating = (opinions.stream()
                            .mapToInt(Opinion::getRating)
                            .sum()) / opinions.size();
                } else {
                    avgRating = 0;
                }
                float roundedAvgRating = (float) (Math.round(avgRating * 10.0) / 10.0);
                account.setAverageRating(roundedAvgRating);
            }
            case UPDATE_OPINION -> {
                List<Opinion> updatedOpinions = account.getListOfTakenOpinions().stream()
                        .map(opinionFromList -> {
                            if (opinionFromList.getId().equals(opinion.getId())) {
                                opinionFromList.setRating(opinion.getRating());
                                opinionFromList.setDescription(opinion.getDescription());
                            }
                            return opinionFromList;
                        })
                        .toList();
                int avgRating = updatedOpinions.stream()
                        .mapToInt(Opinion::getRating)
                        .sum() / Math.max(1, updatedOpinions.size());
                float roundedAvgRating = (float) (Math.round(avgRating * 10.0) / 10.0);
                account.setAverageRating(roundedAvgRating);
            }
        }
        accountService.saveAccount(account);
    }
}

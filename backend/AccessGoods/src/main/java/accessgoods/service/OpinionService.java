package accessgoods.service;

import accessgoods.model.Opinion;
import accessgoods.model.Rent;
import accessgoods.model.RentStatus;
import accessgoods.repository.OpinionRepository;
import org.springframework.stereotype.Service;

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
        Rent rent = rentService.getById(opinion.getRent().getId());
        if (rent.getRentStatus() != RentStatus.CLOSED) {
            throw new IllegalStateException("Rent status has to be in status 'CLOSED' to send opinion");
        }
        if (opinionRepository.findOpinionByRentIdAndOpinionGiverAccountId(opinion.getRent().getId(), opinion.getOpinionGiverAccount().getId()) != null) {
            throw new IllegalStateException("Opinion cannot be send twice at the same rent");
        }
        if (getCurrentUserId(opinion).equals(opinion.getOpinionGiverAccount().getId())) {
            throw new IllegalStateException("You cannot send opinion to yourself");
        }
        return create(opinion);
    }

    private Long getCurrentUserId(Opinion opinion) {
        String email = AccountDetailsService.getCurrentUserEmail();
        if (email == null) {
            throw new IllegalStateException("User is not logged in");
        }
        return accountService.getAccount(email).getId();
    }
}

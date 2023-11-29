package accessgoods.service;

import accessgoods.exceptions.EntityNotFoundException;
import accessgoods.exceptions.IncorrectStatusChangeException;
import accessgoods.model.Item;
import accessgoods.model.Rent;
import accessgoods.model.RentStatus;
import accessgoods.repository.RentRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class RentService extends CrudService<Long, Rent> {
    private final RentRepository rentRepository;
    private final AccountServiceImpl accountService;
    private final ItemService itemService;

    public RentService(RentRepository rentRepository, AccountServiceImpl accountService, ItemService itemService) {
        super(rentRepository, Rent.class);
        this.rentRepository = rentRepository;
        this.accountService = accountService;
        this.itemService = itemService;
    }

    private static List<RentStatus> getStatusFlow(Rent rent) {
        List<RentStatus> availableStatuses = new ArrayList<>();
        switch (rent.getRentStatus()) {
            case TO_ACCEPT:
                availableStatuses.add(RentStatus.ACCEPTED);
                availableStatuses.add(RentStatus.CANCELED);
                break;
            case ACCEPTED:
                availableStatuses.add(RentStatus.IN_RENT);
                availableStatuses.add(RentStatus.CANCELED);
                break;
            case IN_RENT:
                availableStatuses.add(RentStatus.CLOSED);
                availableStatuses.add(RentStatus.CANCELED);
                break;
            case CLOSED:
                // Nie dodajemy nowych statusów
                break;
            case CANCELED:
                // Nie dodajemy nowych statusów
                break;
        }
        return availableStatuses;
    }

    public Rent createRent(Rent rent) {
        Item item = itemService.getById(rent.getItem().getId());
        if (isCurrentUserIsLender(rent)) {
            throw new IllegalStateException("You cannot rent your item");
        }
        rent.setTotalCost(ChronoUnit.DAYS.between(rent.getRentTime(), rent.getReturnTime()) * item.getCost());
        rent.setRentStatus(RentStatus.TO_ACCEPT);
        return create(rent);
    }

    private boolean isCurrentUserIsLender(Rent rent) {
        String email = AccountDetailsService.getCurrentUserEmail();
        if (email == null) {
            throw new IllegalStateException("User is not logged in");
        }
        return rent.getLendingAccount().getId().equals(accountService.getAccount(email).getId());
    }

    private boolean isCurrentUserIsBorrower(Rent rent) {
        String email = AccountDetailsService.getCurrentUserEmail();
        if (email == null) {
            throw new IllegalStateException("User is not logged in");
        }
        return rent.getBorrowingAccount().getId().equals(accountService.getAccount(email).getId());
    }

    public Rent changeStatus(Long id, RentStatus targetStatus) {
        Rent rent = getById(id);
        if (!getStatusFlow(rent).contains(targetStatus)) {
            throw new IncorrectStatusChangeException(rent.getRentStatus(), targetStatus);
        }
        rent.setRentStatus(targetStatus);
        return update(id, rent);
    }

    public List<RentStatus> getStatusFlowForRentId(Long id) {
        Rent rent = getById(id);
        return getStatusFlow(rent);
    }
}


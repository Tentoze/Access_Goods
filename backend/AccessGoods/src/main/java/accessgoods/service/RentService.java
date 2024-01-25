package accessgoods.service;

import accessgoods.exceptions.IncorrectStatusChangeException;
import accessgoods.model.Account;
import accessgoods.model.Item;
import accessgoods.model.Rent;
import accessgoods.model.RentStatus;
import accessgoods.repository.RentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RentService extends CrudService<Long, Rent> {
    private final RentRepository rentRepository;
    private final AccountServiceImpl accountService;
    private final ItemService itemService;
    private final AccountDetailsService accountDetailsService;

    public RentService(RentRepository rentRepository, AccountServiceImpl accountService, ItemService itemService, AccountDetailsService accountDetailsService) {
        super(rentRepository, Rent.class);
        this.rentRepository = rentRepository;
        this.accountService = accountService;
        this.itemService = itemService;
        this.accountDetailsService = accountDetailsService;
    }

    private static List<RentStatus> getStatusFlow(Rent rent) {
        List<RentStatus> availableStatuses = new ArrayList<>();
        switch (rent.getRentStatus()) {
            case TO_ACCEPT:
                availableStatuses.add(RentStatus.ACCEPTED);
                availableStatuses.add(RentStatus.CANCELLED);
                break;
            case ACCEPTED:
                availableStatuses.add(RentStatus.IN_RENT);
                availableStatuses.add(RentStatus.CANCELLED);
                break;
            case IN_RENT:
                availableStatuses.add(RentStatus.CLOSED);
                availableStatuses.add(RentStatus.CANCELLED);
                break;
            case CLOSED:
                // Nie dodajemy nowych statusów
                break;
            case CANCELLED:
                // Nie dodajemy nowych statusów
                break;
        }
        return availableStatuses;
    }

    public List<String> getPossibleRentTimes(Long itemId) {
        List<Rent> rents = rentRepository.findByItem_IdAndReturnTimeAfter(itemId, LocalDate.now());
        rents = rents.stream().filter(i -> i.getRentStatus() != RentStatus.TO_ACCEPT && i.getRentStatus() != RentStatus.CANCELLED).collect(Collectors.toList());
        List<String> rentedDates = rents.stream()
                .flatMap(rent -> getDatesBetween(rent.getRentTime(), rent.getReturnTime()).stream())
                .distinct()
                .map(LocalDate::toString)
                .collect(Collectors.toList());

        return rentedDates;
    }
    public List<Rent> getCurrentUserRents() {
        Account currentUser = accountDetailsService.getCurrentUser();
        if(currentUser == null) {
            throw new IllegalStateException("User is not logged in");
        }
        return rentRepository.findByBorrowingAccount_IdOrLendingAccount_Id(currentUser.getId(), currentUser.getId());
    }

    private List<LocalDate> getDatesBetween(LocalDate startDate, LocalDate endDate) {
        List<LocalDate> dates = new ArrayList<>();
        for (LocalDate date = startDate; date.isBefore(endDate.plusDays(1)); date = date.plusDays(1)) {
            dates.add(date);
        }
        return dates;
    }

    public Rent createRent(Rent rent) {
        Item item = itemService.getById(rent.getItem().getId());
        rent.setLendingAccount(item.getAccount());
        Account borrowingAccount = accountDetailsService.getCurrentUser();
        if (isCurrentUserIsLender(borrowingAccount, rent)) {
            throw new IllegalStateException("You cannot rent your item");
        }
        rent.setBorrowingAccount(borrowingAccount);
        rent.setTotalCost(ChronoUnit.DAYS.between(rent.getRentTime(), rent.getReturnTime()) * item.getCost());
        rent.setRentStatus(RentStatus.TO_ACCEPT);
        return create(rent);
    }

    private boolean isCurrentUserIsLender(Account borrowingUser, Rent rent) {
        if (borrowingUser == null) {
            throw new IllegalStateException("User is not logged in");
        }
        return rent.getLendingAccount().equals(borrowingUser);
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


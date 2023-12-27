package accessgoods.repository;

import accessgoods.model.Rent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RentRepository extends JpaRepository<Rent, Long> {
    List<Rent> findByBorrowingAccount_IdOrLendingAccount_Id(Long borrowingAccountId, Long lendingAccountId);
    List<Rent> findByItem_IdAndReturnTimeAfter(Long id, LocalDate returnTime);
}

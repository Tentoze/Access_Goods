package accessgoods.repository;

import accessgoods.model.Account;
import accessgoods.model.FeedbackTarget;
import accessgoods.model.Item;
import accessgoods.model.Opinion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OpinionRepository extends JpaRepository<Opinion, Long> {
    Optional<Opinion> findByOpinionGiverAccount_IdAndOpinionReceiverAccount_IdAndFeedbackTarget(Long id, Long id1, FeedbackTarget feedbackTarget);

    Optional<Opinion> findByOpinionGiverAccount_IdAndFeedbackTarget(Long id, FeedbackTarget feedbackTarget);

    Optional<Opinion> findByOpinionGiverAccountAndFeedbackTarget(Account opinionGiverAccount, FeedbackTarget feedbackTarget);
}

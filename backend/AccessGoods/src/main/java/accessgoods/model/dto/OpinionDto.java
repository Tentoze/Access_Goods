package accessgoods.model.dto;

import accessgoods.model.Account;
import accessgoods.model.FeedbackTarget;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OpinionDto {
    private Long id;
    private Integer rating;
    private String description;
    private AccountDto opinionGiverAccount;
    private AccountDto opinionReceiverAccount;
    private FeedbackTarget feedbackTarget;
}

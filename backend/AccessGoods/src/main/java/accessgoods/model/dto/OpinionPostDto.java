package accessgoods.model.dto;

import accessgoods.model.FeedbackTarget;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OpinionPostDto {
    private Integer rating;
    private String description;
    private Long opinionGiverAccountId;
    private Long opinionReceiverAccountId;
    private FeedbackTarget feedbackTarget;
}

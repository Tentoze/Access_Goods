package accessgoods.model.dto;

import accessgoods.model.Item;
import accessgoods.model.RentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RentPostDto {
    private Long itemId;
    private Long lendingAccountId;
    private Long borrowingAccountId;
    private float totalCost;
    private LocalDate returnTime;
    private LocalDate rentTime;
}

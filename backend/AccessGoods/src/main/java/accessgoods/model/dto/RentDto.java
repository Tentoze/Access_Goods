package accessgoods.model.dto;

import accessgoods.model.RentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class RentDto {
    private Long id;
    private Long itemId;
    private String itemName;
    private String itemPhoto;
    private Long lendingAccountId;
    private Long borrowingAccountId;
    private float totalCost;
    private String returnTime;
    private String rentTime;
    private RentStatus rentStatus;
}

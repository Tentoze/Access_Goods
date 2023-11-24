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
    private ItemDto item;
    private AccountDto lendingAccount;
    private AccountDto borrowingAccount;
    private float totalCost;
    private LocalDate returnTime;
    private LocalDate rentTime;
    private RentStatus rentStatus;
}

package accessgoods.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Rent {
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "item_gen")
    @SequenceGenerator(name="item_gen", sequenceName="item_seq", allocationSize = 1)
    @Column(name = "rent_id", nullable = false)
    @Id
    private Long id;
    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;
    @ManyToOne
    @JoinColumn(name = "lending_account_id")
    private Account lendingAccount;

    @ManyToOne
    @JoinColumn(name = "borrowing_account_id")
    private Account borrowingAccount;

    @Column
    private float totalCost;
    @Column
    private LocalDate rentTime;
    @Column
    private LocalDate returnTime;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private RentStatus rentStatus;

    @Override
    public String toString() {
        return "Rent{" +
                "id=" + id +
                ", totalCost=" + totalCost +
                ", rentTime=" + rentTime +
                ", returnTime=" + returnTime +
                ", rentStatus=" + rentStatus +
                '}';
    }
}

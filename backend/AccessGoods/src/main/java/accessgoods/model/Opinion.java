package accessgoods.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Opinion {
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "item_gen")
    @SequenceGenerator(name="item_gen", sequenceName="item_seq", allocationSize = 1)
    @Column(name = "item_id", nullable = false)
    @Id
    private Long id;
    @Column
    private Integer rating;
    @Column
    private String description;
    @ManyToOne
    @JoinColumn(name = "giver_account_id")
    private Account opinionGiverAccount;
    @ManyToOne
    @JoinColumn(name = "receiver_account_id")
    private Account opinionReceiverAccount;
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private FeedbackTarget feedbackTarget;
}

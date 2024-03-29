package accessgoods.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import static jakarta.persistence.CascadeType.*;
import static jakarta.persistence.CascadeType.REMOVE;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Item {
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "item_gen")
    @SequenceGenerator(name="item_gen", sequenceName="item_seq", allocationSize = 1)
    @Column(name = "item_id", nullable = false)
    @Id
    private Long id;
    @Column
    private String name;
    @Column
    private String description;
    @Column
    private Float cost;
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;
    @Column
    private boolean isActive;
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rent> rents;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Override
    public String toString() {
        return "Item{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", cost=" + cost +
                ", images=" + images +
                ", isActive=" + isActive +
                ", rents=" + rents +
                ", category=" + category +
                '}';
    }
}

package accessgoods.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "item_image")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Image {
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "category_gen")
    @SequenceGenerator(name="category_gen", sequenceName="category_seq", allocationSize = 1)
    @Column(name = "image_id", nullable = false)
    @Id
    private Long id;
    @Column(columnDefinition = "text")
    private String image;
    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;

}

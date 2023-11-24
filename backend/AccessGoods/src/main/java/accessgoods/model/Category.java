package accessgoods.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Category {

    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "category_id", nullable = false)
    @Id
    private Long id;
    @Column
    private String name;
    @Column
    private String description;

}

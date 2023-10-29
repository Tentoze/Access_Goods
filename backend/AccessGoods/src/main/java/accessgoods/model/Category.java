package accessgoods.model;

import jakarta.persistence.OneToMany;
import lombok.Data;

@Data
public class Category {
    private Long id;
    private String name;

}

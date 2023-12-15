package accessgoods.model.dto;

import accessgoods.model.Account;
import accessgoods.model.Image;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemPostDto {

    private String name;
    private String description;
    private Float cost;
    private List<ImagePostDto> images;
    private boolean isActive;
    private Long accountID;
}

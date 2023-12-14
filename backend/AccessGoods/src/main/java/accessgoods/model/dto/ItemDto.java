package accessgoods.model.dto;

import accessgoods.model.Account;
import accessgoods.model.Image;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemDto {
    private Long id;
    private String name;
    private String description;
    private Float cost;
    private List<ImageDto> images;
    private boolean isActive;
    private Long accountId;
    private String accountFirstName;
    private String accountLastName;
    private String accountImage;

}

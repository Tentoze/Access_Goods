package accessgoods.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FilterSearchDto {
    private String searchTerm;
    private Long categoryId;
    private Float priceFrom;
    private Float priceTo;
    private SortItemsByDto sortOption;
    private Boolean verifiedUser;
    private Boolean userHasPhoto;
    private Boolean withDelivery;
    private Boolean selfPickUp;

}

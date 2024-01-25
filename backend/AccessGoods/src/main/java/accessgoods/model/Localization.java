package accessgoods.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class Localization {

    @Column(name = "location_longitude")
    private Double longitude;
    @Column(name = "location_latitude")
    private Double latitude;
    @Column(name = "location_name")
    private String name;
}

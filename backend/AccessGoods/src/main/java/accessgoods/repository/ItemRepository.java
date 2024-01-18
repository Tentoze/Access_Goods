package accessgoods.repository;

import accessgoods.model.Category;
import accessgoods.model.Item;
import accessgoods.model.dto.SortItemsByDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByAccount_Id(@NonNull Long id);

    @Query("SELECT i FROM Item i " +
            "WHERE " +
            "(LOWER(i.name) LIKE CONCAT('%', LOWER(:searchTerm), '%') OR :searchTerm IS NULL) " +
            "AND (i.category.id = :categoryId OR :categoryId IS NULL) " +
            "AND (i.cost >= :costFrom OR :costFrom IS NULL) " +
            "AND (i.cost <= :costUpTo OR :costUpTo IS NULL) " +
            "AND (i.account.photo IS NOT NULL OR :userHasPhoto IS NULL) " +
            "AND (:searchLongitude IS NULL OR :searchLatitude IS NULL OR " +
            "    ST_Distance(" +
            "        ST_GeographyFromText(CONCAT('POINT(', i.account.localization.longitude, ' ', i.account.localization.latitude, ')')), " +
            "        ST_GeographyFromText(CONCAT('POINT(', :searchLongitude, ' ', :searchLatitude, ')'))" +
            "    ) <= :distanceInMeters" +
            ") " +
            "ORDER BY " +
            "CASE " +
            "   WHEN :sortBy = 'PRICE_ASC' THEN i.cost " +
            "   WHEN :sortBy = 'PRICE_DESC' THEN -i.cost " +
            "   else i.id end")
    List<Item> searchItems(
            @Param("searchTerm") String searchTerm,
            @Param("categoryId") Long categoryId,
            @Param("costFrom") Float costFrom,
            @Param("costUpTo") Float costUpTo,
            @Param("userHasPhoto") Boolean userHasPhoto,
            @Param("sortBy") String sortBy,
            @Param("searchLongitude") Double searchLongitude,
            @Param("searchLatitude") Double searchLatitude,
            @Param("distanceInMeters") Double distanceInMeters
    );


}

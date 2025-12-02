package com.balconazo.spaces.repository;

import com.balconazo.spaces.model.Space;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpaceRepository extends JpaRepository<Space, UUID>, JpaSpecificationExecutor<Space> {

    Page<Space> findByHostId(UUID hostId, Pageable pageable);

    Page<Space> findByActiveTrue(Pageable pageable);

    Page<Space> findByCityAndActiveTrue(String city, Pageable pageable);

    @Query(value = "SELECT * FROM spaces s WHERE s.active = true " +
           "AND (:city IS NULL OR LOWER(s.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "AND (CAST(:minPrice AS numeric) IS NULL OR s.price_per_hour >= CAST(:minPrice AS numeric)) " +
           "AND (CAST(:maxPrice AS numeric) IS NULL OR s.price_per_hour <= CAST(:maxPrice AS numeric)) " +
           "AND (CAST(:capacity AS integer) IS NULL OR s.capacity >= CAST(:capacity AS integer))",
           countQuery = "SELECT COUNT(*) FROM spaces s WHERE s.active = true " +
           "AND (:city IS NULL OR LOWER(s.city) LIKE LOWER(CONCAT('%', :city, '%'))) " +
           "AND (CAST(:minPrice AS numeric) IS NULL OR s.price_per_hour >= CAST(:minPrice AS numeric)) " +
           "AND (CAST(:maxPrice AS numeric) IS NULL OR s.price_per_hour <= CAST(:maxPrice AS numeric)) " +
           "AND (CAST(:capacity AS integer) IS NULL OR s.capacity >= CAST(:capacity AS integer))",
           nativeQuery = true)
    Page<Space> findWithFilters(
            @Param("city") String city,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("capacity") Integer capacity,
            Pageable pageable
    );

    @Query("SELECT s FROM Space s LEFT JOIN FETCH s.photos LEFT JOIN FETCH s.features WHERE s.id = :id")
    Optional<Space> findByIdWithDetails(@Param("id") UUID id);

    boolean existsByIdAndHostId(UUID id, UUID hostId);
}

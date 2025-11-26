package com.balconazo.spaces.repository;

import com.balconazo.spaces.dto.SpaceFilter;
import com.balconazo.spaces.model.Space;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SpaceSpecification {

    public static Specification<Space> withFilters(SpaceFilter filter) {
        return (Root<Space> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Solo espacios activos
            predicates.add(cb.isTrue(root.get("active")));

            // Filtro por ciudad (case-insensitive, parcial)
            if (filter.getCity() != null && !filter.getCity().isBlank()) {
                predicates.add(
                    cb.like(
                        cb.lower(root.get("city")),
                        "%" + filter.getCity().toLowerCase() + "%"
                    )
                );
            }

            // Filtro por precio mínimo
            if (filter.getMinPrice() != null) {
                predicates.add(
                    cb.greaterThanOrEqualTo(root.get("pricePerHour"), filter.getMinPrice())
                );
            }

            // Filtro por precio máximo
            if (filter.getMaxPrice() != null) {
                predicates.add(
                    cb.lessThanOrEqualTo(root.get("pricePerHour"), filter.getMaxPrice())
                );
            }

            // Filtro por capacidad mínima
            if (filter.getCapacity() != null) {
                predicates.add(
                    cb.greaterThanOrEqualTo(root.get("capacity"), filter.getCapacity())
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

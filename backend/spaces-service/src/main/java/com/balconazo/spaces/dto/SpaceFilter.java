package com.balconazo.spaces.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpaceFilter {

    private String city;
    private String category;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer capacity;
}

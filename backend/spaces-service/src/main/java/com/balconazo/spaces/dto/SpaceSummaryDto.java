package com.balconazo.spaces.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpaceSummaryDto {

    private UUID id;
    private String title;
    private String city;
    private Integer capacity;
    private BigDecimal pricePerHour;
    private String thumbnailUrl;
    private Boolean active;
}

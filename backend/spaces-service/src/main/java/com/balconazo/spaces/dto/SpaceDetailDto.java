package com.balconazo.spaces.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SpaceDetailDto {

    private UUID id;
    private UUID hostId;
    private String title;
    private String description;
    private String city;
    private String address;
    private Integer capacity;
    private BigDecimal pricePerHour;
    private Boolean active;
    private List<String> photos;
    private List<String> features;
    private LocalDateTime createdAt;
}

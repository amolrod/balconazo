package com.balconazo.bookings.dto;

import com.balconazo.bookings.model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private UUID id;
    private UUID spaceId;
    private UUID guestId;
    private UUID hostId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal totalPrice;
    private BookingStatus status;
    private String notes;
    private Long durationHours;
    private LocalDateTime createdAt;
}

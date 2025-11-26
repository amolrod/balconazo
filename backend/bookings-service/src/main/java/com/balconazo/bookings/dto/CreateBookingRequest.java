package com.balconazo.bookings.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingRequest {

    @NotNull(message = "El ID del espacio es obligatorio")
    private UUID spaceId;

    @NotNull(message = "La fecha/hora de inicio es obligatoria")
    @Future(message = "La fecha de inicio debe ser futura")
    private LocalDateTime startTime;

    @NotNull(message = "La fecha/hora de fin es obligatoria")
    @Future(message = "La fecha de fin debe ser futura")
    private LocalDateTime endTime;

    private String notes;
}

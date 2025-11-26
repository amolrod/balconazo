package com.balconazo.bookings.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "space_id", nullable = false)
    private UUID spaceId;

    @Column(name = "guest_id", nullable = false)
    private UUID guestId;

    @Column(name = "host_id", nullable = false)
    private UUID hostId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Calcula la duración de la reserva en horas.
     */
    public long getDurationHours() {
        return java.time.Duration.between(startTime, endTime).toHours();
    }

    /**
     * Verifica si la reserva puede ser cancelada.
     */
    public boolean canBeCancelled() {
        return status == BookingStatus.PENDING || status == BookingStatus.CONFIRMED;
    }

    /**
     * Verifica si el usuario puede cancelar la reserva.
     */
    public boolean canUserCancel(UUID userId) {
        return canBeCancelled() && (guestId.equals(userId) || hostId.equals(userId));
    }
}

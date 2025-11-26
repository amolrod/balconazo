package com.balconazo.bookings.repository;

import com.balconazo.bookings.model.Booking;
import com.balconazo.bookings.model.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

    /**
     * Busca reservas de un huésped.
     */
    Page<Booking> findByGuestId(UUID guestId, Pageable pageable);

    /**
     * Busca reservas de un huésped con estado específico.
     */
    Page<Booking> findByGuestIdAndStatus(UUID guestId, BookingStatus status, Pageable pageable);

    /**
     * Busca reservas recibidas por un anfitrión.
     */
    Page<Booking> findByHostId(UUID hostId, Pageable pageable);

    /**
     * Busca reservas recibidas por un anfitrión con estado específico.
     */
    Page<Booking> findByHostIdAndStatus(UUID hostId, BookingStatus status, Pageable pageable);

    /**
     * Busca reservas de un espacio específico.
     */
    List<Booking> findBySpaceId(UUID spaceId);

    /**
     * Detecta reservas solapadas para un espacio.
     * Una reserva se solapa si:
     * - El espacio es el mismo
     * - El estado NO es CANCELLED
     * - Hay superposición de fechas (start < endRequested AND end > startRequested)
     */
    @Query("SELECT b FROM Booking b WHERE b.spaceId = :spaceId " +
           "AND b.status IN ('PENDING', 'CONFIRMED') " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    List<Booking> findOverlappingBookings(
            @Param("spaceId") UUID spaceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    /**
     * Verifica si existe una reserva solapada (más eficiente que cargar todos).
     */
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE b.spaceId = :spaceId " +
           "AND b.status IN ('PENDING', 'CONFIRMED') " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    boolean existsOverlappingBooking(
            @Param("spaceId") UUID spaceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    /**
     * Busca reservas futuras de un espacio en un rango de fechas.
     */
    @Query("SELECT b FROM Booking b WHERE b.spaceId = :spaceId " +
           "AND b.status IN ('PENDING', 'CONFIRMED') " +
           "AND b.startTime >= :startDate AND b.endTime <= :endDate " +
           "ORDER BY b.startTime ASC")
    List<Booking> findBookingsInDateRange(
            @Param("spaceId") UUID spaceId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}

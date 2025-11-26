package com.balconazo.bookings.service;

import com.balconazo.bookings.dto.*;
import com.balconazo.bookings.model.Booking;
import com.balconazo.bookings.model.BookingStatus;
import com.balconazo.bookings.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RestTemplate restTemplate;

    @Value("${app.services.spaces-url}")
    private String spacesServiceUrl;

    /**
     * Crea una nueva reserva.
     */
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request, UUID guestId) {
        log.info("Creando reserva para espacio {} por guest {}", request.getSpaceId(), guestId);

        // Validar que startTime < endTime
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin");
        }

        // Validar duración mínima (1 hora)
        long hours = Duration.between(request.getStartTime(), request.getEndTime()).toHours();
        if (hours < 1) {
            throw new IllegalArgumentException("La duración mínima de una reserva es 1 hora");
        }

        // Verificar que no hay reservas solapadas
        if (bookingRepository.existsOverlappingBooking(
                request.getSpaceId(),
                request.getStartTime(),
                request.getEndTime())) {
            throw new IllegalStateException("Ya existe una reserva para este espacio en el horario seleccionado");
        }

        // Obtener información del espacio (precio y hostId)
        SpaceInfo spaceInfo = getSpaceInfo(request.getSpaceId());
        
        // Calcular precio total
        BigDecimal totalPrice = spaceInfo.pricePerHour().multiply(BigDecimal.valueOf(hours));

        Booking booking = Booking.builder()
                .id(UUID.randomUUID())
                .spaceId(request.getSpaceId())
                .guestId(guestId)
                .hostId(spaceInfo.hostId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .totalPrice(totalPrice)
                .status(BookingStatus.CONFIRMED) // Auto-confirmación por ahora
                .notes(request.getNotes())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        log.info("Reserva creada con ID: {}", savedBooking.getId());

        return mapToResponse(savedBooking);
    }

    /**
     * Obtiene las reservas del huésped actual.
     */
    @Transactional(readOnly = true)
    public Page<BookingResponse> getMyBookings(UUID guestId, BookingStatus status, Pageable pageable) {
        log.debug("Obteniendo reservas del guest: {}", guestId);

        Page<Booking> bookings = status != null
                ? bookingRepository.findByGuestIdAndStatus(guestId, status, pageable)
                : bookingRepository.findByGuestId(guestId, pageable);

        return bookings.map(this::mapToResponse);
    }

    /**
     * Obtiene las reservas recibidas por el anfitrión.
     */
    @Transactional(readOnly = true)
    public Page<BookingResponse> getHostBookings(UUID hostId, BookingStatus status, Pageable pageable) {
        log.debug("Obteniendo reservas del host: {}", hostId);

        Page<Booking> bookings = status != null
                ? bookingRepository.findByHostIdAndStatus(hostId, status, pageable)
                : bookingRepository.findByHostId(hostId, pageable);

        return bookings.map(this::mapToResponse);
    }

    /**
     * Obtiene el detalle de una reserva.
     */
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(UUID bookingId, UUID userId) {
        log.debug("Obteniendo reserva: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));

        // Verificar que el usuario tiene acceso (es guest o host)
        if (!booking.getGuestId().equals(userId) && !booking.getHostId().equals(userId)) {
            throw new SecurityException("No tienes permiso para ver esta reserva");
        }

        return mapToResponse(booking);
    }

    /**
     * Cancela una reserva.
     */
    @Transactional
    public BookingResponse cancelBooking(UUID bookingId, UUID userId) {
        log.info("Cancelando reserva: {} por usuario: {}", bookingId, userId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada"));

        if (!booking.canUserCancel(userId)) {
            throw new SecurityException("No tienes permiso para cancelar esta reserva o ya no se puede cancelar");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking savedBooking = bookingRepository.save(booking);

        log.info("Reserva cancelada: {}", bookingId);
        return mapToResponse(savedBooking);
    }

    /**
     * Obtiene la disponibilidad de un espacio en un rango de fechas.
     */
    @Transactional(readOnly = true)
    public List<BookedSlot> getSpaceAvailability(UUID spaceId, LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Obteniendo disponibilidad del espacio: {} entre {} y {}", spaceId, startDate, endDate);

        List<Booking> bookings = bookingRepository.findBookingsInDateRange(spaceId, startDate, endDate);

        return bookings.stream()
                .map(b -> BookedSlot.builder()
                        .startTime(b.getStartTime())
                        .endTime(b.getEndTime())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Obtiene información del espacio desde spaces-service.
     * En una implementación real, usaría Feign Client o RestTemplate.
     */
    private SpaceInfo getSpaceInfo(UUID spaceId) {
        try {
            // Por ahora, simulamos la llamada
            // En producción: restTemplate.getForObject(spacesServiceUrl + "/spaces/" + spaceId, SpaceInfoResponse.class)
            log.debug("Obteniendo info del espacio: {}", spaceId);
            
            // TODO: Implementar llamada real a spaces-service
            // Por ahora devolvemos valores por defecto para desarrollo
            return new SpaceInfo(
                    spaceId,
                    UUID.fromString("00000000-0000-0000-0000-000000000001"), // hostId placeholder
                    new BigDecimal("25.00") // precio por defecto
            );
        } catch (Exception e) {
            log.error("Error obteniendo info del espacio: {}", e.getMessage());
            throw new IllegalStateException("No se pudo obtener información del espacio");
        }
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .spaceId(booking.getSpaceId())
                .guestId(booking.getGuestId())
                .hostId(booking.getHostId())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .notes(booking.getNotes())
                .durationHours(booking.getDurationHours())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    /**
     * Record para información del espacio.
     */
    private record SpaceInfo(UUID id, UUID hostId, BigDecimal pricePerHour) {}
}

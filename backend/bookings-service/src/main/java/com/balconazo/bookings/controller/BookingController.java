package com.balconazo.bookings.controller;

import com.balconazo.bookings.dto.*;
import com.balconazo.bookings.model.BookingStatus;
import com.balconazo.bookings.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    /**
     * Crea una nueva reserva.
     */
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID guestId = UUID.fromString(jwt.getSubject());
        log.debug("POST /bookings - Guest: {}", guestId);

        BookingResponse booking = bookingService.createBooking(request, guestId);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    /**
     * Obtiene las reservas del usuario actual (como huésped).
     */
    @GetMapping("/me")
    public ResponseEntity<Page<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) BookingStatus status,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        UUID guestId = UUID.fromString(jwt.getSubject());
        log.debug("GET /bookings/me - Guest: {}", guestId);

        Page<BookingResponse> bookings = bookingService.getMyBookings(guestId, status, pageable);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Obtiene las reservas recibidas (como anfitrión).
     */
    @GetMapping("/host")
    @PreAuthorize("hasAnyRole('ROLE_HOST', 'ROLE_ADMIN')")
    public ResponseEntity<Page<BookingResponse>> getHostBookings(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) BookingStatus status,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        UUID hostId = UUID.fromString(jwt.getSubject());
        log.debug("GET /bookings/host - Host: {}", hostId);

        Page<BookingResponse> bookings = bookingService.getHostBookings(hostId, status, pageable);
        return ResponseEntity.ok(bookings);
    }

    /**
     * Obtiene el detalle de una reserva.
     */
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        log.debug("GET /bookings/{} - User: {}", id, userId);

        BookingResponse booking = bookingService.getBookingById(id, userId);
        return ResponseEntity.ok(booking);
    }

    /**
     * Cancela una reserva.
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());
        log.debug("PUT /bookings/{}/cancel - User: {}", id, userId);

        BookingResponse booking = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(booking);
    }

    /**
     * Obtiene la disponibilidad de un espacio (slots ocupados).
     */
    @GetMapping("/space/{spaceId}/availability")
    public ResponseEntity<List<BookedSlot>> getSpaceAvailability(
            @PathVariable UUID spaceId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate
    ) {
        log.debug("GET /bookings/space/{}/availability - {} to {}", spaceId, startDate, endDate);

        List<BookedSlot> bookedSlots = bookingService.getSpaceAvailability(spaceId, startDate, endDate);
        return ResponseEntity.ok(bookedSlots);
    }
}

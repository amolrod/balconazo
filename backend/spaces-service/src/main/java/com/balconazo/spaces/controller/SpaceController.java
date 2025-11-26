package com.balconazo.spaces.controller;

import com.balconazo.spaces.dto.*;
import com.balconazo.spaces.service.SpaceService;
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

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/spaces")
@RequiredArgsConstructor
@Slf4j
public class SpaceController {

    private final SpaceService spaceService;

    /**
     * Lista espacios públicos con filtros opcionales.
     */
    @GetMapping
    public ResponseEntity<Page<SpaceSummaryDto>> listSpaces(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer capacity,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        log.debug("GET /spaces - Filtros: city={}, minPrice={}, maxPrice={}, capacity={}",
                city, minPrice, maxPrice, capacity);

        SpaceFilter filter = SpaceFilter.builder()
                .city(city)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .capacity(capacity)
                .build();

        Page<SpaceSummaryDto> spaces = spaceService.listSpaces(filter, pageable);
        return ResponseEntity.ok(spaces);
    }

    /**
     * Obtiene el detalle de un espacio por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SpaceDetailDto> getSpace(@PathVariable UUID id) {
        log.debug("GET /spaces/{}", id);
        SpaceDetailDto space = spaceService.getSpaceById(id);
        return ResponseEntity.ok(space);
    }

    /**
     * Crea un nuevo espacio (solo HOSTS).
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_HOST', 'ROLE_ADMIN')")
    public ResponseEntity<SpaceDetailDto> createSpace(
            @Valid @RequestBody CreateSpaceRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID hostId = UUID.fromString(jwt.getSubject());
        log.debug("POST /spaces - Host: {}", hostId);

        SpaceDetailDto created = spaceService.createSpace(request, hostId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * Actualiza un espacio existente (solo el propietario).
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_HOST', 'ROLE_ADMIN')")
    public ResponseEntity<SpaceDetailDto> updateSpace(
            @PathVariable UUID id,
            @Valid @RequestBody CreateSpaceRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID hostId = UUID.fromString(jwt.getSubject());
        log.debug("PUT /spaces/{} - Host: {}", id, hostId);

        SpaceDetailDto updated = spaceService.updateSpace(id, request, hostId);
        return ResponseEntity.ok(updated);
    }

    /**
     * Elimina un espacio (solo el propietario).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_HOST', 'ROLE_ADMIN')")
    public ResponseEntity<Void> deleteSpace(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID hostId = UUID.fromString(jwt.getSubject());
        log.debug("DELETE /spaces/{} - Host: {}", id, hostId);

        spaceService.deleteSpace(id, hostId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Lista los espacios del host autenticado.
     */
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ROLE_HOST', 'ROLE_ADMIN')")
    public ResponseEntity<Page<SpaceSummaryDto>> getMySpaces(
            @AuthenticationPrincipal Jwt jwt,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        UUID hostId = UUID.fromString(jwt.getSubject());
        log.debug("GET /spaces/my - Host: {}", hostId);

        Page<SpaceSummaryDto> spaces = spaceService.getMySpaces(hostId, pageable);
        return ResponseEntity.ok(spaces);
    }
}

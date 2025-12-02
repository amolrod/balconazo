package com.balconazo.users.controller;

import com.balconazo.users.dto.RegisterRequest;
import com.balconazo.users.dto.RegisterResponse;
import com.balconazo.users.service.KeycloakAdminService;
import com.balconazo.users.service.KeycloakAdminService.KeycloakRegistrationException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final KeycloakAdminService keycloakAdminService;

    /**
     * Endpoint público para registro de usuarios.
     * Crea el usuario en Keycloak y le asigna el rol ROLE_USER.
     */
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /auth/register - Email: {}", request.getEmail());
        
        try {
            String userId = keycloakAdminService.registerUser(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(RegisterResponse.success(userId));
                    
        } catch (KeycloakRegistrationException e) {
            log.warn("Error en registro: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(RegisterResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Error inesperado en registro", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(RegisterResponse.error("Error interno del servidor"));
        }
    }
}

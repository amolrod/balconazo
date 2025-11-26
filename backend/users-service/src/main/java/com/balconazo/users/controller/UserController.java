package com.balconazo.users.controller;

import com.balconazo.users.dto.UpdateUserRequest;
import com.balconazo.users.dto.UserResponse;
import com.balconazo.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Obtiene el perfil del usuario autenticado.
     * Si es la primera vez que accede, se crea automáticamente.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        log.debug("GET /users/me - Usuario: {}", jwt.getSubject());
        UserResponse user = userService.getOrCreateUser(jwt);
        return ResponseEntity.ok(user);
    }

    /**
     * Actualiza los datos del usuario autenticado.
     */
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateUserRequest request
    ) {
        log.debug("PUT /users/me - Usuario: {}", jwt.getSubject());
        UserResponse user = userService.updateUser(jwt.getSubject(), request);
        return ResponseEntity.ok(user);
    }
}

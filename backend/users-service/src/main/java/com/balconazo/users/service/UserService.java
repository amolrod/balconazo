package com.balconazo.users.service;

import com.balconazo.users.dto.UpdateUserRequest;
import com.balconazo.users.dto.UserResponse;
import com.balconazo.users.model.Role;
import com.balconazo.users.model.User;
import com.balconazo.users.repository.RoleRepository;
import com.balconazo.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    /**
     * Obtiene o crea un usuario basándose en la información del token JWT.
     * Si el usuario no existe en la BD local, se crea con los datos del token.
     */
    @Transactional
    public UserResponse getOrCreateUser(Jwt jwt) {
        String keycloakId = jwt.getSubject();
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("given_name");
        String surname = jwt.getClaimAsString("family_name");

        log.debug("Buscando usuario con keycloakId: {}", keycloakId);

        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseGet(() -> createUser(keycloakId, email, name, surname, extractRoles(jwt)));

        return mapToResponse(user);
    }

    /**
     * Actualiza los datos del usuario actual.
     */
    @Transactional
    public UserResponse updateUser(String keycloakId, UpdateUserRequest request) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        user.setName(request.getName());
        user.setSurname(request.getSurname());

        User savedUser = userRepository.save(user);
        log.info("Usuario actualizado: {}", savedUser.getId());

        return mapToResponse(savedUser);
    }

    /**
     * Obtiene el usuario actual por su keycloakId.
     */
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String keycloakId) {
        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        return mapToResponse(user);
    }

    private User createUser(String keycloakId, String email, String name, String surname, Set<String> roleNames) {
        log.info("Creando nuevo usuario con keycloakId: {}", keycloakId);

        Set<Role> roles = new HashSet<>();
        for (String roleName : roleNames) {
            roleRepository.findByName(roleName).ifPresent(roles::add);
        }

        // Si no se encontraron roles, asignar ROLE_USER por defecto
        if (roles.isEmpty()) {
            roleRepository.findByName("ROLE_USER").ifPresent(roles::add);
        }

        User user = User.builder()
                .id(UUID.randomUUID())
                .keycloakId(keycloakId)
                .email(email != null ? email : "unknown@balconazo.local")
                .name(name != null ? name : "Usuario")
                .surname(surname != null ? surname : "Nuevo")
                .roles(roles)
                .build();

        return userRepository.save(user);
    }

    @SuppressWarnings("unchecked")
    private Set<String> extractRoles(Jwt jwt) {
        Set<String> roles = new HashSet<>();
        
        // Intentar extraer roles de realm_access.roles
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess != null && realmAccess.containsKey("roles")) {
            List<String> realmRoles = (List<String>) realmAccess.get("roles");
            roles.addAll(realmRoles.stream()
                    .filter(role -> role.startsWith("ROLE_"))
                    .collect(Collectors.toSet()));
        }

        return roles;
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .surname(user.getSurname())
                .fullName(user.getFullName())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}

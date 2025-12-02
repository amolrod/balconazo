package com.balconazo.users.service;

import com.balconazo.users.dto.RegisterRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class KeycloakAdminService {

    private final RestTemplate restTemplate;

    @Value("${keycloak.admin.url:http://localhost:8081}")
    private String keycloakUrl;

    @Value("${keycloak.admin.realm:balconazo}")
    private String realm;

    @Value("${keycloak.admin.username:admin}")
    private String adminUsername;

    @Value("${keycloak.admin.password:admin}")
    private String adminPassword;

    public KeycloakAdminService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Registra un nuevo usuario en Keycloak
     */
    public String registerUser(RegisterRequest request) throws KeycloakRegistrationException {
        String adminToken = getAdminToken();
        
        // Crear el usuario en Keycloak
        String userUrl = keycloakUrl + "/admin/realms/" + realm + "/users";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);

        Map<String, Object> userRepresentation = new HashMap<>();
        userRepresentation.put("email", request.getEmail());
        userRepresentation.put("username", request.getEmail());
        userRepresentation.put("firstName", request.getFirstName());
        userRepresentation.put("lastName", request.getLastName());
        userRepresentation.put("enabled", true);
        userRepresentation.put("emailVerified", true);

        // Configurar la contraseña
        Map<String, Object> credential = new HashMap<>();
        credential.put("type", "password");
        credential.put("value", request.getPassword());
        credential.put("temporary", false);
        userRepresentation.put("credentials", Collections.singletonList(credential));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(userRepresentation, headers);

        try {
            ResponseEntity<Void> response = restTemplate.exchange(
                    userUrl,
                    HttpMethod.POST,
                    entity,
                    Void.class
            );

            if (response.getStatusCode() == HttpStatus.CREATED) {
                // Obtener el ID del usuario creado desde el header Location
                String location = response.getHeaders().getFirst(HttpHeaders.LOCATION);
                if (location != null) {
                    String userId = location.substring(location.lastIndexOf("/") + 1);
                    log.info("Usuario creado en Keycloak con ID: {}", userId);
                    
                    // Asignar rol ROLE_USER al usuario
                    assignDefaultRole(adminToken, userId);
                    
                    return userId;
                }
            }
            throw new KeycloakRegistrationException("Error al crear usuario en Keycloak");
            
        } catch (HttpClientErrorException.Conflict e) {
            log.warn("Usuario ya existe: {}", request.getEmail());
            throw new KeycloakRegistrationException("Ya existe una cuenta con este email");
        } catch (HttpClientErrorException e) {
            log.error("Error de Keycloak: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new KeycloakRegistrationException("Error al registrar usuario: " + e.getMessage());
        }
    }

    /**
     * Obtiene un token de administrador de Keycloak
     */
    private String getAdminToken() throws KeycloakRegistrationException {
        String tokenUrl = keycloakUrl + "/realms/master/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", "admin-cli");
        body.add("username", adminUsername);
        body.add("password", adminPassword);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    tokenUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (response.getBody() != null && response.getBody().containsKey("access_token")) {
                return (String) response.getBody().get("access_token");
            }
            throw new KeycloakRegistrationException("No se pudo obtener token de administrador");
            
        } catch (HttpClientErrorException e) {
            log.error("Error al obtener token admin: {}", e.getMessage());
            throw new KeycloakRegistrationException("Error de autenticación con Keycloak");
        }
    }

    /**
     * Asigna el rol ROLE_USER al usuario recién creado
     */
    private void assignDefaultRole(String adminToken, String userId) {
        try {
            // Primero obtenemos el rol ROLE_USER del realm
            String rolesUrl = keycloakUrl + "/admin/realms/" + realm + "/roles/ROLE_USER";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            ResponseEntity<Map> roleResponse = restTemplate.exchange(
                    rolesUrl,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class
            );

            if (roleResponse.getBody() != null) {
                // Asignar el rol al usuario
                String assignUrl = keycloakUrl + "/admin/realms/" + realm + "/users/" + userId + "/role-mappings/realm";
                
                HttpEntity<List<Map>> assignEntity = new HttpEntity<>(
                        Collections.singletonList(roleResponse.getBody()),
                        headers
                );

                restTemplate.exchange(
                        assignUrl,
                        HttpMethod.POST,
                        assignEntity,
                        Void.class
                );
                
                log.info("Rol ROLE_USER asignado al usuario: {}", userId);
            }
        } catch (Exception e) {
            log.warn("No se pudo asignar el rol por defecto: {}", e.getMessage());
            // No lanzamos excepción porque el usuario ya está creado
        }
    }

    public static class KeycloakRegistrationException extends Exception {
        public KeycloakRegistrationException(String message) {
            super(message);
        }
    }
}

package com.balconazo.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {

    private boolean success;
    private String message;
    private String userId;

    public static RegisterResponse success(String userId) {
        return RegisterResponse.builder()
                .success(true)
                .message("Usuario registrado correctamente")
                .userId(userId)
                .build();
    }

    public static RegisterResponse error(String message) {
        return RegisterResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}

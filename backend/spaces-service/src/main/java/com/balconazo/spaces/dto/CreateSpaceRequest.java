package com.balconazo.spaces.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSpaceRequest {

    @NotBlank(message = "El título es obligatorio")
    @Size(min = 5, max = 150, message = "El título debe tener entre 5 y 150 caracteres")
    private String title;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 20, max = 2000, message = "La descripción debe tener entre 20 y 2000 caracteres")
    private String description;

    @NotBlank(message = "La ciudad es obligatoria")
    @Size(max = 100, message = "La ciudad no puede superar los 100 caracteres")
    private String city;

    @Size(max = 255, message = "La dirección no puede superar los 255 caracteres")
    private String address;

    @DecimalMin(value = "-90.0", message = "Latitud inválida")
    @DecimalMax(value = "90.0", message = "Latitud inválida")
    private Double latitude;

    @DecimalMin(value = "-180.0", message = "Longitud inválida")
    @DecimalMax(value = "180.0", message = "Longitud inválida")
    private Double longitude;

    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad mínima es 1 persona")
    @Max(value = 500, message = "La capacidad máxima es 500 personas")
    private Integer capacity;

    @NotNull(message = "El precio por hora es obligatorio")
    @DecimalMin(value = "1.00", message = "El precio mínimo es 1.00€")
    @DecimalMax(value = "10000.00", message = "El precio máximo es 10000.00€")
    private BigDecimal pricePerHour;

    private List<String> photoUrls;

    private List<String> features;
}

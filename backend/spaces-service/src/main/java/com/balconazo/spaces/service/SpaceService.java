package com.balconazo.spaces.service;

import com.balconazo.spaces.dto.*;
import com.balconazo.spaces.model.Space;
import com.balconazo.spaces.model.SpaceFeature;
import com.balconazo.spaces.model.SpacePhoto;
import com.balconazo.spaces.repository.SpaceRepository;
import com.balconazo.spaces.repository.SpaceSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SpaceService {

    private final SpaceRepository spaceRepository;

    /**
     * Lista espacios con filtros opcionales.
     */
    @Transactional(readOnly = true)
    public Page<SpaceSummaryDto> listSpaces(SpaceFilter filter, Pageable pageable) {
        log.debug("Listando espacios con filtros: {}", filter);

        Page<Space> spaces = spaceRepository.findAll(
                SpaceSpecification.withFilters(filter),
                pageable
        );

        return spaces.map(this::mapToSummary);
    }

    /**
     * Obtiene el detalle de un espacio por ID.
     */
    @Transactional(readOnly = true)
    public SpaceDetailDto getSpaceById(UUID id) {
        log.debug("Obteniendo espacio con ID: {}", id);

        Space space = spaceRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new IllegalArgumentException("Espacio no encontrado"));

        return mapToDetail(space);
    }

    /**
     * Crea un nuevo espacio.
     */
    @Transactional
    public SpaceDetailDto createSpace(CreateSpaceRequest request, UUID hostId) {
        log.info("Creando espacio para host: {}", hostId);

        Space space = Space.builder()
                .id(UUID.randomUUID())
                .hostId(hostId)
                .title(request.getTitle())
                .description(request.getDescription())
                .city(request.getCity())
                .address(request.getAddress())
                .capacity(request.getCapacity())
                .pricePerHour(request.getPricePerHour())
                .active(true)
                .build();

        // Añadir fotos
        if (request.getPhotoUrls() != null) {
            int sortOrder = 0;
            for (String url : request.getPhotoUrls()) {
                SpacePhoto photo = SpacePhoto.builder()
                        .id(UUID.randomUUID())
                        .url(url)
                        .sortOrder(sortOrder++)
                        .build();
                space.addPhoto(photo);
            }
        }

        // Añadir características
        if (request.getFeatures() != null) {
            for (String featureName : request.getFeatures()) {
                SpaceFeature feature = SpaceFeature.builder()
                        .id(UUID.randomUUID())
                        .name(featureName)
                        .build();
                space.addFeature(feature);
            }
        }

        Space savedSpace = spaceRepository.save(space);
        log.info("Espacio creado con ID: {}", savedSpace.getId());

        return mapToDetail(savedSpace);
    }

    /**
     * Actualiza un espacio existente.
     */
    @Transactional
    public SpaceDetailDto updateSpace(UUID spaceId, CreateSpaceRequest request, UUID hostId) {
        log.info("Actualizando espacio: {} por host: {}", spaceId, hostId);

        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new IllegalArgumentException("Espacio no encontrado"));

        if (!space.getHostId().equals(hostId)) {
            throw new SecurityException("No tienes permiso para editar este espacio");
        }

        space.setTitle(request.getTitle());
        space.setDescription(request.getDescription());
        space.setCity(request.getCity());
        space.setAddress(request.getAddress());
        space.setCapacity(request.getCapacity());
        space.setPricePerHour(request.getPricePerHour());

        // Actualizar fotos
        space.getPhotos().clear();
        if (request.getPhotoUrls() != null) {
            int sortOrder = 0;
            for (String url : request.getPhotoUrls()) {
                SpacePhoto photo = SpacePhoto.builder()
                        .id(UUID.randomUUID())
                        .url(url)
                        .sortOrder(sortOrder++)
                        .build();
                space.addPhoto(photo);
            }
        }

        // Actualizar características
        space.getFeatures().clear();
        if (request.getFeatures() != null) {
            for (String featureName : request.getFeatures()) {
                SpaceFeature feature = SpaceFeature.builder()
                        .id(UUID.randomUUID())
                        .name(featureName)
                        .build();
                space.addFeature(feature);
            }
        }

        Space savedSpace = spaceRepository.save(space);
        return mapToDetail(savedSpace);
    }

    /**
     * Elimina un espacio.
     */
    @Transactional
    public void deleteSpace(UUID spaceId, UUID hostId) {
        log.info("Eliminando espacio: {} por host: {}", spaceId, hostId);

        Space space = spaceRepository.findById(spaceId)
                .orElseThrow(() -> new IllegalArgumentException("Espacio no encontrado"));

        if (!space.getHostId().equals(hostId)) {
            throw new SecurityException("No tienes permiso para eliminar este espacio");
        }

        spaceRepository.delete(space);
        log.info("Espacio eliminado: {}", spaceId);
    }

    /**
     * Lista los espacios de un host.
     */
    @Transactional(readOnly = true)
    public Page<SpaceSummaryDto> getMySpaces(UUID hostId, Pageable pageable) {
        log.debug("Listando espacios del host: {}", hostId);
        return spaceRepository.findByHostId(hostId, pageable).map(this::mapToSummary);
    }

    private SpaceSummaryDto mapToSummary(Space space) {
        return SpaceSummaryDto.builder()
                .id(space.getId())
                .title(space.getTitle())
                .city(space.getCity())
                .capacity(space.getCapacity())
                .pricePerHour(space.getPricePerHour())
                .thumbnailUrl(space.getThumbnailUrl())
                .active(space.getActive())
                .build();
    }

    private SpaceDetailDto mapToDetail(Space space) {
        return SpaceDetailDto.builder()
                .id(space.getId())
                .hostId(space.getHostId())
                .title(space.getTitle())
                .description(space.getDescription())
                .city(space.getCity())
                .address(space.getAddress())
                .capacity(space.getCapacity())
                .pricePerHour(space.getPricePerHour())
                .active(space.getActive())
                .photos(space.getPhotos().stream()
                        .map(SpacePhoto::getUrl)
                        .collect(Collectors.toList()))
                .features(space.getFeatures().stream()
                        .map(SpaceFeature::getName)
                        .collect(Collectors.toList()))
                .createdAt(space.getCreatedAt())
                .build();
    }
}

package com.balconazo.spaces.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "spaces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Space {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @Column(name = "host_id", nullable = false)
    private UUID hostId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(length = 255)
    private String address;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "price_per_hour", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @OrderBy("sortOrder ASC")
    private List<SpacePhoto> photos = new ArrayList<>();

    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<SpaceFeature> features = new ArrayList<>();

    public void addPhoto(SpacePhoto photo) {
        photos.add(photo);
        photo.setSpace(this);
    }

    public void removePhoto(SpacePhoto photo) {
        photos.remove(photo);
        photo.setSpace(null);
    }

    public void addFeature(SpaceFeature feature) {
        features.add(feature);
        feature.setSpace(this);
    }

    public void removeFeature(SpaceFeature feature) {
        features.remove(feature);
        feature.setSpace(null);
    }

    public String getThumbnailUrl() {
        return photos.isEmpty() ? null : photos.get(0).getUrl();
    }
}

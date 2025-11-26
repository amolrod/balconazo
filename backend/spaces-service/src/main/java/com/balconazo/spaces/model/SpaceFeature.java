package com.balconazo.spaces.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "space_features")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpaceFeature {

    @Id
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", nullable = false)
    private Space space;

    @Column(nullable = false, length = 100)
    private String name;
}

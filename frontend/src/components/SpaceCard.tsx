"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Users, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Space } from "@/lib/api";

interface SpaceCardProps {
  space: Space;
  index?: number;
}

// Placeholder images for spaces without images
const placeholderImages = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
];

export default function SpaceCard({ space, index = 0 }: SpaceCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Get all images: prefer images array, fallback to thumbnailUrl, then placeholder
  const allImages = space.images && space.images.length > 0 
    ? space.images 
    : space.thumbnailUrl 
      ? [space.thumbnailUrl]
      : [placeholderImages[index % placeholderImages.length]];
  
  const imageUrl = allImages[currentImageIndex];
  const hasMultipleImages = allImages.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <Link 
      href={`/spaces/${space.id}`}
      className="space-card"
      style={{ 
        opacity: 0,
        animation: `fadeUp 0.6s ease forwards`,
        animationDelay: `${index * 0.05}s`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="space-image-container">
        <Image
          src={imageUrl}
          alt={space.title}
          fill
          className="space-image"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Favorite Button */}
        <button 
          className="favorite-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: Implement favorite toggle
          }}
        >
          <Heart size={18} strokeWidth={2} />
        </button>

        {/* Category Badge */}
        {space.category && (
          <div className="space-badge">
            {space.category}
          </div>
        )}

        {/* Image Navigation Arrows */}
        {hasMultipleImages && isHovered && (
          <>
            <button 
              className="image-nav-btn image-nav-prev"
              onClick={handlePrevImage}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button 
              className="image-nav-btn image-nav-next"
              onClick={handleNextImage}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* Image Dots Indicator */}
        {hasMultipleImages && (
          <div className="image-dots">
            {allImages.map((_, idx) => (
              <span 
                key={idx} 
                className={`image-dot ${idx === currentImageIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-content">
        <div className="space-header">
          <div>
            <h3 className="space-title">{space.title}</h3>
            <p className="space-location">
              <MapPin size={14} />
              {space.city}
            </p>
            <p className="space-capacity">
              <Users size={14} />
              Hasta {space.capacity} personas
            </p>
          </div>
          {space.rating && (
            <div className="space-rating">
              <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
              <span>{space.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="space-price">
          <span className="amount">{space.pricePerHour}€</span>
          <span className="period">/ hora</span>
        </div>
      </div>
    </Link>
  );
}

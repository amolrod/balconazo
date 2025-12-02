"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "react-aria-components";
import { 
  MapPin, 
  Users, 
  Heart,
  Share2,
  Check,
  Wifi,
  Car,
  UtensilsCrossed,
  Music2,
  Sparkles,
  Shield,
  Minus,
  Plus,
  Clock,
  Grid2X2,
  ArrowLeft,
  Wind,
  Tv,
  Eye,
  Lightbulb,
  Camera,
  Sofa,
  CalendarDays,
  X
} from "lucide-react";
import { spacesApi, Space } from "@/lib/api";
import { RangeCalendar } from "@/components/ui/calendar-rac";
import dynamic from "next/dynamic";
import "./space-detail.css";

// Dynamic import for map (Leaflet doesn't work with SSR)
const SpaceMap = dynamic(() => import("@/components/SpaceMap"), {
  ssr: false,
  loading: () => <div className="space-map-skeleton" />
});

function SpaceDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const spaceId = params.id as string;
  
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [guests, setGuests] = useState(1);
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("22:00");
  const [dateRange, setDateRange] = useState<{ start: DateValue; end: DateValue } | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // TODO: Fetch booked dates from API when available
  // For now, no dates are unavailable
  const bookedDates: Array<[DateValue, DateValue]> = [];

  const isDateUnavailable = (date: DateValue) =>
    bookedDates.some(
      (interval) =>
        date.compare(interval[0]) >= 0 && date.compare(interval[1]) <= 0
    );

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  // Fallback data from search params
  const fallbackTitle = searchParams.get('title');
  const fallbackCity = searchParams.get('city');
  const fallbackPrice = searchParams.get('price');
  const fallbackCapacity = searchParams.get('capacity');
  const fallbackImage = searchParams.get('image');
  const fallbackRating = searchParams.get('rating');

  useEffect(() => {
    const fetchSpace = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await spacesApi.getById(spaceId);
        setSpace(data);
      } catch (err) {
        console.error("Error fetching space:", err);
        if (fallbackTitle) {
          setSpace({
            id: spaceId,
            title: fallbackTitle,
            city: fallbackCity || '',
            pricePerHour: Number(fallbackPrice) || 0,
            capacity: Number(fallbackCapacity) || 0,
            thumbnailUrl: fallbackImage || undefined,
            rating: fallbackRating ? Number(fallbackRating) : undefined,
          });
        } else {
          setError("No se pudo cargar el espacio");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (spaceId) {
      fetchSpace();
    }
  }, [spaceId, fallbackTitle, fallbackCity, fallbackPrice, fallbackCapacity, fallbackImage, fallbackRating]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: space?.title,
          text: `Mira este espacio: ${space?.title}`,
          url: window.location.href,
        });
      } catch {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("¡Enlace copiado!");
    }
  };

  // Calculate hours and total
  const calculateHours = () => {
    const [startH] = startTime.split(':').map(Number);
    const [endH] = endTime.split(':').map(Number);
    return Math.max(0, endH - startH);
  };

  const hours = calculateHours();
  const subtotal = (space?.pricePerHour || 0) * hours;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !space) {
    return (
      <div className="space-error-container">
        <div className="space-error-content">
          <div className="space-error-icon">
            <MapPin />
          </div>
          <h1 className="space-error-title">Espacio no encontrado</h1>
          <p className="space-error-message">
            {error || "El espacio que buscas no existe o ha sido eliminado."}
          </p>
          <Link href="/" className="space-error-link">
            <ArrowLeft />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const images = space.photos || (space.thumbnailUrl ? [space.thumbnailUrl] : []);
  const mainImage = images[0] || "/placeholder-space.jpg";
  const features = space.features || space.amenities || [];

  return (
    <div className="space-detail-page">
      {/* Header */}
      <header className="space-detail-header">
        <div className="space-detail-header-inner">
          <h1 className="space-detail-title">{space.title}</h1>
          <div className="space-detail-meta">
            <div className="space-detail-location">
              <MapPin />
              <span>{space.city}</span>
            </div>
            <div className="space-detail-actions">
              <button onClick={handleShare} className="space-detail-action-btn">
                <Share2 />
                <span>Compartir</span>
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)} 
                className="space-detail-action-btn"
              >
                <Heart style={isFavorite ? { fill: '#e11d48', color: '#e11d48' } : {}} />
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="space-detail-content">
        {/* Gallery */}
        <div className="space-gallery-wrapper">
          <div className="space-gallery-grid">
            <div className="space-gallery-main">
              <Image
                src={mainImage}
                alt={space.title}
                fill
                className="space-gallery-img"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="space-gallery-secondary">
                {images[idx] ? (
                  <Image
                    src={images[idx]}
                    alt={`${space.title} ${idx + 1}`}
                    fill
                    className="space-gallery-img"
                    sizes="25vw"
                  />
                ) : (
                  <div className="space-gallery-placeholder">
                    <div className="space-gallery-placeholder-icon">
                      <Grid2X2 />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div className="space-main-layout">
          {/* Left column - Content */}
          <div className="space-main-content">
            {/* Quick info */}
            <div className="space-quick-info">
              <div className="space-quick-info-item">
                <Users />
                <div>
                  <strong>{space.capacity} personas</strong>
                  <span>Capacidad máx.</span>
                </div>
              </div>
              <div className="space-quick-info-item">
                <Clock />
                <div>
                  <strong>{space.pricePerHour}€</strong>
                  <span>Precio/hora</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {space.description && (
              <section className="space-section">
                <h2 className="space-section-title">Sobre este espacio</h2>
                <p className="space-description">{space.description}</p>
              </section>
            )}

            {/* Amenities */}
            {features.length > 0 && (
              <section className="space-section space-section-bordered">
                <h2 className="space-section-title">Lo que ofrece este lugar</h2>
                <div className="space-amenities-grid">
                  {features.map((feature, idx) => (
                    <div key={idx} className="space-amenity-item">
                      {getFeatureIcon(feature)}
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Trust badges */}
            <section className="space-section space-section-bordered">
              <div className="space-trust-grid">
                <div className="space-trust-card">
                  <div className="space-trust-icon space-trust-icon--rose">
                    <Shield />
                  </div>
                  <div className="space-trust-content">
                    <h3>Reserva segura</h3>
                    <p>Pago protegido y cancelación flexible</p>
                  </div>
                </div>
                <div className="space-trust-card">
                  <div className="space-trust-icon space-trust-icon--green">
                    <Check />
                  </div>
                  <div className="space-trust-content">
                    <h3>Espacio verificado</h3>
                    <p>Revisado por nuestro equipo</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Location Map */}
            <section className="space-section space-section-bordered">
              <h2 className="space-section-title">
                <MapPin className="w-5 h-5" />
                Ubicación
              </h2>
              <p className="space-location-address">{space.address}</p>
              <div className="space-map-container">
                <SpaceMap 
                  latitude={space.latitude} 
                  longitude={space.longitude}
                  title={space.title}
                  address={space.address}
                />
              </div>
            </section>
          </div>

          {/* Right column - Booking sidebar */}
          <aside className="space-sidebar">
            <div className="space-booking-card">
              {/* Price */}
              <div className="space-price-display">
                <span className="space-price-amount">{space.pricePerHour}€</span>
                <span className="space-price-unit">/ hora</span>
              </div>

              {/* Booking form */}
              <div className="space-booking-form">
                {/* Date picker dropdown */}
                <div className="space-date-picker" ref={calendarRef}>
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="space-date-picker-trigger"
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      {dateRange 
                        ? `${dateRange.start.toString()} - ${dateRange.end.toString()}`
                        : 'Seleccionar fechas'
                      }
                    </span>
                  </button>
                  
                  {isCalendarOpen && (
                    <div className="space-calendar-dropdown">
                      <div className="space-calendar-dropdown-header">
                        <span>Selecciona fechas</span>
                        <button 
                          onClick={() => setIsCalendarOpen(false)}
                          className="space-calendar-close"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <RangeCalendar
                        aria-label="Selecciona fechas"
                        value={dateRange}
                        onChange={(value: { start: DateValue; end: DateValue } | null) => {
                          setDateRange(value);
                          if (value?.start && value?.end) {
                            setIsCalendarOpen(false);
                          }
                        }}
                        isDateUnavailable={isDateUnavailable}
                        minValue={today(getLocalTimeZone())}
                      />
                    </div>
                  )}
                </div>

                {/* Time */}
                <div className="space-form-row">
                  <div className="space-form-field">
                    <label className="space-form-label">Inicio</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="space-form-input"
                    />
                  </div>
                  <div className="space-form-field">
                    <label className="space-form-label">Fin</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="space-form-input"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="space-form-field">
                  <label className="space-form-label">Invitados</label>
                  <div className="space-guests-display">
                    <span className="space-guests-count">
                      {guests} persona{guests > 1 ? 's' : ''}
                    </span>
                    <div className="space-guests-controls">
                      <button
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                        className="space-guests-btn"
                      >
                        <Minus />
                      </button>
                      <span className="space-guests-number">{guests}</span>
                      <button
                        onClick={() => setGuests(Math.min(space.capacity, guests + 1))}
                        disabled={guests >= space.capacity}
                        className="space-guests-btn"
                      >
                        <Plus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Book button */}
              <button className="space-book-btn">
                Reservar
              </button>

              {/* Price breakdown */}
              {hours > 0 && (
                <div className="space-price-breakdown">
                  <div className="space-price-row">
                    <span>{space.pricePerHour}€ x {hours} horas</span>
                    <span>{subtotal}€</span>
                  </div>
                  <div className="space-price-row">
                    <span>Comisión de servicio</span>
                    <span>{serviceFee}€</span>
                  </div>
                  <div className="space-price-total">
                    <span>Total</span>
                    <span>{total}€</span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function getFeatureIcon(feature: string) {
  const f = feature.toLowerCase();
  if (f.includes('wifi')) return <Wifi />;
  if (f.includes('parking') || f.includes('aparcamiento')) return <Car />;
  if (f.includes('cocina') || f.includes('catering') || f.includes('barra')) return <UtensilsCrossed />;
  if (f.includes('música') || f.includes('sonido') || f.includes('music')) return <Music2 />;
  if (f.includes('limpieza')) return <Sparkles />;
  if (f.includes('aire') || f.includes('acondicionado')) return <Wind />;
  if (f.includes('televisión') || f.includes('tv')) return <Tv />;
  if (f.includes('vista') || f.includes('panorámica')) return <Eye />;
  if (f.includes('ascensor')) return <ArrowLeft style={{ transform: 'rotate(90deg)' }} />;
  if (f.includes('iluminación') || f.includes('luz')) return <Lightbulb />;
  if (f.includes('cámara') || f.includes('seguridad')) return <Camera />;
  if (f.includes('chill') || f.includes('zona') || f.includes('sofá')) return <Sofa />;
  return <Check />;
}

function LoadingSkeleton() {
  return (
    <div className="space-detail-page">
      <div className="space-detail-header">
        <div className="space-detail-header-inner">
          <div className="space-skeleton" style={{ height: '2rem', width: '60%', background: 'var(--muted)', borderRadius: '0.5rem', marginBottom: '0.75rem' }} />
          <div className="space-skeleton" style={{ height: '1.25rem', width: '30%', background: 'var(--muted)', borderRadius: '0.25rem' }} />
        </div>
      </div>
      <div className="space-detail-content">
        <div className="space-gallery-wrapper">
          <div className="space-gallery-grid">
            <div className="space-gallery-main space-skeleton" style={{ background: 'var(--muted)' }} />
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-gallery-secondary space-skeleton" style={{ background: 'var(--muted)' }} />
            ))}
          </div>
        </div>
        <div className="space-main-layout">
          <div className="space-main-content">
            <div className="space-quick-info">
              <div className="space-skeleton" style={{ height: '4rem', width: '10rem', background: 'var(--muted)', borderRadius: '0.75rem' }} />
              <div className="space-skeleton" style={{ height: '4rem', width: '10rem', background: 'var(--muted)', borderRadius: '0.75rem' }} />
            </div>
          </div>
          <div className="space-sidebar">
            <div className="space-skeleton" style={{ height: '400px', background: 'var(--muted)', borderRadius: '1rem' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpaceDetailPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SpaceDetailContent />
    </Suspense>
  );
}

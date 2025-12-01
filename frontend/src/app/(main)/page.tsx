"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users,
  Home, 
  Sun, 
  TreePine, 
  Building2, 
  Sofa, 
  Waves, 
  Sparkles, 
  Fence, 
  Lock, 
  CheckCircle, 
  Headphones, 
  ArrowRight, 
  AlertCircle, 
  Building 
} from "lucide-react";
import { spacesApi, Space } from "@/lib/api";
import Carousel from "@/components/ui/carousel";

// Categorías con iconos de Lucide
const categories = [
  { id: "todos", label: "Todos", icon: Home },
  { id: "terraza", label: "Terrazas", icon: Sun },
  { id: "jardin", label: "Jardines", icon: TreePine },
  { id: "atico", label: "Áticos", icon: Building2 },
  { id: "salon", label: "Salones", icon: Sofa },
  { id: "piscina", label: "Con piscina", icon: Waves },
  { id: "azotea", label: "Azoteas", icon: Sparkles },
  { id: "patio", label: "Patios", icon: Fence },
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSpaces, setTotalSpaces] = useState(0);
  
  // Estados para el category bar
  const [isCategoryBarFixed, setIsCategoryBarFixed] = useState(false);
  const [categoryBarOffset, setCategoryBarOffset] = useState(0); // 0 a 100 (porcentaje)

  // Refs for scroll detection
  const whyBalconazoRef = useRef<HTMLElement>(null);
  const categoryBarPlaceholderRef = useRef<HTMLDivElement>(null);

  // Search state
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchGuests, setSearchGuests] = useState("");

  // Handle scroll - fijar barra al navbar y deslizar progresivamente cuando llega a Why Balconazo
  const handleScroll = useCallback(() => {
    const whySection = whyBalconazoRef.current;
    const placeholder = categoryBarPlaceholderRef.current;
    
    if (!placeholder) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const placeholderTop = placeholder.getBoundingClientRect().top + currentScroll;
    
    // Fijar la barra cuando el placeholder llega al navbar (80px)
    const shouldBeFixed = currentScroll > placeholderTop - 80;
    setIsCategoryBarFixed(shouldBeFixed);
    
    // Calcular offset progresivo basado en la posición de Why Balconazo
    if (whySection) {
      const whyRect = whySection.getBoundingClientRect();
      const categoryBarHeight = 73;
      const navbarHeight = 80;
      
      // Distancia desde el top de Why Balconazo hasta donde está la barra fija
      const barBottomPosition = navbarHeight + categoryBarHeight;
      const distanceToBar = whyRect.top - barBottomPosition;
      
      // Empezar a deslizar cuando Why Balconazo está a 150px de la barra
      const slideStartDistance = 150;
      
      if (distanceToBar < slideStartDistance && distanceToBar > -categoryBarHeight) {
        // Progreso de 0 (visible) a 100 (oculto)
        const progress = ((slideStartDistance - distanceToBar) / slideStartDistance) * 100;
        setCategoryBarOffset(Math.min(Math.max(0, progress), 100));
      } else if (distanceToBar <= -categoryBarHeight) {
        setCategoryBarOffset(100);
      } else {
        setCategoryBarOffset(0);
      }
    } else {
      setCategoryBarOffset(0);
    }
  }, []);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Fetch spaces from API
  const fetchSpaces = async (category?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filters = {
        size: 8,
        page: 0,
        ...(category && category !== "todos" ? { category } : {}),
      };
      
      const response = await spacesApi.getAll(filters);
      setSpaces(response.content);
      setTotalSpaces(response.totalElements);
    } catch (err) {
      console.error("Error fetching spaces:", err);
      setError("No se pudieron cargar los espacios. Verifica que el backend esté funcionando.");
      setSpaces([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and category change
  useEffect(() => {
    fetchSpaces(activeCategory);
  }, [activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Searching:", { searchLocation, searchDate, searchGuests });
  };

  return (
    <>
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="hero-section">
        <div className="hero-gradient"></div>
        
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge animate-fade-up">
            <span className="pulse-dot">
              <span className="pulse-ring"></span>
              <span className="pulse-core"></span>
            </span>
            {totalSpaces > 0 ? `${totalSpaces} espacios disponibles` : "Espacios verificados"}
          </div>

          {/* Title */}
          <h1 className="hero-title animate-fade-up delay-100">
            Descubre rincones únicos <br /> con <span className="hero-title-gradient">vistas increíbles</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle animate-fade-up delay-100">
            Terrazas, jardines y salones exclusivos por horas. Reserva de forma segura y sin complicaciones.
          </p>

          {/* Search Bar */}
          <div className="search-bar-wrapper animate-fade-up delay-200">
            <div className="search-pill-container">
              {/* Location */}
              <div className="search-input-group search-input-location">
                <label>
                  <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Ubicación
                </label>
                <input 
                  type="text" 
                  placeholder="¿Dónde buscas?"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>

              <div className="search-divider"></div>

              {/* Date */}
              <div className="search-input-group search-input-date">
                <label>
                  <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Fecha
                </label>
                <input 
                  type="text" 
                  placeholder="¿Cuándo?"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                />
              </div>

              <div className="search-divider"></div>

              {/* Guests + Button */}
              <div className="search-input-group search-input-guests">
                <div style={{ flex: 1 }}>
                  <label>
                    <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Invitados
                  </label>
                  <input 
                    type="text" 
                    placeholder="¿Cuántos?"
                    value={searchGuests}
                    onChange={(e) => setSearchGuests(e.target.value)}
                  />
                </div>
                
                <button className="search-submit-btn" onClick={handleSearch}>
                  <Search size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CATEGORY BAR
          ============================================ */}
      <div ref={categoryBarPlaceholderRef} className="category-bar-wrapper">
        <div 
          className={`category-bar ${isCategoryBarFixed ? 'fixed' : ''}`}
          style={{ transform: `translateY(-${categoryBarOffset}%)` }}
        >
          <div className="category-bar-container">
            <div className="category-list hide-scrollbar">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    className={`category-item ${activeCategory === category.id ? 'category-item-active' : ''}`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <IconComponent size={24} strokeWidth={1.5} />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          FEATURED SPACES GRID
          ============================================ */}
      <section className="section-padding featured-section">
        <div className="container-full">
          {/* Section Header */}
          <div className="section-header">
            <div>
              <h2>
                {activeCategory === "todos" ? "Espacios destacados" : `Espacios: ${categories.find(c => c.id === activeCategory)?.label}`}
              </h2>
              <p>
                {isLoading 
                  ? "Cargando espacios..." 
                  : `${spaces.length} de ${totalSpaces} espacios`
                }
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="spaces-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-image"></div>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-text-sm"></div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="error-state">
              <AlertCircle size={48} style={{ margin: '0 auto 16px', color: 'var(--destructive)' }} />
              <h3>Error al cargar espacios</h3>
              <p>{error}</p>
              <button className="btn-retry" onClick={() => fetchSpaces(activeCategory)}>
                Reintentar
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && spaces.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Building size={40} />
              </div>
              <h3>No hay espacios disponibles</h3>
              <p>
                {activeCategory !== "todos" 
                  ? "No encontramos espacios en esta categoría. Prueba con otra."
                  : "Aún no hay espacios publicados. ¡Sé el primero en publicar!"
                }
              </p>
            </div>
          )}

          {/* Spaces Grid */}
          {!isLoading && !error && spaces.length > 0 && (
            <div className="relative overflow-hidden w-full h-full py-20">
              <Carousel 
                slides={spaces.map(space => ({
                  title: space.title,
                  button: "Ver detalles",
                  src: space.thumbnailUrl || space.images?.[0] || "/placeholder-space.jpg"
                }))} 
              />
            </div>
          )}

          {/* More Button */}
          {!isLoading && !error && spaces.length > 0 && totalSpaces > spaces.length && (
            <div className="spaces-more">
              <button className="btn-more">
                Mostrar más espacios
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================================
          WHY BALCONAZO SECTION
          ============================================ */}
      <section ref={whyBalconazoRef} className="why-balconazo-section">
        <div className="container-full">
          <div className="why-header">
            <h2>¿Por qué Balconazo?</h2>
            <p>La plataforma más segura y sencilla para alquilar espacios</p>
          </div>

          <div className="why-grid">
            {/* Card 1 - Pago seguro */}
            <div className="why-card">
              <div className="why-icon icon-rose">
                <Lock size={32} />
              </div>
              <h3>Pago seguro</h3>
              <p>Todas las transacciones están protegidas con encriptación de nivel bancario. Tu dinero está seguro.</p>
            </div>

            {/* Card 2 - Espacios verificados */}
            <div className="why-card">
              <div className="why-icon icon-green">
                <CheckCircle size={32} />
              </div>
              <h3>Espacios verificados</h3>
              <p>Todos los espacios pasan por un proceso de verificación para garantizar calidad y seguridad.</p>
            </div>

            {/* Card 3 - Soporte 24/7 */}
            <div className="why-card">
              <div className="why-icon icon-blue">
                <Headphones size={32} />
              </div>
              <h3>Soporte 24/7</h3>
              <p>Nuestro equipo está disponible las 24 horas para ayudarte con cualquier consulta o problema.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="cta-section">
        <div className="container-full" style={{ maxWidth: '800px' }}>
          <h2>¿Tienes un espacio que alquilar?</h2>
          <p>Únete a miles de anfitriones que ya están ganando dinero extra con sus terrazas, jardines y salones.</p>
          <button className="btn-cta">
            Convertirme en Anfitrión
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </>
  );
}

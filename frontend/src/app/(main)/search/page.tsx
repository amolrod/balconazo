"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users,
  SlidersHorizontal,
  ChevronDown,
  Home,
  Sun,
  TreePine,
  Building2,
  Sofa,
  Waves,
  Sparkles,
  Fence,
  Grid3X3,
  List,
  ArrowUpDown
} from "lucide-react";
import { spacesApi, Space, SpaceFilters } from "@/lib/api";
import SpaceCard from "@/components/SpaceCard";
import "./search.css";

// Categorías disponibles
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

// Opciones de ordenación
const sortOptions = [
  { id: "relevance", label: "Relevancia" },
  { id: "price_asc", label: "Precio: menor a mayor" },
  { id: "price_desc", label: "Precio: mayor a menor" },
  { id: "rating_desc", label: "Mejor valorados" },
  { id: "newest", label: "Más recientes" },
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Estados de búsqueda desde URL
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "");
  
  // Estados de filtros
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "todos");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minCapacity, setMinCapacity] = useState(searchParams.get("minCapacity") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance");
  
  // Estados de UI
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Estados de datos
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalSpaces, setTotalSpaces] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Construir filtros para la API
  const buildFilters = useCallback((): SpaceFilters => {
    const filters: SpaceFilters = {
      page: currentPage,
      size: 12,
    };

    if (location) filters.city = location;
    if (activeCategory && activeCategory !== "todos") filters.category = activeCategory;
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    if (minCapacity || guests) filters.minCapacity = Number(minCapacity || guests);
    if (sortBy && sortBy !== "relevance") {
      filters.sort = sortBy === "price_asc" ? "pricePerHour,asc" 
        : sortBy === "price_desc" ? "pricePerHour,desc"
        : sortBy === "rating_desc" ? "rating,desc"
        : "createdAt,desc";
    }

    return filters;
  }, [location, activeCategory, minPrice, maxPrice, minCapacity, guests, sortBy, currentPage]);

  // Actualizar URL con los parámetros de búsqueda
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    
    if (location) params.set("location", location);
    if (date) params.set("date", date);
    if (guests) params.set("guests", guests);
    if (activeCategory && activeCategory !== "todos") params.set("category", activeCategory);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minCapacity) params.set("minCapacity", minCapacity);
    if (sortBy && sortBy !== "relevance") params.set("sort", sortBy);
    if (currentPage > 0) params.set("page", String(currentPage));

    const queryString = params.toString();
    router.push(`/search${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [location, date, guests, activeCategory, minPrice, maxPrice, minCapacity, sortBy, currentPage, router]);

  // Fetch espacios
  const fetchSpaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters = buildFilters();
      const response = await spacesApi.getAll(filters);
      
      setSpaces(response.content);
      setTotalSpaces(response.totalElements);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error fetching spaces:", err);
      setError("Error al cargar los espacios. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }, [buildFilters]);

  // Efecto para cargar espacios cuando cambian los filtros
  useEffect(() => {
    fetchSpaces();
    updateURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, minPrice, maxPrice, minCapacity, sortBy, currentPage]);

  // Efecto inicial para cargar desde URL
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) setCurrentPage(Number(page));
    fetchSpaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejadores de búsqueda
  const handleSearch = () => {
    setCurrentPage(0);
    fetchSpaces();
    updateURL();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setLocation("");
    setDate("");
    setGuests("");
    setActiveCategory("todos");
    setMinPrice("");
    setMaxPrice("");
    setMinCapacity("");
    setSortBy("relevance");
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Contar filtros activos
  const activeFiltersCount = [
    location,
    date,
    guests,
    activeCategory !== "todos" ? activeCategory : "",
    minPrice,
    maxPrice,
    minCapacity,
  ].filter(Boolean).length;

  return (
    <div className="search-page">
      {/* Search Header */}
      <div className="search-header">
        <div className="search-header-inner">
          <h1 className="search-title">Buscar espacios</h1>
          
          {/* Main Search Bar */}
          <div className="search-bar">
            <div className="search-bar-group">
              <MapPin size={18} className="search-icon" />
              <input
                type="text"
                placeholder="¿Dónde buscas?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                className="search-input"
              />
            </div>
            
            <div className="search-bar-divider" />
            
            <div className="search-bar-group">
              <Calendar size={18} className="search-icon" />
              <input
                type="date"
                placeholder="¿Cuándo?"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="search-bar-divider" />
            
            <div className="search-bar-group">
              <Users size={18} className="search-icon" />
              <input
                type="number"
                placeholder="Invitados"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                onKeyDown={handleKeyDown}
                min="1"
                className="search-input"
              />
            </div>
            
            <button className="search-btn" onClick={handleSearch}>
              <Search size={20} />
              <span>Buscar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="search-categories">
        <div className="search-categories-inner">
          <div className="categories-scroll">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  className={`category-chip ${activeCategory === category.id ? "active" : ""}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <IconComponent size={18} />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="search-content">
        <div className="search-content-inner">
          {/* Toolbar */}
          <div className="search-toolbar">
            <div className="search-results-info">
              {isLoading ? (
                <span>Buscando espacios...</span>
              ) : (
                <span>
                  <strong>{totalSpaces}</strong> {totalSpaces === 1 ? "espacio encontrado" : "espacios encontrados"}
                  {location && <> en <strong>{location}</strong></>}
                </span>
              )}
            </div>

            <div className="search-toolbar-actions">
              {/* Filters Toggle */}
              <button 
                className={`toolbar-btn ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={18} />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="filter-badge">{activeFiltersCount}</span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="sort-dropdown-container">
                <button 
                  className="toolbar-btn"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                >
                  <ArrowUpDown size={18} />
                  <span>{sortOptions.find(o => o.id === sortBy)?.label || "Ordenar"}</span>
                  <ChevronDown size={16} />
                </button>
                
                {showSortDropdown && (
                  <>
                    <div className="sort-dropdown-overlay" onClick={() => setShowSortDropdown(false)} />
                    <div className="sort-dropdown">
                      {sortOptions.map((option) => (
                        <button
                          key={option.id}
                          className={`sort-option ${sortBy === option.id ? "active" : ""}`}
                          onClick={() => {
                            setSortBy(option.id);
                            setShowSortDropdown(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Vista en cuadrícula"
                >
                  <Grid3X3 size={18} />
                </button>
                <button 
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="Vista en lista"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filters-header">
                <h3>Filtros avanzados</h3>
                <button className="clear-filters-btn" onClick={handleClearFilters}>
                  Limpiar filtros
                </button>
              </div>
              
              <div className="filters-grid">
                {/* Price Range */}
                <div className="filter-group">
                  <label className="filter-label">Rango de precio (€/hora)</label>
                  <div className="filter-range">
                    <input
                      type="number"
                      placeholder="Mín"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      min="0"
                      className="filter-input"
                    />
                    <span className="filter-range-separator">-</span>
                    <input
                      type="number"
                      placeholder="Máx"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min="0"
                      className="filter-input"
                    />
                  </div>
                </div>

                {/* Minimum Capacity */}
                <div className="filter-group">
                  <label className="filter-label">Capacidad mínima</label>
                  <input
                    type="number"
                    placeholder="Número de personas"
                    value={minCapacity}
                    onChange={(e) => setMinCapacity(e.target.value)}
                    min="1"
                    className="filter-input"
                  />
                </div>
              </div>

              <button className="apply-filters-btn" onClick={handleSearch}>
                Aplicar filtros
              </button>
            </div>
          )}

          {/* Results */}
          <div className="search-results">
            {/* Loading */}
            {isLoading && (
              <div className={`spaces-grid ${viewMode}`}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton skeleton-image" />
                    <div className="skeleton-content">
                      <div className="skeleton skeleton-title" />
                      <div className="skeleton skeleton-text" />
                      <div className="skeleton skeleton-price" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && !isLoading && (
              <div className="search-error">
                <p>{error}</p>
                <button onClick={fetchSpaces}>Reintentar</button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && spaces.length === 0 && (
              <div className="search-empty">
                <div className="empty-icon">
                  <Search size={48} />
                </div>
                <h3>No encontramos espacios</h3>
                <p>Intenta modificar los filtros o buscar en otra ubicación.</p>
                <button className="clear-search-btn" onClick={handleClearFilters}>
                  Limpiar búsqueda
                </button>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && !error && spaces.length > 0 && (
              <>
                <div className={`spaces-grid ${viewMode}`}>
                  {spaces.map((space, index) => (
                    <SpaceCard key={space.id} space={space} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      disabled={currentPage === 0}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Anterior
                    </button>
                    
                    <div className="pagination-pages">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i;
                        } else if (currentPage < 3) {
                          pageNum = i;
                        } else if (currentPage > totalPages - 4) {
                          pageNum = totalPages - 5 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            className={`pagination-page ${currentPage === pageNum ? "active" : ""}`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      className="pagination-btn"
                      disabled={currentPage === totalPages - 1}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="search-page">
        <div className="search-header">
          <div className="search-header-inner">
            <h1 className="search-title">Buscar espacios</h1>
            <div className="search-bar-skeleton" />
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

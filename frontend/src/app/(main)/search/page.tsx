"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, MapPin, Grid, List, X, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { RangeCalendar } from "@/components/ui/calendar-rac";
import { getLocalTimeZone, today, parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";
import SpaceCard from "@/components/SpaceCard";
import { spacesApi, type Space } from "@/lib/api";
import "./search.css";

// Componente interno que usa useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Estados de búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [minCapacity, setMinCapacity] = useState(searchParams.get("minCapacity") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance");
  
  // Estado del calendario con DateValue
  const [dateRange, setDateRange] = useState<{ start: DateValue; end: DateValue } | null>(() => {
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate && endDate) {
      try {
        return {
          start: parseDate(startDate),
          end: parseDate(endDate)
        };
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  // Estados de UI
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Datos
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [totalSpaces, setTotalSpaces] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Límite por página
  const PAGE_SIZE = 40;

  // Cerrar calendario al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        calendarButtonRef.current &&
        !calendarButtonRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cargar categorías y ciudades únicas
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const response = await spacesApi.getAll({ page: 0, size: 100 });
        const allSpaces = response.content || [];
        
        const uniqueCategories = [...new Set(allSpaces.map((s: Space) => s.category).filter((c): c is string => Boolean(c)))];
        const uniqueCities = [...new Set(allSpaces.map((s: Space) => s.city).filter((c): c is string => Boolean(c)))];
        
        setCategories(uniqueCategories);
        setCities(uniqueCities);
      } catch (error) {
        console.error("Error loading filters data:", error);
      }
    };
    fetchFiltersData();
  }, []);

  // Buscar espacios
  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, string | number> = {
          page: currentPage - 1,
          size: PAGE_SIZE,
        };

        if (city) params.city = city;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minCapacity) params.minCapacity = minCapacity;
        if (sortBy && sortBy !== "relevance") params.sort = sortBy;

        const response = await spacesApi.getAll(params);
        
        let filteredSpaces = response.content || [];
        
        // Filtro de búsqueda por texto (frontend)
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredSpaces = filteredSpaces.filter((space: Space) =>
            space.title?.toLowerCase().includes(query) ||
            space.description?.toLowerCase().includes(query) ||
            space.city?.toLowerCase().includes(query) ||
            space.address?.toLowerCase().includes(query)
          );
        }

        setSpaces(filteredSpaces);
        setTotalSpaces(response.totalElements || filteredSpaces.length);
      } catch (error) {
        console.error("Error fetching spaces:", error);
        setSpaces([]);
        setTotalSpaces(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, [currentPage, city, category, minPrice, maxPrice, minCapacity, sortBy, searchQuery]);

  // Actualizar URL con los parámetros de búsqueda
  const updateURL = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minCapacity) params.set("minCapacity", minCapacity);
    if (sortBy && sortBy !== "relevance") params.set("sort", sortBy);
    if (dateRange) {
      params.set("startDate", dateRange.start.toString());
      params.set("endDate", dateRange.end.toString());
    }

    const newURL = params.toString() ? `?${params.toString()}` : "/search";
    router.push(newURL, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateURL();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCity("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setMinCapacity("");
    setSortBy("relevance");
    setDateRange(null);
    setCurrentPage(1);
    router.push("/search", { scroll: false });
  };

  const hasActiveFilters = searchQuery || city || category || minPrice || maxPrice || minCapacity || sortBy !== "relevance" || dateRange;

  const totalPages = Math.ceil(totalSpaces / PAGE_SIZE);

  // Formatear fechas para mostrar en el botón
  const formatDateRange = () => {
    if (!dateRange) return "Seleccionar fechas";
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    const startStr = new Date(dateRange.start.toString()).toLocaleDateString("es-ES", options);
    const endStr = new Date(dateRange.end.toString()).toLocaleDateString("es-ES", options);
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className="search-page">
      {/* Barra de búsqueda */}
      <div className="search-header">
        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Buscar espacios, ubicaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Botón de calendario */}
            <div className="calendar-wrapper">
              <button
                ref={calendarButtonRef}
                type="button"
                className="calendar-toggle-btn"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <Calendar size={18} />
                <span>{formatDateRange()}</span>
              </button>

              {isCalendarOpen && (
                <div ref={calendarRef} className="calendar-popup">
                  <RangeCalendar
                    aria-label="Seleccionar rango de fechas"
                    value={dateRange}
                    onChange={(range) => {
                      setDateRange(range);
                      if (range?.start && range?.end) {
                        setIsCalendarOpen(false);
                      }
                    }}
                    minValue={today(getLocalTimeZone())}
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>Filtros</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                className="clear-filters-btn"
                onClick={clearFilters}
                title="Limpiar todos los filtros"
              >
                <X size={18} />
                <span>Limpiar</span>
              </button>
            )}

            <button type="submit" className="search-submit-btn">
              Buscar
            </button>
          </form>

          {/* Panel de filtros expandible */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Ciudad</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">Todas las ciudades</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Categoría</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Todas las categorías</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Precio mínimo</label>
                  <input
                    type="number"
                    placeholder="€ Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                </div>

                <div className="filter-group">
                  <label>Precio máximo</label>
                  <input
                    type="number"
                    placeholder="€ Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>

                <div className="filter-group">
                  <label>Capacidad mínima</label>
                  <input
                    type="number"
                    placeholder="Personas"
                    value={minCapacity}
                    onChange={(e) => setMinCapacity(e.target.value)}
                    min="1"
                  />
                </div>

                <div className="filter-group">
                  <label>Ordenar por</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="relevance">Relevancia</option>
                    <option value="price,asc">Precio: menor a mayor</option>
                    <option value="price,desc">Precio: mayor a menor</option>
                    <option value="capacity,desc">Mayor capacidad</option>
                    <option value="name,asc">Nombre A-Z</option>
                  </select>
                </div>
              </div>

              <div className="filters-actions">
                <button type="button" className="apply-filters-btn" onClick={handleSearch}>
                  Aplicar filtros
                </button>
                <button type="button" className="clear-all-btn" onClick={clearFilters}>
                  Limpiar todo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="search-content">
        {/* Barra de resultados */}
        <div className="results-bar">
          <div className="results-info">
            <span className="results-count">
              {isLoading ? "Buscando..." : `${totalSpaces} espacios encontrados`}
            </span>
            {hasActiveFilters && (
              <div className="active-filters">
                {searchQuery && (
                  <span className="filter-tag">
                    &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")}>
                      <X size={14} />
                    </button>
                  </span>
                )}
                {city && (
                  <span className="filter-tag">
                    <MapPin size={14} /> {city}
                    <button onClick={() => setCity("")}>
                      <X size={14} />
                    </button>
                  </span>
                )}
                {category && (
                  <span className="filter-tag">
                    {category}
                    <button onClick={() => setCategory("")}>
                      <X size={14} />
                    </button>
                  </span>
                )}
                {dateRange && (
                  <span className="filter-tag">
                    <Calendar size={14} /> {formatDateRange()}
                    <button onClick={() => setDateRange(null)}>
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Vista en cuadrícula"
            >
              <Grid size={18} />
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

        {/* Grid de espacios */}
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando espacios...</p>
          </div>
        ) : spaces.length > 0 ? (
          <div className={`spaces-grid ${viewMode}`}>
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No se encontraron espacios</h3>
            <p>Intenta ajustar tus filtros de búsqueda o explorar otras opciones.</p>
            <button onClick={clearFilters} className="clear-search-btn">
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Paginación - solo si hay más de PAGE_SIZE espacios */}
        {!isLoading && totalSpaces > PAGE_SIZE && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
              Anterior
            </button>

            <div className="pagination-pages">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className={`page-btn ${currentPage === pageNum ? "active" : ""}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principal con Suspense
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="search-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

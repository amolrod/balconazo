'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, MapPin, DollarSign, Users, Loader2 } from 'lucide-react'
import { SpaceCard } from '@/components/spaces/SpaceCard'
import { spacesApi, type Space, type SpaceFilters } from '@/lib/api'

export default function SpacesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [spaces, setSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  // Filtros
  const [filters, setFilters] = useState<SpaceFilters>({
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    capacity: searchParams.get('capacity') ? Number(searchParams.get('capacity')) : undefined,
  })

  const [tempFilters, setTempFilters] = useState(filters)

  useEffect(() => {
    const fetchSpaces = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await spacesApi.list({
          ...filters,
          page: currentPage,
          size: 12,
        })
        setSpaces(response.content)
        setTotalPages(response.totalPages)
      } catch (err) {
        setError('Error al cargar los espacios. Por favor, intenta de nuevo.')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpaces()
  }, [filters, currentPage])

  const handleSearch = () => {
    setFilters(tempFilters)
    setCurrentPage(0)

    // Actualizar URL con los filtros
    const params = new URLSearchParams()
    if (tempFilters.city) params.set('city', tempFilters.city)
    if (tempFilters.minPrice) params.set('minPrice', tempFilters.minPrice.toString())
    if (tempFilters.maxPrice) params.set('maxPrice', tempFilters.maxPrice.toString())
    if (tempFilters.capacity) params.set('capacity', tempFilters.capacity.toString())
    
    router.push(`/spaces?${params.toString()}`)
  }

  const clearFilters = () => {
    const emptyFilters: SpaceFilters = {}
    setTempFilters(emptyFilters)
    setFilters(emptyFilters)
    setCurrentPage(0)
    router.push('/spaces')
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Barra de filtros */}
      <div className="bg-white border-b border-secondary-200 py-4 sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Ciudad */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Ciudad
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  placeholder="¿Dónde buscas?"
                  value={tempFilters.city || ''}
                  onChange={(e) =>
                    setTempFilters({ ...tempFilters, city: e.target.value })
                  }
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Precio mínimo */}
            <div className="w-full md:w-36">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Precio mín.
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="number"
                  placeholder="0"
                  min="0"
                  value={tempFilters.minPrice || ''}
                  onChange={(e) =>
                    setTempFilters({
                      ...tempFilters,
                      minPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Precio máximo */}
            <div className="w-full md:w-36">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Precio máx.
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="number"
                  placeholder="1000"
                  min="0"
                  value={tempFilters.maxPrice || ''}
                  onChange={(e) =>
                    setTempFilters({
                      ...tempFilters,
                      maxPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Capacidad */}
            <div className="w-full md:w-32">
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Capacidad
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="number"
                  placeholder="2"
                  min="1"
                  value={tempFilters.capacity || ''}
                  onChange={(e) =>
                    setTempFilters({
                      ...tempFilters,
                      capacity: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              <button
                onClick={clearFilters}
                className="btn btn-outline px-4 py-2"
              >
                Limpiar
              </button>
              <button
                onClick={handleSearch}
                className="btn btn-primary px-6 py-2"
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Estado de carga */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            <span className="ml-2 text-secondary-600">Cargando espacios...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Sin resultados */}
        {!isLoading && !error && spaces.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No encontramos espacios
            </h3>
            <p className="text-secondary-600 mb-4">
              Intenta ajustar tus filtros de búsqueda
            </p>
            <button onClick={clearFilters} className="btn btn-primary px-6 py-2">
              Ver todos los espacios
            </button>
          </div>
        )}

        {/* Grid de espacios */}
        {!isLoading && !error && spaces.length > 0 && (
          <>
            <div className="mb-4 text-secondary-600">
              Mostrando {spaces.length} espacios
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {spaces.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="btn btn-outline px-4 py-2 disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="flex items-center px-4 text-secondary-600">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="btn btn-outline px-4 py-2 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

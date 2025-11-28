'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Loader2, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { spacesApi, type Space } from '@/lib/api'

export default function MySpacesPage() {
  const { isAuthenticated, isLoading: authLoading, token, login } = useAuth()

  const [spaces, setSpaces] = useState<Space[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      login()
      return
    }

    const fetchMySpaces = async () => {
      if (!token) return

      setIsLoading(true)
      setError(null)
      try {
        const response = await spacesApi.getMySpaces(token)
        setSpaces(response.content)
      } catch (err) {
        setError('Error al cargar tus espacios')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMySpaces()
  }, [isAuthenticated, authLoading, token, login])

  const handleDelete = async (spaceId: string) => {
    if (!token || !confirm('¿Estás seguro de que quieres eliminar este espacio?')) {
      return
    }

    setDeletingId(spaceId)
    try {
      await spacesApi.delete(token, spaceId)
      setSpaces((prev) => prev.filter((s) => s.id !== spaceId))
    } catch (err) {
      alert('Error al eliminar el espacio')
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Mis espacios</h1>
            <p className="text-secondary-600 mt-1">
              Gestiona tus espacios publicados en BalconazoApp
            </p>
          </div>
          <Link
            href="/account/spaces/new"
            className="btn btn-primary px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Publicar espacio
          </Link>
        </div>

        {/* Contenido */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : error ? (
          <div className="card p-8 text-center">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-secondary-600">{error}</p>
          </div>
        ) : spaces.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              Aún no tienes espacios publicados
            </h2>
            <p className="text-secondary-600 mb-6">
              Publica tu primera terraza, balcón o salón y empieza a ganar dinero.
            </p>
            <Link
              href="/account/spaces/new"
              className="btn btn-primary px-6 py-3 inline-flex"
            >
              <Plus className="w-5 h-5 mr-2" />
              Publicar mi primer espacio
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {spaces.map((space) => (
              <div
                key={space.id}
                className="card p-4 md:p-6"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Imagen */}
                  <div className="w-full md:w-48 h-32 bg-secondary-100 rounded-lg overflow-hidden flex-shrink-0">
                    {space.thumbnailUrl ? (
                      <img
                        src={space.thumbnailUrl}
                        alt={space.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-secondary-400">
                        <span className="text-4xl">🏠</span>
                      </div>
                    )}
                  </div>

                  {/* Información */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {space.title}
                        </h3>
                        <div className="flex items-center gap-1 text-secondary-600 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{space.city}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          space.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-secondary-100 text-secondary-600'
                        }`}
                      >
                        {space.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 mt-3 text-sm text-secondary-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{space.capacity} personas</span>
                      </div>
                      <div>
                        <span className="font-semibold text-primary-600">
                          ${space.pricePerHour}
                        </span>
                        <span>/hora</span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-secondary-100">
                      <Link
                        href={`/spaces/${space.id}`}
                        className="btn btn-outline px-4 py-2 text-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Link>
                      <Link
                        href={`/account/spaces/${space.id}/edit`}
                        className="btn btn-outline px-4 py-2 text-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(space.id)}
                        disabled={deletingId === space.id}
                        className="btn btn-outline px-4 py-2 text-sm text-red-600 border-red-300 hover:bg-red-50"
                      >
                        {deletingId === space.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

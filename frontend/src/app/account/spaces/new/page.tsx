'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Plus, X, ImagePlus } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { spacesApi, type CreateSpaceRequest } from '@/lib/api'

const FEATURES_OPTIONS = [
  'WiFi',
  'Baño privado',
  'Cocina',
  'Aire acondicionado',
  'Calefacción',
  'Parking',
  'Piscina',
  'Terraza cubierta',
  'Vistas',
  'Mascotas permitidas',
  'Accesible',
  'Barbacoa',
]

export default function NewSpacePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, token, login } = useAuth()

  const [formData, setFormData] = useState<CreateSpaceRequest>({
    title: '',
    description: '',
    city: '',
    address: '',
    capacity: 1,
    pricePerHour: 10,
    photoUrls: [],
    features: [],
  })
  const [newPhotoUrl, setNewPhotoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    login()
    return null
  }

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim() && !formData.photoUrls?.includes(newPhotoUrl)) {
      setFormData({
        ...formData,
        photoUrls: [...(formData.photoUrls || []), newPhotoUrl.trim()],
      })
      setNewPhotoUrl('')
    }
  }

  const handleRemovePhoto = (url: string) => {
    setFormData({
      ...formData,
      photoUrls: formData.photoUrls?.filter((p) => p !== url),
    })
  }

  const handleToggleFeature = (feature: string) => {
    const features = formData.features || []
    if (features.includes(feature)) {
      setFormData({
        ...formData,
        features: features.filter((f) => f !== feature),
      })
    } else {
      setFormData({
        ...formData,
        features: [...features, feature],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError('No estás autenticado')
      return
    }

    if (!formData.title || !formData.city || !formData.description) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await spacesApi.create(token, formData)
      router.push('/account/spaces')
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      setError(error.data?.message || 'Error al crear el espacio')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Encabezado */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-secondary-600 hover:text-primary-600 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Volver
          </button>
          <h1 className="text-3xl font-bold text-secondary-900">Publicar nuevo espacio</h1>
          <p className="text-secondary-600 mt-1">
            Completa la información de tu espacio para publicarlo en BalconazoApp
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Información básica
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Título del espacio *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Terraza con vistas al mar"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe tu espacio, qué lo hace especial, qué pueden hacer los invitados..."
                  className="input w-full h-32 resize-none"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Ej: Barcelona"
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ej: Calle Mayor, 123"
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Capacidad (personas) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Precio por hora ($) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    step="0.01"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) || 1 })}
                    className="input w-full"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fotos */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Fotos del espacio
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="URL de la imagen"
                className="input flex-1"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="btn btn-outline px-4"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {formData.photoUrls && formData.photoUrls.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.photoUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(url)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-secondary-300 rounded-lg p-8 text-center">
                <ImagePlus className="w-12 h-12 text-secondary-400 mx-auto mb-2" />
                <p className="text-secondary-500">
                  Añade URLs de imágenes de tu espacio
                </p>
              </div>
            )}
          </div>

          {/* Características */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-4">
              Características
            </h2>

            <div className="flex flex-wrap gap-2">
              {FEATURES_OPTIONS.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => handleToggleFeature(feature)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.features?.includes(feature)
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline px-6 py-3 flex-1 md:flex-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary px-6 py-3 flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar espacio'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

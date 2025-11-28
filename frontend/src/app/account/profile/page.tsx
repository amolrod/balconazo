'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Calendar, Loader2, Check } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { usersApi, type UserProfile, type UpdateUserRequest } from '@/lib/api'

export default function ProfilePage() {
  const { isAuthenticated, isLoading: authLoading, token, login } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Formulario de edición
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UpdateUserRequest>({ name: '', surname: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      login()
      return
    }

    const fetchProfile = async () => {
      if (!token) return

      setIsLoading(true)
      setError(null)
      try {
        const data = await usersApi.getMe(token)
        setProfile(data)
        setFormData({ name: data.name, surname: data.surname })
      } catch (err) {
        setError('Error al cargar tu perfil')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [isAuthenticated, authLoading, token, login])

  const handleSave = async () => {
    if (!token) return

    setIsSaving(true)
    setSaveSuccess(false)
    try {
      const updated = await usersApi.updateMe(token, formData)
      setProfile(updated)
      setIsEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err) {
      setError('Error al actualizar tu perfil')
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({ name: profile.name, surname: profile.surname })
    }
    setIsEditing(false)
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-secondary-600">{error || 'Error al cargar el perfil'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Mi perfil</h1>

        {/* Mensaje de éxito */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <Check className="w-5 h-5 mr-2" />
            Perfil actualizado correctamente
          </div>
        )}

        {/* Tarjeta de perfil */}
        <div className="card p-6 md:p-8">
          {/* Avatar y nombre */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">
                {profile.fullName || `${profile.name} ${profile.surname}`}
              </h2>
              <p className="text-secondary-500">
                {profile.roles.includes('HOST') ? 'Anfitrión' : 'Usuario'}
              </p>
            </div>
          </div>

          {/* Información */}
          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-500">Email</p>
                <p className="text-secondary-900">{profile.email}</p>
              </div>
            </div>

            {/* Miembro desde */}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-secondary-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-secondary-500">Miembro desde</p>
                <p className="text-secondary-900">
                  {new Date(profile.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Roles */}
            <div>
              <p className="text-sm font-medium text-secondary-500 mb-2">Roles</p>
              <div className="flex flex-wrap gap-2">
                {profile.roles.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {role === 'USER' ? 'Usuario' : role === 'HOST' ? 'Anfitrión' : role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Separador */}
          <hr className="my-8 border-secondary-200" />

          {/* Edición de nombre */}
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Datos personales
            </h3>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    value={formData.surname}
                    onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                    className="input w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="btn btn-outline px-4 py-2"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn btn-primary px-4 py-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar cambios'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-secondary-500">Nombre</p>
                    <p className="text-secondary-900">{profile.name || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-500">Apellidos</p>
                    <p className="text-secondary-900">{profile.surname || '-'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-outline px-4 py-2"
                >
                  Editar datos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

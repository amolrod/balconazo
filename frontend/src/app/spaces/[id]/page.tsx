'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Users, Clock, Check, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { spacesApi, bookingsApi, type SpaceDetail, type BookedSlot } from '@/lib/api'

export default function SpaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, token, login } = useAuth()

  const [space, setSpace] = useState<SpaceDetail | null>(null)
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Formulario de reserva
  const [selectedDate, setSelectedDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [notes, setNotes] = useState('')
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const spaceId = params.id as string

  useEffect(() => {
    const fetchSpace = async () => {
      if (!spaceId) return

      setIsLoading(true)
      setError(null)
      try {
        const spaceData = await spacesApi.getById(spaceId)
        setSpace(spaceData)

        // Obtener disponibilidad para los próximos 30 días
        const today = new Date()
        const endDate = new Date(today)
        endDate.setDate(endDate.getDate() + 30)

        const slots = await bookingsApi.getAvailability(
          spaceId,
          today.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        )
        setBookedSlots(slots)
      } catch (err) {
        setError('Error al cargar el espacio')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpace()
  }, [spaceId])

  const calculateTotal = () => {
    if (!space || !startTime || !endTime) return 0
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    return hours > 0 ? hours * space.pricePerHour : 0
  }

  const handleBooking = async () => {
    if (!isAuthenticated) {
      login()
      return
    }

    if (!token || !selectedDate || !startTime || !endTime) {
      setBookingError('Por favor completa todos los campos')
      return
    }

    const startDateTime = `${selectedDate}T${startTime}:00`
    const endDateTime = `${selectedDate}T${endTime}:00`

    setIsBooking(true)
    setBookingError(null)

    try {
      await bookingsApi.create(token, {
        spaceId,
        startTime: startDateTime,
        endTime: endDateTime,
        notes: notes || undefined,
      })
      setBookingSuccess(true)
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      setBookingError(error.data?.message || 'Error al crear la reserva')
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !space) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-secondary-900 mb-2">
          {error || 'Espacio no encontrado'}
        </h2>
        <button
          onClick={() => router.push('/spaces')}
          className="btn btn-primary px-6 py-2 mt-4"
        >
          Volver a espacios
        </button>
      </div>
    )
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-secondary-900 mb-2">
          ¡Reserva creada con éxito!
        </h2>
        <p className="text-secondary-600 mb-6">
          Tu reserva está pendiente de confirmación por el anfitrión
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/account/bookings')}
            className="btn btn-primary px-6 py-2"
          >
            Ver mis reservas
          </button>
          <button
            onClick={() => router.push('/spaces')}
            className="btn btn-outline px-6 py-2"
          >
            Seguir explorando
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Botón volver */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2">
            {/* Galería de fotos */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-96 bg-secondary-100">
                {space.photos && space.photos.length > 0 ? (
                  <Image
                    src={space.photos[0]}
                    alt={space.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-secondary-400">
                    <span className="text-8xl">🏠</span>
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              {space.photos && space.photos.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {space.photos.slice(1).map((photo, index) => (
                    <div
                      key={index}
                      className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={photo}
                        alt={`${space.title} ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Información del espacio */}
            <div className="bg-white rounded-xl p-6 mt-6 shadow-sm">
              <h1 className="text-3xl font-bold text-secondary-900">
                {space.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-secondary-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  <span>{space.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>Hasta {space.capacity} personas</span>
                </div>
              </div>

              <div className="border-t border-secondary-100 my-6" />

              <h2 className="text-xl font-semibold text-secondary-900 mb-3">
                Descripción
              </h2>
              <p className="text-secondary-600 whitespace-pre-line">
                {space.description}
              </p>

              {space.features && space.features.length > 0 && (
                <>
                  <div className="border-t border-secondary-100 my-6" />
                  <h2 className="text-xl font-semibold text-secondary-900 mb-4">
                    Características
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {space.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-secondary-600"
                      >
                        <Check className="w-5 h-5 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Reserva */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-primary-600">
                  ${space.pricePerHour}
                </span>
                <span className="text-secondary-500">/hora</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Hora inicio
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Hora fin
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="input w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Notas (opcional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="¿Algo que el anfitrión deba saber?"
                    rows={3}
                    className="input w-full resize-none"
                  />
                </div>
              </div>

              {/* Total */}
              {calculateTotal() > 0 && (
                <div className="border-t border-secondary-100 mt-6 pt-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="text-secondary-600">Total</span>
                    <span className="font-bold text-secondary-900">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {bookingError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {bookingError}
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={isBooking || !selectedDate || !startTime || !endTime}
                className="btn btn-primary w-full py-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Procesando...
                  </>
                ) : isAuthenticated ? (
                  'Reservar'
                ) : (
                  'Iniciar sesión para reservar'
                )}
              </button>

              <p className="text-xs text-secondary-500 text-center mt-4">
                No se te cobrará todavía. El anfitrión debe confirmar tu reserva.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

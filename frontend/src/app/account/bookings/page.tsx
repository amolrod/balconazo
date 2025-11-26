'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { bookingsApi, type Booking, type BookingStatus } from '@/lib/api'

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: 'Confirmada', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
  COMPLETED: { label: 'Completada', className: 'bg-blue-100 text-blue-800' },
}

export default function MyBookingsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, token, login } = useAuth()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      login()
      return
    }

    const fetchBookings = async () => {
      if (!token) return

      setIsLoading(true)
      setError(null)
      try {
        const response = await bookingsApi.getMyBookings(token)
        setBookings(response.content)
      } catch (err) {
        setError('Error al cargar tus reservas')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [isAuthenticated, authLoading, token, login])

  const handleCancel = async (bookingId: string) => {
    if (!token || !confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return
    }

    setCancellingId(bookingId)
    try {
      await bookingsApi.cancel(token, bookingId)
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      )
    } catch (err) {
      alert('Error al cancelar la reserva')
      console.error(err)
    } finally {
      setCancellingId(null)
    }
  }

  const now = new Date()
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.startTime) >= now && b.status !== 'CANCELLED'
  )
  const pastBookings = bookings.filter(
    (b) => new Date(b.startTime) < now || b.status === 'CANCELLED'
  )

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">
          Mis Reservas
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-600 hover:bg-secondary-100'
            }`}
          >
            Próximas ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-600 hover:bg-secondary-100'
            }`}
          >
            Historial ({pastBookings.length})
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-600">{error}</span>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && displayedBookings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              {activeTab === 'upcoming'
                ? 'No tienes reservas próximas'
                : 'No tienes reservas pasadas'}
            </h3>
            <p className="text-secondary-600 mb-4">
              {activeTab === 'upcoming' && '¡Explora espacios y haz tu primera reserva!'}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => router.push('/spaces')}
                className="btn btn-primary px-6 py-2"
              >
                Explorar espacios
              </button>
            )}
          </div>
        )}

        {/* Bookings list */}
        {!isLoading && !error && displayedBookings.length > 0 && (
          <div className="space-y-4">
            {displayedBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusConfig[booking.status].className
                        }`}
                      >
                        {statusConfig[booking.status].label}
                      </span>
                    </div>

                    <div className="space-y-2 text-secondary-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span>{formatDate(booking.startTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span>
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          <span className="text-secondary-400 ml-2">
                            ({booking.durationHours}h)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-secondary-900">
                      ${booking.totalPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-secondary-500">Total</div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-secondary-100">
                    <p className="text-sm text-secondary-600">
                      <span className="font-medium">Notas:</span> {booking.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {booking.status === 'PENDING' && (
                  <div className="mt-4 pt-4 border-t border-secondary-100 flex gap-3">
                    <button
                      onClick={() => router.push(`/spaces/${booking.spaceId}`)}
                      className="btn btn-outline px-4 py-2"
                    >
                      Ver espacio
                    </button>
                    <button
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50 px-4 py-2"
                    >
                      {cancellingId === booking.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Cancelar'
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

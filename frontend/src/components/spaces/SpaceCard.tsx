import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Clock } from 'lucide-react'
import type { Space } from '@/lib/api'

interface SpaceCardProps {
  space: Space
}

export function SpaceCard({ space }: SpaceCardProps) {
  return (
    <Link
      href={`/spaces/${space.id}`}
      className="card group hover:shadow-lg transition-all duration-300"
    >
      {/* Imagen */}
      <div className="relative h-48 bg-secondary-100 rounded-t-xl overflow-hidden">
        {space.thumbnailUrl ? (
          <Image
            src={space.thumbnailUrl}
            alt={space.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-secondary-400">
            <span className="text-5xl">🏠</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-1">
          {space.title}
        </h3>

        <div className="flex items-center gap-1 mt-2 text-secondary-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{space.city}</span>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm text-secondary-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{space.capacity} personas</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary-100">
          <div className="flex items-center gap-1 text-secondary-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Por hora</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-primary-600">
              ${space.pricePerHour}
            </span>
            <span className="text-secondary-500">/hora</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

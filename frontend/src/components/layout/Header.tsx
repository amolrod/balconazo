'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthProvider'
import { Menu, X, User } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">
              Balconazo
            </span>
            <span className="text-2xl font-bold text-secondary-900">App</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/spaces"
              className="text-secondary-600 hover:text-primary-600 transition-colors"
            >
              Explorar espacios
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  href="/account/bookings"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Mis reservas
                </Link>
                <Link
                  href="/account/spaces"
                  className="text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  Mis espacios
                </Link>
              </>
            )}

            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-secondary-200 animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-secondary-900">
                    {user?.name || 'Usuario'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="btn btn-outline px-4 py-2"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={login}
                  className="btn btn-outline px-4 py-2"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={login}
                  className="btn btn-primary px-4 py-2"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200">
            <div className="flex flex-col gap-4">
              <Link
                href="/spaces"
                className="text-secondary-600 hover:text-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explorar espacios
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    href="/account/bookings"
                    className="text-secondary-600 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mis reservas
                  </Link>
                  <Link
                    href="/account/spaces"
                    className="text-secondary-600 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mis espacios
                  </Link>
                </>
              )}

              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-4 border-t border-secondary-200">
                  <button onClick={login} className="btn btn-outline w-full py-2">
                    Iniciar sesión
                  </button>
                  <button onClick={login} className="btn btn-primary w-full py-2">
                    Registrarse
                  </button>
                </div>
              )}

              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="btn btn-outline w-full py-2 mt-4"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

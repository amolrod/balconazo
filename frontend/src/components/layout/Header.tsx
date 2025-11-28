'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/AuthProvider'
import { Menu, X, User, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function Header() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:bg-secondary-100 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-secondary-900">
                    {user?.name || 'Usuario'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-secondary-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-2 z-50">
                    <Link
                      href="/account/profile"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mi perfil
                    </Link>
                    <Link
                      href="/account/bookings"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mis reservas
                    </Link>
                    <Link
                      href="/account/spaces"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Mis espacios
                    </Link>
                    <hr className="my-2 border-secondary-200" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        logout()
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
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

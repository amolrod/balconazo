"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Heart, Calendar, Home, LogOut, Settings, HelpCircle } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          Balconazo
        </Link>

        {/* Navigation Menu */}
        <ul className="navbar-menu">
          <li>
            <Link href="/" className="navbar-link navbar-link-active">
              Explorar
            </Link>
          </li>
          <li>
            <Link href="/reservas" className="navbar-link">
              Mis Reservas
            </Link>
          </li>
          <li>
            <Link href="/favoritos" className="navbar-link">
              Favoritos
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <ModeToggle />

          {/* Show login button when not authenticated */}
          {!isLoading && !isAuthenticated && (
            <Link href="/auth">
              <InteractiveHoverButton>
                Iniciar sesión
              </InteractiveHoverButton>
            </Link>
          )}

          {/* User Menu - only show when authenticated */}
          {!isLoading && isAuthenticated && (
            <div className="user-menu-wrapper" ref={menuRef}>
              <button 
                className="user-menu-trigger"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-haspopup="true"
              >
                {/* Hamburger Icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
                
                {/* Avatar */}
                <div className="user-avatar user-avatar--authenticated">
                  <span className="user-avatar-initial">
                    {user?.firstName?.[0] || user?.name?.[0] || "U"}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu for authenticated users */}
              {isMenuOpen && (
                <div className="user-dropdown">
                  {/* User Info */}
                  <div className="dropdown-user-info">
                    <div className="dropdown-user-avatar">
                      {user?.firstName?.[0] || user?.name?.[0] || "U"}
                    </div>
                    <div className="dropdown-user-details">
                      <span className="dropdown-user-name">{user?.name}</span>
                      <span className="dropdown-user-email">{user?.email}</span>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  {/* Navigation Section */}
                  <div className="dropdown-section">
                    <Link href="/publicar" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      <Home size={18} />
                      Publica tu espacio
                    </Link>
                    <Link href="/favoritos" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      <Heart size={18} />
                      Favoritos
                    </Link>
                    <Link href="/reservas" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      <Calendar size={18} />
                      Mis reservas
                    </Link>
                  </div>

                  <div className="dropdown-divider"></div>

                  {/* Settings Section */}
                  <div className="dropdown-section">
                    <Link href="/cuenta" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      <Settings size={18} />
                      Configuración
                    </Link>
                    <Link href="/ayuda" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      <HelpCircle size={18} />
                      Centro de ayuda
                    </Link>
                  </div>

                  <div className="dropdown-divider"></div>

                  {/* Logout */}
                  <div className="dropdown-section">
                    <button 
                      className="dropdown-item dropdown-item-danger" 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut size={18} />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="user-avatar-skeleton" />
          )}
        </div>
      </div>
    </nav>
  );
}

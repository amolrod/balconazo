"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { User, LogIn, UserPlus, Heart, Calendar, Home, LogOut, Settings, HelpCircle } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Header() {
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

          {/* User Menu */}
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
            <div className="user-avatar">
              <User size={18} />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="user-dropdown">
              {/* Guest Section */}
              <div className="dropdown-section">
                <Link href="/auth" className="dropdown-item dropdown-item-bold" onClick={() => setIsMenuOpen(false)}>
                  <LogIn size={18} />
                  Iniciar sesión
                </Link>
                <Link href="/auth?mode=register" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                  <UserPlus size={18} />
                  Registrarse
                </Link>
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

              {/* Help Section */}
              <div className="dropdown-section">
                <Link href="/ayuda" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                  <HelpCircle size={18} />
                  Centro de ayuda
                </Link>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </nav>
  );
}

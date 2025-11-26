'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import Keycloak from 'keycloak-js'

interface User {
  id: string
  email: string
  name: string
  surname: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  login: () => void
  logout: () => void
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

let keycloakInstance: Keycloak | null = null

function getKeycloak(): Keycloak {
  if (typeof window === 'undefined') {
    throw new Error('Keycloak can only be initialized on the client side')
  }

  if (!keycloakInstance) {
    keycloakInstance = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || 'http://localhost:8081',
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'balconazo',
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'balconazo-frontend',
    })
  }

  return keycloakInstance
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null)

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const kc = getKeycloak()
        
        const authenticated = await kc.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        })

        setKeycloak(kc)

        if (authenticated && kc.tokenParsed) {
          setToken(kc.token || null)
          setUser({
            id: kc.tokenParsed.sub || '',
            email: kc.tokenParsed.email || '',
            name: kc.tokenParsed.given_name || '',
            surname: kc.tokenParsed.family_name || '',
            roles: kc.tokenParsed.realm_access?.roles || [],
          })
        }

        // Configurar renovación automática del token
        kc.onTokenExpired = () => {
          kc.updateToken(30).then((refreshed) => {
            if (refreshed) {
              setToken(kc.token || null)
            }
          }).catch(() => {
            setUser(null)
            setToken(null)
          })
        }

      } catch (error) {
        console.error('Error initializing Keycloak:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initKeycloak()
  }, [])

  const login = useCallback(() => {
    keycloak?.login()
  }, [keycloak])

  const logout = useCallback(() => {
    keycloak?.logout({ redirectUri: window.location.origin })
  }, [keycloak])

  const hasRole = useCallback((role: string) => {
    return user?.roles.includes(role) || false
  }, [user])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    token,
    login,
    logout,
    hasRole,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

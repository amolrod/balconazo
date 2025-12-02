"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import Keycloak from "keycloak-js";

// Keycloak configuration
const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8081",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "balconazo",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "balconazo-frontend",
};

// User type from Keycloak token
export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  roles: string[];
}

// Registration data
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Registration result
export interface RegisterResult {
  success: boolean;
  error?: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: () => void;
  register: () => void;
  logout: () => void;
  getToken: () => Promise<string | null>;
  // Direct login/register with credentials (custom UI)
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  registerWithCredentials: (data: RegisterData) => Promise<RegisterResult>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  getToken: async () => null,
  loginWithCredentials: async () => false,
  registerWithCredentials: async () => ({ success: false }),
});

// Singleton Keycloak instance
let keycloakInstance: Keycloak | null = null;

function getKeycloak(): Keycloak {
  if (typeof window === "undefined") {
    throw new Error("Keycloak can only be used in the browser");
  }
  
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(keycloakConfig);
  }
  
  return keycloakInstance;
}

// Parse user from Keycloak token
function parseUser(keycloak: Keycloak): User | null {
  if (!keycloak.authenticated || !keycloak.tokenParsed) {
    return null;
  }

  const token = keycloak.tokenParsed as {
    sub?: string;
    email?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    preferred_username?: string;
    realm_access?: { roles?: string[] };
  };

  return {
    id: token.sub || "",
    email: token.email || "",
    name: token.name || token.preferred_username || "",
    firstName: token.given_name,
    lastName: token.family_name,
    username: token.preferred_username,
    roles: token.realm_access?.roles || [],
  };
}

// Auth Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);

  // Initialize Keycloak
  useEffect(() => {
    const initKeycloak = async () => {
      try {
        // First, check if we have tokens in sessionStorage (Direct Access Grants flow)
        if (typeof window !== "undefined") {
          const storedToken = sessionStorage.getItem("kc_access_token");
          if (storedToken) {
            try {
              const payload = JSON.parse(atob(storedToken.split(".")[1]));
              const exp = payload.exp * 1000;
              
              if (Date.now() < exp - 30000) {
                // Token still valid, restore session
                const userData: User = {
                  id: payload.sub || "",
                  email: payload.email || "",
                  name: payload.name || payload.preferred_username || "",
                  firstName: payload.given_name,
                  lastName: payload.family_name,
                  username: payload.preferred_username,
                  roles: payload.realm_access?.roles || [],
                };
                setUser(userData);
                setToken(storedToken);
                setIsLoading(false);
                return; // Skip Keycloak init if we have valid tokens
              }
            } catch {
              // Invalid token, continue with Keycloak init
              sessionStorage.removeItem("kc_access_token");
              sessionStorage.removeItem("kc_refresh_token");
            }
          }
        }

        const kc = getKeycloak();
        
        const authenticated = await kc.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri: typeof window !== "undefined" 
            ? `${window.location.origin}/silent-check-sso.html` 
            : undefined,
          pkceMethod: "S256",
          checkLoginIframe: false,
        });

        setKeycloak(kc);

        if (authenticated) {
          setUser(parseUser(kc));
          setToken(kc.token || null);
        }

        // Token refresh
        kc.onTokenExpired = () => {
          kc.updateToken(30).then((refreshed) => {
            if (refreshed) {
              setToken(kc.token || null);
            }
          }).catch(() => {
            console.error("Failed to refresh token");
            setUser(null);
            setToken(null);
          });
        };

        // Auth state changes
        kc.onAuthSuccess = () => {
          setUser(parseUser(kc));
          setToken(kc.token || null);
        };

        kc.onAuthLogout = () => {
          setUser(null);
          setToken(null);
        };

      } catch (error) {
        console.error("Keycloak init error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initKeycloak();
  }, []);

  // Login - redirect to Keycloak
  const login = useCallback(() => {
    if (keycloak) {
      keycloak.login({
        redirectUri: window.location.origin,
      });
    }
  }, [keycloak]);

  // Register - redirect to Keycloak registration
  const register = useCallback(() => {
    if (keycloak) {
      keycloak.register({
        redirectUri: window.location.origin,
      });
    }
  }, [keycloak]);

  // Logout
  const logout = useCallback(() => {
    // Clear session storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("kc_access_token");
      sessionStorage.removeItem("kc_refresh_token");
    }
    
    setUser(null);
    setToken(null);
    
    // If Keycloak is initialized, also logout from Keycloak
    if (keycloak?.authenticated) {
      keycloak.logout({
        redirectUri: window.location.origin,
      });
    } else {
      // Just redirect to home if using Direct Access Grants
      window.location.href = "/";
    }
  }, [keycloak]);

  // Get fresh token (with auto-refresh)
  const getToken = useCallback(async (): Promise<string | null> => {
    // First check if we have a token from Keycloak instance
    if (keycloak?.authenticated) {
      try {
        // Refresh if token expires in less than 30 seconds
        await keycloak.updateToken(30);
        return keycloak.token || null;
      } catch {
        console.error("Failed to refresh token via Keycloak");
      }
    }
    
    // Fallback: Check sessionStorage (for Direct Access Grants flow)
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("kc_access_token");
      if (storedToken) {
        // Check if token is still valid
        try {
          const payload = JSON.parse(atob(storedToken.split(".")[1]));
          const exp = payload.exp * 1000; // Convert to milliseconds
          if (Date.now() < exp - 30000) { // 30 seconds buffer
            return storedToken;
          }
          // Token expired, try to refresh
          const refreshToken = sessionStorage.getItem("kc_refresh_token");
          if (refreshToken) {
            const newToken = await refreshAccessToken(refreshToken);
            if (newToken) {
              return newToken;
            }
          }
        } catch {
          console.error("Error parsing stored token");
        }
      }
    }
    
    return token;
  }, [keycloak, token]);

  // Refresh access token using refresh token
  const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
    try {
      const tokenUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
      
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: keycloakConfig.clientId,
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        // Refresh token expired, clear storage
        sessionStorage.removeItem("kc_access_token");
        sessionStorage.removeItem("kc_refresh_token");
        setUser(null);
        setToken(null);
        return null;
      }

      const tokenData = await response.json();
      sessionStorage.setItem("kc_access_token", tokenData.access_token);
      sessionStorage.setItem("kc_refresh_token", tokenData.refresh_token);
      setToken(tokenData.access_token);
      
      return tokenData.access_token;
    } catch {
      return null;
    }
  };

  // Login with credentials (Direct Access Grants / Resource Owner Password)
  const loginWithCredentials = useCallback(async (
    email: string, 
    password: string
  ): Promise<boolean> => {
    try {
      const tokenUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;
      
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          client_id: keycloakConfig.clientId,
          username: email,
          password: password,
          scope: "openid profile email",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login failed:", errorData);
        return false;
      }

      const tokenData = await response.json();
      
      // Store tokens
      setToken(tokenData.access_token);
      
      // Parse user from access token
      const tokenPayload = JSON.parse(atob(tokenData.access_token.split(".")[1]));
      const userData: User = {
        id: tokenPayload.sub || "",
        email: tokenPayload.email || email,
        name: tokenPayload.name || tokenPayload.preferred_username || "",
        firstName: tokenPayload.given_name,
        lastName: tokenPayload.family_name,
        username: tokenPayload.preferred_username,
        roles: tokenPayload.realm_access?.roles || [],
      };
      
      setUser(userData);
      
      // Store refresh token for later use
      if (typeof window !== "undefined") {
        sessionStorage.setItem("kc_refresh_token", tokenData.refresh_token);
        sessionStorage.setItem("kc_access_token", tokenData.access_token);
      }
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }, []);

  // Register with credentials via backend API (which calls Keycloak Admin API)
  const registerWithCredentials = useCallback(async (
    data: RegisterData
  ): Promise<RegisterResult> => {
    try {
      // Use backend endpoint to register user in Keycloak
      // The backend handles the Keycloak Admin API call securely
      // NEXT_PUBLIC_API_URL already includes /api, so we just append /auth/register
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return { 
          success: false, 
          error: result.message || "Error al crear la cuenta" 
        };
      }

      // Auto-login after successful registration
      const loginSuccess = await loginWithCredentials(data.email, data.password);
      
      if (!loginSuccess) {
        return { 
          success: true, 
          error: "Cuenta creada. Por favor, inicia sesión." 
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        error: "Error de conexión. Por favor, inténtalo más tarde." 
      };
    }
  }, [loginWithCredentials]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        token,
        login,
        register,
        logout,
        getToken,
        loginWithCredentials,
        registerWithCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;

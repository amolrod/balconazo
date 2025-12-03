"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Particles } from "@/components/ui/particles";
import { ShineBorder } from "@/components/ui/shine-border";
import { ModeToggle } from "@/components/ui/mode-toggle";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithCredentials, registerWithCredentials, isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Control de qué formulario se muestra
  const [isLogin, setIsLogin] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Leer el query param 'mode' al cargar
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") {
      setIsLogin(false);
    }
  }, [searchParams]);

  // ================= LOGIN STATE =================
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // ================= REGISTER STATE =================
  const [registerShowPassword, setRegisterShowPassword] = useState(false);
  const [registerShowConfirm, setRegisterShowConfirm] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [registerErrors, setRegisterErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
  }>({});

  // ================= SWAP ANIMATION =================
  const handleSwap = () => {
    setIsLogin(!isLogin);
    // Clear errors on swap
    setLoginError(null);
    setRegisterError(null);
    setLoginErrors({});
    setRegisterErrors({});
  };

  // ================= LOGIN HANDLERS =================
  const validateLogin = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!loginData.email) {
      errors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      errors.email = "Email inválido";
    }
    
    if (!loginData.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (loginData.password.length < 6) {
      errors.password = "Mínimo 6 caracteres";
    }
    
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!validateLogin()) return;
    
    setLoginLoading(true);
    
    try {
      const success = await loginWithCredentials(loginData.email, loginData.password, loginData.rememberMe);
      if (success) {
        router.push("/");
      } else {
        setLoginError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
      }
    } catch {
      setLoginError("Error al iniciar sesión. Por favor, inténtalo más tarde.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (loginErrors[name as keyof typeof loginErrors]) {
      setLoginErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // ================= REGISTER HANDLERS =================
  const validateRegister = () => {
    const errors: typeof registerErrors = {};
    
    if (!registerData.firstName.trim()) {
      errors.firstName = "El nombre es obligatorio";
    }
    if (!registerData.lastName.trim()) {
      errors.lastName = "Los apellidos son obligatorios";
    }
    if (!registerData.email) {
      errors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      errors.email = "Email inválido";
    }
    if (!registerData.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (registerData.password.length < 8) {
      errors.password = "Mínimo 8 caracteres";
    }
    if (!registerData.confirmPassword) {
      errors.confirmPassword = "Confirma tu contraseña";
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (!registerData.acceptTerms) {
      errors.acceptTerms = "Debes aceptar los términos";
    }
    
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    
    if (!validateRegister()) return;
    
    setRegisterLoading(true);
    
    try {
      const result = await registerWithCredentials({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
      });
      
      if (result.success) {
        router.push("/");
      } else {
        setRegisterError(result.error || "Error al crear la cuenta. Por favor, inténtalo de nuevo.");
      }
    } catch {
      setRegisterError("Error al crear la cuenta. Por favor, inténtalo de nuevo.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (registerErrors[name as keyof typeof registerErrors]) {
      setRegisterErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Don't render while checking auth
  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className={`auth-container ${!isLogin ? 'register-mode' : ''}`}>
      {/* Panel de Branding - ESPECTACULAR */}
      <div className="auth-branding">
        {/* Toggle modo oscuro (desktop) */}
        <div className="absolute top-4 right-4 z-50">
          <ModeToggle className="text-white hover:bg-white/20 hover:text-white" />
        </div>

        {/* Fondo con gradiente animado */}
        <div className="brand-bg-gradient"></div>
        
        {/* Partículas interactivas de fondo (siguen al ratón) */}
        <Particles
          className="absolute inset-0 z-10"
          quantity={150}
          ease={80}
          color="#ffffff"
          refresh
        />
        
        {/* Logo gigante de fondo (marca de agua difuminada) */}
        <div className="brand-bg-logo-watermark">
          <Image 
            src="/logo.png" 
            alt="" 
            width={800} 
            height={800}
            className="watermark-img"
          />
        </div>
        
        {/* CONTENIDO CENTRAL */}
        <div className="brand-hero-content">
          {/* Texto animado */}
          <div className="brand-hero-text">
            <h2 className="brand-hero-title">
              {isLogin ? "¡Hola de nuevo!" : "¡Únete ahora!"}
            </h2>
            <p className="brand-hero-subtitle">
              Descubre espacios únicos
            </p>
          </div>
        </div>
      </div>

      {/* Columna Formularios */}
      <div className="auth-content relative">
        {/* Toggle modo oscuro (mobile) */}
        <div className="absolute top-4 right-4 lg:hidden">
          <ModeToggle />
        </div>

        <div className="auth-content-inner">
          {/* Logo solo visible en mobile */}
          <div className="auth-logo-mobile">
            <Image 
              src="/logo.png" 
              alt="Balconazo" 
              width={50} 
              height={50}
              className="auth-logo-img"
            />
          </div>

          {/* Container de formularios con animación crossfade */}
          <div className={`auth-forms-wrapper ${!isLogin ? 'show-register' : ''}`}>
              {/* LOGIN FORM */}
              <div className="auth-form-panel">
                <div className="auth-card relative overflow-hidden">
                  {/* Borde colorido animado */}
                  <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                  
                  <div className="auth-card-header">
                    <h2 className="auth-card-title">Bienvenido de nuevo</h2>
                    <p className="auth-card-subtitle">Ingresa tus datos para continuar</p>
                  </div>

                  {loginError && (
                    <div className="alert alert-error">
                      <AlertCircle size={16} />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form className="auth-form" onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                      <label htmlFor="login-email" className="form-label">
                        Correo electrónico
                      </label>
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        className={`form-input ${loginErrors.email ? 'error' : ''}`}
                        placeholder="tu@email.com"
                        autoComplete="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        disabled={loginLoading}
                      />
                      {loginErrors.email && (
                        <span className="form-error">{loginErrors.email}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="login-password" className="form-label">
                        Contraseña
                      </label>
                      <div className="input-with-icon">
                        <input
                          id="login-password"
                          name="password"
                          type={loginShowPassword ? "text" : "password"}
                          className={`form-input ${loginErrors.password ? 'error' : ''}`}
                          placeholder="••••••••"
                          autoComplete="current-password"
                          value={loginData.password}
                          onChange={handleLoginChange}
                          disabled={loginLoading}
                        />
                        <button
                          type="button"
                          className="input-icon-btn"
                          onClick={() => setLoginShowPassword(!loginShowPassword)}
                          tabIndex={-1}
                        >
                          {loginShowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <span className="form-error">{loginErrors.password}</span>
                      )}
                    </div>

                    <div className="form-options">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="rememberMe"
                          className="checkbox-input"
                          checked={loginData.rememberMe}
                          onChange={handleLoginChange}
                        />
                        <span>Recordarme</span>
                      </label>
                      <Link href="/forgot-password" className="link-primary">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      className="btn-auth btn-auth-primary"
                      disabled={loginLoading}
                    >
                      {loginLoading ? (
                        <>
                          <span className="spinner"></span>
                          <span>Iniciando sesión...</span>
                        </>
                      ) : (
                        <span>Iniciar Sesión</span>
                      )}
                    </button>

                    <div className="form-footer">
                      <p>
                        ¿No tienes una cuenta?{" "}
                        <button type="button" onClick={handleSwap} className="link-primary">
                          Regístrate gratis
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </div>

              {/* REGISTER FORM */}
              <div className="auth-form-panel">
                <div className="auth-card relative overflow-hidden">
                  {/* Borde colorido animado */}
                  <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                  
                  <div className="auth-card-header">
                    <h2 className="auth-card-title">Únete a Balconazo</h2>
                    <p className="auth-card-subtitle">Descubre espacios únicos en tu ciudad</p>
                  </div>

                  {registerError && (
                    <div className="alert alert-error">
                      <AlertCircle size={16} />
                      <span>{registerError}</span>
                    </div>
                  )}

                  <form className="auth-form" onSubmit={handleRegisterSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="firstName" className="form-label">Nombre</label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          className={`form-input ${registerErrors.firstName ? 'error' : ''}`}
                          placeholder="Tu nombre"
                          autoComplete="given-name"
                          value={registerData.firstName}
                          onChange={handleRegisterChange}
                          disabled={registerLoading}
                        />
                        {registerErrors.firstName && (
                          <span className="form-error">{registerErrors.firstName}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="lastName" className="form-label">Apellidos</label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          className={`form-input ${registerErrors.lastName ? 'error' : ''}`}
                          placeholder="Tus apellidos"
                          autoComplete="family-name"
                          value={registerData.lastName}
                          onChange={handleRegisterChange}
                          disabled={registerLoading}
                        />
                        {registerErrors.lastName && (
                          <span className="form-error">{registerErrors.lastName}</span>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="register-email" className="form-label">Correo electrónico</label>
                      <input
                        id="register-email"
                        name="email"
                        type="email"
                        className={`form-input ${registerErrors.email ? 'error' : ''}`}
                        placeholder="tu@email.com"
                        autoComplete="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        disabled={registerLoading}
                      />
                      {registerErrors.email && (
                        <span className="form-error">{registerErrors.email}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="register-password" className="form-label">Contraseña</label>
                      <div className="input-with-icon">
                        <input
                          id="register-password"
                          name="password"
                          type={registerShowPassword ? "text" : "password"}
                          className={`form-input ${registerErrors.password ? 'error' : ''}`}
                          placeholder="Mínimo 8 caracteres"
                          autoComplete="new-password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          disabled={registerLoading}
                        />
                        <button
                          type="button"
                          className="input-icon-btn"
                          onClick={() => setRegisterShowPassword(!registerShowPassword)}
                          tabIndex={-1}
                        >
                          {registerShowPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {registerErrors.password && (
                        <span className="form-error">{registerErrors.password}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                      <div className="input-with-icon">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={registerShowConfirm ? "text" : "password"}
                          className={`form-input ${registerErrors.confirmPassword ? 'error' : ''}`}
                          placeholder="Repite tu contraseña"
                          autoComplete="new-password"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          disabled={registerLoading}
                        />
                        <button
                          type="button"
                          className="input-icon-btn"
                          onClick={() => setRegisterShowConfirm(!registerShowConfirm)}
                          tabIndex={-1}
                        >
                          {registerShowConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {registerErrors.confirmPassword && (
                        <span className="form-error">{registerErrors.confirmPassword}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          className="checkbox-input"
                          checked={registerData.acceptTerms}
                          onChange={handleRegisterChange}
                        />
                        <span>
                          Acepto los{" "}
                          <Link href="/terms" target="_blank">Términos</Link>
                          {" "}y la{" "}
                          <Link href="/privacy" target="_blank">Política de Privacidad</Link>
                        </span>
                      </label>
                      {registerErrors.acceptTerms && (
                        <span className="form-error">{registerErrors.acceptTerms}</span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn-auth btn-auth-primary"
                      disabled={registerLoading}
                    >
                      {registerLoading ? (
                        <>
                          <span className="spinner"></span>
                          <span>Creando cuenta...</span>
                        </>
                      ) : (
                        <span>Crear cuenta</span>
                      )}
                    </button>

                    <div className="form-footer">
                      <p>
                        ¿Ya tienes cuenta?{" "}
                        <button type="button" onClick={handleSwap} className="link-primary">
                          Inicia sesión
                        </button>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="auth-loading">
        <div className="auth-loading-spinner"></div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}

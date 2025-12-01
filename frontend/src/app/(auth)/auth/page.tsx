"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Home } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Control de qué formulario se muestra
  const [isLogin, setIsLogin] = useState(true);

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Login con:", loginData);
      router.push("/");
    } catch {
      setLoginError("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Registro con:", registerData);
      // Cambiar a login después del registro
      handleSwap();
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

  return (
    <div className={`auth-container ${!isLogin ? 'register-mode' : ''}`}>
      {/* Columna Branding (Desktop only) */}
      <div className="auth-branding">
        <div className="auth-branding-content">
          <div className="auth-branding-icon">
            <Home size={40} color="white" />
          </div>
          <h1 className="auth-branding-title">Balconazo</h1>
          <p className="auth-branding-subtitle">
            {isLogin 
              ? "Descubre espacios únicos para tus eventos. Terrazas, jardines y salones exclusivos te esperan."
              : "Únete a miles de usuarios que ya disfrutan de espacios únicos para sus eventos y celebraciones."
            }
          </p>
        </div>
      </div>

      {/* Columna Formularios */}
      <div className="auth-content">
        <div className="auth-content-inner">
          {/* Logo (mobile) */}
          <div className="auth-logo">
            <h1 className="auth-logo-text">Balconazo</h1>
            <p className="auth-logo-subtitle">
              {isLogin ? "Inicia sesión en tu cuenta" : "Crea tu cuenta"}
            </p>
          </div>

          {/* Container de formularios con animación de slide */}
          <div className="auth-forms-wrapper">
            <div className={`auth-forms-slider ${!isLogin ? 'show-register' : ''}`}>
              {/* LOGIN FORM */}
              <div className="auth-form-panel">
              <div className="auth-card">
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
                      />
                      <button
                        type="button"
                        className="input-icon-btn"
                        onClick={() => setLoginShowPassword(!loginShowPassword)}
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
              <div className="auth-card">
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
                      />
                      <button
                        type="button"
                        className="input-icon-btn"
                        onClick={() => setRegisterShowPassword(!registerShowPassword)}
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
                      />
                      <button
                        type="button"
                        className="input-icon-btn"
                        onClick={() => setRegisterShowConfirm(!registerShowConfirm)}
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
    </div>
  );
}

# Guía de Replicación de Estilos: Login y Registro (BalconazoApp)

Este documento contiene toda la información necesaria para replicar exactamente los estilos de las páginas de Login y Registro de BalconazoApp en otro proyecto.

## 1. Design Tokens (Variables CSS)

Copia estas variables en tu archivo CSS global (ej. `:root` en `styles.css` o `global.css`). Estas definen la paleta de colores, tipografía, espaciado y sombras.

```css
:root {
  /* ========== COLORES ========== */

  /* Primary (Rose) */
  --primary-50: #FFF1F2;
  --primary-100: #FFE4E6;
  --primary-200: #FECDD3;
  --primary-300: #FDA4AF;
  --primary-400: #FB7185;
  --primary-500: #F43F5E;
  --primary-600: #E11D48;
  --primary-700: #BE123C;
  --primary-800: #9F1239;
  --primary-900: #881337;

  /* Gray Scale */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;

  /* Semantic Colors */
  --success: #10B981;
  --success-light: #D1FAE5;
  --success-dark: #047857;

  --warning: #F59E0B;
  --warning-light: #FEF3C7;
  --warning-dark: #D97706;

  --error: #EF4444;
  --error-light: #FEE2E2;
  --error-dark: #DC2626;

  --info: #3B82F6;
  --info-light: #DBEAFE;
  --info-dark: #2563EB;

  /* Neutral */
  --white: #FFFFFF;
  --black: #000000;

  /* ========== SPACING ========== */
  --space-0: 0;
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-7: 1.75rem;    /* 28px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px */

  /* ========== TIPOGRAFÍA ========== */

  /* Font Families */
  --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-6xl: 3.75rem;    /* 60px */

  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Letter Spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;

  /* ========== SHADOWS ========== */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --shadow-none: none;

  /* Custom shadows */
  --shadow-primary: 0 10px 30px -5px rgba(244, 63, 94, 0.3);
  --shadow-card: var(--shadow-md);
  --shadow-card-hover: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
  --shadow-navbar: 0 2px 8px rgba(0, 0, 0, 0.08);

  /* ========== BORDER RADIUS ========== */
  --radius-none: 0;
  --radius-sm: 0.25rem;     /* 4px */
  --radius-base: 0.5rem;    /* 8px */
  --radius-md: 0.625rem;    /* 10px */
  --radius-lg: 0.75rem;     /* 12px */
  --radius-xl: 1rem;        /* 16px */
  --radius-2xl: 1.5rem;     /* 24px */
  --radius-3xl: 2rem;       /* 32px */
  --radius-full: 9999px;

  /* ========== Z-INDEX ========== */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;

  /* ========== TRANSITIONS ========== */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slower: 500ms cubic-bezier(0.4, 0, 0.2, 1);

  /* ========== OTROS ========== */
  --opacity-disabled: 0.5;
  --opacity-hover: 0.8;
}
```

## 2. Estilos Globales Básicos

Asegúrate de tener estos estilos base para que la tipografía y el box-sizing funcionen correctamente.

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--gray-900);
  background-color: var(--white);
  overflow-x: hidden;
}

/* Botones base */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  font-size: inherit;
}

/* Links */
a {
  color: var(--primary-600);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--primary-700);
}
```

## 3. Estilos Compartidos de Autenticación (Auth Shared)

Estos estilos definen el layout de "pantalla dividida" (tipo Instagram) y los componentes comunes como inputs y botones.

```css
/* ============================================
   AUTH PAGES - INSTAGRAM-LIKE LAYOUT
   No sliders, no scroll, 100dvh
   ============================================ */

.auth-container {
  height: 100dvh;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  overflow: hidden;
  background: var(--gray-50);
}

/* Desktop: 2 columnas tipo Instagram */
@media (min-width: 1024px) {
  .auth-container {
    grid-template-columns: 1fr 1fr;
  }
}

/* ====== COLUMNA IZQUIERDA: BRANDING (Desktop only) ====== */
.auth-branding {
  display: none;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 100%);
  position: relative;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .auth-branding {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-12);
  }
}

.auth-branding-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 20px 60px rgba(0, 0, 0, 0.2));
}

/* ====== COLUMNA DERECHA: FORMULARIO ====== */
.auth-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-6);
  overflow-y: auto;
  height: 100%;
}

/* Scrollbar minimalista */
.auth-content::-webkit-scrollbar {
  width: 4px;
}

.auth-content::-webkit-scrollbar-track {
  background: transparent;
}

.auth-content::-webkit-scrollbar-thumb {
  background: var(--gray-300);
  border-radius: var(--radius-full);
}

@media (min-width: 640px) {
  .auth-content {
    padding: var(--space-12) var(--space-8);
  }
}

.auth-content-inner {
  width: 100%;
  max-width: 400px;
}

/* ====== LOGO (Solo mobile, centrado arriba) ====== */
.auth-logo {
  text-align: center;
  margin-bottom: var(--space-4);
}

@media (min-width: 1024px) {
  .auth-logo {
    margin-bottom: var(--space-3);
  }
}

.auth-logo-text {
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-1);
}

.auth-logo-subtitle {
  font-size: var(--text-xs);
  color: var(--gray-600);
  font-weight: var(--font-medium);
}

/* ====== TARJETA MINIMAL ====== */
.auth-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}

.auth-card-header {
  margin-bottom: var(--space-4);
}

.auth-card-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--gray-900);
  margin-bottom: var(--space-1);
  text-align: center;
}

.auth-card-subtitle {
  font-size: var(--text-xs);
  color: var(--gray-600);
  text-align: center;
  margin: 0;
}

/* ====== FORMULARIO ====== */
.auth-form .form-group {
  margin-bottom: var(--space-3);
}

.auth-form .form-label {
  display: block;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--gray-700);
  margin-bottom: var(--space-1);
}

.auth-form .form-input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  color: var(--gray-900);
  background: var(--gray-50);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.auth-form .form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  background: white;
  box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.1);
}

.auth-form .form-input.error {
  border-color: var(--error);
  background: var(--error-light);
}

.auth-form .form-input::placeholder {
  color: var(--gray-400);
}

.auth-form .form-error,
.auth-form .error-message {
  display: block;
  margin-top: var(--space-1);
  font-size: 0.7rem;
  color: var(--error);
  font-weight: var(--font-medium);
}

/* Input con icono (mostrar/ocultar password) */
.input-with-icon {
  position: relative;
}

.input-with-icon .form-input {
  padding-right: 44px;
}

.input-with-icon .input-icon-btn {
  position: absolute;
  right: var(--space-2);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: var(--space-2);
  cursor: pointer;
  color: var(--gray-500);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.input-with-icon .input-icon-btn:hover {
  color: var(--gray-700);
  background: var(--gray-100);
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--gray-700);
  cursor: pointer;
}

.checkbox-label .checkbox-input {
  margin-top: 2px;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--primary-600);
}

.checkbox-label a {
  color: var(--primary-600);
  text-decoration: none;
  font-weight: var(--font-semibold);
}

.checkbox-label a:hover {
  text-decoration: underline;
}

/* Form options (recordarme) */
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
  font-size: var(--text-xs);
}

.link-primary {
  color: var(--primary-600);
  text-decoration: none;
  font-weight: var(--font-semibold);
  transition: color var(--transition-fast);
  font-size: var(--text-xs);
}

.link-primary:hover {
  color: var(--primary-700);
  text-decoration: underline;
}

/* Alert */
.alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
  font-size: var(--text-xs);
}

.alert svg {
  flex-shrink: 0;
  margin-top: 2px;
  width: 16px;
  height: 16px;
}

.alert.alert-error {
  background: var(--error-light);
  color: var(--error);
  border: 1px solid var(--error);
}

/* Form footer */
.form-footer {
  text-align: center;
  padding-top: var(--space-3);
  margin-top: var(--space-3);
  border-top: 1px solid var(--gray-200);
}

.form-footer p {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--gray-600);
}

/* Loading spinner */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .auth-content {
    padding: var(--space-4);
  }

  .auth-card {
    padding: var(--space-4);
    border: none;
    box-shadow: none;
  }

  .auth-logo-text {
    font-size: var(--text-2xl);
  }
}

/* Estilos para botones primarios (btn-primary) */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  border-radius: var(--radius-lg);
  min-height: 44px;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  white-space: nowrap;
}

.btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-500));
  color: var(--white);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover:not(:disabled) {
  box-shadow: var(--shadow-primary);
  transform: translateY(-2px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
  min-height: 52px;
}
```

## 4. Estilos Específicos de Registro

Añade estos estilos si estás implementando la página de registro.

```css
/* Register-specific styles */
.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

.auth-info {
  background: var(--primary-50);
  border-left: 4px solid var(--primary-500);
  padding: var(--space-4);
  border-radius: var(--radius-base);
  margin-top: var(--space-4);
}

.auth-info p {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--gray-700);
  line-height: var(--leading-relaxed);
}

.auth-info p strong {
  color: var(--primary-600);
}
```

## 5. Estructura HTML: Login

Esta es la estructura HTML completa para el Login. Adapta las directivas de Angular (`*ngIf`, `[formGroup]`, etc.) a tu framework (React, Vue, HTML puro).

```html
<div class="auth-container">
  <!-- Columna Izquierda: Branding (Desktop only) -->
  <div class="auth-branding">
    <img
      src="/assets/images/auth-branding.svg"
      alt="Balconazo"
      class="auth-branding-image"
    />
  </div>

  <!-- Columna Derecha: Formulario -->
  <div class="auth-content">
    <div class="auth-content-inner">
      <!-- Logo (mobile) -->
      <div class="auth-logo">
        <h1 class="auth-logo-text">Balconazo</h1>
        <p class="auth-logo-subtitle">Inicia sesión en tu cuenta</p>
      </div>

      <!-- Tarjeta de Login -->
      <div class="auth-card">
        <div class="auth-card-header">
          <h2 class="auth-card-title">Bienvenido de nuevo</h2>
          <p class="auth-card-subtitle">Ingresa tus datos para continuar</p>
        </div>

        <form class="auth-form">
          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              class="form-input"
              placeholder="tu@email.com"
              autocomplete="email"
            />
            <!-- Ejemplo de error (oculto por defecto) -->
            <!-- <span class="form-error">Email inválido</span> -->
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <div class="input-with-icon">
              <input
                id="password"
                type="password"
                class="form-input"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button type="button" class="input-icon-btn">
                <!-- Icono de ojo (SVG) -->
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember me & Forgot password -->
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox-input">
              <span>Recordarme</span>
            </label>
            <a href="#" class="link-primary">¿Olvidaste tu contraseña?</a>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            class="btn btn-primary btn-lg"
            style="width: 100%;"
          >
            <span>Iniciar Sesión</span>
          </button>

          <!-- Link to register -->
          <div class="form-footer">
            <p>¿No tienes una cuenta? <a href="/register" class="link-primary">Regístrate gratis</a></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
```

## 6. Estructura HTML: Registro

```html
<div class="auth-container">
  <!-- Columna Izquierda: Branding (Desktop only) -->
  <div class="auth-branding">
    <img
      src="/assets/images/auth-branding.svg"
      alt="Balconazo"
      class="auth-branding-image"
    />
  </div>

  <!-- Columna Derecha: Formulario -->
  <div class="auth-content">
    <div class="auth-content-inner">
      <!-- Logo (mobile) -->
      <div class="auth-logo">
        <h1 class="auth-logo-text">Balconazo</h1>
        <p class="auth-logo-subtitle">Crea tu cuenta</p>
      </div>

      <!-- Tarjeta de Registro -->
      <div class="auth-card">
        <div class="auth-card-header">
          <h2 class="auth-card-title">Únete a Balconazo</h2>
          <p class="auth-card-subtitle">Descubre espacios únicos en tu ciudad</p>
        </div>

        <form class="auth-form">
          <!-- Nombre y Apellidos (2 columnas) -->
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">Nombre</label>
              <input
                id="firstName"
                type="text"
                class="form-input"
                placeholder="Tu nombre"
              />
            </div>

            <div class="form-group">
              <label for="lastName" class="form-label">Apellidos</label>
              <input
                id="lastName"
                type="text"
                class="form-input"
                placeholder="Tus apellidos"
              />
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              class="form-input"
              placeholder="tu@email.com"
            />
          </div>

          <!-- Contraseña -->
          <div class="form-group">
            <label for="password" class="form-label">Contraseña</label>
            <div class="input-with-icon">
              <input
                id="password"
                type="password"
                class="form-input"
                placeholder="Mínimo 8 caracteres"
              />
              <button type="button" class="input-icon-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirmar Contraseña -->
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
            <div class="input-with-icon">
              <input
                id="confirmPassword"
                type="password"
                class="form-input"
                placeholder="Repite tu contraseña"
              />
              <button type="button" class="input-icon-btn">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <!-- Términos y Condiciones -->
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" class="checkbox-input">
              <span>
                Acepto los <a href="/terms" target="_blank">Términos y Condiciones</a>
                y la <a href="/privacy" target="_blank">Política de Privacidad</a>
              </span>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-lg"
            style="width: 100%;">
            <span>Crear cuenta</span>
          </button>

          <!-- Link to login -->
          <div class="form-footer">
            <p>¿Ya tienes cuenta? <a href="/login" class="link-primary">Inicia sesión</a></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
```

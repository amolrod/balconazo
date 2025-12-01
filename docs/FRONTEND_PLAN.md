# 📋 Plan de Desarrollo del Frontend - BalconazoApp

## Índice
1. [Estado Actual](#estado-actual)
2. [Problemas Identificados](#problemas-identificados)
3. [Propuesta de Rediseño](#propuesta-de-rediseño)
4. [Sistema de Diseño](#sistema-de-diseño)
5. [Arquitectura del Frontend](#arquitectura-del-frontend)
6. [Plan de Desarrollo por Sprints](#plan-de-desarrollo-por-sprints)
7. [Componentes a Crear](#componentes-a-crear)
8. [Páginas a Desarrollar](#páginas-a-desarrollar)
9. [Integraciones](#integraciones)
10. [Testing](#testing)

---

## 1. Estado Actual

### Páginas Existentes
| Ruta | Estado | Observaciones |
|------|--------|---------------|
| `/` | ✅ Funcional | Diseño básico, buscador no conectado |
| `/spaces` | ✅ Funcional | Lista de espacios con filtros básicos |
| `/spaces/[id]` | ✅ Funcional | Detalle y formulario de reserva |
| `/account/profile` | ✅ Funcional | Edición básica de perfil |
| `/account/bookings` | ✅ Funcional | Lista de reservas del usuario |
| `/account/spaces` | ✅ Funcional | Panel del host |
| `/account/spaces/new` | ✅ Funcional | Crear espacio |
| `/account/spaces/[id]/edit` | ✅ Funcional | Editar espacio |

### Tecnologías Actuales
- **Framework**: Next.js 15 (App Router)
- **UI**: React 19
- **Estilos**: Tailwind CSS 3.4
- **Estado**: React Query (TanStack Query)
- **Autenticación**: Keycloak + keycloak-js
- **Iconos**: Lucide React
- **Formularios**: React Hook Form + Zod
- **Fechas**: date-fns

---

## 2. Problemas Identificados

### 🎨 Diseño Visual
- [ ] Paleta de colores genérica (azul/gris por defecto)
- [ ] Sin identidad de marca definida
- [ ] Tipografía sin personalidad
- [ ] Espacios visuales inconsistentes
- [ ] Cards de espacios poco atractivas
- [ ] Hero section genérico
- [ ] Footer básico sin información útil

### 🧩 UX/UI
- [ ] Buscador del home no funcional
- [ ] Sin feedback visual durante carga
- [ ] Sin estados vacíos diseñados
- [ ] Sin animaciones/transiciones
- [ ] Navegación móvil básica
- [ ] Sin breadcrumbs
- [ ] Sin skeleton loaders

### 🔧 Funcionalidad
- [ ] Falta página `/become-host`
- [ ] Falta vista de reservas como host
- [ ] Sin calendario de disponibilidad visual
- [ ] Sin sistema de favoritos
- [ ] Sin búsqueda avanzada
- [ ] Sin mapa de ubicación
- [ ] Sin sistema de notificaciones
- [ ] Sin chat/mensajería

---

## 3. Propuesta de Rediseño

### 🎯 Concepto Visual
**Estilo**: Moderno, cálido, confiable - inspirado en Airbnb/Peerspace pero con personalidad propia.

**Palabras clave del diseño**:
- Acogedor
- Profesional
- Confiable
- Moderno
- Mediterráneo (colores cálidos)

### 🎨 Opciones de Paleta de Colores

#### Opción A: "Mediterráneo Cálido"
```css
/* Primario - Terracota */
--primary-50: #fef7f4;
--primary-100: #fceee8;
--primary-500: #e07c4c;
--primary-600: #d35f2a;
--primary-700: #b54d1f;

/* Secundario - Azul Profundo */
--secondary-500: #1e3a5f;
--secondary-600: #152c4a;
--secondary-900: #0a1628;

/* Acento - Dorado */
--accent-500: #d4a853;
```

#### Opción B: "Verde Natural"
```css
/* Primario - Verde Bosque */
--primary-50: #f0fdf4;
--primary-100: #dcfce7;
--primary-500: #22c55e;
--primary-600: #16a34a;
--primary-700: #15803d;

/* Secundario - Gris Cálido */
--secondary-500: #78716c;
--secondary-900: #1c1917;

/* Acento - Ámbar */
--accent-500: #f59e0b;
```

#### Opción C: "Azul Océano" (actual mejorada)
```css
/* Primario - Azul Océano */
--primary-50: #eff6ff;
--primary-500: #0ea5e9;
--primary-600: #0284c7;
--primary-700: #0369a1;

/* Secundario - Slate */
--secondary-500: #64748b;
--secondary-900: #0f172a;

/* Acento - Coral */
--accent-500: #f97316;
```

### 📐 Tipografía
```css
/* Títulos */
font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;

/* Cuerpo */
font-family: 'Inter', system-ui, sans-serif;
```

---

## 4. Sistema de Diseño

### Estructura de Componentes UI

```
src/
├── components/
│   ├── ui/                    # Componentes base reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Spinner.tsx
│   │   ├── Tabs.tsx
│   │   ├── Pagination.tsx
│   │   └── index.ts
│   │
│   ├── layout/               # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   └── Container.tsx
│   │
│   ├── spaces/               # Componentes de espacios
│   │   ├── SpaceCard.tsx
│   │   ├── SpaceGrid.tsx
│   │   ├── SpaceGallery.tsx
│   │   ├── SpaceFeatures.tsx
│   │   ├── SpaceMap.tsx
│   │   ├── SpaceCalendar.tsx
│   │   └── SpaceReviews.tsx
│   │
│   ├── booking/              # Componentes de reservas
│   │   ├── BookingForm.tsx
│   │   ├── BookingCard.tsx
│   │   ├── BookingSummary.tsx
│   │   ├── DateTimePicker.tsx
│   │   └── PriceBreakdown.tsx
│   │
│   ├── search/               # Componentes de búsqueda
│   │   ├── SearchBar.tsx
│   │   ├── SearchFilters.tsx
│   │   ├── FilterDrawer.tsx
│   │   └── LocationAutocomplete.tsx
│   │
│   ├── user/                 # Componentes de usuario
│   │   ├── UserAvatar.tsx
│   │   ├── UserMenu.tsx
│   │   ├── ProfileCard.tsx
│   │   └── HostBadge.tsx
│   │
│   └── common/               # Componentes comunes
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       ├── LoadingState.tsx
│       ├── Breadcrumbs.tsx
│       ├── Rating.tsx
│       └── ImageUpload.tsx
```

### Tokens de Diseño

```typescript
// src/lib/design-tokens.ts

export const tokens = {
  // Spacing
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  // Border Radius
  radius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  
  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  
  // Transitions
  transition: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },
}
```

---

## 5. Arquitectura del Frontend

### Estructura de Carpetas Propuesta

```
frontend/src/
├── app/                      # Next.js App Router
│   ├── (marketing)/          # Grupo: páginas públicas marketing
│   │   ├── page.tsx          # Home
│   │   ├── about/
│   │   ├── become-host/
│   │   ├── help/
│   │   └── layout.tsx
│   │
│   ├── (auth)/               # Grupo: autenticación
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   │
│   ├── spaces/               # Espacios públicos
│   │   ├── page.tsx          # Lista/búsqueda
│   │   └── [id]/
│   │       └── page.tsx      # Detalle
│   │
│   ├── account/              # Área privada usuario
│   │   ├── layout.tsx        # Layout con sidebar
│   │   ├── page.tsx          # Dashboard
│   │   ├── profile/
│   │   ├── bookings/
│   │   ├── favorites/
│   │   └── settings/
│   │
│   ├── host/                 # Área privada host
│   │   ├── layout.tsx        # Layout host
│   │   ├── page.tsx          # Dashboard host
│   │   ├── spaces/
│   │   ├── bookings/
│   │   ├── calendar/
│   │   └── earnings/
│   │
│   ├── api/                  # API Routes (si necesario)
│   │
│   ├── layout.tsx            # Root layout
│   ├── globals.css
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/               # Componentes (ver arriba)
│
├── lib/                      # Utilidades y configuración
│   ├── api/
│   │   ├── client.ts         # Cliente HTTP base
│   │   ├── users.ts          # API usuarios
│   │   ├── spaces.ts         # API espacios
│   │   └── bookings.ts       # API reservas
│   │
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useSpaces.ts
│   │   ├── useBookings.ts
│   │   ├── useMediaQuery.ts
│   │   └── useDebounce.ts
│   │
│   ├── utils/                # Funciones utilitarias
│   │   ├── cn.ts             # classNames helper
│   │   ├── formatters.ts     # Formateadores
│   │   └── validators.ts     # Validaciones
│   │
│   ├── constants/            # Constantes
│   │   ├── routes.ts
│   │   └── config.ts
│   │
│   └── types/                # TypeScript types
│       ├── api.ts
│       ├── user.ts
│       ├── space.ts
│       └── booking.ts
│
├── styles/                   # Estilos adicionales
│   └── animations.css
│
└── public/                   # Assets estáticos
    ├── images/
    ├── icons/
    └── fonts/
```

---

## 6. Plan de Desarrollo por Sprints

### 🏃 Sprint 1: Sistema de Diseño Base (3-4 días)
**Objetivo**: Establecer fundamentos visuales

**Tareas**:
1. [ ] Definir paleta de colores final (elegir opción A, B o C)
2. [ ] Configurar fuentes en Tailwind
3. [ ] Crear componentes UI base:
   - [ ] Button (variantes: primary, secondary, outline, ghost)
   - [ ] Input (con estados: error, disabled, loading)
   - [ ] Card (variantes: default, elevated, bordered)
   - [ ] Badge
   - [ ] Avatar
   - [ ] Skeleton
   - [ ] Spinner
4. [ ] Crear página de demostración de componentes (`/dev/components`)
5. [ ] Documentar uso de componentes

**Entregables**:
- Tailwind config actualizado
- Biblioteca de componentes UI base
- Página de demo

---

### 🏃 Sprint 2: Layout y Navegación (2-3 días)
**Objetivo**: Estructura general de la aplicación

**Tareas**:
1. [ ] Rediseñar Header:
   - [ ] Logo/Branding
   - [ ] Navegación principal
   - [ ] Búsqueda integrada
   - [ ] Menú usuario (dropdown mejorado)
   - [ ] Versión móvil (hamburger menu)
2. [ ] Crear Footer completo:
   - [ ] Links útiles
   - [ ] Redes sociales
   - [ ] Newsletter
   - [ ] Info legal
3. [ ] Crear layouts:
   - [ ] Layout marketing (header + footer)
   - [ ] Layout dashboard usuario (sidebar)
   - [ ] Layout dashboard host (sidebar)
4. [ ] Implementar navegación móvil
5. [ ] Breadcrumbs component

**Entregables**:
- Header responsive
- Footer completo
- Layouts organizados
- Navegación móvil

---

### 🏃 Sprint 3: Home Page (2-3 días)
**Objetivo**: Landing page atractiva y funcional

**Tareas**:
1. [ ] Hero section rediseñado:
   - [ ] Imagen/video de fondo
   - [ ] Copy atractivo
   - [ ] Buscador funcional integrado
2. [ ] Sección "Espacios destacados":
   - [ ] Carrusel/grid de espacios
   - [ ] Nuevo diseño de SpaceCard
3. [ ] Sección "Cómo funciona":
   - [ ] Iconos personalizados
   - [ ] Animaciones sutiles
4. [ ] Sección "Tipos de espacios":
   - [ ] Categorías con imágenes
5. [ ] Sección "Testimonios/Reviews"
6. [ ] Sección CTA "Conviértete en host"
7. [ ] Conectar buscador con `/spaces`

**Entregables**:
- Home page completa y atractiva
- Buscador funcional

---

### 🏃 Sprint 4: Búsqueda y Listado de Espacios (3-4 días)
**Objetivo**: Experiencia de búsqueda completa

**Tareas**:
1. [ ] Rediseñar página `/spaces`:
   - [ ] Header con buscador sticky
   - [ ] Grid de resultados mejorado
   - [ ] Vista mapa (opcional)
2. [ ] SearchBar component:
   - [ ] Ubicación (con autocomplete)
   - [ ] Fechas (date picker)
   - [ ] Huéspedes/capacidad
3. [ ] Panel de filtros:
   - [ ] Drawer lateral en móvil
   - [ ] Sidebar en desktop
   - [ ] Filtros: precio, capacidad, características, tipo
4. [ ] SpaceCard rediseñado:
   - [ ] Galería de imágenes con hover
   - [ ] Información clara
   - [ ] Botón favoritos
   - [ ] Badge de características
5. [ ] Paginación mejorada
6. [ ] Estados vacíos diseñados
7. [ ] Skeleton loaders

**Entregables**:
- Búsqueda avanzada funcional
- Cards atractivas
- Filtros completos

---

### 🏃 Sprint 5: Detalle de Espacio (3-4 días)
**Objetivo**: Página de detalle que convierte

**Tareas**:
1. [ ] Galería de fotos:
   - [ ] Grid de imágenes
   - [ ] Modal lightbox
   - [ ] Navegación entre fotos
2. [ ] Información del espacio:
   - [ ] Título y ubicación
   - [ ] Descripción formateada
   - [ ] Lista de características con iconos
   - [ ] Reglas del espacio
3. [ ] Sección del host:
   - [ ] Avatar y nombre
   - [ ] Rating y reviews
   - [ ] Botón contactar
4. [ ] Widget de reserva:
   - [ ] Selector de fecha/hora
   - [ ] Calculadora de precio
   - [ ] Botón reservar (sticky en móvil)
5. [ ] Calendario de disponibilidad visual
6. [ ] Mapa de ubicación (Google Maps/Mapbox)
7. [ ] Sección de reviews
8. [ ] Espacios similares

**Entregables**:
- Página de detalle completa
- Widget de reserva funcional
- Galería de imágenes

---

### 🏃 Sprint 6: Flujo de Reserva (2-3 días)
**Objetivo**: Proceso de reserva claro y confiable

**Tareas**:
1. [ ] Página de confirmación de reserva:
   - [ ] Resumen del espacio
   - [ ] Detalles de fecha/hora
   - [ ] Desglose de precio
   - [ ] Políticas de cancelación
   - [ ] Campo de notas
2. [ ] Página de éxito:
   - [ ] Confirmación visual
   - [ ] Detalles de la reserva
   - [ ] Próximos pasos
   - [ ] Botón ver reservas
3. [ ] Emails transaccionales (diseño)
4. [ ] Notificaciones en app

**Entregables**:
- Flujo de reserva completo
- Páginas de confirmación

---

### 🏃 Sprint 7: Área de Usuario (3-4 días)
**Objetivo**: Dashboard del usuario completo

**Tareas**:
1. [ ] Dashboard usuario (`/account`):
   - [ ] Resumen de reservas
   - [ ] Acciones rápidas
2. [ ] Mis reservas (`/account/bookings`):
   - [ ] Tabs: próximas, pasadas, canceladas
   - [ ] Cards de reserva rediseñadas
   - [ ] Acciones: ver detalle, cancelar, contactar host
3. [ ] Detalle de reserva:
   - [ ] Toda la información
   - [ ] Comunicación con host
4. [ ] Perfil (`/account/profile`):
   - [ ] Foto de perfil
   - [ ] Información personal
   - [ ] Verificaciones
5. [ ] Favoritos (`/account/favorites`):
   - [ ] Grid de espacios guardados
6. [ ] Configuración (`/account/settings`):
   - [ ] Notificaciones
   - [ ] Privacidad
   - [ ] Eliminar cuenta

**Entregables**:
- Dashboard usuario completo
- Gestión de reservas
- Perfil editable

---

### 🏃 Sprint 8: Área de Host (4-5 días)
**Objetivo**: Panel de host completo

**Tareas**:
1. [ ] Página "Conviértete en host" (`/become-host`):
   - [ ] Beneficios
   - [ ] Cómo funciona
   - [ ] CTA registro
2. [ ] Dashboard host (`/host`):
   - [ ] Estadísticas: reservas, ingresos, vistas
   - [ ] Gráficos simples
   - [ ] Acciones pendientes
3. [ ] Mis espacios (`/host/spaces`):
   - [ ] Lista de espacios
   - [ ] Estado (activo/pausado)
   - [ ] Estadísticas por espacio
4. [ ] Crear/Editar espacio:
   - [ ] Wizard multi-paso
   - [ ] Upload de imágenes real
   - [ ] Preview del espacio
5. [ ] Reservas recibidas (`/host/bookings`):
   - [ ] Pendientes de confirmación
   - [ ] Confirmadas
   - [ ] Historial
   - [ ] Acciones: confirmar, rechazar
6. [ ] Calendario (`/host/calendar`):
   - [ ] Vista mensual
   - [ ] Bloquear fechas
   - [ ] Ver reservas
7. [ ] Ganancias (`/host/earnings`):
   - [ ] Historial de pagos
   - [ ] Próximos pagos
   - [ ] Exportar datos

**Entregables**:
- Panel host completo
- Gestión de espacios mejorada
- Calendario de disponibilidad

---

### 🏃 Sprint 9: Mejoras UX y Polish (2-3 días)
**Objetivo**: Pulir la experiencia

**Tareas**:
1. [ ] Animaciones y transiciones:
   - [ ] Page transitions
   - [ ] Micro-interacciones
   - [ ] Loading states
2. [ ] Toasts/Notificaciones
3. [ ] Modales mejorados
4. [ ] Error handling visual
5. [ ] Páginas de error (404, 500)
6. [ ] Accesibilidad (a11y)
7. [ ] SEO básico (meta tags)
8. [ ] Performance (lazy loading, optimización imágenes)

**Entregables**:
- App pulida
- Buena UX en todos los flujos

---

### 🏃 Sprint 10: Páginas Adicionales y Legal (1-2 días)
**Objetivo**: Completar páginas secundarias

**Tareas**:
1. [ ] Sobre nosotros (`/about`)
2. [ ] Centro de ayuda (`/help`)
3. [ ] FAQ
4. [ ] Términos y condiciones (`/terms`)
5. [ ] Política de privacidad (`/privacy`)
6. [ ] Contacto (`/contact`)

**Entregables**:
- Todas las páginas legales
- Centro de ayuda

---

## 7. Componentes a Crear

### Prioridad Alta 🔴
| Componente | Descripción | Sprint |
|------------|-------------|--------|
| `Button` | Botón con variantes | 1 |
| `Input` | Input con estados | 1 |
| `Card` | Card base | 1 |
| `SpaceCard` | Card de espacio rediseñada | 4 |
| `SearchBar` | Buscador principal | 4 |
| `Header` | Header rediseñado | 2 |
| `Footer` | Footer completo | 2 |
| `BookingWidget` | Widget de reserva | 5 |
| `ImageGallery` | Galería de fotos | 5 |

### Prioridad Media 🟡
| Componente | Descripción | Sprint |
|------------|-------------|--------|
| `DateTimePicker` | Selector fecha/hora | 5 |
| `FilterDrawer` | Panel de filtros | 4 |
| `UserMenu` | Menú desplegable usuario | 2 |
| `BookingCard` | Card de reserva | 7 |
| `StatsCard` | Card de estadísticas | 8 |
| `Calendar` | Calendario disponibilidad | 8 |

### Prioridad Baja 🟢
| Componente | Descripción | Sprint |
|------------|-------------|--------|
| `Rating` | Componente de estrellas | 5 |
| `Map` | Mapa de ubicación | 5 |
| `Toast` | Notificaciones | 9 |
| `Modal` | Modal genérico | 9 |
| `Breadcrumbs` | Migas de pan | 2 |

---

## 8. Páginas a Desarrollar

### Resumen por Área

| Área | Páginas | Estado |
|------|---------|--------|
| **Marketing** | Home, About, Become Host, Help | 🔴 Pendiente |
| **Espacios** | Lista, Detalle | 🟡 Mejorar |
| **Usuario** | Dashboard, Bookings, Profile, Favorites, Settings | 🟡 Parcial |
| **Host** | Dashboard, Spaces, Bookings, Calendar, Earnings | 🔴 Pendiente |
| **Legal** | Terms, Privacy, Contact | 🔴 Pendiente |
| **Auth** | Login, Register (Keycloak) | ✅ Externo |

---

## 9. Integraciones

### Actuales ✅
- [x] API Backend (KrakenD Gateway)
- [x] Keycloak (Autenticación)
- [x] React Query (Estado servidor)

### Pendientes 📋
- [ ] **Google Maps / Mapbox**: Mapas de ubicación
- [ ] **Cloudinary / AWS S3**: Upload de imágenes
- [ ] **Stripe**: Pagos (futuro)
- [ ] **SendGrid / Resend**: Emails transaccionales
- [ ] **Analytics**: Google Analytics / Plausible
- [ ] **Sentry**: Error tracking

---

## 10. Testing

### Estrategia de Testing

```
src/
├── __tests__/
│   ├── components/        # Tests de componentes
│   ├── pages/             # Tests de páginas
│   ├── hooks/             # Tests de hooks
│   └── utils/             # Tests de utilidades
```

### Herramientas
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright (futuro)
- **Visual Tests**: Storybook (opcional)

### Cobertura Objetivo
- Componentes UI: 80%
- Hooks: 90%
- Utilidades: 100%
- Páginas críticas: 70%

---

## 📅 Timeline Estimado

| Sprint | Duración | Acumulado |
|--------|----------|-----------|
| Sprint 1: Sistema de Diseño | 3-4 días | ~4 días |
| Sprint 2: Layout y Navegación | 2-3 días | ~7 días |
| Sprint 3: Home Page | 2-3 días | ~10 días |
| Sprint 4: Búsqueda/Listado | 3-4 días | ~14 días |
| Sprint 5: Detalle Espacio | 3-4 días | ~18 días |
| Sprint 6: Flujo Reserva | 2-3 días | ~21 días |
| Sprint 7: Área Usuario | 3-4 días | ~25 días |
| Sprint 8: Área Host | 4-5 días | ~30 días |
| Sprint 9: Polish/UX | 2-3 días | ~33 días |
| Sprint 10: Páginas Extra | 1-2 días | ~35 días |

**Total estimado**: 5-6 semanas de desarrollo

---

## 🎯 Próximos Pasos Inmediatos

1. **Decisión**: Elegir paleta de colores (A, B o C)
2. **Sprint 1**: Comenzar con sistema de diseño
3. **Configurar**: Actualizar `tailwind.config.js` con nueva paleta
4. **Crear**: Componentes UI base

---

## 📝 Notas

- Este plan es flexible y puede ajustarse según prioridades
- Cada sprint puede hacerse en paralelo con backend si es necesario
- Se recomienda hacer commits frecuentes por feature
- Revisar diseño con usuario antes de implementar

---

**Última actualización**: 29 de noviembre de 2025
**Autor**: GitHub Copilot
**Versión**: 1.0

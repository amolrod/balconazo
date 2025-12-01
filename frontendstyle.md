# Guía de Replicación - Página Home (Balconazo)

Este documento contiene todos los detalles necesarios para replicar exactamente la página de inicio (Home) de Balconazo.

## 1. Estructura General del Layout

La página se compone de las siguientes secciones apiladas verticalmente:
1.  **Hero Section**: Fondo blanco, título grande, subtítulo y barra de búsqueda flotante.
2.  **Category Bar**: Barra "sticky" con iconos de categorías.
3.  **Featured Spaces**: Grid de tarjetas de espacios destacados.
4.  **Why Balconazo**: Sección de beneficios con 3 tarjetas.
5.  **CTA Section**: Llamada a la acción para anfitriones con fondo gradiente.

---

## 2. Hero Section

Esta sección ocupa la parte superior y contiene el buscador principal.

### HTML Structure
```html
<section class="hero-section">
  <!-- Gradient Background Effect -->
  <div class="hero-gradient"></div>

  <div class="hero-content">
    <!-- Badge -->
    <div class="hero-badge animate-fade-up">
      <span class="pulse-dot">
        <span class="pulse-ring"></span>
        <span class="pulse-core"></span>
      </span>
      Más de 100 espacios verificados
    </div>

    <!-- Titles -->
    <h1 class="hero-title animate-fade-up delay-100">
      Descubre rincones únicos <br /> con <span class="hero-title-gradient">vistas increíbles</span>
    </h1>

    <p class="hero-subtitle animate-fade-up delay-200">
      Terrazas, jardines y salones exclusivos por horas. Reserva de forma segura y sin complicaciones.
    </p>

    <!-- Search Bar Wrapper -->
    <div class="search-bar-wrapper animate-fade-up delay-200">
      <!-- (Ver sección Search Bar para el código interno) -->
    </div>
  </div>
</section>
```

### CSS Styles
```css
.hero-section {
  position: relative;
  padding: 64px 16px 128px;
  overflow: hidden;
  background: white;
}
@media (min-width: 768px) {
  .hero-section { padding: 64px 32px 128px; }
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top, rgba(244, 63, 94, 0.05), transparent 50%);
  pointer-events: none;
}

.hero-content {
  max-width: 1920px;
  margin: 0 auto;
  text-align: center;
  padding: 0 24px;
}

/* Badge Styles */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 9999px;
  background: white;
  border: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.pulse-dot { position: relative; width: 12px; height: 12px; display: flex; justify-content: center; align-items: center; }
.pulse-ring { position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #10b981; opacity: 0.6; animation: pulse 2s infinite; }
.pulse-core { width: 8px; height: 8px; border-radius: 50%; background: #10b981; position: relative; }

/* Typography */
.hero-title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin-bottom: 24px;
}
@media (min-width: 768px) { .hero-title { font-size: 4.5rem; } }

.hero-title-gradient {
  background: linear-gradient(to right, #f43f5e, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  margin-bottom: 48px;
  max-width: 672px;
  margin: 0 auto 48px;
}
```

---

## 3. Search Bar (Píldora Premium)

El componente central de búsqueda con diseño de píldora flotante.

### HTML Structure
```html
<div class="search-bar-wrapper">
  <div class="search-pill-container">
    
    <!-- Location Input -->
    <div class="search-input-group">
      <label>Ubicación</label>
      <input type="text" placeholder="¿Dónde buscas?">
    </div>

    <!-- Divider -->
    <div class="search-divider"></div>

    <!-- Date Input -->
    <div class="search-input-group search-input-date">
      <label>Fecha</label>
      <input type="date">
    </div>

    <!-- Divider -->
    <div class="search-divider"></div>

    <!-- Guests Input + Button -->
    <div class="search-input-group search-input-guests">
      <div class="w-full">
        <label>Invitados</label>
        <input type="number" placeholder="¿Cuántos?">
      </div>
      
      <button class="search-submit-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
    </div>

  </div>
</div>
```

### CSS Styles
```css
.search-bar-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.search-pill-container {
  background: white;
  border-radius: 9999px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
  padding: 8px;
  display: flex;
  flex-direction: column; /* Mobile first */
  align-items: center;
  width: 100%;
  max-width: 896px;
  transition: box-shadow 0.3s;
}
.search-pill-container:hover {
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
}

@media (min-width: 768px) {
  .search-pill-container {
    flex-direction: row;
  }
}

.search-input-group {
  width: 100%;
  padding: 8px 24px;
  border-radius: 9999px;
  transition: background-color 0.2s;
  text-align: left;
  position: relative;
}
.search-input-group:hover {
  background-color: #f1f5f9;
}
@media (min-width: 768px) {
  .search-input-group { flex: 1; }
  .search-input-date { min-width: 180px; flex: 0 auto; }
  .search-input-guests { flex: 0.8; display: flex; align-items: center; justify-content: space-between; padding-right: 8px; }
}

.search-input-group label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

.search-input-group input {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  outline: none;
}

.search-divider {
  display: none;
  width: 1px;
  height: 32px;
  background-color: #e2e8f0;
}
@media (min-width: 768px) {
  .search-divider { display: block; }
}

.search-submit-btn {
  width: 48px;
  height: 48px;
  background: linear-gradient(to bottom right, #e11d48, #f43f5e);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
}
.search-submit-btn:hover {
  transform: scale(1.05);
}
```

---

## 4. Category Bar

Barra de categorías sticky debajo del hero.

### HTML Structure
```html
<div class="category-bar">
  <div class="category-bar-container">
    <div class="category-list hide-scrollbar">
      <!-- Item Activo -->
      <button class="category-item category-item-active">
        <i class="ph-fill ph-house category-icon"></i>
        <span>Todos</span>
      </button>
      
      <!-- Item Inactivo -->
      <button class="category-item">
        <i class="ph-fill ph-sun category-icon"></i>
        <span>Terrazas</span>
      </button>
      <!-- Repetir para más categorías -->
    </div>
  </div>
</div>
```

### CSS Styles
```css
.category-bar {
  position: sticky;
  top: 80px; /* Ajustar según altura del navbar */
  z-index: 40;
  background: white;
  border-bottom: 1px solid #f1f5f9;
  padding-top: 16px;
  padding-bottom: 0;
}

.category-bar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.category-list {
  display: flex;
  gap: 32px;
  overflow-x: auto;
  justify-content: center; /* O flex-start si son muchos */
  scrollbar-width: none; /* Firefox */
}
.category-list::-webkit-scrollbar { display: none; }

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 8px 0;
  cursor: pointer;
  color: #64748b;
  opacity: 0.6;
  transition: all 0.2s;
  flex-shrink: 0;
}

.category-item:hover {
  opacity: 1;
  color: #0f172a;
}

.category-item-active {
  color: #0f172a;
  opacity: 1;
  border-bottom-color: #0f172a;
}

.category-icon { font-size: 24px; }
.category-item span { font-size: 13px; font-weight: 600; white-space: nowrap; }
```

---

## 5. Featured Spaces Grid

Grid responsive de tarjetas.

### HTML Structure
```html
<section class="section-padding bg-white">
  <div class="container-full">
    <div class="spaces-grid">
      
      <!-- Card Item -->
      <div class="space-card group">
        <!-- Image -->
        <div class="space-image-container">
          <img src="..." alt="..." class="space-image">
          <button class="favorite-btn">
            <svg>...</svg> <!-- Heart Icon -->
          </button>
        </div>
        
        <!-- Content -->
        <div class="space-content">
          <div class="space-header">
            <div>
              <h3 class="space-title">Ático de Lujo</h3>
              <p class="space-location">Madrid, Centro</p>
              <p class="space-capacity">Capacidad: 10 pers.</p>
            </div>
            <div class="space-rating">
              <i class="ph-fill ph-star"></i>
              <span>4.9</span>
            </div>
          </div>
          
          <div class="space-price">
            <span class="amount">50€</span>
            <span class="period">/ hora</span>
          </div>
        </div>
      </div>
      
    </div>
    
    <!-- More Button -->
    <div class="spaces-more">
      <button class="btn-more">Mostrar más espacios</button>
    </div>
  </div>
</section>
```

### CSS Styles
```css
.spaces-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px 24px;
  margin-top: 48px;
}
@media (min-width: 640px) { .spaces-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .spaces-grid { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 1536px) { .spaces-grid { grid-template-columns: repeat(5, 1fr); } }

.space-card { cursor: pointer; }

.space-image-container {
  position: relative;
  aspect-ratio: 1 / 1.05;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 12px;
  background: #e2e8f0;
}

.space-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.space-card:hover .space-image { transform: scale(1.05); }

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(8px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s;
  cursor: pointer;
}
.space-card:hover .favorite-btn { opacity: 1; transform: scale(1); }

.space-header { display: flex; justify-content: space-between; align-items: flex-start; }
.space-title { font-weight: 700; color: #0f172a; margin: 0; font-size: 16px; }
.space-location, .space-capacity { color: #64748b; font-size: 14px; margin: 0; }
.space-rating { display: flex; align-items: center; gap: 4px; font-size: 14px; }

.space-price { margin-top: 4px; display: flex; align-items: baseline; gap: 4px; }
.space-price .amount { font-weight: 700; font-size: 18px; color: #0f172a; }
.space-price .period { font-size: 14px; color: #475569; }

.btn-more {
  padding: 16px 32px;
  background: white;
  border: 1px solid #0f172a;
  border-radius: 9999px;
  font-weight: 700;
  color: #0f172a;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-more:hover { background: #f8fafc; }
```

---

## 6. Why Balconazo Section

Sección informativa con tarjetas.

### HTML Structure
```html
<section class="why-balconazo-section">
  <div class="container-full">
    <div class="why-header">
      <h2>¿Por qué Balconazo?</h2>
      <p>La plataforma más segura y sencilla para alquilar espacios</p>
    </div>

    <div class="why-grid">
      <!-- Card 1 -->
      <div class="why-card">
        <div class="why-icon icon-rose">
          <i class="ph-fill ph-lock-key"></i>
        </div>
        <h3>Pago seguro</h3>
        <p>Todas las transacciones están protegidas...</p>
      </div>

      <!-- Card 2 -->
      <div class="why-card">
        <div class="why-icon icon-green">
          <i class="ph-fill ph-check-circle"></i>
        </div>
        <h3>Espacios verificados</h3>
        <p>Todos los espacios pasan por un proceso...</p>
      </div>
      
      <!-- Card 3 -->
      <div class="why-card">
        <div class="why-icon icon-blue">
          <i class="ph-fill ph-headset"></i>
        </div>
        <h3>Soporte 24/7</h3>
        <p>Nuestro equipo está disponible...</p>
      </div>
    </div>
  </div>
</section>
```

### CSS Styles
```css
.why-balconazo-section {
  padding: 80px 24px;
  background: linear-gradient(to bottom, white 0%, #f8fafc 100%);
}

.why-header { text-align: center; margin-bottom: 64px; }
.why-header h2 { font-size: 3rem; font-weight: 800; color: #0f172a; margin-bottom: 16px; }
.why-header p { font-size: 1.25rem; color: #64748b; }

.why-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
}
@media (min-width: 768px) { .why-grid { grid-template-columns: repeat(3, 1fr); } }

.why-card {
  background: white;
  padding: 40px 32px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  text-align: center;
  transition: all 0.3s ease;
}
.why-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
}

.why-icon {
  width: 64px; height: 64px; margin: 0 auto 24px;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  font-size: 32px;
  transition: transform 0.3s;
}
.why-card:hover .why-icon { transform: scale(1.1) rotate(5deg); }

.icon-rose { background: #fef2f2; color: #f43f5e; }
.icon-green { background: #f0fdf4; color: #22c55e; }
.icon-blue { background: #eff6ff; color: #3b82f6; }

.why-card h3 { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
.why-card p { font-size: 15px; color: #64748b; line-height: 1.6; }
```

---

## 7. CTA Section (Host)

Banner final de llamada a la acción.

### HTML Structure
```html
<section class="cta-section">
  <div class="container text-center">
    <h2>¿Tienes un espacio que alquilar?</h2>
    <p>Únete a miles de anfitriones que ya están ganando dinero extra</p>
    <button class="btn-cta">
      Convertirme en Anfitrión
      <svg>...</svg> <!-- Arrow Right -->
    </button>
  </div>
</section>
```

### CSS Styles
```css
.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #e11d48, #f43f5e); /* primary-600 to 500 */
  color: white;
}

.cta-section h2 { font-size: 2.25rem; color: white; margin-bottom: 16px; font-weight: 800; }
.cta-section p { font-size: 1.25rem; color: rgba(255,255,255,0.9); margin-bottom: 32px; max-width: 600px; margin: 0 auto 32px; }

.btn-cta {
  padding: 16px 32px;
  background: white;
  color: #e11d48;
  font-weight: 700;
  font-size: 1.125rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
}
.btn-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
```

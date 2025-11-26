# **FRONTEND_DEVELOPMENT_GUIDE.md**

Guía de desarrollo del frontend – Next.js 15 + React

---

## **Índice**

* [1. Introducción](#1-introducción)

* [2. Inicialización del proyecto](#2-inicialización-del-proyecto)

* [3. Estructura de carpetas](#3-estructura-de-carpetas)

* [4. Configuración básica](#4-configuración-básica)

* [5. Cliente de API](#5-cliente-de-api)

* [6. Autenticación con Keycloak](#6-autenticación-con-keycloak)

* [7. Implementación: páginas y rutas](#7-implementación-páginas-y-rutas)

* [8. Estilos y diseño responsive](#8-estilos-y-diseño-responsive)

* [9. Testing de frontend](#9-testing-de-frontend)

* [10. Comandos habituales](#10-comandos-habituales)

* [11. Troubleshooting](#11-troubleshooting)

---

## **1. Introducción**

El frontend de BalconazoApp está construido con:

* **Next.js 15** (App Router)

* **React**

* TypeScript

* Tailwind CSS (recomendado para estilos)

Consume la API de KrakenD (`http://localhost:8080/api`) y utiliza Keycloak para autenticación OIDC.

---

## **2. Inicialización del proyecto**

Desde la raíz del repo:

```bash
cd frontend

npx create-next-app@latest . \
  --typescript \
  --eslint \
  --tailwind \
  --src-dir \
  --app \
  --import-alias "@/*"
```

Si ya creaste el proyecto con otro comando, asegúrate de:

* Tener `app/` en lugar de `pages/`.

* Usar TypeScript (`.tsx`).

---

## **3. Estructura de carpetas**

Estructura recomendada:

```
frontend/  
├─ app/  
│  ├─ layout.tsx  
│  ├─ page.tsx                 (Home)  
│  ├─ spaces/  
│  │  ├─ page.tsx              (Listado de espacios)  
│  │  └─ [id]/  
│  │      └─ page.tsx          (Detalle espacio)  
│  ├─ account/  
│  │  ├─ spaces/page.tsx       (Gestión mis espacios)  
│  │  └─ bookings/page.tsx     (Mis reservas)  
│  └─ auth/  
│     └─ callback/page.tsx     (Callback OIDC si lo necesitas)  
├─ components/  
│  ├─ Layout.tsx  
│  ├─ Header.tsx  
│  ├─ SpaceCard.tsx  
│  └─ BookingCard.tsx  
├─ lib/  
│  ├─ api.ts  
│  └─ auth/  
│     └─ keycloak.ts  
├─ styles/  
│  ├─ globals.css  
│  └─ ...  
└─ package.json
```

---

## **4. Configuración básica**

### **4.1 Variables de entorno**

En `frontend/.env.local` (puedes reutilizar las `NEXT_PUBLIC_` del `.env` raíz):

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api  
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8081  
NEXT_PUBLIC_KEYCLOAK_REALM=balconazo  
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=balconazo-frontend
```

### **4.2 Configuración Tailwind CSS**

`tailwind.config.js` (generado por create-next-app) debe incluir:

```javascript
module.exports = {  
  content: [  
    "./src/app/**/*.{js,ts,jsx,tsx}",  
    "./src/components/**/*.{js,ts,jsx,tsx}"  
  ],  
  theme: {  
    extend: {}  
  },  
  plugins: []  
}
```

---

## **5. Cliente de API**

Crea `src/lib/api.ts`:

```typescript
// src/lib/api.ts  
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

export async function apiFetch<T>(  
  path: string,  
  options: RequestInit = {},  
  accessToken?: string  
): Promise<T> {  
  const headers: HeadersInit = {  
    "Content-Type": "application/json",  
    ...(options.headers || {})  
  };

  if (accessToken) {  
    headers["Authorization"] = `Bearer ${accessToken}`;  
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {  
    ...options,  
    headers,  
    cache: "no-store"  
  });

  if (!res.ok) {  
    const text = await res.text();  
    throw new Error(`API error ${res.status}: ${text}`);  
  }

  return res.json() as Promise<T>;  
}
```

Ejemplo de uso en un componente servidor:

```typescript
import { apiFetch } from "@/lib/api";

export async function getSpaces() {  
  return apiFetch<SpaceSummary[]>("/spaces");  
}
```

---

## **6. Autenticación con Keycloak**

### **6.1 Instalación de `keycloak-js`**

```bash
npm install keycloak-js
```

### **6.2 Inicializar Keycloak en el cliente**

`src/lib/auth/keycloak.ts`:

```typescript
"use client";

import Keycloak from "keycloak-js";

const keycloak = new Keycloak({  
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,  
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,  
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID  
});

export default keycloak;
```

### **6.3 Provider de autenticación**

`src/components/AuthProvider.tsx`:

```typescript
"use client";

import { ReactNode, useEffect, useState } from "react";  
import keycloak from "@/lib/auth/keycloak";

type AuthContextValue = {  
  initialized: boolean;  
  authenticated: boolean;  
  token?: string;  
};

export const AuthContext = React.createContext<AuthContextValue>({  
  initialized: false,  
  authenticated: false  
});

export function AuthProvider({ children }: { children: ReactNode }) {  
  const [state, setState] = useState<AuthContextValue>({  
    initialized: false,  
    authenticated: false  
  });

  useEffect(() => {  
    keycloak  
      .init({ onLoad: "check-sso", silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html" })  
      .then(authenticated => {  
        setState({  
          initialized: true,  
          authenticated,  
          token: keycloak.token ?? undefined  
        });  
      });  
  }, []);

  return (  
    <AuthContext.Provider value={state}>  
      {children}  
    </AuthContext.Provider>  
  );  
}
```

En `app/layout.tsx`, envuelve tu contenido con `AuthProvider`.

---

## **7. Implementación: páginas y rutas**

### **7.1 Home (`app/page.tsx`)**

* Buscador de espacios (ciudad, fechas).

* Lista de espacios destacados (llamada a `/spaces`).

### **7.2 Listado de espacios (`app/spaces/page.tsx`)**

* Usa el cliente de API para obtener espacios.

* Renderiza tarjetas `SpaceCard`.

### **7.3 Detalle de espacio (`app/spaces/[id]/page.tsx`)**

* Obtiene detalle por `params.id`.

* Permite seleccionar fecha/hora y lanzar acción de reserva.

### **7.4 Panel de usuario (`app/account/...`)**

* `account/spaces`: listado y edición de espacios del anfitrión.

* `account/bookings`: reservas como huésped y anfitrión.

### **7.5 Protección de rutas**

En páginas dentro de `/account`, puedes usar el `AuthContext` para redirigir si no está autenticado:

```typescript
"use client";

import { useContext, useEffect } from "react";  
import { AuthContext } from "@/components/AuthProvider";  
import { useRouter } from "next/navigation";

export default function MySpacesPage() {  
  const { initialized, authenticated } = useContext(AuthContext);  
  const router = useRouter();

  useEffect(() => {  
    if (initialized && !authenticated) {  
      router.push("/login"); // o redireccionar a Keycloak  
    }  
  }, [initialized, authenticated, router]);

  if (!initialized) return <p>Cargando...</p>;

  // contenido protegido...  
}
```

---

## **8. Estilos y diseño responsive**

* Usa Tailwind para crear un diseño limpio y responsive.

* Define componentes genéricos (botones, cards, layouts).

Ejemplo de `SpaceCard`:

```typescript
import Link from "next/link";

type Props = {  
  id: string;  
  title: string;  
  city: string;  
  pricePerHour: number;  
  imageUrl?: string;  
};

export function SpaceCard({ id, title, city, pricePerHour, imageUrl }: Props) {  
  return (  
    <Link href={`/spaces/${id}`} className="block rounded-lg shadow hover:shadow-lg transition">  
      <div className="h-48 bg-gray-200 rounded-t-lg overflow-hidden">  
        {imageUrl && <img src={imageUrl} alt={title} className="w-full h-full object-cover" />}  
      </div>  
      <div className="p-4">  
        <h3 className="font-semibold text-lg">{title}</h3>  
        <p className="text-sm text-gray-500">{city}</p>  
        <p className="mt-2 font-bold">{pricePerHour} €/hora</p>  
      </div>  
    </Link>  
  );  
}
```

---

## **9. Testing de frontend**

Instala herramientas de test:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest
```

Ejemplo de test de un componente:

```typescript
// src/components/__tests__/SpaceCard.test.tsx  
import { render, screen } from "@testing-library/react";  
import { SpaceCard } from "../SpaceCard";

test("renderiza título y precio", () => {  
  render(<SpaceCard id="1" title="Terraza centro" city="Madrid" pricePerHour={25} />);  
  expect(screen.getByText("Terraza centro")).toBeInTheDocument();  
  expect(screen.getByText("25 €/hora")).toBeInTheDocument();  
});
```

Configura Jest según documentación de Next.js (puedes basarte en `next/jest` para simplificar).

---

## **10. Comandos habituales**

**Levantar servidor de desarrollo**

```bash
npm run dev
```

**Build de producción**

```bash
npm run build  
npm start
```

**Lint**

```bash
npm run lint
```

**Tests**

```bash
npm test
```

---

## **11. Troubleshooting**

**Problema:** `TypeError: fetch failed` al llamar a la API

* **Causa:** `NEXT_PUBLIC_API_BASE_URL` incorrecta o KrakenD caído.

* **Solución:**

  * Asegúrate de que el gateway responde en `http://localhost:8080`.

  * Revisa la variable en `.env.local` y reinicia `npm run dev`.

---

**Problema:** Bucle de redirecciones al usar Keycloak

* **Causa:** configuración incorrecta de redirect URI en Keycloak.

* **Solución:**

  * Asegúrate de tener `http://localhost:3000/*` en **Valid redirect URIs**.

---

**Problema:** Error de hidratación en componentes con `keycloak-js`

* **Causa:** uso de APIs de `window` en componentes de servidor.

* **Solución:**

  * Marca los componentes que usan Keycloak con `"use client"` en la primera línea.

# OROMAXI Frontend

Frontend de la plataforma OROMAXI - Marketplace de oro, relojería y joyas de valor.

## 🛠️ Tecnologías

- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **TypeScript** - Type safety

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Crear archivo .env.local si no existe
cp .env.local.example .env.local
```

## 🚀 Desarrollo

```bash
# Correr servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Estructura

```
frontend/
├── app/                    # App router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── auth/              # Auth components
├── lib/                   # Utilities & stores
│   ├── api.js             # API client
│   └── authStore.js       # Auth state (Zustand)
├── public/                # Static files
├── styles/                # CSS files
└── package.json          # Dependencies
```

## 🔌 API Connection

El frontend está configurado para conectar al backend en `http://localhost:3001/api`.

Modificar en `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🔐 Variables de Entorno

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=OROMAXI
```

## 📝 Próximos Pasos

- [ ] Crear página de signup `/app/(auth)/signup/page.tsx`
- [ ] Crear página de login `/app/(auth)/login/page.tsx`
- [ ] Crear dashboard del vendedor
- [ ] Crear página de marketplace
- [ ] Integrar Cloudinary para imágenes
- [ ] Integrar Stripe para pagos
- [ ] Deploy a Vercel

## 📄 Licencia

© 2024 OROMAXI. Todos los derechos reservados.

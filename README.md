# TaskFlow - Project & Task Management SaaS

A modern, professional React frontend for managing projects and tasks built with clean architecture principles.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **React Hook Form + Zod** - Form handling & validation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Structure

```
src/
├── app/                    # App shell (router, providers)
├── features/               # Feature-based modules
│   ├── auth/              # Authentication feature
│   ├── dashboard/         # Dashboard feature
│   ├── projects/          # Projects CRUD
│   ├── tasks/             # Tasks CRUD
│   └── settings/          # User settings
├── shared/                 # Shared code
│   ├── components/        # Reusable components
│   │   ├── ui/           # Base UI components
│   │   ├── layout/       # Layout components
│   │   └── feedback/     # Loading, error, empty states
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── constants/        # App constants
│   └── types/            # TypeScript types
├── services/              # API services
└── styles/                # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=TaskFlow
```

## Deployment (production)

The app is a **Vite SPA** with **client-side routing**; `vercel.json`, `netlify.toml`, and `public/_redirects` send unknown paths to `index.html`.

### Environment variables (hosting dashboard)

Set at build time (Vite inlines `VITE_*`):

| Variable | Example |
|----------|---------|
| `VITE_API_BASE_URL` | `https://your-api.onrender.com/api` |
| `VITE_APP_NAME` | `TaskFlow` |

### Vercel

1. **Add New Project** → import the Git repo (root = this folder, or set **Root Directory** to `Gestion_tache` in a monorepo).
2. **Framework Preset**: Vite.
3. **Build Command**: `npm run build` (default).
4. **Output Directory**: `dist`.
5. **Environment Variables**: add `VITE_API_BASE_URL` and `VITE_APP_NAME`, then redeploy.

### Netlify

1. **Add new site** → import repo; Netlify reads `netlify.toml` if present.
2. Same env vars as above in **Site configuration → Environment variables**.

### Backend CORS

Add your frontend origin to the API `CORS_ORIGIN` (comma-separated), e.g. `https://your-app.vercel.app`.

## Features

### Authentication
- Login / Register pages
- JWT-based authentication
- Protected routes
- Persistent auth state

### Projects
- Create, read, update, delete projects
- Project progress tracking
- Color-coded projects

### Tasks
- CRUD operations for tasks
- Status management (todo, in-progress, done)
- Priority levels (low, medium, high)
- Filter tasks by status
- Due date tracking

### UI/UX
- Responsive design
- Dashboard with sidebar navigation
- Loading states and skeletons
- Error handling with retry
- Empty states
- Accessible components

## Architecture

This project follows **Clean Architecture** principles:

- **Separation of Concerns**: UI, business logic, and data access are separated
- **Feature-based Structure**: Each feature is self-contained with its own components, hooks, stores, and API services
- **Typed API Responses**: All API calls return typed data
- **No Hardcoded Values**: Constants and configuration are centralized
- **Reusable Components**: Presentational components are abstracted for reuse

## Code Quality

- ESLint + Prettier for code formatting
- TypeScript strict mode
- Custom hooks for data fetching
- Zustand for global state only
- Consistent naming conventions

## API Endpoints (Expected Backend)

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id

GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/projects/:id/tasks
```

## License

MIT


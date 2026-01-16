# SGEE Frontend - React.js

## Installation

```bash
cd frontend
npm install
```

## Configuration

Copier `.env.example` vers `.env` et configurer l'URL de l'API :

```bash
cp .env.example .env
```

## Développement

```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000

## Build Production

```bash
npm run build
```

## Structure

```
src/
├── layouts/          # Layouts (Auth, Dashboard)
├── pages/            # Pages par rôle
│   ├── auth/         # Login, Register
│   ├── student/      # Espace étudiant
│   └── admin/        # Espace administration
├── services/         # Services API
├── store/            # Zustand store
└── App.jsx           # Routes principales
```

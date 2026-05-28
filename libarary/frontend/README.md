# Library Frontend

This frontend uses `Vite + React + React Router + Axios`.

## Quick start

```bash
cd frontend
npm install --cache .npm-cache
copy .env.example .env
npm run dev
```

The default dev server runs at `http://localhost:3000`.

## Environment variables

- `VITE_API_BASE_URL`: backend API origin, default `http://localhost:5000`
- `VITE_ENABLE_DEBUG`: enable extra client-side debug logs

## Project structure

- `src/components`: shared UI and route guard components
- `src/config`: environment and app-level configuration
- `src/constants`: route and storage key constants
- `src/context`: global React context
- `src/hooks`: reusable hooks
- `src/pages`: route-level pages
- `src/services`: HTTP client and API services
- `src/styles`: global style tokens and shared styles
- `src/utils`: browser storage and helper utilities

## Commands

- `npm run dev`: start local development server
- `npm run dev:host`: expose dev server to local network
- `npm run build`: create production build
- `npm run preview`: preview the production build
- `npm run check`: run a build-only sanity check

## Team conventions

See [docs/frontend-code-style.md](./docs/frontend-code-style.md) for the FE-01 code conventions and collaboration notes.

# Frontend Code Style

This document records the FE-01 baseline conventions for the frontend project.

## Branch and commit rules

- Branch format: `feat/fe-xx-short-name`
- Commit format: `[FE-XX] type: summary`
- Allowed types: `feat`, `fix`, `refactor`, `docs`, `test`

## Directory rules

- Put route-level pages in `src/pages`
- Put shared visual building blocks in `src/components`
- Put API access in `src/services`
- Put app config in `src/config`
- Put reusable constants in `src/constants`
- Put browser-side helpers in `src/utils`
- Put reusable hooks in `src/hooks`
- Put shared styles in `src/styles`

## Naming rules

- React components: `PascalCase`
- Hooks: `camelCase` with `use` prefix
- Utility functions: `camelCase`
- CSS modules: match the component or page name

## Router and auth rules

- Keep route paths centralized in `src/constants/routes.js`
- Use `ProtectedRoute` for authenticated pages
- Store auth token through `tokenManager`
- Keep backend base URL in `.env`

## HTTP rules

- Use the shared Axios instance from `src/services/http.js`
- Let the interceptor attach the bearer token
- Normalize timeout and network failures before showing them in UI

## Review checklist

- Directory placement follows the project structure
- New API calls go through the shared HTTP client
- New protected pages are wrapped by the route guard
- New environment variables are documented in `.env.example`
- Build passes with `npm run build`

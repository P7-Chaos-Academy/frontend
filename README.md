# Strato Frontend

A Next.js application powered by Material UI that talks to the `strato-api` backend and presents a left-nav dashboard for distributed clusters.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Provide environment variables by copying the template:

   ```bash
   cp .env.local.example .env.local
   ```

   Adjust `NEXT_PUBLIC_API_BASE_URL` if your backend is reachable on another host or port.

3. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

4. Sign in through the placeholder login flow at [http://localhost:3000/login](http://localhost:3000/login). Any email/password combination will work for now; the form simply seeds local storage until the real authentication endpoints are available.

## Project structure

- `app/` – App Router entry points and grouped layouts (e.g., `(auth)` for login, `(dashboard)` for the shell with navigation)
- `components/` – Reusable React components, including the dashboard shell and auth provider (client-side)
- `lib/api/` – Light-weight API client utilities for communicating with `strato-api`
- `public/` – Static assets

## Dashboard overview

- **Overview** – Health check status plus a quick look at `/api/test` entities to confirm connectivity.
- **Clusters** – Placeholder copy outlining the planned distributed cluster management views.
- **Tests** – Dedicated table listing `/api/test` records once the backend provides data.

## Authentication scaffold

The `AuthProvider` supplies a minimal client-side session using `localStorage`. Replace the stub in `components/AuthProvider.tsx` with real calls to your future auth endpoints. Once wired up, the existing redirect logic in the dashboard pages will guide unauthenticated users back to `/login`.

## API integration

The API base URL defaults to `http://localhost:5000/api` (matching the `strato-api` launch profile). Update the `.env.local` file to target another environment if needed. The overview page surfaces the health check and a simple table of `/api/test` records to validate connectivity.

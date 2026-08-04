# Sports Store Frontend

React storefront for browsing products, managing a cart, checking out, and viewing orders. It is the human-facing part of Sports Store.

## How it fits

The browser loads this single-page application through the [gateway](https://github.com/Deploy-On-Friday2-0/sports-store-gateway). `src/api.js` sends same-origin requests under `/api`; the gateway routes them to the backend services. Keeping one browser origin avoids hard-coded backend addresses and cross-origin configuration.

## Features and routes

- Product home, list, and detail pages: `/`, `/products`, `/products/:slug`.
- Registration and login: `/register`, `/login`.
- Protected cart, checkout, and order pages: `/cart`, `/checkout`, `/orders`.
- Client-side token/session handling, product-image fallbacks, search-engine metadata, loading, and not-found views.

## Technology and structure

- React 18, React Router 6, Vite 5, Vitest, ESLint, and NGINX.
- `src/pages/`: route-level screens. `src/components/`: reusable UI.
- `src/api.js`, `src/auth.jsx`, `src/cart.jsx`: API, authentication, and cart state.
- `public/`: static metadata. `tests/`: Vitest and workflow tests.
- `nginx.conf` serves the production build and `/health`; `review_runner/` has [its own README](review_runner/README.md).

## Local development

Prerequisites: Node.js 18 or 20 and npm (the publishing workflow uses 18 and CI uses 20). For working API calls, also run the platform gateway on `localhost:8080`; Vite proxies `/api` there as configured in `vite.config.js`. The simpler full-system option is [sports-store-local](https://github.com/Deploy-On-Friday2-0/sports-store-local).

```bash
npm ci              # Install the exact package-lock versions
npm run dev          # Start Vite's development server
```

Vite prints the browser URL, normally `http://localhost:5173`.

## Build and validation

```bash
npm run lint
npm test
npm run build        # Write optimized assets to dist/
npm run preview      # Preview dist/ locally
docker build -t sports-store-frontend:local .
docker run --rm -p 8081:80 sports-store-frontend:local
```

The running container reports health at `http://localhost:8081/health`.

## Configuration and deployment

The application intentionally uses relative `/api` URLs and has no runtime application environment variables. `.env.example` contains only optional `OPENROUTER_*` values used by pull-request automation.

`Frontend PR Quality and Security` runs ESLint, Vitest, dependency validation, Gitleaks, Checkov, and Trivy. On changes to `main`, `Publish Production Frontend` builds `dist/`, synchronizes it to the configured S3 bucket, and invalidates the CloudFront cache. Those AWS resources are declared in [sports-store-infrastructure](https://github.com/Deploy-On-Friday2-0/sports-store-infrastructure). The Helm chart also defines a frontend container, but the verified frontend publishing workflow deploys the S3/CloudFront build and does not publish that container or change [sports-store-deployments](https://github.com/Deploy-On-Friday2-0/sports-store-deployments).

## Troubleshooting and security

- API `404` or proxy errors usually mean the gateway is not running at the Vite proxy target.
- A blank production route after refresh usually means SPA fallback routing is missing; this repository's NGINX configuration supplies it.
- Do not place secrets in `VITE_*` variables: Vite embeds client variables into downloadable JavaScript.
- Authentication tokens are browser-visible by design; backend authorization remains mandatory. Follow [CONTRIBUTING.md](CONTRIBUTING.md).

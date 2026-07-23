# Sports Store Frontend

React and Vite storefront for the Sports Store platform. This repository owns the browser UI and communicates with backend APIs through the gateway at `/api`.

## Stack

- React 18
- React Router
- Vite 5
- npm

## Development

```bash
npm ci
npm run dev
```

The development server proxies `/api` requests to `http://localhost:8080`.

## Build

```bash
npm run build
```

Production assets are generated in `dist/`.

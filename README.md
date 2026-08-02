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

## PR Diff Review Runner

The provider-independent pipeline and trusted post-CI GitHub Actions integration are documented in [`review_runner/README.md`](review_runner/README.md). Local use accepts a supplied unified patch and uses the mock provider; the trusted reusable workflow retrieves pull request diffs as data and invokes OpenRouter only after deterministic CI succeeds.

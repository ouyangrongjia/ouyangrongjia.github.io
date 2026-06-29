# ouyangrongjia.github.io

AstroPaper-based personal blog source for `https://ouyangrongjia.github.io/`.

## Local Commands

```powershell
npm install
npm run dev
npm run build
```

## Deployment

GitHub Pages deployment is configured in `.github/workflows/ci.yml`.

The workflow runs on pushes to `main` and publishes `dist/` using GitHub Pages Actions. Do not overwrite the remote `main` branch until the legacy static site backup has been confirmed.
# Render Mode Reference

The Cloudflare Worker injects globals into the page, then Browserless renders it headlessly for PDF generation.

## Injected globals

```js
window.__RENDER_MODE__ = true
window.__CARD_DATA__ = { /* FormData object */ }
```

## main.tsx gate

```tsx
if (window.__RENDER_MODE__) {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <CardRenderView data={window.__CARD_DATA__} />
  )
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
  )
}
```

## CardRenderView rules

- Renders only the card at full A4 size (794×1123px)
- No watermark
- No padding, no UI chrome
- No header, no editor
- Must be self-contained (no external data fetching)

## Global type declarations (types/index.ts)

```ts
declare global {
  interface Window {
    __RENDER_MODE__?: boolean
    __CARD_DATA__?: FormData
  }
}
```

## How it's triggered

Worker endpoint `POST /generate-pdf` receives `{ cardData, lang, code }`, fetches the live GitHub Pages `index.html`, injects the globals, and passes the page to Browserless for rendering.

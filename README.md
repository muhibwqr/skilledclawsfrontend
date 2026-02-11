# skilledclaws frontend

Teach your Claude bot anything · veteran .skills · drop into clawdbot.

Standalone React (Vite) UI that can connect to the [SkilledClaws](https://github.com/muhibwqr/skilledclaws) API for skill generation and search.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

## Backend / API context

This app is designed to work with the **SkilledClaws monorepo** ([muhibwqr/skilledclaws](https://github.com/muhibwqr/skilledclaws)):

- **API** runs at `http://localhost:3001` (Hono). In dev, Vite proxies `/api` to that host so you can use `fetch('/api/...')` without CORS.
- **Endpoints:** `POST /api/generate` (body: `{ skillName }`) for generating skills from one word; `POST /api/similarity/search` for skill search. See **[docs/BACKEND_CONTEXT.md](docs/BACKEND_CONTEXT.md)** for full API summary, MVP flow, and CORS notes.

Optional env (create `.env` if needed):

- `VITE_API_URL` — API base URL. Leave unset in dev to use the proxy; set to your hosted API root (e.g. `https://your-api.example.com`) when the backend is not on localhost. The diagram calls `POST /api/generate` with the prompt word.

## Build

```bash
npm run build
npm run preview
```

## Layout

- **Landing:** "What do you want to teach your clawdbot?" + one word input + pills (Day trading, Technical analysis, etc.); Enter → diagram page.
- **Diagram:** Input word → Skills (mesh) → Continue (react-diagrams); can be wired to `POST /api/generate` and show `subSkills` as nodes.
- **Dock:** Bottom nav (Home, Diagram, Generate, About). Dark theme (#1f1f1f), Inter font.
- **Generate page:** One word, prompt, skills list (add/remove), final skills + "Generate skill pack" (ready to call API).

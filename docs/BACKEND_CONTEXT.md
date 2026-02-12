# Backend context (SkilledClaws monorepo)

This frontend is designed to work with the **SkilledClaws** backend from the [muhibwqr/skilledclaws](https://github.com/muhibwqr/skilledclaws) monorepo. That repo provides the API, skills engine, and (optionally) the Next.js web app with map-based discovery.

## Monorepo overview

- **Repo:** https://github.com/muhibwqr/skilledclaws  
- **Stack:** pnpm + Turborepo, Next.js 14 (apps/web), Hono API (apps/api), shared `@skilledclaws/skills-engine`, `@skilledclaws/ui`, Stripe, Mastra agents, Cloudflare R2.
- **Web app:** `http://localhost:3000` (Next.js, Mapbox heatmap, search, checkout).  
- **API:** `http://localhost:3001` (Hono).

## MVP flow (from backend README)

1. **Search:** User enters up to 5 words → rate-limited search → Mastra agent returns trends + locations → map heatmap and trend cards update.
2. **Checkout:** User clicks “Generate for $3” → Stripe Checkout → success redirect to `/success?session_id=...`.
3. **Webhook:** Stripe `checkout.session.completed` → synthesis agent builds skill content → ZIP via `@skilledclaws/skills-engine` → upload to R2 → presigned URL stored.
4. **Download:** Success page polls `GET /api/generate/download?session_id=...` → user gets download link when ready.

## API endpoints relevant to this frontend

Base URL: `http://localhost:3001` (or set `VITE_API_URL`).

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/api/generate` | Generate skill from a single name. Body: `{ "skillName": "string" }`. Returns `{ success, mainSkill: { name, description, ... }, subSkills: [{ id, name, ... }], skillIds }`. Use the landing “one word” or diagram input as `skillName`. |
| `GET` | `/api/skills` | List skills. Query: `limit`, `offset`, `source`. Response: `{ skills: [...], total? }`. |
| `GET` | `/api/skills/:id/download` | Download skill file as `.md`. |
| `POST` | `/api/similarity/search` | Search skills by text. Body: `{ "query": "string", "limit"?: number, "source"?: "generated" \| "awesome-claude-skills" }`. Returns `{ query, results: [{ id, name, description, source, similarity }] }`. For future search/autocomplete. |
| `GET` | `/api/similarity/:skillId` | Get skills similar to a given skill ID. Query: `limit`, `source`. For future "related skills". |
| `GET` | `/` | Health: `{ name: "skilledclaws-api", status: "ok" }`. |

Other routes in the monorepo: `registerSkills`, `registerExport`, Stripe webhooks, etc. See `apps/api/src/index.ts` and `apps/api/src/routes/`.

## CORS

The API is configured for `http://localhost:3000` and `http://127.0.0.1:3000`. If this Vite app runs on **port 5173**, either:

- Run the API with CORS updated to allow `http://localhost:5173`, or  
- Use a dev proxy in `vite.config.js` that forwards `/api` to `http://localhost:3001`.

## Environment (backend)

Backend expects (see monorepo README):

- **API:** `OPENAI_API_KEY`, `STRIPE_*`, `CLOUDFLARE_R2_*`, optional `UPSTASH_REDIS_*`, optional `ANTHROPIC_API_KEY`.
- **Web (Next.js):** `NEXT_PUBLIC_MAPBOX_TOKEN`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

This frontend only needs the API base URL (e.g. `VITE_API_URL=http://localhost:3001`) to call the endpoints above.

## How this frontend maps to the backend

| This app (Vite) | Backend / monorepo |
|-----------------|--------------------|
| Landing: “What do you want to teach your clawdbot?” + one word + Enter | Use that word as `skillName` in `POST /api/generate`. |
| Diagram: Input word → Skills (B–F) → Continue | After calling `/api/generate`, use `mainSkill` + `subSkills` to label or drive diagram nodes (e.g. show sub-skills as the “skills from knowledge” nodes). |
| “Generate skill pack” / final step | Could trigger `POST /api/generate` with selected skill name, then show download or link to Stripe checkout when you add payments. |
| Skill library / browse | Use `POST /api/similarity/search` with a query or list from the API. |

Use this doc as the single source of context when wiring the Vite UI to the [SkilledClaws](https://github.com/muhibwqr/skilledclaws) API.

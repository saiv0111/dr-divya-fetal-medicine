# Dr. Divya · Fetal Medicine

Marketing site for a consultant-led fetal medicine and women's healthcare practice.
Two pages — a long-form animated homepage and a journal — backed by a small
Express API for enquiries and article content.

---

## Stack

| Layer     | Choice                                                    |
| --------- | --------------------------------------------------------- |
| Build     | Vite 6, TypeScript 5.7 (strict), npm workspaces             |
| UI        | React 18, Tailwind CSS v4, Framer Motion 11, Lenis          |
| Forms     | React Hook Form + Zod (schemas shared with the server)      |
| Routing   | React Router 6                                              |
| API       | Node 20+, Express 4, TypeScript, Helmet, rate limiting      |

### Why Tailwind instead of MUI

The original brief specified MUI. This build uses Tailwind CSS v4 instead, for
three reasons:

1. **Design fit.** This is a bespoke editorial layout — arch masks, scroll-pinned
   horizontal tracks, per-word mask reveals. Material Design's component
   opinions fight that, and the work becomes `sx` override archaeology.
2. **Performance.** MUI + Emotion adds roughly 90–150 kB gzip and runtime
   CSS-in-JS to a page whose entire interactive surface is one form, one
   accordion and one drawer. The whole app currently ships **~152 kB gzip of JS
   and 11 kB of CSS**.
3. **No capability lost.** React Hook Form, Zod, Express and TypeScript are all
   used exactly as specified.

If MUI is a hard organisational requirement, the section components are the only
files that would change — `src/data/site.ts`, `src/lib/`, and the whole server
are presentation-agnostic.

---

## Getting started

```bash
npm install
cp .env.example .env     # optional; sensible defaults are baked in
npm run dev
```

- Client → http://localhost:5173 (Vite proxies `/api` to the server)
- API → http://localhost:4000

| Script             | Does                                                   |
| ------------------ | ------------------------------------------------------ |
| `npm run dev`      | Builds `shared`, then runs API + client concurrently    |
| `npm run build`    | Builds all three workspaces                             |
| `npm start`        | Serves the built client **and** API from Express        |
| `npm run typecheck`| Strict typecheck across all workspaces                  |

In production `npm start` serves `client/dist` from the Express process with an
SPA fallback, so there is a single port to deploy.

---

## Layout

```
shared/    Zod schemas + types imported by BOTH client and server
client/    Vite + React app
  src/data/site.ts        ← every word of marketing copy lives here
  src/components/sections ← the 11 homepage sections, one file each
  src/components/ui       ← animation + form primitives
  src/lib/motion.ts       ← shared easing, variants, viewport config
server/    Express API
  src/routes/             ← posts (read), enquiries (write)
  src/data/posts.ts       ← article content; swap for a CMS read
  src/services/notifier.ts← single seam for email/CRM delivery
```

`shared/` is the contract: the same `appointmentRequestSchema` validates in the
browser (via `@hookform/resolvers/zod`) and again on the server. Field errors
returned by the API map straight onto React Hook Form's `setError`, so a schema
change can never leave the two sides disagreeing.

The client resolves `@drdivya/shared` from **source** via a Vite alias (instant
HMR); the server resolves it from `shared/dist`. Editing a schema during
`npm run dev` therefore needs `npm run build -w shared` for the server to pick
it up — the client updates immediately.

---

## Page structure

Homepage sections, in render order (`client/src/pages/Home.tsx`):

1. **Hero** — parallax arch portrait, word-mask headline, magnetic CTAs
   _(followed by a thin credential ticker, which is part of the hero block)_
2. **About the doctor** — sticky identity card, scroll-linked word highlight
3. **Certifications / credibility** — 6-cell numbered grid, ink wipe on hover
4. **Stats** — count-up on scroll, drifting gradient
5. **Services** — hover-expanding list with a cursor-following chip
6. **Baby's journey** — a 340vh scroll-pinned ultrasound stage: an embryo that
    morphs and grows as you scrub, with clickable week pills ⚠️ _placeholder copy_
7. **Testimonials** — auto-rotating feature + two counter-scrolling marquees
8. **Location** — details + click-to-load Google Map
9. **CTA** — parallax orb and ultrasound rings
10. **FAQs** — animated accordion with a sticky contact card
11. **Footer** — newsletter form, oversized wordmark

`/blog` lists articles and opens them in a deep-linkable reader overlay at
`?post=<slug>`, keeping the site to the two pages specified in the brief.

---

## Before launch — placeholders to replace

Everything below is invented stand-in content.

**`client/src/data/site.ts`**
- `doctor` — full name, credentials, medical council registration number
- `practice` — phone, email, street address, opening hours, social URLs
- `practice.mapsEmbedUrl` — from Google Maps → Share → Embed a map
  (or set `VITE_GOOGLE_MAPS_EMBED_URL`)
- `stats`, `about.facts` — every figure is fabricated; a healthcare site must
  not publish unverifiable outcome claims
- `testimonials` — real, consented quotes only
- **`journey.stages`** — flagged in the file; awaiting the client's final copy
- `certifications` — confirm each accreditation actually holds

**Assets**
- `client/public/pregnant-lady.png` — the supplied photo has a black studio
  backdrop, so the hero frames it in a dark ink arch and the backdrop blends in.
  Swapping in a light-background or cut-out image means changing
  `bg-ink-950` → a light tone and removing the two feather gradients in
  `Hero.tsx`.
- The About section shows a **monogram placeholder** where a portrait of the
  doctor should go.

**`client/index.html`** — canonical URL, Open Graph image, and the
`MedicalClinic` JSON-LD block all carry placeholder values.

---

## Backend notes

`POST /api/appointments`, `/api/contact` and `/api/newsletter` are validated,
rate limited (8 writes / 15 min / IP) and honeypot-protected. They currently
**log a redacted line and return success** — nothing is emailed or stored.

To go live, implement the transport in `server/src/services/notifier.ts` and set
`SMTP_URL`. That file deliberately throws if `SMTP_URL` is set but no transport
exists, so a half-finished integration fails loudly rather than silently
dropping a patient's appointment request.

Patient-identifiable fields (`email`, `phone`, `message`, `weeksPregnant`) are
redacted before logging. Before handling real patient data, confirm your
obligations under the applicable privacy regime (DPDP Act / GDPR) — at minimum
you will need persistence with a retention policy, a real privacy notice behind
the footer link, and a data processing agreement with your mail provider.

---

## Accessibility & motion

- Every animation is gated on `prefers-reduced-motion`: Lenis does not mount,
  Framer entrances collapse to static, marquees stop, and the scroll-pinned
  journey section falls back to a swipeable carousel.
- Skip link, visible focus rings, labelled form controls with `aria-invalid` and
  `aria-describedby`, `aria-expanded`/`aria-controls` on the accordion, and
  `role="dialog"` + Escape handling on the drawer and reader.
- Count-up numbers expose the final value to screen readers immediately rather
  than announcing the animation.

Not yet done: a full screen-reader pass and axe/Lighthouse audit on the built
output.

---

## The Baby's Journey section

Modelled on the scroll-scrub pattern from priyankafetaldr.com: a 340vh tunnel
whose sticky inner pane pins for the duration, mapping scroll progress onto six
milestones (weeks 8, 12, 20, 28, 36, 40). Week pills scroll the page to the
matching point rather than setting state directly, so the pills and the scrub
can never disagree.

Where it differs: the embryo is the supplied `embryo.svg` artwork — an
Illustrator 3x3 grid of nine gestational stages. The **first six** are used, one
per milestone. Extraction strips each cell's amniotic sac, keeps the body and
line art, recolours them to the site palette and normalises all six to a common
height centred in the scan disc; the result is the generated `embryoStages.ts`.

There is no crossfade. Because every drawing is normalised to the same height,
the only thing that animates is a single continuous scale on a wrapper group —
the same growth the reference does with its one blob. A drawing is swapped in at
the milestone it belongs to, at the point where the scale already matches its
natural size, so the silhouette grows smoothly and only the interior detail
advances. Measured across the scroll the rendered height climbs 68px to 225px
with no discontinuity at any swap.

The growth ramp blends the artwork's own proportions 30/70 toward an even ramp:
left raw, cell 3 barely grows while cell 5 jumps 36%, which makes the scroll
feel like it stalls and then lurches.

Geometry is written straight to the DOM from the scroll handler; only the
active week index lives in React state. Below 1024px, or with reduced motion,
the pin is dropped and the pills tween between stages instead.

---

## Follow-ups not done

- ESLint/Prettier are not configured yet (no `lint` script). `npm run typecheck`
  covers types only.
- No automated tests. The API was smoke-tested by hand; the UI was verified
  section-by-section in headless Chrome.
- No sitemap.xml (robots.txt references one).

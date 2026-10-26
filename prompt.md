# FarmScale: Frontend Build Prompt

Paste this whole file into your AI coding agent (Gemini, Claude Code, Cursor, etc.) at the start of the frontend work.

---

## 0. Role and first step

You are a senior frontend engineer. Build the **public FarmScale web app** (`apps/web`).

**Before writing any code:**
1. Read `AGENTS.md`, `docs/DESIGN-RULES.md`, `docs/DESIGN.md`, `docs/FarmScale-User-Flows.md` and `docs/FarmScale-Project-Context-and-Dev-Plan.md` in the repo. They are the rules. If this prompt conflicts with them, stop and ask.
2. Look at the design export in `design/stitch_farmscale_crop_rotation_app/` (screen PNGs and `code.html`). Use it as **visual reference only**. Do not copy its invented numbers, claims, CDN scripts or hotlinked images.
3. Reply with: your understanding in 5 lines, a file and folder plan, the dependency list you intend to install, and any questions. **Wait for approval before coding.**

Out of scope: the admin console (`apps/admin`), the backend gateway, any AI feature. The only AI-related UI is a disabled "Coming soon" slot.

---

## 1. What you are building

A mobile-first web app where a user picks a location, sees what the climate is doing there, sets three priorities (Save water, Earn income, Rebuild soil), and gets the **top 3 ranked crop rotations**, each with a plain-language "Why this rotation" and the data behind it.

Pilot region: Rajshahi, Bangladesh. Languages: English, Bangla, Japanese.

### Screens (routes under `/[locale]/`)

| Route | Screen |
|---|---|
| `/` | Landing |
| `/explore` | Location Explorer (map, search, summary sheet) |
| `/dashboard` | Climate and Soil Dashboard (Simple and Expert views) |
| `/plan` | Rotation Planner |
| `/crops` and `/crops/[id]` | Crop Library and detail |
| `/gateway` | Public Data Gateway page (static docs: endpoints, examples) |
| `/more` | Settings, language, about and data limits |

Navigation: bottom tab bar on mobile (Home, Explore, Plan, Crops, More). Top navigation from about 900 px. Selected location and priorities are kept across screens and across language changes (URL search params plus a small client store).

---

## 2. Tech stack (approved)

- **Next.js** (App Router) with **TypeScript strict**
- **Tailwind CSS**, configured from design tokens
- **next-intl** for i18n (`en`, `bn`, `ja`)
- **TanStack Query** for data fetching and caching
- **Zod** for runtime validation of API responses
- **Zustand** (or React context) for small client state
- **MapLibre GL JS** for the map, **lazy loaded**
- **Charts:** small custom SVG components, or one lightweight library after asking me
- **Testing:** Vitest + React Testing Library, Playwright for key flows, `@axe-core/playwright` for accessibility
- **Lint and format:** ESLint, Prettier

**Ask before adding anything else.** Keep the bundle light for low-bandwidth users. No UI kit that ships heavy runtime CSS. No CDN scripts. All fonts, icons and images local.

---

## 3. Project structure

```
apps/web/
  src/
    app/[locale]/(routes)/...       route files
    components/
      ui/                           buttons, tags, tooltip, sheet, skeleton, tabs
      data/                         DataCard, DataStateTag, SourceLabel, ChartTable
      planner/                      PrioritySliders, RotationCard, SeasonTimeline
      season/                       RotationRing, SeasonSelector
      layout/                       Header, BottomTabBar, LanguageSwitcher, ContextBar
    lib/
      api/                          client, schemas (zod), endpoints, mock adapter
      scoring/                      thin wrapper that imports packages/scoring
      i18n/                         config, helpers
      format/                       date, number, unit formatters per locale
    messages/                       en.json, bn.json, ja.json
    styles/                         tokens.css, globals.css
  tests/                            unit, e2e, a11y
packages/ui-tokens/                 tokens.css and tailwind preset (from DESIGN-RULES.md)
```

---

## 4. Design tokens first

Build `packages/ui-tokens` before any screen: colors (light and dark), semantic roles, type scale, spacing (8 px scale), radius, elevation, focus ring, and script-specific line heights. Values come from `DESIGN-RULES.md`. Include the accessible text variants (`water-text` `#256B8F`, `gold-text` `#7A5900`). **Never hardcode colors or fonts in components.**

Fonts: Source Serif 4, Noto Sans, Noto Sans Bengali, Noto Sans JP, JetBrains Mono (numbers only). Self-host as subsets with `font-display: swap` and fallback stacks. Load Bangla and Japanese fonts only on those locales.

---

## 5. Data layer (important)

The real gateway endpoints are not final. **Do not invent them as fact.** Build against an interface and a swappable adapter:

```ts
interface FarmScaleApi {
  searchLocations(q: string): Promise<Result<Location[]>>;
  getClimate(loc: LatLon): Promise<Result<ClimateSummary>>;
  getSoil(loc: LatLon): Promise<Result<SoilSummary>>;
  listCrops(): Promise<Result<Crop[]>>;
  rankRotations(input: RankInput): Promise<Result<RankedRotation[]>>;
}
```

- `Result<T>` is a discriminated union: `{ state: "live", data, source, updatedAt }`, `{ state: "sample", data, source, updatedAt }`, `{ state: "unavailable", reason }`, `{ state: "error", code }`, `{ state: "rate_limited", retryAfter }`.
- Provide two adapters: `httpAdapter` (reads `NEXT_PUBLIC_API_BASE_URL`) and `sampleAdapter` (local fixtures). The default is `sampleAdapter` until I confirm the gateway.
- **Everything returned by `sampleAdapter` is `state: "sample"`** and must render the visible "Sample data" tag. Fixture values must look obviously fake-safe (for example round placeholder values) and be stored in one file with a header comment explaining they are not real measurements.
- The gateway returns **codes and numbers, not sentences** (for example `rainOnset: "later"`, `signalCodes: ["low_soil_moisture"]`). The frontend maps codes to translated sentences from `messages/*.json`.
- Validate every response with Zod. A bad response becomes `state: "error"`, never a crash.
- Mark every unconfirmed assumption with `// TODO(human): confirm with gateway` and list them in `docs/frontend-assumptions.md`.
- Ranking: call `packages/scoring` locally for the sample adapter. With the real gateway it may come from `rankRotations`. The UI does not care which.

---

## 6. Components and behavior

### DataCard (build first, reuse everywhere)
Props: `statementKey`, `chart`, `source`, `updatedAt`, `state`, `expert` content. Always renders exactly **one source label** and a **"Last updated"** line. Renders all states: loading (skeleton of the same shape), live, sample (visible tag), unavailable (explanation and alternatives), stale ("Data may be old" and refresh), error (Retry; code only in Expert view), rate limited (wait time), offline (saved data banner).

### Simple and Expert views
A toggle in the context bar, default Simple, remembered per user. Simple: one plain sentence and one chart per card. Expert: technical terms with tooltips (open on tap too), raw values behind an expand control, full source details.

### PrioritySliders and RotationCard
Three sliders (0-10), 44 px thumbs, keyboard operable, live value text. Moving a slider re-ranks cards immediately with a short animation (under 300 ms, none if reduced motion). All zeros: show a gentle prompt to pick a priority. Each rotation card: rank, three crops in season order, score, season timeline, expandable **"Why this rotation"** (signal codes translated, each with its source), and a **disabled** "Ask about this recommendation" button with a "Coming soon" tooltip. Allow overriding soil values; the ranking updates and the result is marked "Using your values".

### RotationRing and SeasonSelector
SVG ring with three arcs: Kharif-1 (pre-monsoon), Kharif-2 (monsoon), Rabi (winter). Desktop: interactive. Mobile: swipeable segmented selector with dots. Season names translated.

### Layout parts
Header (logo, location chip, language switcher; max 4 top-level items), bottom tab bar (56 px with safe-area padding), bottom sheet (drag handle, focus trap, Escape to close), sticky context bar (location, season, Simple/Expert), offline banner. No stacked top bars and no status ticker.

### Reserved AI slot
A collapsed assistant panel showing "Coming soon". Reads a feature flag `ai.enabled` from config (default false). It never calls any service and never shows generated text.

---

## 7. Screen requirements

**Landing:** headline, one supporting line, location search with a primary "Explore your field" button, the rotation ring, and 3 provable trust points ("Uses NASA data", "Shows its reasoning", "Built for farmers and extension officers"). At most 3 short sections. The pilot region is labeled as a pilot, not the product's identity. No claims like "validated by".

**Explorer:** full-screen map with a floating search box. Selecting a place opens a summary (bottom sheet on mobile, side panel on desktop) with 3-4 cards and an "Open dashboard" button. Design the empty, no-data and denied-location-permission (fall back to search) states.

**Dashboard:** 4-6 DataCards: rainfall trend, heat days, soil moisture, vegetation health, soil properties. Desktop layout 8 + 4 columns with a sticky right rail (location summary and small map). Primary action "See rotations" goes to the Planner.

**Planner:** desktop 4 + 8 columns (sticky sliders left, ranked cards right). Mobile: sliders in a collapsible card at the top, ranked cards below, sticky "See rotations" action when relevant.

**Crop Library:** filters (season, water need, nitrogen-fixing), card grid (2-3 columns on desktop, 1 on mobile, filters in a bottom sheet), detail page per crop with source for each trait. Traits that are sample show the Sample tag.

**Gateway page:** public documentation only: endpoint list, copyable request and response examples (using placeholders, not real keys), rate-limit and data-limit notes. No key management here (that is in the admin console).

---

## 8. Internationalization

- Routes `/en`, `/bn`, `/ja`. Detect from the browser on first visit, remember the choice, never lose location or priorities when switching.
- **All user-facing text in `messages/*.json`.** No hardcoded strings, no text inside images.
- Set `<html lang>` correctly. Locale-aware dates (for example 2026年10月26日), numbers and units.
- Line heights by locale (about 1.5, 1.6-1.7, 1.7-1.8). No italics in Bangla or Japanese. Allow natural Japanese line breaks.
- Missing translation: fall back to English and log it in development.
- Write real Bangla and Japanese strings for all UI text, and mark farming terms `// NEEDS-NATIVE-REVIEW` in the message files.
- Components must survive the longest label in all three languages. Add a Playwright test that renders each key screen in each locale.

---

## 9. Performance and offline

- Mobile first at 360 px. Budget: keep the initial JavaScript for the landing page small (target under about 150 KB gzipped, excluding fonts) and report the real number.
- Server-render landing and static pages. Lazy-load the map and charts after main content, with clean placeholders.
- Skeleton loading for every data component. Use `prefers-reduced-motion`.
- Cache API responses with TanStack Query (stale-while-revalidate). Persist the last result locally so the app shows saved data offline with an "Offline: showing saved data" banner. A service worker or PWA setup is optional; propose it before adding.
- SVG for ring and icons, no large photos, no autoplay media.

---

## 10. Accessibility (required on every screen)

WCAG AA contrast (using the token pairs in `DESIGN-RULES.md`), touch targets 44 px or larger with 8 px spacing, body text 16 px or larger on mobile, visible focus ring, full keyboard use, labels for every input and icon button, color never the only signal, charts with a text alternative and a "View as table" option, focus trap in sheets, works at 200% zoom. Run axe in Playwright for every screen in every locale.

---

## 11. Work plan (stop after each step and wait for my approval)

1. **Plan:** the understanding, file plan, dependency list, questions (Section 0).
2. **Foundation:** repo setup, tokens package, fonts, Tailwind preset, i18n skeleton, layout shell (header, tab bar, language switcher), theme toggle. Demo page showing tokens and components.
3. **Data layer:** types, Zod schemas, `Result` states, `sampleAdapter`, `httpAdapter` skeleton, `DataCard` with all states. Tests.
4. **Landing and Explorer:** including the lazy-loaded map and the summary sheet.
5. **Dashboard:** cards, Simple and Expert views, sticky rail.
6. **Planner:** sliders, scoring integration, rotation cards, "Why this rotation", soil override.
7. **Crop Library and detail**, then the **Gateway** and **More** pages.
8. **Quality pass:** accessibility, three-language stress test, performance report, offline behavior, README and `docs/frontend-assumptions.md`.

After each step, report: what changed, how to run it, tests run and results, and open questions.

---

## 12. Definition of done (for the whole frontend)

- [ ] Compiles, lints, and type-checks cleanly (strict mode)
- [ ] No invented numbers shown as real; every sample value shows the tag
- [ ] Every data card has one source label, an update time and all states
- [ ] Simple and Expert views work
- [ ] Mobile (360), tablet (768) and desktop (1280) layouts match `DESIGN-RULES.md`
- [ ] English, Bangla and Japanese complete, with longest-text tests passing
- [ ] Keyboard and screen-reader basics pass, axe has no serious violations
- [ ] Map and charts lazy-load; performance numbers reported
- [ ] Offline state works with saved data
- [ ] Disabled AI slot present, no AI calls anywhere
- [ ] No secrets, no hotlinked assets, no CDN scripts, no unapproved dependencies
- [ ] Tests passing: unit, key-flow e2e, accessibility

## 13. Hard rules (repeat of the most important)

1. Never show invented data as real.
2. No AI features. Disabled placeholders only.
3. No hardcoded text, colors or fonts.
4. Ask before adding dependencies, changing API shapes or deleting files.
5. Plan first, small steps, wait for approval at each checkpoint.
6. When something is unknown (endpoints, copy, data), mark `TODO(human)` and ask. Do not guess.
# AGENTS.md — Agentic AI Resume Workspace

This file is a living guide for AI coding agents working on this project. Update it whenever the build tooling, architecture, or conventions change.

---

## Project Overview

This is a **single-page React + TypeScript web application** for building and tailoring a one-page engineering resume.

Core value propositions:

- **AI Resume Tailoring**: Paste a target job description (JD) and call Groq or Google Gemini models to rephrase the resume title, summary, skills, and project bullets for better ATS keyword alignment.
- **Interactive UI Editor**: Edit personal info, summary, skills, projects, and education through a collapsible accordion panel.
- **Inline Resume Editing**: Click any text directly on the rendered resume page to edit it live.
- **Strict 1-Page PDF Export**: Browser print media CSS enforces A4 portrait with no extra margins or page-break gaps.
- **Responsive Workspace**: Desktop shows a dual-pane layout (controls left, resume right); mobile uses a stacked, touch-optimized layout.

All application logic runs in the browser. There is no backend server in this repo.

---

## Technology Stack

| Layer | Choice | Version (package.json) |
|-------|--------|------------------------|
| Framework | React | ^19.2.6 |
| Language | TypeScript | ~6.0.2 |
| Build Tool | Vite | ^8.0.12 |
| CSS Framework | TailwindCSS | ^4.3.0 (with `@tailwindcss/vite`) |
| Package Manager | pnpm | 11.x (lockfile: `pnpm-lock.yaml`) |
| Linter | ESLint | ^10.3.0 with `typescript-eslint`, react-hooks, react-refresh |

Notable runtime dependencies are only React, React-DOM, TailwindCSS, and the Vite Tailwind plugin. No routing, state-management, or UI component libraries are used.

---

## Directory Layout

```
resume/
├── index.html              # HTML entry point; mounts #root, loads /src/main.tsx
├── package.json            # Scripts and dependencies
├── pnpm-lock.yaml          # pnpm lockfile
├── vite.config.ts          # Vite + React + TailwindCSS plugin configuration
├── tsconfig.json           # TypeScript project references
├── tsconfig.app.json       # TypeScript config for the browser app (src/)
├── tsconfig.node.json      # TypeScript config for Vite config file
├── eslint.config.js        # Flat ESLint config
├── .env.example            # Template for required API keys
├── public/                 # Static assets copied to dist as-is
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.tsx            # React root render (StrictMode)
│   ├── App.tsx             # Main application component (header, panel, resume)
│   ├── resumeData.ts       # Default resume data model and TypeScript types
│   ├── aiTailor.ts         # AI model options + Groq/Gemini API callers
│   ├── ResumeEditorPanel.tsx # Accordion-based structured resume editor
│   ├── icons.tsx           # SVG icon components (LinkedIn, GitHub, Mail, etc.)
│   ├── index.css           # Tailwind import, theme, base, and print CSS
│   └── assets/             # Placeholder for additional assets (currently empty)
└── dist/                   # Production build output (gitignored, but present locally)
```

---

## Build and Development Commands

All commands use pnpm.

```bash
# Install dependencies
pnpm install

# Start the dev server on localhost:5173, exposed to LAN via --host
pnpm dev

# Type-check and build for production into dist/
pnpm build

# Lint the entire project
pnpm lint

# Preview the production build locally
pnpm preview
```

### Build Details

- `pnpm build` runs `tsc -b && vite build`.
- TypeScript uses project references (`tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`).
- `tsconfig.app.json` targets `es2023`, uses `moduleResolution: bundler`, `noEmit: true`, and enforces `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, and `erasableSyntaxOnly`.
- The Vite config enables `@vitejs/plugin-react` and `@tailwindcss/vite`.
- Output is a static site in `dist/` intended to be served by any static host.

---

## Environment Variables

Create `.env` from `.env.example`. Vite exposes only variables prefixed with `VITE_` to the client.

| Variable | Required For | Source |
|----------|--------------|--------|
| `VITE_GROQ_API_KEY` | Groq models | https://console.groq.com/keys |
| `VITE_GEMINI_API_KEY` | Gemini models | https://aistudio.google.com/app/apikey |

Users can also enter keys directly in the UI; the app stores them in `localStorage` (`groq_api_key`, `gemini_api_key`) and falls back to the `.env` values.

**Security note:** API keys are shipped to the browser. This is acceptable for a personal client-side demo, but do not deploy this to a public site if you need to keep keys secret.

---

## Code Organization

### `src/resumeData.ts`

- Exports the canonical `resumeData` object (name, title, contact, summary, skills, projects, education).
- Exports `ResumeDataType = typeof resumeData`.
- This is the single source of truth for the default resume state.

### `src/aiTailor.ts`

- Exports `ALL_AI_MODELS`, the list of selectable models split between `groq` and `gemini` providers.
- Exports `tailorResumeWithAI(jobDescription, modelId, userGroqKey, userGeminiKey, baseResume)`.
- Contains the `SYSTEM_PROMPT` that instructs the LLM to optimize honestly without fabricating experience.
- `callGroqApi` posts to `https://api.groq.com/openai/v1/chat/completions` with `response_format: { type: "json_object" }`.
- `callGeminiApi` posts to `https://generativelanguage.googleapis.com/v1beta/models/{modelId}:generateContent` with `responseMimeType: "application/json"`.
- Both functions expect a JSON response and `JSON.parse` it directly.

### `src/App.tsx`

- Holds all global state: active tab (`ai`/`edit`), resume data, spacing controls, AI inputs/loading/error, panel collapse state.
- Implements `handleEditableBlur` for inline resume editing via `contentEditable`.
- Implements `handleRunAiTailor`, which merges AI output back into the default resume shape.
- Renders the sticky top header with spacing steppers, reset/print actions, and the dual-pane layout.
- Applies CSS custom properties (`--resume-font-size`, `--resume-line-height`, etc.) used by print styles.

### `src/ResumeEditorPanel.tsx`

- Accordion-style structured editor for the entire resume.
- Supports add/remove for skill categories, projects, and bullets.
- Supports JSON export/import for the full resume object.

### `src/icons.tsx`

- Simple inline SVG React components used in the resume header and UI.

### `src/index.css`

- Imports Google Fonts (`Inter`, `Playfair Display`) and TailwindCSS.
- Defines custom theme fonts.
- Contains aggressive `@media print` rules that override padding, margins, shadows, and colors to produce a clean A4 PDF.

---

## Development Conventions

- **Language**: TypeScript only; `.ts` and `.tsx` files.
- **Module system**: ES modules (`"type": "module"` in package.json).
- **Component style**: Functional React components with hooks; default exports for page-level components, named exports for utilities and panels.
- **Styling**: TailwindCSS utility classes exclusively (no CSS modules or styled-components). Print overrides live in `src/index.css`.
- **State management**: React `useState` and `useEffect` only; no Redux/Zustand.
- **Inline editing**: Uses React `contentEditable` with `suppressContentEditableWarning` and `onBlur` handlers that parse dotted `fieldPath` strings.
- **Icons**: Inline SVG components in `src/icons.tsx`.
- **No tests**: The project currently has no test runner or test files.

---

## Linting and Type Checking

- ESLint is configured in `eslint.config.js` as a flat config.
- Extends `@eslint/js/recommended`, `typescript-eslint/recommended`, `react-hooks/flat/recommended`, and `react-refresh/vite`.
- Runs over `**/*.{ts,tsx}` and ignores `dist/`.
- Run `pnpm lint` before committing.
- TypeScript enforces unused locals/parameters; the build will fail if they are present.

---

## Deployment

This is a static Vite site. The recommended deployment path is:

1. Copy `.env.example` to `.env` and add your keys (only needed at build/dev time; keys are still client-side).
2. Run `pnpm install && pnpm build`.
3. Deploy the contents of `dist/` to any static host (Vercel, Netlify, GitHub Pages, etc.).

There is no server-side rendering, API routes, or database in this repo.

---

## Security Considerations

- API keys for Groq and Gemini are exposed to the browser through Vite env vars or user input/localStorage.
- The app calls third-party AI APIs directly from the browser with `fetch`.
- Do not commit a real `.env` file; it is gitignored.
- The system prompt instructs the model not to fabricate experience, but always review AI-tailored output before using it in a real application.

---

## Common Tasks

### Add a new AI model

1. Open `src/aiTailor.ts`.
2. Add an entry to `ALL_AI_MODELS` with the correct `provider` (`"groq"` or `"gemini"`).
3. If the provider is new, update the model selector in `src/App.tsx` to render another `<optgroup>`.

### Change the default resume content

1. Edit `src/resumeData.ts`.
2. Keep the shape consistent with `ResumeDataType`.

### Adjust print/PDF layout

1. Edit `@media print` rules in `src/index.css`.
2. Spacing variables (`--resume-font-size`, `--resume-line-height`, etc.) are set inline by `App.tsx` and read by the print stylesheet.

### Add a new resume section

1. Update the data shape in `src/resumeData.ts` and `ResumeDataType`.
2. Render the new section in `src/App.tsx`.
3. Add editing support in `src/ResumeEditorPanel.tsx` and inline editing in `handleEditableBlur`.

---

## Notes for Agents

- This is a personal resume application; many strings and project examples are specific to Sohail Islam's background. When modifying, preserve the honest-resume constraint embedded in `aiTailor.ts`.
- The project does not use React Router; everything lives in one component tree.
- Avoid adding heavy dependencies; the current bundle is intentionally small.
- If you add runtime dependencies, update both `package.json` and this file.

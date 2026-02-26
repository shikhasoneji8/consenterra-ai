# ConsenTerra

**AI-powered clarity for privacy, sustainability, and everyday decisions.**

ConsenTerra builds intelligent tools that translate complex policies, claims, and fine print into clear, actionable insights — so users and businesses can understand before they consent.

---

## Products

### PriXplainer
AI-driven privacy policy analyzer. Paste a URL, get a risk score, highlighted clauses, and plain-English explanations of what a company does with your data.

### TrustEarthy *(coming soon)*
Sustainability claims verifier. Understand whether "eco-friendly" labels actually hold up.

### Browser Extension
Chrome extension that scans any website for privacy risks in one click — trust score, dark patterns, data collection summary.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui |
| Backend | Supabase (Postgres, Auth, Edge Functions, RLS) |
| AI/ML | Hierarchical classifiers · LLM explanations · Embeddings |
| Extension | Chrome Manifest V3 |
| Deployment | Vercel (frontend) · Supabase (backend) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (comes with Node.js)
- **Git**

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/consenterra/consenterra-ai.git

# 2. Navigate to the project
cd consenterra-ai

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The app will be running at `http://localhost:8080`.

### Environment Variables

Create a `.env.local` file in the root directory. Ask a team lead for the required values:

```env
VITE_SUPABASE_URL=<ask team lead>
VITE_SUPABASE_ANON_KEY=<ask team lead>
```

---

## Project Structure

```
consenterra-ai/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service layer
│   ├── integrations/   # Supabase client & types
│   ├── lib/            # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Helper functions
│   └── assets/         # Images, icons, static files
├── browser-extension/  # Chrome extension (Manifest V3)
├── supabase/
│   ├── functions/      # Supabase Edge Functions
│   └── migrations/     # Database migrations
├── public/             # Static public assets
└── index.html          # Entry point
```

---

## Available Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start development server (port 8080) |
| `npm run build` | Production build to `dist/` |
| `npm run build:dev` | Development build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

---

## Browser Extension (Dev Mode)

1. Navigate to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `browser-extension/` folder
5. Pin the extension in your toolbar

See [`browser-extension/README.md`](./browser-extension/README.md) for full details.

---

## Contributing

1. Create a feature branch from `main`: `git checkout -b feature/your-feature-name`
2. Make your changes and commit with clear messages
3. Push and open a Pull Request
4. Request review from a team lead

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines (coming soon).

---

## Team

Built by the ConsenTerra team. For questions, reach out on Discord.

---

*© 2026 ConsenTerra, Inc. All rights reserved.*

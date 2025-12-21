# Pokédex — Next.js (Gen 1)

A modern Pokédex application built with **Next.js App Router**, focused on the original **151 Pokémon**.  
This project demonstrates clean architecture, thoughtful UX, and production-ready React & TypeScript practices.

---

## Features

### Pokédex Index
- Displays the original 151 Pokémon
- Each card shows:
  - National Dex number
  - Name
  - Types
  - Artwork
- Responsive grid layout (desktop and mobile)

### Smart Search
Supports natural-language-style queries:
- Search by **name** (partial, case-insensitive)
- Search by **number** (exact or partial)
- Search by **type** (e.g. `fire`, `water`)
- Advanced intent:
  - Pokémon **weak to** a type
  - Pokémon that **resist** a type

Search input is debounced for performance and provides real-time feedback.

### Sorting & Pagination
- Sort by **Dex number** or **name**
- Ascending / descending order
- Pagination works seamlessly with search and sorting
- Sorting state persists during navigation

---

## Pokémon Detail View

Each Pokémon has a dedicated server-rendered detail page.

### Story
- Official Pokédex flavor text (cleaned and normalized)

### Base Stats
- Visual stat bars with 3-tier shading
- Clear differentiation between low, medium, and high values

### Type Matchups
- Displays:
  - Weak To
  - Resists
- Uses canonical Pokémon type effectiveness
- Gen-accurate calculations

### Evolutions
- Visual evolution chain using artwork and arrows
- Supports linear and branching evolutions
- Evolution results are restricted to Gen 1 Pokémon only (001–151)

### Navigation
- Previous / Next Pokémon controls
- Fast browsing without returning to the index

---

## Design & UX

- Inspired by classic Game Boy Advance Pokédex UI
- Subtle retro styling with modern usability
- Clear visual hierarchy and spacing
- Consistent component language
- Fully responsive and touch-friendly

---

## Tech Stack

- Next.js 14 (App Router, Server Components)
- React
- TypeScript
- CSS Modules
- PokéAPI (REST)
- Vercel (hosting)

---

## Architecture & Decisions

### Server-Side Rendering
- Index and detail pages are server-rendered for:
  - Performance
  - SEO
  - Predictable data loading
- Client components are used only where interaction is required

### Headless Data Layer
- Data fetched through serverless API routes
- Enrichment layer adds:
  - Flavor text
  - Type effectiveness
  - Evolution chains
- Evolution data filtered to Gen 1 only

### Smart Search Strategy
- Query parsing separated from UI logic
- Clear intent detection:
  - name / id
  - type
  - weakness / resistance
- Keeps UI simple while enabling powerful filtering

### Clean Code Practices
- Strong typing across data boundaries
- Pure utility functions (sorting, filtering, pagination)
- Reusable components
- Declarative, readable code

---

## Error Handling & Performance

- Defensive API fetching with graceful fallbacks
- Debounced client-side search
- Server fetch caching and revalidation
- Production-safe absolute API URLs for SSR on Vercel

---

## Getting Started (Local)

```bash
npm install
npm run dev

Open:
http://localhost:3000
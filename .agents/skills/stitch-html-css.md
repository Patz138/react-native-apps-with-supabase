---
name: stitch-html-css
description: Workflow for generating and stitching modular HTML/CSS components into a complete, responsive single-file UI
metadata:
  type: skill
---

# Skill: Stitch HTML/CSS — Modular UI Composition

## Purpose
Generate self-contained, production-quality HTML/CSS/JS from a design token system and component specs, then stitch all modules into one deployable file.

## Phase 1 — Token Extraction
1. Read the project's theme file (e.g. `kineticTheme.ts`, `tokens.json`, Tailwind config).
2. Map all values to CSS custom properties in `:root { }`:
   - Colors → `--color-*`
   - Spacing → `--space-*`
   - Border radius → `--radius-*`
   - Typography → `--font-*`
3. Add semantic aliases where needed (e.g. `--surface` maps to a specific background shade).

## Phase 2 — Component Modules (Stitch Units)
Each UI component is a self-contained CSS block + HTML snippet:

```
[Component Name]
├── Structure: HTML markup with BEM-like class names
├── Styles: CSS block scoped to component class
└── Variants: modifier classes (--primary, --sm, --active)
```

**Naming convention:** `.component-name`, `.component-name__element`, `.component-name--modifier`

**Required stitch units for this project:**
| Unit | Classes | Description |
|------|---------|-------------|
| Navbar | `.navbar`, `.nav-link`, `.nav-logo` | Sticky top bar with logo + links |
| Button | `.btn`, `.btn--primary`, `.btn--ghost`, `.btn--outline` | Multi-variant CTA buttons |
| Card | `.workout-card`, `.difficulty-badge` | Workout info card |
| Form | `.auth-form`, `.form-input`, `.form-group` | Auth input fields |
| Auth Layout | `.auth-layout`, `.auth-card`, `.auth-branding` | Two-col or centered auth wrapper |
| Badge | `.badge`, `.badge--secondary` | Small label pill |
| Page Header | `.page-header`, `.filter-tabs` | Section title + filter controls |

## Phase 3 — Stitching Order
Combine modules in this exact order to avoid specificity conflicts:

```css
/* 1. CSS Reset */
/* 2. :root { } Token Variables */
/* 3. Base (body, a, img, button) */
/* 4. Layout (navbar, .view, .page-header) */
/* 5. Components (buttons, forms, cards) in dependency order */
/* 6. View-specific overrides */
/* 7. @media responsive rules LAST */
```

## Phase 4 — Inline JS SPA Router
For multi-view apps without a bundler:

```js
const views = { home: el, login: el, ... };
function navigate(route) {
  Object.entries(views).forEach(([k, el]) => el.classList.toggle('hidden', k !== route));
  // sync active nav link classes
}
document.addEventListener('click', e => {
  const link = e.target.closest('[data-route]');
  if (link) { e.preventDefault(); navigate(link.dataset.route); }
});
```

Hide non-active views with `.hidden { display: none !important; }`.

## Phase 5 — Responsive Breakpoints
| Breakpoint | Target | Key changes |
|------------|--------|-------------|
| `max-width: 900px` | Tablet | Hide desktop nav, show hamburger; single-col grids |
| `max-width: 600px` | Mobile | Stack hero CTAs; full-width forms; hide auth branding |

## Output Checklist
- [ ] Single `.html` file, no external CSS/JS dependencies (except optional CDN fonts)
- [ ] All CSS custom properties declared in `:root`
- [ ] All views present, only one visible at a time
- [ ] `prefers-color-scheme` or explicit dark mode applied
- [ ] No inline `style=""` attributes — classes only
- [ ] Forms have `novalidate` + JS validation
- [ ] All interactive elements have `:hover`/`:focus` states

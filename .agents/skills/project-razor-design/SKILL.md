---
name: project-razor-design
description: Design guidelines for Project Razor — a dark-mode critical-thinking course and library. Use when designing, refactoring, or reviewing UI.
---

# Project Razor Design

## Product identity

- **Product**: Educational critical-thinking app (logical fallacies, cognitive biases, bad-faith tactics).
- **Tone**: Calm authority — trustworthy, focused, modern, never childish or cartoonish.
- **Mode**: Dark mode first; all design tokens assume a dark surface.
- **Stack**: Vite + React + TypeScript + Tailwind CSS + shadcn/ui.

## Color tokens

All colors live as CSS variables in `src/index.css` and mapped in `tailwind.config.ts`.

```css
:root {
  --background: 240 10% 4%;        /* near-black, low noise */
  --foreground: 0 0% 98%;          /* crisp white text */
  --card: 240 8% 8%;               /* elevated surface */
  --card-foreground: 0 0% 98%;
  --muted: 240 6% 14%;             /* secondary surface */
  --muted-foreground: 240 5% 60%;  /* secondary text */
  --border: 240 6% 20%;            /* faint separators */
  --primary: 270 95% 65%;          /* electric violet */
  --primary-foreground: 0 0% 100%;
  --accent: 280 90% 60%;           /* magenta accent */
  --success: 142 76% 40%;
  --warning: 38 92% 55%;
  --destructive: 0 84% 60%;
}
```

- Primary/secondary accents are intentionally saturated against dark surfaces.
- Do not introduce flat grays (`bg-gray-700` or raw hex like `#334155`) — use semantic tokens.
- Avoid adding a light mode unless explicitly requested; the app is built dark-first.

## Typography scale

Base scale is `16px`. Use this finite set:

| Element | Tailwind classes |
|---------|------------------|
| Page title | `text-3xl sm:text-4xl font-bold tracking-tight` |
| Section heading | `text-2xl font-bold` |
| Card title | `text-lg font-semibold` |
| Body | `text-base leading-relaxed` |
| Label/caption | `text-sm font-medium` |
| Metadata | `text-xs uppercase tracking-wider text-muted-foreground` |

Avoid arbitrary sizes. The global CSS resets `h1`/`h2`/`h3` to large sizes; in page components prefer explicit utility classes and use `prose` or `card h2` for content headings.

## Spacing and rhythm

- Page padding: `py-8 sm:py-12`.
- Section gaps: `gap-6` to `gap-8`.
- Card padding: `p-5` to `p-6`.
- Card gaps: `gap-4`.
- Maintain a clear vertical rhythm; avoid giant dead zones.

## Components

### Cards

All cards should:
- Use `bg-card border border-border rounded-xl`.
- Have subtle hover state if interactive: `hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10`.
- Avoid mixed border-radius; prefer `rounded-xl`.

### Buttons

- Primary action: `Button` default (already styled).
- Secondary/outline: `Button variant="outline"`.
- Disabled state must be visible but clearly inactive (opacity-50, cursor-not-allowed).

### Progress indicators

- Use `Progress` for linear bars; label with text beside it, not on the thumb.
- Show progress as "N of M" with clear hierarchy.

## Anti-patterns to avoid

1. **Truncated card descriptions** — use `line-clamp-2` only if the full text is one click away.
2. **Double quotes** — never wrap `example.text` in additional quote characters; data already contains them.
3. **Tiny explanation text** — body copy should be `text-base` with `text-foreground`, not `text-sm text-muted-foreground`.
4. **Inconsistent heading sizes** — component headings and page headings must respect the scale.
5. **Generic shadcn defaults left unstyled** — the nav, forms, and stage tabs need deliberate treatment.
6. **Raw hex or arbitrary values** — always use design tokens.

## Responsive

- Mobile-first, max readable width `max-w-5xl`/`max-w-6xl`.
- Touch targets minimum `44×44px` (use `min-h-11` on buttons/inputs).
- Use `sm:` and `md:` for breakpoints; avoid `lg:` unless necessary.

## Accessibility

- Maintain contrast 4.5:1 for body text.
- Visible focus rings (Tailwind `focus-visible:ring-2 focus-visible:ring-ring`).
- Prefer Lucide icons; never use emojis as the only icon indicator.

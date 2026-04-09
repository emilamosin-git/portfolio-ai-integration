# Portfolio — Claude Code Guidelines

## Design Guidelines

This project uses two skill files for frontend generation. Always follow both when building UI:

- **FRONT-END.md** — Creative direction: commit to a bold aesthetic, choose distinctive typography, use motion intentionally, break from generic AI aesthetics.
- **TASTE.md** — Engineering standards: component architecture, Tailwind rules, animation performance, forbidden patterns.

### Active Baselines (from TASTE.md)
- `DESIGN_VARIANCE`: 8 — Asymmetric layouts, masonry, fractional grids, large empty zones
- `MOTION_INTENSITY`: 6 — Fluid CSS transitions, `cubic-bezier` easing, `animation-delay` cascades
- `VISUAL_DENSITY`: 4 — Normal spacing, daily-app feel

### Key Rules

**Typography**
- Banned fonts: `Inter`, `Roboto`, `Arial`, `Space Grotesk`
- Use: `Geist`, `Outfit`, `Cabinet Grotesk`, or `Satoshi`
- Display: `text-4xl md:text-6xl tracking-tighter leading-none`
- Body: `text-base text-gray-600 leading-relaxed max-w-[65ch]`

**Color**
- Max 1 accent color, saturation < 80%
- No purple/neon gradients ("The Lila Ban")
- No pure `#000000` — use Zinc-950 or Charcoal
- Neutral base (Zinc/Slate) + singular high-contrast accent

**Layout**
- Centered hero sections are banned (`DESIGN_VARIANCE > 4`) — use split-screen or left-aligned asymmetric layouts
- No 3-equal-column card layouts — use 2-col zig-zag, asymmetric grid, or horizontal scroll
- Full-height sections: always `min-h-[100dvh]`, never `h-screen`
- Page containers: `max-w-[1400px] mx-auto` or `max-w-7xl`
- Mobile fallback: all asymmetric layouts above `md:` must collapse to single-column

**Styling**
- Tailwind CSS primary (90%)
- Check `package.json` before importing any 3rd-party library
- Verify Tailwind version before using v4 syntax

**Motion**
- Animate only `transform` and `opacity` — never `top`, `left`, `width`, `height`
- Framer Motion for interactive UI; GSAP/ThreeJS only for isolated scroll-telling
- Never mix Framer Motion + GSAP in the same component tree
- Magnetic hover: use `useMotionValue`/`useTransform`, never `useState` for continuous animation
- Perpetual animations must be isolated in their own `'use client'` leaf components

**Icons**
- Use `@phosphor-icons/react` or `@radix-ui/react-icons` (check which is installed)
- No emojis — ever

**Content**
- No generic names (John Doe, Sarah Chan), fake round numbers (50%, 99.99%), or startup slop names (Acme, Nexus)
- No filler copy: "Elevate", "Seamless", "Unleash", "Next-Gen"
- Images: `https://picsum.photos/seed/{random_string}/800/600` — no Unsplash links

**Components**
- Glassmorphism: add `border-white/10` inner border + `shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`
- Cards: use only when elevation communicates hierarchy; prefer spacing/dividers otherwise
- Always implement loading, empty, and error states
- Tactile button feedback: `:active` → `-translate-y-[1px]` or `scale-[0.98]`

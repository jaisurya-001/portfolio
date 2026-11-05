# CODE AUDIT REPORT: Cinematic 3D Solar System Portfolio
**Target:** Jaisurya V — Portfolio Codebase  
**Auditor:** Senior React Three Fiber Engineer  
**Date:** November 4, 2026  
**Status:** Incomplete / Build Failing (Cursor stopped partway)

---

## 1. Overall Completion Estimate
**Completion: 58%**  
*Justification:* The core foundation (Vite, React 18, TypeScript, Zustand store, portfolio data, UI skeleton, camera Catmull-Rom spline flight, and base procedural planet shaders) is well structured, but the build/dev pipeline is currently broken by a Tailwind v4/Oxide package mismatch, all 7 planet-specific special 3D features are missing, dual-mode fallback/lazy loading is unimplemented, and intro/polish extras are absent.

---

## 2. Phase Summary Table

| Phase / Checklist Item | Status | One-Line Note |
| :--- | :---: | :--- |
| **A. Project Health** | 🔴 Broken | `tsc` passes (0 errors), but `npm run build` and `npm run dev` fail due to Tailwind v4/oxide mismatch. |
| **B. Data Integrity** | ✅ Done | `portfolio.ts` is 100% accurate to Jaisurya V; clean types, zero invented metrics, and no fake links. |
| **C. 3D Scene Core** | ✅ Done | Canvas, Sun, 8 planets on orbits, orbit rings, procedural shaders, and asteroid InstancedMesh exist. |
| **D. Camera & Navigation** | ✅ Done | Catmull-Rom curved flight, GSAP easing, HUD list, Arrow/Wheel/Esc navigation, and offset framing work. |
| **E. Panel & Sections** | ✅ Done | Glassmorphic slide-in InfoPanel and all 10 section views are properly wired to `portfolio.ts`. |
| **F. Special 3D Treatments** | 🔴 Broken / ❌ Missing | Saturn plaques, Jupiter moons, Earth pin/atmosphere, Mars flag, Mercury chips, and Neptune pulse are missing. |
| **G. Intro & Extras** | 🟡 Partial | Bloom exists, but LoadingScreen lacks `useProgress` & countdown; typewriter, nebula, stars, spaceship cursor missing. |
| **H. Dual Mode (3D / 2D)** | 🟡 Partial | ModeToggle and FlatView exist, but Canvas is never unmounted, and ErrorBoundary / React.lazy / fallbacks are missing. |
| **I. Performance & Quality** | 🟡 Partial | DPR capped at 1.5 and state isolated from frames, but lacks weak-device tier scaling and memoization in JSX shaders. |
| **J. Accessibility & SEO** | 🟡 Partial | ARIA labels and `lang="en"` present, but missing meta description, Open Graph tags, favicon, and reduced-motion handling. |
| **K. README & Documentation** | 🟡 Partial | Basic run steps present, but missing TODO checklist, data-editing instructions, and full Vercel deployment guide. |

---

## 3. Detailed Findings

### A. Project Health (🔴 Broken)
- **`src/styles/index.css` & `package.json`**:
  - `npx tsc --noEmit` passes with 0 errors.
  - `npm run build` and `npm run dev` fail immediately with `[@tailwindcss/vite:generate:build] Cannot convert undefined or null to object`.
  - *Cause:* `@tailwindcss/vite` is pinned to `4.0.6` in `package.json`, but `npm` resolved `@tailwindcss/oxide` to `4.3.4` in `package-lock.json`. The Rust native NAPI binding in oxide `4.3.4` expects `{ base, pattern, negated }` in `ScannerOptions.sources`, whereas `@tailwindcss/vite` `4.0.6` passes objects without `negated`, throwing a fatal TypeError.
- **Unfinished Stubs**:
  - `src/data/portfolio.ts`: Projects have placeholder `githubUrl: 'TODO'` and `liveUrl: 'TODO'` (as required by spec). `education[1]` has `credential: ''`.

### F. Special Treatments (🔴 Broken / ❌ Missing)
- **`src/components/scene/Planet.tsx`**:
  - **Mercury**: Orbiting skill chips are **missing**.
  - **Earth**: Has a basic procedural Moon, but Tiruppur location pin and dedicated Fresnel atmosphere glow mesh are **missing**.
  - **Mars**: Glowing achievement beacon / flag is **missing**.
  - **Jupiter**: Project moons (4 clickable moons representing the 4 projects) are **completely missing**.
  - **Saturn**: Ring mesh exists, but the 4 orbiting certification plaques are **missing**.
  - **Neptune**: "Mission Control" signal pulse ring is **missing**.
- **`src/components/scene/AsteroidBelt.tsx`**:
  - Has an `instancedMesh` with 520 generic rocks, but the **6 labeled larger interest rocks** are **missing**.

### G. Intro and Extras (🟡 Partial)
- **`src/components/ui/LoadingScreen.tsx`**:
  - Lacks `@react-three/drei`'s `useProgress`. Uses an arbitrary 900ms `setTimeout` in `App.tsx`.
  - Missing the cinematic 3-2-1 launch countdown.
- **`src/components/sections/Hero.tsx` & `src/components/ui/HUD.tsx`**:
  - Hero section and HUD overview lack typewriter / staggered text entry animations.
- **`src/components/scene/Starfield.tsx`**:
  - Uses default `<Stars />` only. Lacks a procedural nebula background and shooting star streaks.
- **Global Scene / Window**:
  - Spaceship cursor follower is **missing**.
  - Press "H" for keyboard shortcut help overlay is **missing** (only static footnote in HUD).
  - HUD solar system progress indicator is **missing**.

### H. Dual Mode (🟡 Partial)
- **`src/App.tsx`**:
  - In 2D mode, `<Canvas>` is kept mounted with `className="invisible ..."` and `frameloop="never"` instead of being unmounted, retaining WebGL resources.
  - Lacks an `ErrorBoundary` wrapping the 3D Canvas.
  - Lacks `React.lazy()` / code-splitting for the 3D scene graph.
  - Lacks automated fallback detection for mobile devices, low-end GPUs, missing WebGL context, or `prefers-reduced-motion`.
- **`src/components/ui/FlatView.tsx`**:
  - Semantic HTML (`<main>`, `<section>`) is present, but lacks an integrated sticky navigation header.

### I. Performance & Quality (🟡 Partial)
- **`src/components/scene/Planet.tsx`**:
  - In the JSX body, `uniforms={{ uColorA: { value: new THREE.Color(body.colors[0]) }, ... }}` creates new instances of `THREE.Color` and vectors on every component render.
- **`src/components/scene/AsteroidBelt.tsx` & `Starfield.tsx`**:
  - Asteroid count (520) and Star count (3500) are hardcoded without tier-based scaling for low-end hardware.

### J. Accessibility and SEO (🟡 Partial)
- **`index.html`**:
  - Missing `<meta name="description" ...>`.
  - Missing Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`).
  - Missing favicon (`<link rel="icon" ...>`).
- **`src/components/sections/Projects.tsx` & `Contact.tsx`**:
  - External links use `rel="noreferrer"` instead of `rel="noopener noreferrer"`.
- **Global**:
  - Missing CSS `@media (prefers-reduced-motion: reduce)` rules and JS state checks to disable camera animation.
  - Missing visible focus states (`:focus-visible`) for keyboard navigation.

### K. README (🟡 Partial)
- **`README.md`**:
  - Missing a dedicated "How to Edit Portfolio Data" section.
  - Missing the Project TODO list.
  - Missing explicit step-by-step Vercel deployment instructions.

---

## 4. Build and Runtime Errors

### 1. Build Failure (`npm run build`)
```text
> jaisurya-portfolio@1.0.0 build
> tsc --noEmit && vite build

vite v6.0.11 building for production...
transforming...
✓ 3 modules transformed.
x Build failed in 78ms
error during build:
[@tailwindcss/vite:generate:build] Cannot convert undefined or null to object
file: C:/Users/JAISURYA/OneDrive/Documents/projects/jaisurya_portfolio/src/styles/index.css
    at M.generate (file:///C:/Users/JAISURYA/OneDrive/Documents/projects/jaisurya_portfolio/node_modules/@tailwindcss/vite/dist/index.mjs:1:5762)
    at async Object.transform (file:///C:/Users/JAISURYA/OneDrive/Documents/projects/jaisurya_portfolio/node_modules/@tailwindcss/vite/dist/index.mjs:1:3770)
    at async transform (file:///C:/Users/JAISURYA/OneDrive/Documents/projects/jaisurya_portfolio/node_modules/rollup/dist/es/shared/node-entry.js:22723:16)
    at async ModuleLoader.addModuleSource (file:///C:/Users/JAISURYA/OneDrive/Documents/projects/jaisurya_portfolio/node_modules/rollup/dist/es/shared/node-entry.js:22952:32)
```

### 2. Dev Server Failure (`npm run dev`)
```text
Dev server error: TypeError: Cannot convert undefined or null to object
    at M.generate (file:///C:/Users/JAISURYA/OneDrive/Documents/projects/jaisurya_portfolio/node_modules/@tailwindcss/vite/dist/index.mjs:1:5762)
    at async TransformPluginContext.transform (file:///C:/Users/JAISURYA/OneDrive/Documents/projects/jaisurya_portfolio/node_modules/@tailwindcss/vite/dist/index.mjs:1:3431)
    plugin: '@tailwindcss/vite:generate:serve',
    id: '.../src/styles/index.css'
```

---

## 5. Current File Tree (`src` only)

```text
src/
├── App.tsx
├── main.tsx
├── vite-env.d.ts
├── components/
│   ├── scene/
│   │   ├── AsteroidBelt.tsx
│   │   ├── BodyLabel.tsx
│   │   ├── CameraRig.tsx
│   │   ├── OrbitRing.tsx
│   │   ├── Planet.tsx
│   │   ├── poses.ts
│   │   ├── shaders.ts
│   │   ├── SolarSystem.tsx
│   │   ├── Starfield.tsx
│   │   └── Sun.tsx
│   ├── sections/
│   │   ├── About.tsx
│   │   ├── Achievements.tsx
│   │   ├── Certifications.tsx
│   │   ├── Contact.tsx
│   │   ├── Education.tsx
│   │   ├── Hero.tsx
│   │   ├── index.ts
│   │   ├── Interests.tsx
│   │   ├── Objective.tsx
│   │   ├── Projects.tsx
│   │   └── Skills.tsx
│   └── ui/
│       ├── FlatView.tsx
│       ├── HUD.tsx
│       ├── InfoPanel.tsx
│       ├── LoadingScreen.tsx
│       └── ModeToggle.tsx
├── data/
│   ├── bodies.ts
│   └── portfolio.ts
├── store/
│   └── useStore.ts
└── styles/
    └── index.css
```
*Total files in `src`: 24*

---

## 6. Installed Dependencies vs Required Stack

| Package | Required Version / Role | Installed Version | Status / Notes |
| :--- | :--- | :--- | :--- |
| `react` | 18 | `18.3.1` | ✅ Exact |
| `react-dom` | 18 | `18.3.1` | ✅ Exact |
| `three` | 3D engine | `0.169.0` | ✅ Exact |
| `@react-three/fiber` | R3F React renderer | `8.17.10` | ✅ Compatible with React 18 |
| `@react-three/drei` | R3F helpers | `9.117.3` | ✅ Installed |
| `@react-three/postprocessing` | Post-processing | `2.16.3` | ✅ Installed |
| `gsap` | Easing & animation | `3.12.7` | ✅ Installed |
| `zustand` | State management | `5.0.3` | ✅ Installed (no localStorage used) |
| `tailwindcss` | Utility CSS | `4.0.6` | 🔴 Version conflict with sub-dependency |
| `@tailwindcss/vite` | Vite CSS plugin | `4.0.6` | 🔴 Incompatible with `@tailwindcss/oxide@4.3.4` |
| `typescript` | Static typing | `5.7.3` | ✅ Exact |
| `vite` | Dev / build tool | `6.0.11` | ✅ Exact |

*No extraneous UI libraries or external texture files are present.*

---

## 7. Risks and Architectural Concerns

1. **Tailwind v4 Native Binding Drift:**
   The package lockfile resolved an unpinned `@tailwindcss/oxide` (`4.3.4`) while `@tailwindcss/vite` was pinned to `4.0.6`. In CI or fresh installs, unpinned sub-dependencies in Tailwind v4 will break builds unless versions are aligned or pinned.
2. **WebGL Context Retention in 2D Mode:**
   Hiding the Canvas with CSS (`invisible`) keeps WebGL textures, render buffers, and shaders active in GPU memory. On mobile devices with constrained memory, switching to 2D view could cause background tab crashes without complete unmounting.
3. **Missing Error Boundary on Canvas:**
   If a client device fails to initialize WebGL2 or throws a shader compilation error, React unmounts the whole tree into a white screen. An ErrorBoundary must intercept WebGL faults and gracefully downgrade to the 2D view.
4. **Per-Render Object Allocations in `Planet.tsx`:**
   Shader uniforms create new `THREE.Color` objects inside the component function body. If the store triggers re-renders, unnecessary garbage collection pauses can occur.
5. **Drei `<Html>` DOM Overhead:**
   Every planet and body mounts an `<Html>` element. When adding moons, plaques, and asteroid interest labels, having 25+ projected DOM elements can cause layout thrashing on weaker CPUs.

---

## 8. Recommended Completion Plan

The remaining work is divided into **two focused sequential prompts**, ordered strictly by dependency.

### Prompt 1: Build Fix, Dual-Mode Hardening, and 3D Special Treatments
- **Execution Order:** 1st (Core blocker & 3D scene features)
- **Scope & Scope Estimate:** Medium-Large (~45–60 min agent run)
- **Tasks:**
  1. Fix Tailwind v4 build issue by aligning `@tailwindcss/vite` and `tailwindcss` dependencies or standardizing CSS directives so `npm run build` and `npm run dev` pass cleanly.
  2. Implement robust dual-mode in `App.tsx`:
     - Add `ErrorBoundary` around 3D viewport with auto-fallback to 2D mode on WebGL crash.
     - Unmount `<Canvas>` cleanly when `mode === '2d'`.
     - Code-split 3D scene via `React.lazy()`.
     - Add auto-fallback for mobile screens, reduced motion, and devices lacking WebGL.
  3. Implement all 7 planet special treatments:
     - **Mercury:** Orbiting skill chips.
     - **Earth:** Tiruppur location pin, Moon orbit, and dedicated Fresnel atmosphere halo.
     - **Mars:** Achievement flag / beacon.
     - **Asteroid Belt:** 6 larger labeled rocks for user interests.
     - **Jupiter:** 4 clickable project moons linked to portfolio projects.
     - **Saturn:** 4 orbiting certification plaques around the ring system.
     - **Neptune:** Pulsing radar ring ("Mission Control").

### Prompt 2: Intro Sequence, Visual Ambiance, Accessibility/SEO, and Documentation
- **Execution Order:** 2nd (Polish, UX extras, and production readiness)
- **Scope & Scope Estimate:** Medium (~30–40 min agent run)
- **Tasks:**
  1. **Intro & Extras:**
     - Connect `LoadingScreen` to `@react-three/drei`'s `useProgress` and add the 3-2-1 launch countdown.
     - Add typewriter / staggered text entry to `Hero.tsx` and overview HUD.
     - Add procedural nebula background shader, shooting star streaks, and spaceship cursor follower.
     - Add "H" key modal shortcut for mission controls and a HUD solar system progression meter.
  2. **Accessibility & SEO:**
     - Add metadata, title, meta description, Open Graph tags, Twitter cards, and SVG favicon to `index.html`.
     - Implement `:focus-visible` ring styles and `prefers-reduced-motion` overrides.
     - Ensure all external links include `rel="noopener noreferrer"`.
  3. **Documentation:**
     - Expand `README.md` with a guide on updating `portfolio.ts`, a project TODO tracker, and Vercel zero-config deployment steps.

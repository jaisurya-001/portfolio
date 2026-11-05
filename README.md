# Jaisurya V — 3D Solar System Portfolio

Cinematic portfolio. Each body in the system opens one section. The camera eases along a curve, then a glass panel slides in from the right.

## Run

```bash
npm install
npm run dev
```

Production build: `npm run build`. Output is `dist/`, suitable for Vercel.

## Decisions

- Copy lives in `src/data/portfolio.ts`. Orbit size, speed, tilt, and color live in `src/data/bodies.ts` because they are staging, not biography. Distances are artistic so every body stays reachable.
- **Begin Journey** flies to Mercury. **Quick View** switches to a 2D scroll of the same sections. Before a body is selected, the overview shows the name, location, tagline, and those two actions so they are available without opening the Sun.
- Revolution pauses while the camera is in flight and while the panel is open. Planets keep a slow axial spin. Earth's moon pauses with the orbits.
- The asteroid belt is one selectable body (Interests). Rocks are an `InstancedMesh`.
- Project `githubUrl` and `liveUrl` are the string `TODO`. GitHub and Live controls render only for `http(s)` URLs. No years, grades, metrics, or extra links were added.
- Contact actions use the label **Transmit signal**. The visible section title is **Mission Control**.
- Surfaces are shaders plus a canvas-drawn sun glow. There are no external texture files.
- Tailwind is v4, loaded through `@tailwindcss/vite`. React is pinned to 18, with React Three Fiber 8.

## Controls

Click a body or its HUD button. Arrow keys or the wheel move to the previous or next body. Escape closes the panel and returns to the overview. Input is ignored while the camera is moving. Scrolling inside the open panel does not change the selection.

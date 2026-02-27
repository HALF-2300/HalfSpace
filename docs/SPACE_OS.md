## SPACE OS (Route: `/space/os`)

This document describes the **window manager** and UI architecture for the Space “Operating System” experience.

### Goals

- Desktop-like UX inside Space: **dock + draggable windows + apps**
- **Additions-only**: implemented as new files under `app/space/os/**` and does **not** modify existing Space pages
- Persist and restore the user's session using `localStorage`
- Provide a **performance mode** and an automatic **weak-device fallback** (Tabs instead of windows)

### Route & Composition

- Route: `app/space/os/page.tsx`
- Client shell: `app/space/os/space-os.tsx`
- Visual background: `app/space/os/ui/space-background.tsx`
- Modes:
  - **Windows mode**: `app/space/os/windowing/window-shell.tsx`
  - **Tabs mode (fallback)**: `app/space/os/ui/tabs-shell.tsx`

### Window Manager Model

All state is kept in a single session object:

- `SpaceOSSession`
  - `uiMode`: `'windows' | 'tabs'`
  - `perfMode`: `'high' | 'low'`
  - `windows`: `WindowState[]`
  - `activeWindowId`: `string | null`
  - `activeTabAppId?`: selected app in tabs mode

Each window uses:

- `WindowState`
  - `id`: unique id
  - `appId`: which app is rendered
  - `title`, `icon`
  - `rect`: `{ x, y, w, h }`
  - `z`: stacking order (higher = front)
  - `minimized`: hidden but restorable from the dock
  - `maximized`: fills the viewport (keeps `restoreRect` for restore)

### Focus & Z-Index

- Clicking a window calls `focus()`:
  - sets `activeWindowId`
  - updates the window’s `z` to `max(z)+1`
- Rendering sorts windows by `z` so visual stacking matches state.

### Dragging & Resizing

Implemented in `windowing/window-view.tsx`:

- Drag begins on the titlebar (`mode: 'move'`)
- Resize begins on the bottom-right handle (`mode: 'resize'`)
- Uses pointer events + `setPointerCapture` when available
- Updates are throttled via `requestAnimationFrame` to reduce re-render cost
- `window-shell.tsx` clamps rectangles to keep windows usable in the viewport.

### Session Persistence

Implemented in `windowing/storage.ts`:

- Key: `space_os_session_v1`
- Saves the whole `SpaceOSSession` as JSON (debounced)
- Loads on mount and sanitizes window rects and basic fields

### Performance Mode

- Toggle in header:
  - **High**: more stars, glow enabled, blur effects enabled
  - **Low**: fewer stars, lower animation fps cap, blur reduced/disabled

`ui/space-background.tsx` caps animation fps to reduce CPU/GPU load.

### Weak Device Fallback (Tabs)

`windowing/use-weak-device.ts` uses a heuristic:

- prefers-reduced-motion OR low deviceMemory OR low core count OR mobile UA
- plus a short fps probe; if fps < ~45, it forces fallback

If the device is detected weak and there is no prior saved session, the OS defaults to:

- `uiMode = 'tabs'`
- `perfMode = 'low'`

### Apps

Internal apps rendered inside the OS:

- **Universe Atlas**: list + search + tags using `data/spaceContent.json`
- **Cosmology Tools**: two calculators (Hubble law + time dilation)
- **Gallery**: categories + grid + lightbox using `data/spaceContent.json`

External launchers (dock buttons) open existing Space pages in a new tab.


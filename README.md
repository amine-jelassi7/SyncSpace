# SyncSpace 3D – Cross-Window Synchronization Lab

> ⚠️ **Note:** This project is a personal sandbox & learning template! As a Three.js beginner, I built this using a mix of official docs, AI assistance, and trial-and-error to understand cross-window sync patterns. Feel free to use it as a starter or reference!

Open `index.html` in a browser (double-click works, no build step needed).
Needs an internet connection for the Tailwind, Three.js and Lucide CDNs.

## Structure

```
index.html              Page markup
css/
  base.css              Scrollbar, grid background
  components.css        Glass panels, simulated window styling
  syntax.css            Code highlight tokens
js/
  config/
    state.js            Global state + color themes
    tailwind.config.js  Tailwind CDN config
  sync/
    broadcast.js        BroadcastChannel: send/receive state between windows
  scene/
    geometry.js         Builds the 3D shapes
    sceneFactory.js     Builds a full scene (lights, stars, group)
  simulator/
    SimWindow.js        Virtual window class (drag, resize, renderer)
    simManager.js       Add / close / focus / tile / cascade windows
  realmode/
    realMode.js         Real browser-window mode + popup spawning
  ui/
    status.js           Header window-count badge
    toast.js            Toast notifications
    tabs.js             Simulator / Real tab switching
    controls.js         Sidebar controls (shape, theme, speed, toggles)
  export/
    codeExport.js       Standalone example code + copy helper
  main.js               FPS meter, animation loop, startup
```

## Note on script order

These are plain `<script>` files (not ES modules) so the inline `onclick="..."`
handlers in the HTML keep working. They share globals, so the order of the
`<script>` tags at the bottom of `index.html` matters.




const state = {
  activeTab: 'sim', // 'sim' | 'real' | 'code'
  shape: 'torusKnot',
  theme: 'cyberpunk',
  rotX: 0.4,
  rotY: 0.6,
  rotSpeed: 1.0,
  autoRotate: true,
  wireframe: false,
  isDraggingGlobal: false,
  lastMouseX: 0,
  lastMouseY: 0
};


const themes = {
  cyberpunk: { primary: 0x00f0ff, secondary: 0xff007f, accent: 0x8b5cf6, bg: 0x080a10 },
  emerald: { primary: 0x00ff88, secondary: 0x00b8ff, accent: 0xffe600, bg: 0x03140e },
  deepspace: { primary: 0x8b5cf6, secondary: 0x3b82f6, accent: 0xec4899, bg: 0x070617 },
  sunset: { primary: 0xf97316, secondary: 0xf43f5e, accent: 0xfacc15, bg: 0x140608 }
};

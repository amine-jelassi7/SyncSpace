


let realModeRenderer, realModeScene, realModeCamera, realModeMainGroup;

function initRealModeEngine() {
  const canvas = document.getElementById('real-mode-canvas');
  if (!canvas) return;

  realModeRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  realModeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const sceneObj = createShared3DScene(state.theme, state.shape, state.wireframe);
  realModeScene = sceneObj.scene;
  realModeMainGroup = sceneObj.mainGroup;

  realModeCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  realModeCamera.position.z = 8;

  window.addEventListener('resize', onRealWindowResize);
  onRealWindowResize();

  // Drag to orbit real mode
  canvas.addEventListener('mousedown', (e) => {
    state.isDraggingGlobal = true;
    state.lastMouseX = e.clientX;
    state.lastMouseY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (state.isDraggingGlobal && state.activeTab === 'real') {
      const dx = e.clientX - state.lastMouseX;
      const dy = e.clientY - state.lastMouseY;
      state.rotY += dx * 0.008;
      state.rotX += dy * 0.008;
      state.lastMouseX = e.clientX;
      state.lastMouseY = e.clientY;
      broadcastStateUpdate();
    }
  });
}

function onRealWindowResize() {
  if (!realModeRenderer || !realModeCamera) return;
  realModeRenderer.setSize(window.innerWidth, window.innerHeight);
  realModeCamera.aspect = window.innerWidth / window.innerHeight;
  realModeCamera.updateProjectionMatrix();
}

function renderRealMode() {
  if (!realModeRenderer || !realModeCamera || state.activeTab !== 'real') return;

  // Real physical screen offsets
  const fullW = window.screen.width;
  const fullH = window.screen.height;
  const offsetX = window.screenX || window.screenLeft || 0;
  const offsetY = window.screenY || window.screenTop || 0;

  realModeCamera.setViewOffset(
    fullW,
    fullH,
    offsetX,
    offsetY,
    window.innerWidth,
    window.innerHeight
  );

  if (realModeMainGroup) {
    realModeMainGroup.rotation.x = state.rotX;
    realModeMainGroup.rotation.y = state.rotY;
  }

  realModeRenderer.render(realModeScene, realModeCamera);
}

function spawnRealWindow() {
  const w = 520;
  const h = 480;
  const left = Math.round(window.screenX + 50 + Math.random() * 200);
  const top = Math.round(window.screenY + 50 + Math.random() * 200);

  const win = window.open(
    window.location.href,
    `sync_win_${Date.now()}`,
    `width=${w},height=${h},left=${left},top=${top},resizable=yes`
  );

  if (!win) {
    showToast("Popup blocked by browser! Use the 'In-Canvas Simulator' tab.", "amber");
  } else {
    showToast("New synchronized popup window spawned!", "cyan");
  }
}

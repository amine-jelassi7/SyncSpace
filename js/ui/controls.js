

function setShape(shapeKey) {
  state.shape = shapeKey;
  document.querySelectorAll('.shape-btn').forEach(btn => {
    if (btn.id === `shape-${shapeKey}`) {
      btn.className = "shape-btn flex flex-col items-center p-2.5 rounded-xl border border-cyan-500/50 bg-cyan-500/10 text-cyan-300 text-xs font-medium transition-all";
    } else {
      btn.className = "shape-btn flex flex-col items-center p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all";
    }
  });

  simWindows.forEach(w => w.updateThemeAndShape());
  if (realModeScene) {
    const sceneObj = createShared3DScene(state.theme, state.shape, state.wireframe);
    realModeScene = sceneObj.scene;
    realModeMainGroup = sceneObj.mainGroup;
  }

  broadcastStateUpdate();
}

function setTheme(themeKey) {
  state.theme = themeKey;
  document.querySelectorAll('.theme-btn').forEach(btn => {
    if (btn.id === `theme-${themeKey}`) {
      btn.classList.add('border-pink-500/50', 'bg-pink-500/10', 'text-pink-300');
      btn.classList.remove('border-slate-800', 'bg-slate-900/60', 'text-slate-400');
    } else {
      btn.classList.remove('border-pink-500/50', 'bg-pink-500/10', 'text-pink-300');
      btn.classList.add('border-slate-800', 'bg-slate-900/60', 'text-slate-400');
    }
  });

  simWindows.forEach(w => w.updateThemeAndShape());
  if (realModeScene) {
    const sceneObj = createShared3DScene(state.theme, state.shape, state.wireframe);
    realModeScene = sceneObj.scene;
    realModeMainGroup = sceneObj.mainGroup;
  }

  broadcastStateUpdate();
}

function updateRotSpeed(val) {
  state.rotSpeed = parseFloat(val);
  document.getElementById('speed-val').textContent = `${state.rotSpeed.toFixed(1)}x`;
  broadcastStateUpdate();
}

function toggleAutoRot(val) {
  state.autoRotate = val;
  broadcastStateUpdate();
}

function toggleWireframe(val) {
  state.wireframe = val;
  setShape(state.shape);
}

function resetCameraAndRotation() {
  state.rotX = 0.4;
  state.rotY = 0.6;
  broadcastStateUpdate();
  showToast("Rotation reset to default", "purple");
}

function syncUIWithState() {
  document.getElementById('rot-speed').value = state.rotSpeed;
  document.getElementById('speed-val').textContent = `${state.rotSpeed.toFixed(1)}x`;
  document.getElementById('toggle-autorot').checked = state.autoRotate;
  document.getElementById('toggle-wireframe').checked = state.wireframe;
}

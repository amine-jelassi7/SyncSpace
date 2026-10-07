let frameCount = 0;
let lastFpsTime = performance.now();


function animate() {
  requestAnimationFrame(animate);

  frameCount++;
  const now = performance.now();
  if (now - lastFpsTime >= 1000) {
    document.getElementById('fps-display').textContent = `${frameCount} FPS`;
    frameCount = 0;
    lastFpsTime = now;
  }

  
  if (state.autoRotate && !state.isDraggingGlobal) {
    state.rotY += 0.004 * state.rotSpeed;
  }

  
  if (state.activeTab === 'sim') {
    simWindows.forEach(win => win.render());
  } else if (state.activeTab === 'real') {
    renderRealMode();
  }

  
  if (Math.random() < 0.05) {
    channel.postMessage({ type: 'PING', id: myWindowId });
  }
}

window.onload = () => {
  lucide.createIcons({ props: {}, nameAttr: 'data-lucide' });
  populateCodeDisplay();

  
  setTimeout(() => {
    const containerW = simContainer.clientWidth || 900;
    const containerH = simContainer.clientHeight || 500;

    addSimulatedWindow(40, 40);
    addSimulatedWindow(Math.min(containerW - 380, 420), 100);
  }, 100);

  animate();
};

class SimWindow {
  constructor(id, title, x, y, width, height) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.title = title;

    this.createElement();
    this.initThree();
  }

  createElement() {
    const el = document.createElement('div');
    el.id = `sim-win-${this.id}`;
    el.className = `sim-window absolute rounded-xl glass-panel border border-slate-700/80 overflow-hidden flex flex-col cursor-move select-none`;
    el.style.left = `${this.x}px`;
    el.style.top = `${this.y}px`;
    el.style.width = `${this.width}px`;
    el.style.height = `${this.height}px`;

    el.innerHTML = `
      <!-- Window Header -->
      <div class="win-header px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-medium text-slate-300">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
          <span class="font-mono text-[11px]">${this.title}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <button onclick="closeSimWindow('${this.id}', event)" class="p-1 hover:bg-rose-500/20 hover:text-rose-400 rounded text-slate-400 transition-colors">
            <i data-lucide="x" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
      <!-- Canvas Body -->
      <div class="flex-1 relative bg-slate-950 overflow-hidden">
        <canvas id="canvas-${this.id}" class="w-full h-full block"></canvas>
        <div class="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-cyan-300 pointer-events-none">
          Offset: <span id="pos-info-${this.id}">0,0</span>
        </div>
      </div>
      <!-- Resize Handle -->
      <div class="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center text-slate-600 hover:text-cyan-400">
        <i data-lucide="grip-vertical" class="w-3 h-3 rotate-45"></i>
      </div>
    `;

    simContainer.appendChild(el);
    this.element = el;
    lucide.createIcons({ props: {}, nameAttr: 'data-lucide' });

    this.attachEvents();
  }

  attachEvents() {
    const header = this.element.querySelector('.win-header');
    const resizeHandle = this.element.querySelector('.resize-handle');
    const canvas = this.element.querySelector('canvas');

    
    let isDragging = false;
    let startX, startY, initX, initY;

    header.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initX = this.x;
      initY = this.y;
      focusSimWindow(this.id);
    });

    
    let isResizing = false;
    let initW, initH;

    resizeHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      initW = this.width;
      initH = this.height;
      focusSimWindow(this.id);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        this.x = Math.max(0, Math.min(simContainer.clientWidth - this.width, initX + dx));
        this.y = Math.max(0, Math.min(simContainer.clientHeight - this.height, initY + dy));
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
      } else if (isResizing) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        this.width = Math.max(220, Math.min(800, initW + dx));
        this.height = Math.max(180, Math.min(600, initH + dy));
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        this.resizeCanvas();
      } else if (state.isDraggingGlobal && activeSimWinId === this.id) {
        const dx = e.clientX - state.lastMouseX;
        const dy = e.clientY - state.lastMouseY;
        state.rotY += dx * 0.008;
        state.rotX += dy * 0.008;
        state.lastMouseX = e.clientX;
        state.lastMouseY = e.clientY;
        broadcastStateUpdate();
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      isResizing = false;
      state.isDraggingGlobal = false;
    });

    
    canvas.addEventListener('mousedown', (e) => {
      focusSimWindow(this.id);
      state.isDraggingGlobal = true;
      state.lastMouseX = e.clientX;
      state.lastMouseY = e.clientY;
    });
  }

  initThree() {
    const canvas = document.getElementById(`canvas-${this.id}`);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const sceneObj = createShared3DScene(state.theme, state.shape, state.wireframe);
    this.scene = sceneObj.scene;
    this.mainGroup = sceneObj.mainGroup;

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.z = 8;

    this.resizeCanvas();
  }

  resizeCanvas() {
    const canvas = document.getElementById(`canvas-${this.id}`);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    this.renderer.setSize(rect.width, rect.height, false);
  }

  render() {
    if (!this.renderer || !this.camera) return;

    
    const totalW = simContainer.clientWidth || 1000;
    const totalH = simContainer.clientHeight || 600;

    
    this.camera.setViewOffset(
      totalW,
      totalH,
      this.x,
      this.y,
      this.width,
      this.height
    );

    
    if (this.mainGroup) {
      this.mainGroup.rotation.x = state.rotX;
      this.mainGroup.rotation.y = state.rotY;

      
      const inner = this.mainGroup.getObjectByName("innerPoly");
      if (inner) {
        inner.rotation.x -= 0.02;
        inner.rotation.y += 0.02;
      }
    }

    this.renderer.render(this.scene, this.camera);

    
    const infoTag = document.getElementById(`pos-info-${this.id}`);
    if (infoTag) {
      infoTag.textContent = `X:${Math.round(this.x)}, Y:${Math.round(this.y)}`;
    }
  }

  updateThemeAndShape() {
    const sceneObj = createShared3DScene(state.theme, state.shape, state.wireframe);
    this.scene = sceneObj.scene;
    this.mainGroup = sceneObj.mainGroup;
  }
}

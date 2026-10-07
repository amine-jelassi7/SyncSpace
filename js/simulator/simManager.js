


const simContainer = document.getElementById('sim-container');
const simWindows = [];
let activeSimWinId = null;

function addSimulatedWindow(customX, customY) {
  const id = Math.random().toString(36).substring(2, 7);
  const count = simWindows.length + 1;
  const w = 340;
  const h = 280;
  const x = customX !== undefined ? customX : Math.max(20, (count * 40) % (simContainer.clientWidth - w));
  const y = customY !== undefined ? customY : Math.max(20, (count * 30) % (simContainer.clientHeight - h));

  const win = new SimWindow(id, `Window #${count} [${id}]`, x, y, w, h);
  simWindows.push(win);
  focusSimWindow(id);
  updateWindowCountBadge();
}

function closeSimWindow(id, e) {
  if (e) e.stopPropagation();
  const idx = simWindows.findIndex(w => w.id === id);
  if (idx !== -1) {
    simWindows[idx].element.remove();
    simWindows.splice(idx, 1);
  }
  updateWindowCountBadge();
}

function focusSimWindow(id) {
  activeSimWinId = id;
  simWindows.forEach(w => {
    if (w.id === id) {
      w.element.classList.add('active');
      w.element.style.zIndex = '30';
    } else {
      w.element.classList.remove('active');
      w.element.style.zIndex = '10';
    }
  });
}

function arrangeWindows(mode) {
  const containerW = simContainer.clientWidth;
  const containerH = simContainer.clientHeight;
  const total = simWindows.length;
  if (total === 0) return;

  if (mode === 'tile') {
    const cols = total > 2 ? 2 : total;
    const rows = Math.ceil(total / cols);
    const w = Math.floor((containerW - (cols + 1) * 15) / cols);
    const h = Math.floor((containerH - (rows + 1) * 15) / rows);

    simWindows.forEach((win, idx) => {
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      win.x = 15 + c * (w + 15);
      win.y = 15 + r * (h + 15);
      win.width = w;
      win.height = h;
      win.element.style.left = `${win.x}px`;
      win.element.style.top = `${win.y}px`;
      win.element.style.width = `${win.width}px`;
      win.element.style.height = `${win.height}px`;
      win.resizeCanvas();
    });
  } else {
    
    simWindows.forEach((win, idx) => {
      win.x = 30 + idx * 40;
      win.y = 30 + idx * 35;
      win.width = 360;
      win.height = 280;
      win.element.style.left = `${win.x}px`;
      win.element.style.top = `${win.y}px`;
      win.element.style.width = `${win.width}px`;
      win.element.style.height = `${win.height}px`;
      win.resizeCanvas();
    });
  }
}

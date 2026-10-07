
const channel = new BroadcastChannel('syncspace_3d_channel');
const myWindowId = 'win_' + Math.random().toString(36).substring(2, 9);
let realWindowsMap = new Map();


channel.onmessage = (event) => {
  const data = event.data;
  if (!data) return;

  if (data.type === 'STATE_UPDATE') {
    state.rotX = data.rotX;
    state.rotY = data.rotY;
    state.shape = data.shape;
    state.theme = data.theme;
    state.rotSpeed = data.rotSpeed;
    state.autoRotate = data.autoRotate;
    state.wireframe = data.wireframe;
    syncUIWithState();
  } else if (data.type === 'PING') {
    realWindowsMap.set(data.id, Date.now());
    updateWindowCountBadge();
  }
};

function broadcastStateUpdate() {
  channel.postMessage({
    type: 'STATE_UPDATE',
    rotX: state.rotX,
    rotY: state.rotY,
    shape: state.shape,
    theme: state.theme,
    rotSpeed: state.rotSpeed,
    autoRotate: state.autoRotate,
    wireframe: state.wireframe
  });
}

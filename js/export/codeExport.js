


const standaloneCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cross-Window 3D Scene Sync</title>
  <style>
body { margin: 0; overflow: hidden; background: #05050a; }
canvas { width: 100vw; height: 100vh; display: block; }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>
</head>
<body>
  <canvas id="stage"></canvas>
  <script>
// 1. Setup Three.js Scene
const canvas = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 7;

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const light = new THREE.PointLight(0x00f0ff, 2, 50);
light.position.set(10, 10, 10);
scene.add(light);

// 3D Geometry (Glowing Torus Knot)
const geo = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32);
const mat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, wireframe: true });
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

// 2. Inter-Window Synchronization via BroadcastChannel
const channel = new BroadcastChannel('cross_window_3d');

// Sync state on mouse drag
let isDragging = false, lastX = 0, lastY = 0;
window.addEventListener('mousedown', (e) => { isDragging = true; lastX = e.clientX; lastY = e.clientY; });
window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('mousemove', (e) => {
  if (isDragging) {
    mesh.rotation.y += (e.clientX - lastX) * 0.008;
    mesh.rotation.x += (e.clientY - lastY) * 0.008;
    lastX = e.clientX; lastY = e.clientY;
    channel.postMessage({ rotX: mesh.rotation.x, rotY: mesh.rotation.y });
  }
});

channel.onmessage = (e) => {
  if (e.data.rotX !== undefined) {
    mesh.rotation.x = e.data.rotX;
    mesh.rotation.y = e.data.rotY;
  }
};

// 3. Dynamic Camera View Offset Loop
function render() {
  requestAnimationFrame(render);

  // Auto-rotation if idle
  if (!isDragging) mesh.rotation.y += 0.005;

  // Calculate physical screen offsets
  const fullWidth = window.screen.width;
  const fullHeight = window.screen.height;
  const offsetX = window.screenX || window.screenLeft || 0;
  const offsetY = window.screenY || window.screenTop || 0;

  // Update camera offset to slice virtual monitor space
  camera.setViewOffset(fullWidth, fullHeight, offsetX, offsetY, window.innerWidth, window.innerHeight);

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

render();
  <\/script>
</body>
</html>`;

function populateCodeDisplay() {
  const pre = document.getElementById('code-display');
  if (!pre) return;

  // Escape HTML
  const escaped = standaloneCode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  pre.innerHTML = escaped;
}

function copySourceCode() {
  const code = standaloneCode;
  const btn = document.getElementById('btn-copy-code');

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(code);
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
  }

  btn.innerHTML = `<i data-lucide="check" class="w-4 h-4"></i> Copied to Clipboard!`;
  btn.classList.replace('bg-cyan-500', 'bg-emerald-400');
  lucide.createIcons({ props: {}, nameAttr: 'data-lucide' });

  setTimeout(() => {
    btn.innerHTML = `<i data-lucide="copy" class="w-4 h-4"></i> Copy Standalone Code`;
    btn.classList.replace('bg-emerald-400', 'bg-cyan-500');
    lucide.createIcons({ props: {}, nameAttr: 'data-lucide' });
  }, 2500);
}

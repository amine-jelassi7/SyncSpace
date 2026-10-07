
function createShared3DScene(themeKey, shapeKey, isWireframe) {
  const scene = new THREE.Scene();
  const theme = themes[themeKey];

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(theme.primary, 2, 50);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(theme.secondary, 2, 50);
  pointLight2.position.set(-10, -10, -10);
  scene.add(pointLight2);

  // Create geometry group
  const mainGroup = new THREE.Group();
  mainGroup.name = "mainGroup";

  buildGeometryForGroup(mainGroup, shapeKey, theme, isWireframe);

  scene.add(mainGroup);

  // Background starfield
  const starsGeo = new THREE.BufferGeometry();
  const starCount = 600;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 60;
  }
  starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.5 });
  const starField = new THREE.Points(starsGeo, starsMat);
  scene.add(starField);

  return { scene, mainGroup, pointLight1, pointLight2 };
}

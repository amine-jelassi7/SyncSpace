

function buildGeometryForGroup(group, shapeKey, theme, isWireframe) {
  while (group.children.length > 0) {
    const child = group.children[0];
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
      else child.material.dispose();
    }
    group.remove(child);
  }

  if (shapeKey === 'torusKnot') {
    const geo = new THREE.TorusKnotGeometry(1.5, 0.45, 128, 32);
    const mat = new THREE.MeshStandardMaterial({
      color: theme.primary,
      metalness: 0.6,
      roughness: 0.2,
      wireframe: isWireframe,
      emissive: theme.secondary,
      emissiveIntensity: 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    const outerGeo = new THREE.TorusGeometry(3, 0.05, 16, 100);
    const outerMat = new THREE.MeshBasicMaterial({ color: theme.accent, wireframe: true });
    group.add(new THREE.Mesh(outerGeo, outerMat));

  } else if (shapeKey === 'polyhedron') {
    const geo = new THREE.IcosahedronGeometry(2, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: theme.secondary,
      wireframe: true,
      emissive: theme.primary,
      emissiveIntensity: 0.5
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    const innerGeo = new THREE.OctahedronGeometry(1, 0);
    const innerMat = new THREE.MeshStandardMaterial({ color: theme.accent, metalness: 0.8, roughness: 0.1 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.name = "innerPoly";
    group.add(innerMesh);

  } else if (shapeKey === 'swarm') {
    const count = 1800;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color(theme.primary);
    const c2 = new THREE.Color(theme.secondary);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const radius = 0.5 + u * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.5;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const mixedColor = c1.clone().lerp(c2, u);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.9 });
    group.add(new THREE.Points(geo, mat));

  } else if (shapeKey === 'orbital') {
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(1.2 + i * 0.8, 0.04, 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: i === 0 ? theme.primary : (i === 1 ? theme.secondary : theme.accent),
        wireframe: isWireframe
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / (i + 1.5);
      ring.rotation.y = Math.PI / (i + 2);
      group.add(ring);
    }

    
    const nucGeo = new THREE.SphereGeometry(0.6, 32, 32);
    const nucMat = new THREE.MeshStandardMaterial({ color: theme.primary, metalness: 0.9, roughness: 0.1 });
    group.add(new THREE.Mesh(nucGeo, nucMat));
  }
}

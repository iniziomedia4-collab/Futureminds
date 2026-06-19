/* Futureminds v2 — Three.js knowledge sphere (home hero) */
window.initHero3D = function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !window.THREE) return;
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer, scene, camera, group, raf, mouseX = 0, mouseY = 0;
  try { renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true }); }
  catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 15;
  group = new THREE.Group(); scene.add(group);

  const R = 6, N = 120, pts = [];
  for (let i = 0; i < N; i++) {
    const phi = Math.acos(1 - 2 * (i + 0.5) / N);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    pts.push(new THREE.Vector3(R * Math.cos(theta) * Math.sin(phi), R * Math.sin(theta) * Math.sin(phi), R * Math.cos(phi)));
  }
  const geo = new THREE.BufferGeometry();
  const posArr = new Float32Array(N * 3);
  pts.forEach((p, i) => { posArr[i * 3] = p.x; posArr[i * 3 + 1] = p.y; posArr[i * 3 + 2] = p.z; });
  geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  group.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xC8A24B, size: 0.16, transparent: true, opacity: 0.9 })));

  const linePos = [];
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (pts[i].distanceTo(pts[j]) < 2.6) {
    linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
  }
  const lgeo = new THREE.BufferGeometry();
  lgeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3));
  group.add(new THREE.LineSegments(lgeo, new THREE.LineBasicMaterial({ color: 0x5e7bb8, transparent: true, opacity: 0.28 })));

  const hubGeo = new THREE.SphereGeometry(0.22, 16, 16);
  const hubMat = new THREE.MeshBasicMaterial({ color: 0xE8D9A8 });
  const hubs = [];
  for (let k = 0; k < 7; k++) { const m = new THREE.Mesh(hubGeo, hubMat.clone()); m.position.copy(pts[Math.floor(k * N / 7)]); group.add(m); hubs.push(m); }

  group.add(new THREE.Mesh(new THREE.SphereGeometry(2.4, 32, 32), new THREE.MeshBasicMaterial({ color: 0x102A56, transparent: true, opacity: 0.5 })));

  function resize() {
    const w = canvas.clientWidth || canvas.offsetWidth, h = canvas.clientHeight || canvas.offsetHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  function reposition() { group.position.x = window.innerWidth > 900 ? 4.2 : 0; group.position.y = window.innerWidth > 900 ? 0.4 : 2.4; }
  window.addEventListener('resize', () => { resize(); reposition(); });
  resize(); reposition();
  window.addEventListener('mousemove', e => { mouseX = (e.clientX / window.innerWidth - 0.5); mouseY = (e.clientY / window.innerHeight - 0.5); });

  let t = 0;
  function loop() {
    raf = requestAnimationFrame(loop);
    t += 0.01;
    group.rotation.y += REDUCED ? 0 : 0.0026;
    group.rotation.x += REDUCED ? 0 : 0.0009;
    if (!REDUCED) { group.rotation.y += mouseX * 0.0015; group.rotation.x += mouseY * 0.0012; }
    hubs.forEach((m, i) => { const s = 1 + Math.sin(t * 2 + i) * 0.18; m.scale.set(s, s, s); });
    renderer.render(scene, camera);
  }
  loop();
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else loop(); });
};

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export default function SyncSculpture({ className = '', interactive = true }) {
  const mountRef = useRef(null);

  const sceneStateRef = useRef({
    finish: 'evergreen',
    spacing: 0,
    targetSpacing: 0,
    view: 'orbit',
    isHovered: false,
    pointerX: 0,
    pointerY: 0,
    targetRotationX: 0.25,
    targetRotationY: 0.45,
    currentRotationX: 0.25,
    currentRotationY: 0.45,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.8, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(3.5, 4.5, 3.0);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xe8f0ec, 0x173d32, 1.1);
    hemiLight.position.set(0, 5, 0);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xd8c29a, 1.2);
    rimLight.position.set(-3.5, -1.0, -2.5);
    scene.add(rimLight);

    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const gradient = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      gradient.addColorStop(0, 'rgba(23, 61, 50, 0.45)');
      gradient.addColorStop(0.35, 'rgba(23, 61, 50, 0.22)');
      gradient.addColorStop(0.7, 'rgba(23, 61, 50, 0.06)');
      gradient.addColorStop(1, 'rgba(23, 61, 50, 0)');
      shadowCtx.fillStyle = gradient;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    shadowTexture.colorSpace = THREE.SRGBColorSpace;

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 3.8),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.45;
    scene.add(shadowPlane);

    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.y = 0.05;
    scene.add(sculptureGroup);

    const createMaterials = (finish) => {
      if (finish === 'platinum') {
        return {
          primary: new THREE.MeshPhysicalMaterial({
            color: 0xd7d8ce,
            metalness: 0.85,
            roughness: 0.2,
            clearcoat: 0.4,
            clearcoatRoughness: 0.1,
          }),
          accent: new THREE.MeshPhysicalMaterial({
            color: 0x7e8980,
            metalness: 0.6,
            roughness: 0.35,
          }),
          core: new THREE.MeshPhysicalMaterial({
            color: 0xc7f36b,
            metalness: 0.3,
            roughness: 0.15,
            transmission: isSoftwareGl ? 0 : 0.6,
            transparent: true,
            opacity: 0.85,
          }),
          caps: new THREE.MeshStandardMaterial({
            color: 0x173d32,
            metalness: 0.9,
            roughness: 0.25,
          }),
        };
      } else if (finish === 'bronze') {
        return {
          primary: new THREE.MeshPhysicalMaterial({
            color: 0x2e2318,
            metalness: 0.75,
            roughness: 0.28,
            clearcoat: 0.5,
          }),
          accent: new THREE.MeshPhysicalMaterial({
            color: 0xd8c29a,
            metalness: 0.92,
            roughness: 0.18,
          }),
          core: new THREE.MeshPhysicalMaterial({
            color: 0xeae9df,
            metalness: 0.4,
            roughness: 0.2,
          }),
          caps: new THREE.MeshStandardMaterial({
            color: 0xc7f36b,
            metalness: 0.8,
            roughness: 0.3,
          }),
        };
      }
      return {
        primary: new THREE.MeshPhysicalMaterial({
          color: 0x173d32,
          metalness: 0.4,
          roughness: 0.32,
          clearcoat: 0.3,
          clearcoatRoughness: 0.2,
        }),
        accent: new THREE.MeshPhysicalMaterial({
          color: 0xd8c29a,
          metalness: 0.88,
          roughness: 0.22,
          clearcoat: 0.5,
        }),
        core: new THREE.MeshPhysicalMaterial({
          color: 0xc7f36b,
          metalness: 0.5,
          roughness: 0.25,
          emissive: 0x173d32,
          emissiveIntensity: 0.2,
        }),
        caps: new THREE.MeshStandardMaterial({
          color: 0x102820,
          metalness: 0.85,
          roughness: 0.3,
        }),
      };
    };

    let activeMatSet = createMaterials(sceneStateRef.current.finish);

    const ring1Geom = new THREE.TorusGeometry(1.25, 0.18, 32, 90);
    const ring1Mesh = new THREE.Mesh(ring1Geom, activeMatSet.primary);
    ring1Mesh.rotation.x = Math.PI * 0.35;
    ring1Mesh.rotation.y = Math.PI * 0.15;
    ring1Mesh.castShadow = !isSoftwareGl;
    ring1Mesh.receiveShadow = !isSoftwareGl;
    sculptureGroup.add(ring1Mesh);

    const ring2Geom = new THREE.TorusGeometry(1.22, 0.16, 32, 90);
    const ring2Mesh = new THREE.Mesh(ring2Geom, activeMatSet.accent);
    ring2Mesh.rotation.x = -Math.PI * 0.32;
    ring2Mesh.rotation.y = Math.PI * 0.42;
    ring2Mesh.castShadow = !isSoftwareGl;
    ring2Mesh.receiveShadow = !isSoftwareGl;
    sculptureGroup.add(ring2Mesh);

    const ring3Geom = new THREE.TorusGeometry(0.85, 0.1, 24, 72);
    const ring3Mesh = new THREE.Mesh(ring3Geom, activeMatSet.accent);
    ring3Mesh.rotation.y = Math.PI * 0.25;
    sculptureGroup.add(ring3Mesh);

    const collarGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 32);
    const collar1 = new THREE.Mesh(collarGeom, activeMatSet.caps);
    collar1.position.set(0.9, 0.4, 0.3);
    collar1.rotation.z = 0.4;
    sculptureGroup.add(collar1);

    const collar2 = new THREE.Mesh(collarGeom, activeMatSet.caps);
    collar2.position.set(-0.85, -0.35, -0.25);
    collar2.rotation.z = -0.4;
    sculptureGroup.add(collar2);

    const coreGeom = new THREE.SphereGeometry(0.38, 32, 32);
    const coreMesh = new THREE.Mesh(coreGeom, activeMatSet.core);
    sculptureGroup.add(coreMesh);

    const satelliteGeom = new THREE.SphereGeometry(0.12, 20, 20);
    const sat1 = new THREE.Mesh(satelliteGeom, activeMatSet.accent);
    sat1.position.set(1.45, 0.2, -0.4);
    sculptureGroup.add(sat1);

    const sat2 = new THREE.Mesh(satelliteGeom, activeMatSet.primary);
    sat2.position.set(-1.4, -0.15, 0.45);
    sculptureGroup.add(sat2);

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      sceneStateRef.current.pointerX = x;
      sceneStateRef.current.pointerY = y;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;

        sceneStateRef.current.targetRotationY += deltaX * 0.008;
        sceneStateRef.current.targetRotationX += deltaY * 0.008;
        sceneStateRef.current.targetRotationX = Math.max(
          -0.6,
          Math.min(0.8, sceneStateRef.current.targetRotationX)
        );
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    let frameId = 0;
    let lastTime = performance.now();
    let currentFinish = sceneStateRef.current.finish;

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (sceneStateRef.current.finish !== currentFinish) {
        currentFinish = sceneStateRef.current.finish;
        const newMats = createMaterials(currentFinish);
        ring1Mesh.material = newMats.primary;
        ring2Mesh.material = newMats.accent;
        ring3Mesh.material = newMats.accent;
        collar1.material = newMats.caps;
        collar2.material = newMats.caps;
        coreMesh.material = newMats.core;
        sat1.material = newMats.accent;
        sat2.material = newMats.primary;
        activeMatSet = newMats;
      }

      const currentSpacing = sceneStateRef.current.spacing;
      const targetSpacing = sceneStateRef.current.targetSpacing;
      sceneStateRef.current.spacing += (targetSpacing - currentSpacing) * (1 - Math.exp(-6 * dt));

      ring1Mesh.position.y = sceneStateRef.current.spacing * 0.35;
      ring2Mesh.position.y = -sceneStateRef.current.spacing * 0.35;
      collar1.position.x = 0.9 + sceneStateRef.current.spacing * 0.2;
      collar2.position.x = -0.85 - sceneStateRef.current.spacing * 0.2;

      const view = sceneStateRef.current.view;
      let targetCamY = 0.8;
      let targetCamZ = 5.2;
      let targetCamX = 0;

      if (view === 'elevation') {
        targetCamY = 0.15;
        targetCamZ = 4.8;
      } else if (view === 'top') {
        targetCamY = 3.6;
        targetCamZ = 3.2;
      }

      camera.position.x += (targetCamX - camera.position.x) * (1 - Math.exp(-5 * dt));
      camera.position.y += (targetCamY - camera.position.y) * (1 - Math.exp(-5 * dt));
      camera.position.z += (targetCamZ - camera.position.z) * (1 - Math.exp(-5 * dt));
      camera.lookAt(0, 0, 0);

      if (!isDragging) {
        sceneStateRef.current.targetRotationY += 0.22 * dt;
        const py = sceneStateRef.current.pointerY;
        const parallaxX = 0.25 + py * 0.15;
        sceneStateRef.current.targetRotationX += (parallaxX - sceneStateRef.current.targetRotationX) * 0.05;
      }

      sceneStateRef.current.currentRotationX +=
        (sceneStateRef.current.targetRotationX - sceneStateRef.current.currentRotationX) *
        (1 - Math.exp(-8 * dt));
      sceneStateRef.current.currentRotationY +=
        (sceneStateRef.current.targetRotationY - sceneStateRef.current.currentRotationY) *
        (1 - Math.exp(-8 * dt));

      sculptureGroup.rotation.x = sceneStateRef.current.currentRotationX;
      sculptureGroup.rotation.y = sceneStateRef.current.currentRotationY;

      const breathing = Math.sin(now * 0.0015) * 0.04;
      sculptureGroup.position.y = 0.05 + breathing;
      shadowPlane.scale.setScalar(1 - breathing * 0.6);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);

      renderer.dispose();
      ring1Geom.dispose();
      ring2Geom.dispose();
      ring3Geom.dispose();
      collarGeom.dispose();
      coreGeom.dispose();
      satelliteGeom.dispose();
      shadowTexture.dispose();
      if (container.contains(domElem)) {
        container.removeChild(domElem);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center select-none ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-full min-h-[380px] max-h-[520px] cursor-grab active:cursor-grabbing flex items-center justify-center"
        title="Click and drag to rotate the StaffSync 3D sculpture"
      />

    </div>
  );
}

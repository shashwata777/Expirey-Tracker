import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Background3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0805, 0.0018);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0d0805, 1);
    currentMount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x2d1a0e, 1.5);
    scene.add(ambientLight);

    const goldPointLight1 = new THREE.PointLight(0xf59e0b, 2.5, 180);
    goldPointLight1.position.set(40, 30, 40);
    scene.add(goldPointLight1);

    const warmPointLight2 = new THREE.PointLight(0xd97706, 2, 160);
    warmPointLight2.position.set(-40, -30, 30);
    scene.add(warmPointLight2);

    // 1. Golden Particle Cloud
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const goldColors = [
      new THREE.Color(0xf59e0b),
      new THREE.Color(0xfbbf24),
      new THREE.Color(0xfcd34d),
      new THREE.Color(0xd97706),
      new THREE.Color(0x92400e),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 220;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 140;

      const col = goldColors[Math.floor(Math.random() * goldColors.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      scales[i] = Math.random() * 2 + 0.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(251,191,36,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 2. Floating 3D Geometric Meshes (Gold & Amber Obsidian Polyhedrons)
    const geometries = [
      new THREE.IcosahedronGeometry(6, 0),
      new THREE.OctahedronGeometry(5, 0),
      new THREE.TorusGeometry(8, 0.4, 16, 50),
      new THREE.DodecahedronGeometry(5, 0),
      new THREE.TorusGeometry(12, 0.3, 16, 60),
    ];

    const meshGroup = new THREE.Group();

    const shapeMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0x24150a,
        emissive: 0x92400e,
        emissiveIntensity: 0.35,
        roughness: 0.25,
        metalness: 0.9,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.2,
        roughness: 0.3,
        metalness: 0.85,
        wireframe: false,
        transparent: true,
        opacity: 0.25,
      }),
    ];

    const shapes = [];
    const positionsList = [
      [-55, 25, -20],
      [60, -20, -30],
      [-45, -30, -10],
      [50, 35, -25],
      [0, -40, -15],
      [-10, 40, -35],
    ];

    positionsList.forEach((pos, idx) => {
      const geo = geometries[idx % geometries.length];
      const mat = shapeMaterials[idx % shapeMaterials.length];
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      shapes.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.006,
        rotSpeedY: (Math.random() - 0.5) * 0.008,
        floatSpeed: 0.001 + Math.random() * 0.001,
        initialY: pos[1],
      });
      meshGroup.add(mesh);
    });

    scene.add(meshGroup);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax
      targetX += (mouseX * 12 - targetX) * 0.03;
      targetY += (-mouseY * 12 - targetY) * 0.03;

      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // Rotate particle nebula
      particleSystem.rotation.y = elapsedTime * 0.02;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.01) * 0.1;

      // Animate 3D meshes
      shapes.forEach((item) => {
        item.mesh.rotation.x += item.rotSpeedX;
        item.mesh.rotation.y += item.rotSpeedY;
        item.mesh.position.y = item.initialY + Math.sin(elapsedTime * 1.2 + item.initialY) * 4;
      });

      // Subtle light oscillation
      goldPointLight1.position.x = 40 + Math.sin(elapsedTime * 0.5) * 15;
      goldPointLight1.position.y = 30 + Math.cos(elapsedTime * 0.4) * 15;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 10%, #20140c 0%, #0f0a06 55%, #080402 100%)',
      }}
    />
  );
};

export default Background3D;

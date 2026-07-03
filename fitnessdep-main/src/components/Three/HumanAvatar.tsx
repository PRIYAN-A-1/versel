'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HumanAvatar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    
    // --- CAMERA ---
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00f0ff, 2, 50);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const purpleLight = new THREE.PointLight(0xbd00ff, 1.5, 50);
    purpleLight.position.set(-2, -3, 4);
    scene.add(purpleLight);

    // --- PROCEDURAL HUMAN MODEL ---
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // Material definitions
    const pointMaterial = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xbd00ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });

    const skeletonMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.4
    });

    // 1. Head (Particle Sphere)
    const headGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const headPoints = new THREE.Points(headGeo, pointMaterial);
    headPoints.position.y = 1.3;
    avatarGroup.add(headPoints);

    // 2. Spine & Ribs (Wireframe structures)
    const ribGeo = new THREE.CylinderGeometry(0.4, 0.25, 0.9, 8, 4, true);
    const ribs = new THREE.Mesh(ribGeo, wireframeMaterial);
    ribs.position.y = 0.5;
    avatarGroup.add(ribs);

    const spineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.0, 0),
      new THREE.Vector3(0, 0.0, 0)
    ]);
    const spine = new THREE.Line(spineGeo, skeletonMaterial);
    avatarGroup.add(spine);

    // 3. Limbs (Futuristic Joint Connections)
    const joints: THREE.Vector3[] = [
      new THREE.Vector3(-0.4, 0.9, 0), // left shoulder
      new THREE.Vector3(-0.7, 0.4, 0), // left elbow
      new THREE.Vector3(-0.9, -0.1, 0), // left hand
      new THREE.Vector3(0.4, 0.9, 0),  // right shoulder
      new THREE.Vector3(0.7, 0.4, 0),  // right elbow
      new THREE.Vector3(0.9, -0.1, 0),  // right hand
      new THREE.Vector3(-0.25, 0.0, 0), // left hip
      new THREE.Vector3(-0.3, -0.6, 0), // left knee
      new THREE.Vector3(-0.35, -1.3, 0), // left foot
      new THREE.Vector3(0.25, 0.0, 0),  // right hip
      new THREE.Vector3(0.3, -0.6, 0),  // right knee
      new THREE.Vector3(0.35, -1.3, 0)   // right foot
    ];

    // Draw lines between joints to simulate digital bones
    const skeletonPoints = [
      // Left arm
      [joints[0], joints[1]], [joints[1], joints[2]],
      // Right arm
      [joints[3], joints[4]], [joints[4], joints[5]],
      // Left leg
      [joints[6], joints[7]], [joints[7], joints[8]],
      // Right leg
      [joints[9], joints[10]], [joints[10], joints[11]],
      // Shoulders & Pelvis
      [joints[0], joints[3]], [joints[6], joints[9]],
      // Hips to Spine base
      [joints[6], new THREE.Vector3(0, 0, 0)],
      [joints[9], new THREE.Vector3(0, 0, 0)],
      // Shoulders to neck
      [joints[0], new THREE.Vector3(0, 1.0, 0)],
      [joints[3], new THREE.Vector3(0, 1.0, 0)]
    ];

    skeletonPoints.forEach(([p1, p2]) => {
      const boneGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const bone = new THREE.Line(boneGeo, skeletonMaterial);
      avatarGroup.add(bone);
    });

    // Add glowing markers on joints
    const jointGeo = new THREE.BufferGeometry().setFromPoints(joints);
    const jointPoints = new THREE.Points(jointGeo, new THREE.PointsMaterial({
      color: 0x00ff88,
      size: 0.1,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    }));
    avatarGroup.add(jointPoints);

    // --- BIOMETRIC SCANNING PLANE (Futuristic Green Grid) ---
    const scanGeo = new THREE.RingGeometry(0.01, 1.1, 4, 1);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
      wireframe: true
    });
    const scanPlane = new THREE.Mesh(scanGeo, scanMat);
    scanPlane.rotation.x = Math.PI / 2;
    avatarGroup.add(scanPlane);

    // --- BACKGROUND FLOATING PARTICLES ---
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4;
      positions[i + 1] = (Math.random() - 0.5) * 4;
      positions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.03,
      transparent: true,
      opacity: 0.4,
    });
    const bgParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(bgParticles);

    // --- MOUSE TRACKING ---
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / width) * 2 - 1;
      const y = -((event.clientY - rect.top) / height) * 2 + 1;
      mouseRef.current = { x, y };
    };

    container.addEventListener('mousemove', handleMouseMove);

    // --- ANIMATION LOOP ---
    let clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // BREATHE EFFECT (Sine scaling)
      const breathe = 1.0 + Math.sin(elapsedTime * 2) * 0.03;
      headPoints.scale.set(breathe, breathe, breathe);
      ribs.scale.set(breathe, breathe, breathe);

      // SCANNING PLANE MOVEMENT
      scanPlane.position.y = Math.sin(elapsedTime * 1.5) * 1.4;
      scanPlane.rotation.z = elapsedTime * 0.5;

      // PARALLAX MOUSE INTERACTION (Smooth Lerping)
      const targetRX = mouseRef.current.y * 0.25;
      const targetRY = mouseRef.current.x * 0.4;
      
      avatarGroup.rotation.x += (targetRX - avatarGroup.rotation.x) * 0.05;
      avatarGroup.rotation.y += (targetRY - avatarGroup.rotation.y) * 0.05;
      
      // Idle slow spin
      avatarGroup.rotation.y += 0.003;

      // Spin particles
      bgParticles.rotation.y = elapsedTime * 0.02;
      bgParticles.rotation.x = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };
    animate();

    // --- WINDOW RESIZE ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[320px] relative flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-background pointer-events-none" />
      {/* HUD diagnostic lines overlays */}
      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-neon-blue/60 leading-relaxed pointer-events-none">
        <div>TELEMETRY: ONLINE</div>
        <div>SCAN_DEPTH: 100%</div>
        <div>VITALS: CALIBRATED</div>
      </div>
      <div className="absolute top-4 right-4 font-mono text-[10px] text-neon-emerald/60 text-right pointer-events-none">
        <div>SYS_LOAD: OP-82</div>
        <div>MODEL: AVATAR-CYCLES</div>
      </div>
    </div>
  );
}

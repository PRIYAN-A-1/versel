'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface FoodModelProps {
  isScanning?: boolean;
}

export default function FoodModel({ isScanning = false }: FoodModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef({ isScanning });

  // Keep scanning state in sync
  useEffect(() => {
    scanRef.current.isScanning = isScanning;
  }, [isScanning]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- SETUP ---
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- LIGHTS ---
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);

    const cyanLight = new THREE.PointLight(0x00f0ff, 2.5, 30);
    cyanLight.position.set(3, 2, 2);
    scene.add(cyanLight);

    const pinkLight = new THREE.PointLight(0xff007f, 2, 30);
    pinkLight.position.set(-3, -2, 2);
    scene.add(pinkLight);

    // --- MODEL GROUP ---
    const group = new THREE.Group();
    scene.add(group);

    // 1. Core Molecular Mesh (Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(0.6, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      metalness: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // Solid inner core that glows
    const innerGeo = new THREE.IcosahedronGeometry(0.3, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      transparent: true,
      opacity: 0.3,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    group.add(innerMesh);

    // 2. Outer Satellite Rings (Spinning rings)
    const ringGeo = new THREE.TorusGeometry(0.9, 0.02, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.4
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    group.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 2;
    group.add(ring2);

    // 3. Scanning Laser Line
    const laserGeo = new THREE.RingGeometry(0.01, 1.1, 32);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const laser = new THREE.Mesh(laserGeo, laserMat);
    laser.rotation.x = Math.PI / 2;
    scene.add(laser);

    // 4. Background Orbit Particles
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 1.0 + Math.random() * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const orbitalParticles = new THREE.Points(particleGeo, particleMat);
    group.add(orbitalParticles);

    // --- ANIMATION ---
    let clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotating geometries
      coreMesh.rotation.y = elapsedTime * 0.4;
      coreMesh.rotation.x = elapsedTime * 0.25;
      
      innerMesh.rotation.y = -elapsedTime * 0.5;
      
      ring1.rotation.z = elapsedTime * 0.6;
      ring2.rotation.x = elapsedTime * 0.3;

      // Orbit particles slow rotate
      orbitalParticles.rotation.y = elapsedTime * 0.1;

      // Float effect
      group.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      // LASER SCANNING EFFECT
      const scanning = scanRef.current.isScanning;
      if (scanning) {
        laserMat.opacity = 0.8 + Math.sin(elapsedTime * 15) * 0.2;
        // Sweep up and down
        laser.position.y = Math.sin(elapsedTime * 4.0) * 1.0;
        
        // Make core turn magenta-pink during scan
        coreMat.color.setHex(0xff007f);
        coreMat.opacity = 0.9;
        
        // Fast rotation
        group.rotation.y = elapsedTime * 2.0;
      } else {
        laserMat.opacity = 0;
        coreMat.color.setHex(0x00f0ff);
        coreMat.opacity = 0.6;
        group.rotation.y = elapsedTime * 0.15;
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- RESIZE ---
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
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[260px] flex items-center justify-center relative">
      {isScanning && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-[10px] text-neon-pink animate-pulse-fast tracking-wider">
          AI SCAN ACTIVE
        </div>
      )}
    </div>
  );
}

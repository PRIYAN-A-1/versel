'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFitnessStore } from '@/store/useFitnessStore';

export default function DashboardRings() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Get data from Zustand store to affect materials
  const { waterIntakeMl, stepsCount } = useFitnessStore();
  const waterProgress = Math.min(waterIntakeMl / 3000, 1.0);
  const stepsProgress = Math.min(stepsCount / 10000, 1.0);

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

    const blueLight = new THREE.PointLight(0x00f0ff, 2, 20);
    blueLight.position.set(3, 3, 3);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0xbd00ff, 2, 20);
    purpleLight.position.set(-3, -3, 3);
    scene.add(purpleLight);

    // --- CONCENTRIC PROGRESS RINGS ---
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);

    // Ring 1: Calories (Outer, Neon Blue)
    const ring1Geo = new THREE.TorusGeometry(0.85, 0.05, 12, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ringsGroup.add(ring1);

    // Ring 2: Steps/Workout (Middle, Neon Purple)
    // Scale steps progress to torus size or wireframe density
    const ring2Geo = new THREE.TorusGeometry(0.65, 0.045, 12, 48);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xbd00ff,
      wireframe: true,
      transparent: true,
      opacity: 0.6 + stepsProgress * 0.2,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ringsGroup.add(ring2);

    // Ring 3: Hydration (Inner, Neon Emerald Green)
    const ring3Geo = new THREE.TorusGeometry(0.45, 0.04, 12, 32);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      wireframe: true,
      transparent: true,
      opacity: 0.5 + waterProgress * 0.3,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ringsGroup.add(ring3);

    // Orbit nodes on the rings
    const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const node1 = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: 0x00ffff }));
    const node2 = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: 0xff00ff }));
    const node3 = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: 0x00ff88 }));

    ringsGroup.add(node1, node2, node3);

    // --- MOUSE HOVER INTERACTION ---
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / width) * 2 - 1;
      const y = -((e.clientY - rect.top) / height) * 2 + 1;
      mouseRef.current = { x, y };
    };
    container.addEventListener('mousemove', handleMouseMove);

    // --- ANIMATION ---
    let clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Independent rotations
      ring1.rotation.z = elapsedTime * 0.25;
      ring1.rotation.y = elapsedTime * 0.1;

      ring2.rotation.z = -elapsedTime * 0.35;
      ring2.rotation.x = elapsedTime * 0.15;

      ring3.rotation.z = elapsedTime * 0.5;
      ring3.rotation.y = -elapsedTime * 0.2;

      // Animate node orbits
      const angle1 = elapsedTime * 1.5;
      node1.position.set(Math.cos(angle1) * 0.85, Math.sin(angle1) * 0.85, 0);
      node1.rotation.z = ring1.rotation.z;

      const angle2 = -elapsedTime * 2.0;
      node2.position.set(Math.cos(angle2) * 0.65, 0, Math.sin(angle2) * 0.65);
      
      const angle3 = elapsedTime * 2.5;
      node3.position.set(0, Math.cos(angle3) * 0.45, Math.sin(angle3) * 0.45);

      // Mouse Parallax
      const targetX = mouseRef.current.x * 0.3;
      const targetY = mouseRef.current.y * 0.3;
      ringsGroup.rotation.y += (targetX - ringsGroup.rotation.y) * 0.05;
      ringsGroup.rotation.x += (targetY - ringsGroup.rotation.x) * 0.05;

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
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, [waterProgress, stepsProgress]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[260px] flex items-center justify-center relative">
      <div className="absolute bottom-2 left-4 font-mono text-[9px] text-neon-blue/60 tracking-wider">
        CORE_REACTOR: ENABLED
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function TrophyRoom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, previousX: 0, rotationY: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- SETUP ---
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 250;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 4.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- LIGHTS ---
    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0x00f0ff, 3, 20);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    const goldLight = new THREE.PointLight(0xffaa00, 2, 20);
    goldLight.position.set(2, -1, 1);
    scene.add(goldLight);

    // --- SHELF AND TROPHIES GROUP ---
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // Shelf (Transparent metallic plate)
    const shelfGeo = new THREE.BoxGeometry(2.4, 0.05, 0.8);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x111125,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.y = -0.5;
    roomGroup.add(shelf);

    // Trophy 1: Torus Knot (Gold / Blue, Center)
    const t1Geo = new THREE.TorusKnotGeometry(0.24, 0.07, 64, 8);
    const t1Mat = new THREE.MeshStandardMaterial({
      color: 0xffbb00,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
      emissive: 0xffaa00,
      emissiveIntensity: 0.2
    });
    const t1 = new THREE.Mesh(t1Geo, t1Mat);
    t1.position.set(0, 0, 0);
    roomGroup.add(t1);

    // Trophy 2: Octahedron (Purple, Left)
    const t2Geo = new THREE.OctahedronGeometry(0.26, 0);
    const t2Mat = new THREE.MeshStandardMaterial({
      color: 0xbd00ff,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true,
      emissive: 0xbd00ff,
      emissiveIntensity: 0.2
    });
    const t2 = new THREE.Mesh(t2Geo, t2Mat);
    t2.position.set(-0.8, 0, 0);
    roomGroup.add(t2);

    // Trophy 3: Cone (Emerald Green, Right)
    const t3Geo = new THREE.ConeGeometry(0.22, 0.45, 6);
    const t3Mat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
      emissive: 0x00ff88,
      emissiveIntensity: 0.2
    });
    const t3 = new THREE.Mesh(t3Geo, t3Mat);
    t3.position.set(0.8, 0, 0);
    roomGroup.add(t3);

    // Glow bases
    const baseGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.1, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x22223a, metalness: 0.5 });
    
    const b1 = new THREE.Mesh(baseGeo, baseMat); b1.position.set(0, -0.42, 0);
    const b2 = new THREE.Mesh(baseGeo, baseMat); b2.position.set(-0.8, -0.42, 0);
    const b3 = new THREE.Mesh(baseGeo, baseMat); b3.position.set(0.8, -0.42, 0);
    roomGroup.add(b1, b2, b3);

    // Spark Particles
    const sparkCount = 30;
    const sparkGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2;
      positions[i + 1] = Math.random() * 0.5 - 0.25;
      positions[i + 2] = (Math.random() - 0.5) * 2;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffdd00,
      size: 0.025,
      transparent: true,
      opacity: 0.8
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    roomGroup.add(sparks);

    // --- INTERACTIVE DRAGGING ---
    const handleMouseDown = (e: MouseEvent) => {
      dragRef.current.isDragging = true;
      dragRef.current.previousX = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return;
      const deltaX = e.clientX - dragRef.current.previousX;
      dragRef.current.rotationY += deltaX * 0.01;
      dragRef.current.previousX = e.clientX;
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Support touch
    const handleTouchStart = (e: TouchEvent) => {
      dragRef.current.isDragging = true;
      dragRef.current.previousX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.isDragging) return;
      const deltaX = e.touches[0].clientX - dragRef.current.previousX;
      dragRef.current.rotationY += deltaX * 0.01;
      dragRef.current.previousX = e.touches[0].clientX;
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    // --- ANIMATION ---
    let clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animation
      roomGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.05;

      // Base rotations + Drag rotations
      const targetRY = dragRef.current.rotationY;
      roomGroup.rotation.y += (targetRY - roomGroup.rotation.y) * 0.1;
      
      // Auto idle spin if not dragging
      if (!dragRef.current.isDragging) {
        dragRef.current.rotationY += 0.004;
      }

      // Spin trophies inside their axis
      t1.rotation.y = elapsedTime * 0.8;
      t1.rotation.z = Math.sin(elapsedTime) * 0.2;

      t2.rotation.x = elapsedTime * 0.5;
      t2.rotation.y = elapsedTime * 0.7;

      t3.rotation.y = -elapsedTime * 0.9;

      // Spark particles fade in and out, drift
      const positionsArr = sparks.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkCount * 3; i += 3) {
        // Drift up
        positionsArr[i + 1] += 0.002;
        if (positionsArr[i + 1] > 0.4) {
          positionsArr[i + 1] = -0.4;
          positionsArr[i] = (Math.random() - 0.5) * 2;
          positionsArr[i + 2] = (Math.random() - 0.5) * 2;
        }
      }
      sparks.geometry.attributes.position.needsUpdate = true;

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
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[220px] flex items-center justify-center relative cursor-grab active:cursor-grabbing">
      <div className="absolute top-2 left-4 font-mono text-[9px] text-neon-blue/60 tracking-wider">
        TROPHY_SHELF: DRAG TO SPIN
      </div>
    </div>
  );
}

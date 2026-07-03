'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFitnessStore } from '@/store/useFitnessStore';

export default function WaterBottle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const waterIntakeMl = useFitnessStore((state) => state.waterIntakeMl);
  const targetRef = useRef({ fill: 0 });

  // Update target fill based on water intake ml (max 3000ml = 1.0)
  useEffect(() => {
    const fillPercent = Math.min(waterIntakeMl / 3000, 1.0);
    targetRef.current.fill = fillPercent;
  }, [waterIntakeMl]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // --- SETUP ---
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 350;
    
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- LIGHTS ---
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const violetLight = new THREE.PointLight(0xbd00ff, 2, 20);
    violetLight.position.set(-3, 2, 2);
    scene.add(violetLight);

    // --- WATER BOTTLE GROUPS ---
    const bottleGroup = new THREE.Group();
    scene.add(bottleGroup);

    // 1. Outer Glass Body (Double-sided wireframe/translucent mesh)
    const glassGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.6, 24, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      thickness: 0.5,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const glassOuter = new THREE.Mesh(glassGeo, glassMat);
    bottleGroup.add(glassOuter);

    // Glass cap
    const capGeo = new THREE.CylinderGeometry(0.35, 0.45, 0.15, 24);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.3
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.87;
    bottleGroup.add(cap);

    // Glass base
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.05, 24);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x111122, metalness: 0.5 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.82;
    bottleGroup.add(base);

    // 2. Liquid Cylinder (Scale-animated mesh)
    const liquidGeo = new THREE.CylinderGeometry(0.46, 0.46, 1.5, 24, 4);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
      roughness: 0.05,
      metalness: 0.0,
      emissive: 0x00a0ff,
      emissiveIntensity: 0.25
    });
    
    // Create a group for liquid so we can scale from the bottom
    const liquidWrapper = new THREE.Group();
    liquidWrapper.position.y = -0.75; // Align base of liquid cylinder to bottom of bottle
    
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = 0.75; // Shift center up so liquid cylinder starts at bottom of parent group
    liquidWrapper.add(liquidMesh);
    bottleGroup.add(liquidWrapper);

    // 3. Bubbles floating inside liquid
    const bubbleCount = 20;
    const bubbleGeo = new THREE.SphereGeometry(0.02, 8, 8);
    const bubbleMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const bubbles: THREE.Mesh[] = [];
    for (let i = 0; i < bubbleCount; i++) {
      const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
      // Random coordinates inside liquid volume
      bubble.position.x = (Math.random() - 0.5) * 0.7;
      bubble.position.z = (Math.random() - 0.5) * 0.7;
      bubble.position.y = Math.random() * 1.5;
      
      liquidWrapper.add(bubble);
      bubbles.push(bubble);
    }

    // --- ANIMATION ---
    let currentFill = 0;
    let clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smoothly interpolate current liquid level to target value
      const targetFill = targetRef.current.fill;
      currentFill += (targetFill - currentFill) * 0.08;
      
      // Update scaling of liquid wrapper (Y scale controls fill amount)
      liquidWrapper.scale.y = Math.max(currentFill, 0.01);
      // Make liquid opacity slightly pulsate for magical glow
      liquidMat.opacity = 0.45 + Math.sin(elapsedTime * 3) * 0.1;

      // Animate bubbles floating up
      bubbles.forEach(b => {
        // Rise speed
        b.position.y += 0.005;
        // Wiggle movement
        b.position.x += Math.sin(elapsedTime + b.position.y) * 0.002;
        
        // Wrap bubbles around top boundary (based on current fill height)
        const maxHeight = 1.5 * currentFill;
        if (b.position.y > maxHeight) {
          b.position.y = 0;
          b.position.x = (Math.random() - 0.5) * 0.7;
          b.position.z = (Math.random() - 0.5) * 0.7;
        }

        // Hide bubbles if they escape current scale height
        b.visible = b.position.y <= maxHeight;
      });

      // Slow rotation
      bottleGroup.rotation.y = elapsedTime * 0.3;
      bottleGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;

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
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px] flex items-center justify-center relative">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 font-mono text-[10px] text-neon-blue/60 tracking-wider">
        3D LIQUID TELEMETRY
      </div>
    </div>
  );
}

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const PARTICLE_COUNT = 400;
const BOOKED_COUNT = 12;
const INTERESTED_COUNT = 80;
// NO_ANSWER gets the rest

type Phase = 'chaos' | 'organizing' | 'clustered';

export default function ParticleCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Three.js setup ──────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 5;

    // ── Geometry ────────────────────────────────────────────────────────────
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    // Grid initial positions (spreadsheet-like)
    const cols = 20;
    const rows = Math.ceil(PARTICLE_COUNT / cols);
    const gridSpacingX = 0.28;
    const gridSpacingY = 0.22;

    const initialPos: [number, number, number][] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = (col - cols / 2) * gridSpacingX + (Math.random() - 0.5) * 0.05;
      const y = (row - rows / 2) * gridSpacingY + (Math.random() - 0.5) * 0.05;
      const z = (Math.random() - 0.5) * 0.3;
      initialPos.push([x, y, z]);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 1;
      colors[i * 3 + 2] = 1;
      sizes[i] = 4;
    }

    // Cluster target positions
    const noAnswerTargets: [number, number, number][] = [];
    const interestedTargets: [number, number, number][] = [];
    const bookedTargets: [number, number, number][] = [];

    const clusterRows = (n: number, cx: number) => {
      const c = Math.ceil(Math.sqrt(n));
      const r = Math.ceil(n / c);
      const out: [number, number, number][] = [];
      for (let i = 0; i < n; i++) {
        const ci = i % c;
        const ri = Math.floor(i / c);
        out.push([
          cx + (ci - c / 2) * 0.25 + (Math.random() - 0.5) * 0.06,
          (ri - r / 2) * 0.25 + (Math.random() - 0.5) * 0.06,
          (Math.random() - 0.5) * 0.1,
        ]);
      }
      return out;
    };

    const noAnswerCount = PARTICLE_COUNT - INTERESTED_COUNT - BOOKED_COUNT;
    const naTargets = clusterRows(noAnswerCount, -2.2);
    const intTargets = clusterRows(INTERESTED_COUNT, 0.1);
    const bkTargets = clusterRows(BOOKED_COUNT, 2.0);

    for (let i = 0; i < noAnswerCount; i++) noAnswerTargets.push(naTargets[i]);
    for (let i = 0; i < INTERESTED_COUNT; i++) interestedTargets.push(intTargets[i]);
    for (let i = 0; i < BOOKED_COUNT; i++) bookedTargets.push(bkTargets[i]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: { opacity: { value: 1 } },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float opacity;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float opacity;
        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.2, d);
          gl_FragColor = vec4(vColor, alpha * opacity);
        }
      `,
      transparent: true,
      vertexColors: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ── Canvas resize ───────────────────────────────────────────────────────
    function resize() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Drift velocities for chaos phase ────────────────────────────────────
    const vel: [number, number][] = initialPos.map(() => [
      (Math.random() - 0.5) * 0.003,
      (Math.random() - 0.5) * 0.003,
    ]);

    let phase: Phase = 'chaos';
    let animFrameId = 0;

    // ── Render loop ─────────────────────────────────────────────────────────
    function render() {
      animFrameId = requestAnimationFrame(render);
      if (phase === 'chaos') {
        const pos = geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          pos[i * 3] += vel[i][0];
          pos[i * 3 + 1] += vel[i][1];
          // Bounce loosely
          if (Math.abs(pos[i * 3]) > 3.5) vel[i][0] *= -1;
          if (Math.abs(pos[i * 3 + 1]) > 2.5) vel[i][1] *= -1;
        }
        geometry.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
    }
    render();

    // ── Organize into clusters ───────────────────────────────────────────────
    function organizeParticles() {
      phase = 'organizing';
      const pos = geometry.attributes.position.array as Float32Array;
      const col = geometry.attributes.color.array as Float32Array;
      const sz = geometry.attributes.size.array as Float32Array;

      // Assign targets
      let pi = 0;
      // NO ANSWER — white, stays white
      for (let i = 0; i < noAnswerCount; i++, pi++) {
        const target = noAnswerTargets[i];
        gsap.to({ x: pos[pi * 3], y: pos[pi * 3 + 1], z: pos[pi * 3 + 2] }, {
          x: target[0], y: target[1], z: target[2],
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate: function () {
            pos[pi * 3] = this.targets()[0].x;
            pos[pi * 3 + 1] = this.targets()[0].y;
            pos[pi * 3 + 2] = this.targets()[0].z;
            geometry.attributes.position.needsUpdate = true;
          },
        });
      }

      // INTERESTED — white
      for (let i = 0; i < INTERESTED_COUNT; i++, pi++) {
        const target = interestedTargets[i];
        gsap.to({ x: pos[pi * 3], y: pos[pi * 3 + 1], z: pos[pi * 3 + 2] }, {
          x: target[0], y: target[1], z: target[2],
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate: function () {
            pos[pi * 3] = this.targets()[0].x;
            pos[pi * 3 + 1] = this.targets()[0].y;
            pos[pi * 3 + 2] = this.targets()[0].z;
            geometry.attributes.position.needsUpdate = true;
          },
        });
      }

      // BOOKED — blue-glow color + pulse
      const blueR = 126 / 255, blueG = 184 / 255, blueB = 247 / 255;
      for (let i = 0; i < BOOKED_COUNT; i++, pi++) {
        const target = bookedTargets[i];
        const isStar = i === 0;
        gsap.to({ x: pos[pi * 3], y: pos[pi * 3 + 1], z: pos[pi * 3 + 2] }, {
          x: target[0], y: target[1], z: target[2],
          duration: 1.8,
          ease: 'power2.inOut',
          onUpdate: function () {
            pos[pi * 3] = this.targets()[0].x;
            pos[pi * 3 + 1] = this.targets()[0].y;
            pos[pi * 3 + 2] = this.targets()[0].z;
            geometry.attributes.position.needsUpdate = true;
          },
          onComplete: () => {
            // Set blue color
            col[pi * 3] = blueR;
            col[pi * 3 + 1] = blueG;
            col[pi * 3 + 2] = blueB;
            geometry.attributes.color.needsUpdate = true;
            // Size
            sz[pi] = isStar ? 9 : 5;
            geometry.attributes.size.needsUpdate = true;
            // Pulse the size
            const szProxy = { v: sz[pi] };
            gsap.to(szProxy, {
              v: isStar ? 13 : 7,
              duration: 1.2,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              onUpdate: () => {
                sz[pi] = szProxy.v;
                geometry.attributes.size.needsUpdate = true;
              },
            });
          },
        });
      }

      phase = 'clustered';
    }

    // ── Master loop: chaos → clusters → reset ────────────────────────────────
    function runCycle() {
      phase = 'chaos';
      // Reset positions
      const pos = geometry.attributes.position.array as Float32Array;
      const col = geometry.attributes.color.array as Float32Array;
      const sz = geometry.attributes.size.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3] = initialPos[i][0];
        pos[i * 3 + 1] = initialPos[i][1];
        pos[i * 3 + 2] = initialPos[i][2];
        col[i * 3] = 1; col[i * 3 + 1] = 1; col[i * 3 + 2] = 1;
        sz[i] = 4;
        vel[i][0] = (Math.random() - 0.5) * 0.003;
        vel[i][1] = (Math.random() - 0.5) * 0.003;
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;
    }

    // Initial trigger
    const initialTimer = setTimeout(() => {
      organizeParticles();
    }, 2500);

    // Loop every 12s
    const loopInterval = setInterval(() => {
      runCycle();
      setTimeout(organizeParticles, 2500);
    }, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(loopInterval);
      cancelAnimationFrame(animFrameId);
      ro.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}

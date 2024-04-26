'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SceneHandler } from './components/SceneHandler';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { fbxLoad } from '@/app/util/loaders';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sh = new SceneHandler();
      containerRef.current?.appendChild(sh.renderer.domElement);

      fbxLoad('/NicPad_Uta_model.fbx', (object) => {
        sh.scene.add(object);
      });
      fbxLoad('/NicPad_Body_Model.fbx', (object) => {
        sh.scene.add(object);
      });

      const stats = new Stats();
      document.body.appendChild(stats.dom);

      const animate = () => {
        requestAnimationFrame(animate);

        sh.animate();
        // sh.renderer.render(scene, camera);

        stats.update();
      };

      animate();

      const cleanMe = containerRef.current;
      return () => {
        cleanMe?.removeChild(sh.renderer.domElement);
      };
    }
  }, []);
  return <div ref={containerRef} />;
}

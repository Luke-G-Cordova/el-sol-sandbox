'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SceneHandler } from './components/SceneHandler';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {
  fbxLoad,
  customShaderMaterial,
  customTextures,
} from '@/app/util/loaders';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sh = new SceneHandler();
      containerRef.current?.appendChild(sh.renderer.domElement);

      loadUTAModel((obj) => sh.scene.add(obj));
      loadBodyModel((obj) => sh.scene.add(obj));

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

const loadUTAModel = (
  loaded: (object: THREE.Group<THREE.Object3DEventMap>) => void,
  position: THREE.Vector3 = new THREE.Vector3(-8, 1, 0)
) => {
  fbxLoad('/NicPad_Uta_model.fbx', (object) => {
    //head
    (object.children[0] as THREE.Mesh).material = customShaderMaterial(
      customTextures([
        '/UTA_Textures/Head_eyes/UTA_head_basecolor.png',
        '/UTA_Textures/Head_eyes/UTA_head_Metallic.png',
        '/UTA_Textures/Head_eyes/UTA_head_normal.png',
        '/UTA_Textures/Head_eyes/UTA_head_roughness.png',
      ])
    );

    //right eye
    (object.children[1] as THREE.Mesh).material = customShaderMaterial(
      customTextures(['/UTA_Textures/Head_eyes/UTA_eye_basecolor.png'])
    );

    //left eye
    (object.children[2] as THREE.Mesh).material = customShaderMaterial(
      customTextures(['/UTA_Textures/Head_eyes/UTA_eye_basecolor.png'])
    );

    //body
    (object.children[3] as THREE.Mesh).material = customShaderMaterial(
      customTextures([
        '/UTA_Textures/Body/UTA_Body_BaseColor.png',
        '/UTA_Textures/Body/UTA_Body_Metallic.png',
        '/UTA_Textures/Body/UTA_Body_Normal.png',
        '/UTA_Textures/Body/UTA_Body_Roughness.png',
      ])
    );
    object.rotateY(Math.PI / 2);
    object.position.set(position.x, position.y, position.z);
    loaded(object);
    // sh.scene.add(object);
  });
};

const loadBodyModel = (
  loaded: (object: THREE.Group<THREE.Object3DEventMap>) => void,
  position: THREE.Vector3 = new THREE.Vector3(-8, 1, 0)
) => {
  fbxLoad('/NicPad_Body_Model.fbx', (object) => {
    console.log(object);
    // head
    (object.children[0] as THREE.Mesh).material = customShaderMaterial(
      customTextures(['/Textures_Body_model/Head_Eyes/Head_color.jpg'])
    );
    // eye 1
    (object.children[2] as THREE.Mesh).material = customShaderMaterial(
      customTextures(['/Textures_Body_model/Head_Eyes/NicPad_Eye_color.tga'])
    );
    // eye 2
    (object.children[3] as THREE.Mesh).material = customShaderMaterial(
      customTextures(['/Textures_Body_model/Head_Eyes/NicPad_Eye_color.tga'])
    );
    // arm 1
    (object.children[5] as THREE.Mesh).material = customShaderMaterial(
      customTextures([
        '/Textures_Body_model/arms/HandArm_BaseColor.tif',
        '',
        '/Textures_Body_model/arms/HandArm_Normal.tif',
      ])
    );
    // arm 2
    (object.children[6] as THREE.Mesh).material = customShaderMaterial(
      customTextures([
        '/Textures_Body_model/arms/HandArm_BaseColor.tif',
        '',
        '/Textures_Body_model/arms/HandArm_Normal.tif',
      ])
    );

    (object.children[7] as THREE.Mesh).material = customShaderMaterial(
      customTextures([
        '/Textures_Body_model/shoes/ShoeLeft_LP_defaultMat_BaseColor.png',
        '/Textures_Body_model/shoes/ShoeLeft_LP_defaultMat_Metallic.png',
        '/Textures_Body_model/shoes/ShoeLeft_LP_defaultMat_Normal.png',
        '/Textures_Body_model/shoes/ShoeLeft_LP_defaultMat_Roughness.png',
      ])
    );
    // shoe 1
    (object.children[8] as THREE.Mesh).material = customShaderMaterial(
      customTextures([
        '/Textures_Body_model/shoes/ShoeLeft_LP_defaultMat_BaseColor.png',
        '/Textures_Body_model/shoes/ShoeLeft_LP_defaultMat_Metallic.png',
        '/Textures_Body_model/shoes/ShoeLeft_LP_defaultMat_Normal.png',
        '/Textures_Body_model/shoes/ShoeLeft_LP_defaultMat_Roughness.png',
      ])
    );
    // shoe 2
    (object.children[9] as THREE.Mesh).material = customShaderMaterial(
      customTextures([
        '/Textures_Body_model/sweater/Sweater_LP_defaultMat_BaseColor.png',
        '/Textures_Body_model/sweater/Sweater_LP_defaultMat_Metallic.png',
        '/Textures_Body_model/sweater/Sweater_LP_defaultMat_Normal.png',
        '/Textures_Body_model/sweater/Sweater_LP_defaultMat_Roughness.png',
      ])
    );
    // leggings/skirt
    (object.children[10] as THREE.Mesh).material = customShaderMaterial(
      customTextures([
        '/Textures_Body_model/leggings-skirt/SkirtLeggings_LP_defaultMat_BaseColor.png',
        '/Textures_Body_model/leggings-skirt/SkirtLeggings_LP_defaultMat_Metallic.png',
        '/Textures_Body_model/leggings-skirt/SkirtLeggings_LP_defaultMat_Normal.png',
        '/Textures_Body_model/leggings-skirt/SkirtLeggings_LP_defaultMat_Roughness.png',
      ])
    );
    // console.log(object.children);

    object.position.set(position.x, position.y, position.z);
    object.rotateY(Math.PI / 2);
    loaded(object);
    // sh.scene.add(object);
  });
};

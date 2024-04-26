import { FBXLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';

export function fbxLoad(
  assetURI: string,
  onLoad: (object: THREE.Group<THREE.Object3DEventMap>) => void
) {
  const fbxLoader = new FBXLoader();
  fbxLoader.load(
    assetURI,
    onLoad,
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
      console.log(error);
    }
  );
}

// onLoad = (object) => {
//   // object.traverse(function (child) {
//   //   if ((child as THREE.Mesh).isMesh) {
//   //     // (child as THREE.Mesh).material = material;
//   //     if ((child as THREE.Mesh).material) {
//   //       (
//   //         (child as THREE.Mesh).material as THREE.MeshBasicMaterial
//   //       ).transparent = false;
//   //     }
//   //   }
//   // });
//   // (object.children[0] as THREE.Mesh).material = customShaderMaterial;
//   // (object.children[0] as THREE.Mesh).castShadow = true;
//   // (object.children[0] as THREE.Mesh).receiveShadow = true;

//   object.scale.set(1, 1, 1);
//   object.position.set(-60, 12, 0);
//   object.rotateX(-Math.PI / 2);
//   object.rotateZ(-Math.PI / 2);
//   this.sh.scene.add(object);
// };

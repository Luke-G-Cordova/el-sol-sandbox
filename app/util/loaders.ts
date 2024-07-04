import { FBXLoader } from 'three/examples/jsm/Addons.js';
import * as THREE from 'three';
import { promises as fs } from 'fs';
import { ALL_DATA } from './model_data';

interface FileInfo {
  name: string;
  file: string;
  translate: { x: number; y: number; z: number };
  rotate: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}
interface LightsFileInfo extends FileInfo {
  exposure: number;
  intensity: number;
}
interface BlockerFileInfo extends FileInfo {
  density: number;
}

export const loadAllFiles = (
  loaded: (object: THREE.Group<THREE.Object3DEventMap>) => void
) => {
  ALL_DATA.models.forEach((model) => {
    fbxLoad(`/3d_assets/Bonsai_Models/${model.name}`, (ob) => {
      if (model.textures) {
        if (ob.children.length == 0) {
          console.log(ob);
        }
        if (model.textures.length > 2) {
          (ob.children[0] as THREE.Mesh).material = customShaderMaterial(
            customTextures([
              ...model.textures.map((t) => `/3d_assets/Bonsai_Models/${t}`),
            ])
          );
        } else {
          (ob.children[0] as THREE.Mesh).material = alphaShaderMaterial(
            customTextures([
              ...model.textures.map((t) => `/3d_assets/Bonsai_Models/${t}`),
            ])
          );
        }
      }

      loaded(ob);
    });
  });

  ALL_DATA.lights.forEach((light) => {
    // console.log(light);
    fbxLoad(`/3d_assets/Bonsai_Lights/${light.name}`, (ob) => {
      // console.log(ob);

      loaded(ob);
    });
  });
};

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
      console.error(error);
      console.error(assetURI);
    }
  );
}
export const customTextures = (textureUrls: string[]) => {
  const textures = [];
  const textureLoader = new THREE.TextureLoader();
  for (let i = 0; i < textureUrls.length; i++) {
    textures.push(textureLoader.load(textureUrls[i]));
  }
  return textures;
};

export const alphaShaderMaterial = (textures: Array<any>) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      baseColorMap: { value: textures[0] },
      alphaMap: { value: textures[1] },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D baseColorMap;
      uniform sampler2D alphaMap;

      void main() {
        vec4 baseColor = texture2D(baseColorMap, vUv);
        float alpha = texture2D(alphaMap, vUv).r; // Assuming alpha is stored in the red channel
        gl_FragColor = vec4(baseColor.rgb, alpha);
      }
    `,
    transparent: true, // Enable transparency
  });
};

export const customShaderMaterial = (textures: Array<any>) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      baseColorMap: { value: textures[0] },
      heightMap: { value: textures[1] },
      metallicMap: { value: textures[2] },
      normalMap: { value: textures[3] },
      roughnessMap: { value: textures[4] },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D baseColorMap;
      uniform sampler2D heightMap;
      uniform sampler2D metallicMap;
      uniform sampler2D normalMap;
      uniform sampler2D roughnessMap;

      void main() {
          // Sample textures
          vec4 baseColor = texture2D(baseColorMap, vUv);
          float height = texture2D(heightMap, vUv).r;
          float metallic = texture2D(metallicMap, vUv).r;
          vec3 normal = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
          float roughness = texture2D(roughnessMap, vUv).r;

          // Apply textures in order
          // Base color
          vec3 finalColor = baseColor.rgb;

          // Height
          float finalHeight = height;

          // Metallic
          float finalMetallic = metallic;

          // Normal
          vec3 finalNormal = normalize(normal);

          // Roughness
          float finalRoughness = roughness;

          // Output final color
          gl_FragColor = vec4(finalColor, 1.0); // ignoring height, metallic, normal, and roughness for now
      }
    `,
  });
};
// export const customShaderMaterial = (textures: Array<any>) => {
//   return new THREE.ShaderMaterial({
//     uniforms: {
//       baseColorMap: { value: textures[0] },
//       metallicMap: { value: textures[1] },
//       normalMap: { value: textures[2] },
//       roughnessMap: { value: textures[3] },
//     },
//     vertexShader: `
//           varying vec2 vUv;
//           void main() {
//               vUv = uv;
//               gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//           }
//         `,
//     fragmentShader: `
//           varying vec2 vUv;
//           uniform sampler2D baseColorMap;
//           uniform sampler2D roughnessMap;
//           uniform sampler2D normalMap;

//           void main() {
//               // Sample textures
//               vec4 baseColor = texture2D(baseColorMap, vUv);
//               float roughness = texture2D(roughnessMap, vUv).r; // assuming roughness is stored in the red channel
//               vec3 normal = texture2D(normalMap, vUv).xyz * 2.0 - 1.0; // convert normal map to -1 to 1 range

//               // Apply textures in order
//               // Base color
//               vec3 finalColor = baseColor.rgb;

//               // Roughness
//               float finalRoughness = roughness;

//               // Normal
//               vec3 finalNormal = normalize(normal);

//               // Output final color
//               gl_FragColor = vec4(finalColor, 1.0); // ignoring roughness and normal for now
//           }
//         `,
//   });
// };

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

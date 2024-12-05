// Text3D.js
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

/**
 * Creates a 3D text mesh.
 * @param {string} text - The text to display.
 * @param {THREE.Color | string | number} color - The color of the text.
 * @param {number} size - The size of the text.
 * @param {number} height - The depth of the text.
 * @returns {Promise<THREE.Mesh>} - A promise that resolves to the text mesh.
 */
export function createText3D(text, color = 0xffffff, size = 0.5, height = 0.2) {
  return new Promise((resolve, reject) => {
    const fontLoader = new FontLoader();
    fontLoader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', // Path to the font file
      (font) => {
        const textGeometry = new TextGeometry(text, {
          font: font,
          size: size,
          height: height,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelSegments: 5,
        });

        const textMaterial = new THREE.MeshStandardMaterial({ color });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        resolve(textMesh);
      },
      undefined,
      (error) => {
        reject(new Error('Failed to load the font: ' + error.message));
      }
    );
  });
}

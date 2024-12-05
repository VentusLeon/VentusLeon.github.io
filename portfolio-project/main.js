import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createText3D } from './Text3D.js'

// Set up scene and renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x20232a); // Set a dark grey background color
document.body.appendChild(renderer.domElement);

// Orthographic Camera Setup
let aspect = window.innerWidth / window.innerHeight;
let frustumSize = 5; // Adjust this value to control zoom level and scene coverage

let camera = new THREE.OrthographicCamera(
  -frustumSize * aspect / 2, // left
  frustumSize * aspect / 2,  // right
  frustumSize / 2,           // top
  -frustumSize / 2,          // bottom
  0.1,                       // near
  1000                       // far
);

let flat_view_x = -0.5;
let flat_view_y = 0.8;
let flat_view_z = 0.4; // Even in orthographic, you need to set the Z position

camera.position.set(flat_view_x, flat_view_y, flat_view_z);
camera.lookAt(flat_view_x, flat_view_y, flat_view_z); // Look at the origin

const zoomSpeed = 0.3;

let textMesh = null;

async function updateText() {
  scene.remove(textMesh);
  textMesh = await createText3D('X: ' + flat_view_x.toFixed(2), 0xffffff, 0.5, 0.2);
  textMesh.position.set(0, 1, 0);
  scene.add(textMesh);
}

updateText();

// Load models
const bulletinLoader = new GLTFLoader();
bulletinLoader.load(
  'models/bulletin-board-model.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(-0.85, 1.3, 0);
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the model', error);
  }
);

const computerDeskLoader = new GLTFLoader();
computerDeskLoader.load(
  'models/computer-desk-model.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the desk model', error);
  }
);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);



// Handle window resize
window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -frustumSize * aspect / 2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle arrow key movement
let cameraSpeed = 0.1;
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'z':
      frustumSize = Math.max(0.5, frustumSize - zoomSpeed); // Prevent zooming too far in
      updateCameraFrustum();
      break;
    case 'y':
      frustumSize += zoomSpeed;
      updateCameraFrustum();
      break;
    case 'ArrowUp':
      flat_view_y += cameraSpeed;
      break;
    case 'ArrowDown':
      flat_view_y -= cameraSpeed;
      break;
    case 'ArrowLeft':
      flat_view_x -= cameraSpeed;
      break;
    case 'ArrowRight':
      flat_view_x += cameraSpeed;
      break;
  }
  updateText();
});

function updateCameraFrustum() {
  const aspect = window.innerWidth / window.innerHeight;
  camera.left = -frustumSize * aspect / 2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = -frustumSize / 2;
  camera.updateProjectionMatrix();
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update camera position and look at the origin
  camera.position.set(flat_view_x, flat_view_y, flat_view_z);
  camera.lookAt(flat_view_x, flat_view_y, flat_view_z);

  renderer.render(scene, camera);
}

animate();

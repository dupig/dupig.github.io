import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { ShaderMaterial } from 'three';
import { Material } from 'three';
import { Vector3 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { VertexNormalHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import boneVertexShader from '../public/static/boneVertexShader.glsl';
import vertexShader from '../public/static/vertexShader.glsl';
import cartesianFragment from '../public/static/cartesianFragment.glsl';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import boneCartesianFragment from '../public/static/boneCartesianFragment.glsl';
import quadCartesianFragment from '../public/static/quadCartesianFragment.glsl';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
let controls;
let cartesianMaterial, meshDarkMaterial, mannequinMaterial,quadMaterial;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
const composer = new EffectComposer(renderer);
const raycaster = new THREE.Raycaster();
let INTERSECTED;
let renderPass, outlinePass, objectsToOutline;
let mixer,mixer02,mixer03;
const clock = new THREE.Clock();
const mouse = new THREE.Vector2();
let mannequin01, mannequin02, mannequin03;
// const panel = new GUI();
const cameraSettings = {
  positionX: camera.position.x,
  positionY: camera.position.y,
  positionZ: camera.position.z,
  rotationX: camera.rotation.x,
  rotationY: camera.rotation.y,
  rotationZ: camera.rotation.z
  // Add more properties you want to control if needed
};


function initThreeJS() {

  camera.position.set( 3.9, 5.6, 0.8 );
  camera.rotation.set( -0.1, 1, 0.09 );
  camera.updateProjectionMatrix();
  new RGBELoader().load('static/studio_small_08_2k.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  });


  // renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onPointerMove);

  //for materials - start
  const groundMaterial = new THREE.MeshPhysicalMaterial({ color: 0x1C1B25, metalness: 0.8 });
  meshDarkMaterial = new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 0.6, roughness: 0.3, envMapIntensity: 0.8, transparent: true, opacity: 0.1 });
  // 如果嫌弃某些角度看不到模型，就打开depthTest: false 
  // const meshDarkMaterial = new THREE.MeshPhysicalMaterial({ color: 0x000000, metalness: 0.3, roughness: 0.3, envMapIntensity: 0.8 });

  const _Uni01 = { time: { type: 'f', value: 0.0 } };
  const _Uni02 = { time: { type: 'f', value: 0.0 } };
  cartesianMaterial = new THREE.ShaderMaterial({ uniforms: _Uni01, vertexShader: boneVertexShader, fragmentShader: boneCartesianFragment, transparent: true});
  mannequinMaterial = new THREE.MeshPhysicalMaterial({ color: 0x151618, metalness: 0.4, roughness: 0.4, envMapIntensity: 0.8, transparent: true, opacity: 1.0 });
  quadMaterial = new THREE.ShaderMaterial({ uniforms: _Uni02, vertexShader: boneVertexShader, fragmentShader: quadCartesianFragment, transparent: true});
  //for materials - end




  //for geometreis - start

  const groundMeshGeometry = new THREE.PlaneGeometry(2000, 2000);
  const groundMesh = new THREE.Mesh(groundMeshGeometry, groundMaterial);
  groundMesh.name = 'floor';
  groundMesh.rotation.set(-Math.PI / 2, Math.PI, 0);
  scene.add(groundMesh);


  const loader = new GLTFLoader();

  loader.load('/static/mannequin.glb', function (gltf) {
    mannequin01 = gltf.scene;
    mannequin01.position.set( 2.8, 4.2, -1.2 );
		// model.scale.set(0.9,0.9,0.9);
    scene.add(mannequin01);
    mannequin01.traverse((object) => {
      if (object.isSkinnedMesh) {
          // Assign the custom ShaderMaterial
          object.material = mannequinMaterial;
      }
  });
    const animation = gltf.animations; // Array<THREE.AnimationClip>
    mixer = new THREE.AnimationMixer( mannequin01 );
    mixer.clipAction( gltf.animations[ 0 ] ).play();
}, undefined, function (error) {
    console.error(error);
});

const loader02 = new GLTFLoader();

loader02.load('/static/mannequin.glb', function (gltf) {
  mannequin02 = gltf.scene;
  mannequin02.position.set( 2.8, 4.2, -1.2 );
  // model.scale.set(0.9,0.9,0.9);
  scene.add(mannequin02);
  mannequin02.traverse((object) => {
    if (object.isSkinnedMesh) {
        object.material = quadMaterial;
    }
});
  // const animation = gltf.animations; // Array<THREE.AnimationClip>
  mixer02 = new THREE.AnimationMixer( mannequin02 );
  mixer02.clipAction( gltf.animations[ 0 ] ).play();
}, undefined, function (error) {
  console.error(error);
});

const loader03 = new GLTFLoader();

loader03.load('/static/mannequin.glb', function (gltf) {
  mannequin03 = gltf.scene;
  mannequin03.position.set( 2.8, 4.2, -1.2 );
  // model.scale.set(0.9,0.9,0.9);
  scene.add(mannequin03);
  mannequin03.traverse((object) => {
    if (object.isSkinnedMesh) {
        object.material = cartesianMaterial;
    }
});
  // const animation = gltf.animations; // Array<THREE.AnimationClip>
  mixer03 = new THREE.AnimationMixer( mannequin03 );
  mixer03.clipAction( gltf.animations[ 0 ] ).play();
}, undefined, function (error) {
  console.error(error);
});


  //for geometreis - end

  //for controls - start

// panel.add(cameraSettings, 'positionX', -100, 100).onChange(value => {
//   camera.position.x = value;
// });
// panel.add(cameraSettings, 'positionY', -100, 100).onChange(value => {
//   camera.position.y = value;
// });
// panel.add(cameraSettings, 'positionZ', -100, 100).onChange(value => {
//   camera.position.z = value;
// });
// panel.add(cameraSettings, 'rotationX', -100, 100).onChange(value => {
//   camera.rotation.x = value;
// });
// panel.add(cameraSettings, 'rotationY', -100, 100).onChange(value => {
//   camera.rotation.y = value;
// });
// panel.add(cameraSettings, 'rotationZ', -100, 100).onChange(value => {
//   camera.rotation.z = value;
// });

// const cameraFolder = panel.addFolder('Camera Position');
// cameraFolder.add(cameraSettings, 'positionX').listen();
// cameraFolder.add(cameraSettings, 'positionY').listen();
// cameraFolder.add(cameraSettings, 'positionZ').listen();
// cameraFolder.add(cameraSettings, 'rotationX').listen();
// cameraFolder.add(cameraSettings, 'rotationY').listen();
// cameraFolder.add(cameraSettings, 'rotationZ').listen();
// cameraFolder.open();




  // controls = new OrbitControls(camera, renderer.domElement);
  // // controls.enableDamping = true;
  // controls.minDistance = 1;
  // controls.maxDistance = 45;
  // controls.maxPolarAngle = Math.PI;
  // controls.target.set(3.9, 5.6, 0.8);
  // controls.update();//使用这句话保证orbitcontrol时的焦点
  // console.log(controls);


  renderPass = new RenderPass(scene, camera);
  renderPass.clear = true;
  composer.addPass(renderPass);



  //for lights - start


  const directionalLight01 = new THREE.DirectionalLight(0xAE84D9, 0.4);
  directionalLight01.position.set(20, -20, 30);
  scene.add(directionalLight01);


  const directionalLight02 = new THREE.DirectionalLight(0x90EEFF, 0.6);
  directionalLight02.position.set(30, 10, 30);
  scene.add(directionalLight02);

  //for lights - end

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight); //有effect Composer再打开这句
  }

  function onPointerMove() {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerWidth) * 2 + 1;
    // outlinePass.selectedObjects = objectsToOutline;
    // hoverPieces();
  }
  // initJS - end
}




function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if(mixer!=null) mixer.update( delta );
  if(mixer02!=null) mixer02.update( delta );
  if(mixer03!=null) mixer03.update( delta );
  cameraSettings.positionX = camera.position.x;
  cameraSettings.positionY = camera.position.y;
  cameraSettings.positionZ = camera.position.z;
  cameraSettings.rotationX = camera.rotation.x;
  cameraSettings.rotationY = camera.rotation.y;
  cameraSettings.rotationZ = camera.rotation.z;
  const duration = clock.getElapsedTime();
  const period = 18.0;
  var currentTime = duration%period;

  cartesianMaterial.uniforms.time.value = 1.0-2.0*Math.cos(currentTime*2*Math.PI/period);
  if (currentTime<period/2.0) quadMaterial.uniforms.time.value = Math.cos((currentTime+0.0)*2*Math.PI/period);
  else quadMaterial.uniforms.time.value = -1.0;
  // cartesianMaterial.uniforms.time.value = 0.5+0.5*Math.cos(duration/3.0);
  // cartesianMaterial.uniforms.time.value = 0.5-0.5*Math.cos(duration/3.0);
  // mannequinMaterial.opacity = 0.5+0.5*Math.cos(duration/3.0);
  mannequinMaterial.opacity = Math.cos((currentTime-0.0)*2*Math.PI/period);
  composer.render();
  console.log(quadMaterial.uniforms.time.value);

}

initThreeJS();
animate();



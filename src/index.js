import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import make_city from './utils/city.js';

function init() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 400);
    camera.lookAt(0, 10, 0);
    camera.position.set(0, 10, 50);
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.18);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.25);
    keyLight.position.set(40, 50, 20);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb8d4ff, 0.35);
    fillLight.position.set(-20, 12, -18);
    scene.add(fillLight);


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    window.addEventListener('resize', () => {  
        // Update camera
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        
        // Update renderer
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    });

    const city = make_city();
    scene.add(city);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

window.onload = init
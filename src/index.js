import * as THREE from 'three';
import GUI from 'lil-gui';
import CameraControls from './utils/camera_controls.js';
import Stats from 'three/addons/libs/stats.module.js';

import make_skybox from './city/skybox.js';
import make_city from './city/city.js';
import { gameManager } from './utils/game_manager.js';

const stats = new Stats();

function init() {
    const scene = gameManager.scene;

    // Add stats monitor
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb
    document.body.appendChild(stats.dom);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xd8ecff, 0x9bb07a, 0.55);
    scene.add(hemisphereLight);

    const keyLight = new THREE.DirectionalLight(0xfff3dc, 2.2);
    const sunpos = new THREE.Vector3(150, 300, 150);
    keyLight.position.copy(sunpos);
    keyLight.lookAt(scene.position)
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    
    //keyLight.shadow.camera.near = 1;
    //keyLight.shadow.camera.far = 2000;
    //keyLight.shadow.camera.left = -1000;
    //keyLight.shadow.camera.right = 1000;
    //keyLight.shadow.camera.top = 1000;
    //keyLight.shadow.camera.bottom = -1000;

    keyLight.shadow.camera.near = 10;    // Increased to save precision
    keyLight.shadow.camera.far = 1000;   // Decreased (distance from light to ground)
    keyLight.shadow.camera.left = -200;  // Much tighter window around player
    keyLight.shadow.camera.right = 200;
    keyLight.shadow.camera.top = 200;
    keyLight.shadow.camera.bottom = -200;
    
    //keyLight.shadow.bias = -0.0006;
    //keyLight.shadow.normalBias = 0.04;
    
    // Adjust biases
    keyLight.shadow.bias = -0.001;      // Start very small
    keyLight.shadow.normalBias = 0.07;   // Helps with stripes on sloped surfaces


    


    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbfd9ff, 0.55);
    fillLight.position.set(-180, 120, -220);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffe8c9, 0.35);
    rimLight.position.set(80, 80, 350);
    scene.add(rimLight);

    // GUI
    const gui = new GUI({ title: 'Camera Position' });
    gui.add(gameManager.camera.position, 'x').name('x').listen();
    gui.add(gameManager.camera.position, 'y').name('y').listen();
    gui.add(gameManager.camera.position, 'z').name('z').listen();
    const lightFolder = gui.addFolder('Lighting');
    lightFolder.add(keyLight, 'intensity', 0, 5, 0.01).name('key intensity');
    lightFolder.add(fillLight, 'intensity', 0, 2, 0.01).name('fill intensity');
    lightFolder.add(rimLight, 'intensity', 0, 2, 0.01).name('rim intensity');
    lightFolder.add(hemisphereLight, 'intensity', 0, 2, 0.01).name('hemi intensity');

    const city = make_city();
    scene.add(city);
    scene.add(make_skybox());

    function animate() {
        requestAnimationFrame(animate);
        stats.begin();
        gameManager.update();

        const thing = new THREE.Vector3();
        thing.addVectors(gameManager.player.position, sunpos)
        
        
        console.log(thing)
        keyLight.position.copy(thing);
        
        keyLight.target.position.copy(gameManager.player.position);
        keyLight.target.updateMatrixWorld();
        
        gameManager.render();
        stats.end();
    }
    animate();
}

window.onload = init
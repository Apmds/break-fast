import * as THREE from 'three';
import GUI from 'lil-gui';
import Stats from 'three/addons/libs/stats.module.js';

import { gameManager } from './utils/game_manager.js';

const stats = new Stats();

function init() {
    // Add stats monitor
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    // GUI
    //const gui = new GUI({ title: 'Camera Position' });
    //gui.add(gameManager.camera.position, 'x').name('x').listen();
    //gui.add(gameManager.camera.position, 'y').name('y').listen();
    //gui.add(gameManager.camera.position, 'z').name('z').listen();
    //const lightFolder = gui.addFolder('Lighting');
    //lightFolder.add(keyLight, 'intensity', 0, 5, 0.01).name('key intensity');
    //lightFolder.add(fillLight, 'intensity', 0, 2, 0.01).name('fill intensity');
    //lightFolder.add(rimLight, 'intensity', 0, 2, 0.01).name('rim intensity');
    //lightFolder.add(hemisphereLight, 'intensity', 0, 2, 0.01).name('hemi intensity');

    function animate() {
        requestAnimationFrame(animate);
        stats.begin();
        gameManager.update();

        //const thing = new THREE.Vector3();
        //thing.addVectors(gameManager.player.position, sunpos)
        
        //keyLight.position.copy(thing);
        
        //keyLight.target.position.copy(gameManager.player.position);
        //keyLight.target.updateMatrixWorld();
        
        gameManager.render();
        stats.end();
    }
    animate();
}

window.onload = init
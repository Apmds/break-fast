import { inputManager } from "./input_manager.js";
import * as THREE from 'three';
import CameraControls from './camera_controls.js';

class GameManager {
    constructor() {
        this.scene = new THREE.Scene();
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        document.body.appendChild(this.renderer.domElement);
        
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(0, 10, 50);
        this.camera.lookAt(0, 10, 0);
        this.scene.add(this.camera);


        this.controls = new CameraControls(this.camera, this.renderer.domElement);
    
        this.clock = new THREE.Timer();

        window.addEventListener('resize', () => {
            // Update camera
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            
            // Update renderer
            this.renderer.setSize(window.innerWidth, window.innerHeight)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        });
    }

    update() {
        const delta = this.clock.getDelta();

        inputManager.update();
        this.controls.update(delta);

        this.clock.update();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export const gameManager = new GameManager();
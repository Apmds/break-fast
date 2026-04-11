import { inputManager } from "./input_manager.js";
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Player from './player.js';
import Renderer from "./render.js";

class GameManager {
    constructor() {
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.set(0, 10, 50);
        this.camera.lookAt(0, 10, 0);
        this.scene.add(this.camera);
        
        this.renderer = new Renderer(camera);
        this.renderer.addToDom();

        // Physics world
        this.physicsWorld = new CANNON.World();
        this.physicsWorld.gravity.set(0, -9.82*5, 0);
        this.physicsWorld.defaultContactMaterial.friction = 0.1;

        // Ground body - using a large flat box instead of plane
        const groundShape = new CANNON.Box(new CANNON.Vec3(500, 1, 500)); // width, height, depth
        this.groundBody = new CANNON.Body({
            mass: 0,
            shape: groundShape,
        });
        this.groundBody.position.y = 0; // Slightly below player spawn
        this.physicsWorld.addBody(this.groundBody);

        this.player = new Player(this.camera, this.renderer.domElement, this.physicsWorld);
    
        this.clock = new THREE.Timer();

        window.addEventListener('resize', () => {
            // Update camera
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            
            // Update renderer
            this.renderer.update()
        });
    }

    update() {
        const delta = this.clock.getDelta();

        inputManager.update();
        this.player.update(delta);

        // Step physics world
        this.physicsWorld.step(1 / 60, delta, 3);

        this.clock.update();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

export const gameManager = new GameManager();
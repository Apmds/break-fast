import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Renderer from './render.js';

class Scene {
    constructor(camera) {
        this.camera = camera;
        this.renderer = new Renderer(this.camera);

        this.scene = new THREE.Scene();
        this.scene.add(camera);

        this.physicsWorld = new CANNON.World();
    }

    setAsCurrent() {
        this.renderer.addToDom();
    }

    unsetAsCurrent() {
        this.renderer.removeFromDom();
    }

    get domElement() {
        return this.renderer.domElement;
    }

    add(obj) {
        this.scene.add(obj);
    }

    remove(name) {
        const obj = this.scene.getObjectByName(name);
        this.scene.remove(obj);
    }

    handleResize() {
        // Update camera
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.update()
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    update(delta) {
        // Step physics world
        this.physicsWorld.step(1/60, delta, 3);
    }
}

export default Scene
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Renderer from './render.js';
import GUI from './GUI.js';

class Scene {
    constructor(camera, player) {
        this.player = player;
        this.camera = camera;
        this.renderer = new Renderer(this.camera);

        this.scene = new THREE.Scene();
        this.scene.add(camera);

        this.physicsWorld = new CANNON.World();

        this.gui = new GUI();

        this._objects = {};
    }

    setPlayer(player) {
        this.player = player;
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

    getObject(name) {
        return this.scene.getObjectByName(name);
    }

    add(obj, name) {
        this.scene.add(obj.model);

        this._objects[name] = obj;
    }

    addModel(model) {
        this.scene.add(model);
    }

    remove(name) {
        const model = this._objects[name].model;
        this.scene.remove(model);
        
        delete this._objects[name];
    }

    removeModel(name) {
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
        Object.values(this._objects).forEach((obj) => {
            obj.update(delta);
        });
    }

    begin() {
        this.gui.begin();
    }

    end() {
        this.gui.end();
    }
}

export default Scene
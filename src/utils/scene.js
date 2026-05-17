import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Renderer from './renderer.js';
import DebugUI from '../ui/debug_ui.js';

class Scene {
    constructor(camera, player, onExit = null) {
        this.player = player;
        this.camera = camera;
        this.renderer = new Renderer(this.camera);

        this.scene = new THREE.Scene();
        this.scene.add(camera);

        this.physicsWorld = new CANNON.World();

        this.debug_ui = new DebugUI();

        this._objects = {};

        this.onExit = onExit;
    }

    setPlayer(player) {
        this.player = player;
    }

    setAsCurrent() {
        this.renderer.addToDom();
    }

    unsetAsCurrent() {
        this.renderer.removeFromDom();
        this.debug_ui.hide();
    }

    get domElement() {
        return this.renderer.domElement;
    }

    getObject(name) {
        return this.scene.getObjectByName(name);
    }

    exit() {
        if (this.onExit) {
            this.onExit();
        }
    }

    add(obj, name) {
        this.scene.add(obj.model);

        if (obj.body) {
            this.physicsWorld.addBody(obj.body);
        }

        this._objects[name] = obj;
    }

    addModel(model) {
        this.scene.add(model);
    }

    remove(name) {
        const obj = this._objects[name];
        if (obj) {
            this.scene.remove(obj.model);
            if (obj.body) {
                this.physicsWorld.removeBody(obj.body);
            }
            delete this._objects[name];
        }
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
        this.debug_ui.begin();
    }

    end() {
        this.debug_ui.end();
    }
}

export default Scene
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ObjectManager {
    constructor() {
        this.gltfloader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.audioLoader = new THREE.AudioLoader();
        this.objectCache = {};
        this.animationCache = {};
    }

    async loadTexture(path, id) {
        // If not in cache, load it
        const needs_loading = !this.objectCache[id];

        if (needs_loading) {
            const texture = await this.textureLoader.loadAsync(path);
            this.objectCache[id] = texture;
        }

        // Return a clone
        const clone = this.objectCache[id].clone();

        return clone;
    }

    async loadGLTF(path, id, material_map = null) {
        // If not in cache, load it
        const needs_loading = !this.objectCache[id];

        if (needs_loading) {
            const { scene, animations } = await new Promise((resolve, reject) => {
                this.gltfloader.load(path, (gltf) => {
                    resolve({ scene: gltf.scene, animations: gltf.animations });
                }, undefined, (error) => {
                    console.error(`Failed to load GTLF model object ${id} at ${path}:`, error);
                    reject(error);
                });
            });
            
            // Apply materials
            if (material_map) {
                scene.traverse((node) => {
                    if (node.isMesh && material_map[node.name]) {
                        node.material = material_map[node.name];
                    }
                });
            }

            this.objectCache[id] = scene;
            this.animationCache[id] = Array.isArray(animations) ? animations : [];
        }

        // Return a clone
        const clone = this.objectCache[id].clone();

        if (!needs_loading && material_map) {
            this.objectCache[id].traverse((node) => {
                if (node.isMesh && material_map[node.name]) {
                    node.material = material_map[node.name];
                }
            });
        }

        return clone;
    }

    async loadMP3(path, id) {
        // If not in cache, load it
        const needs_loading = !this.objectCache[id];

        if (needs_loading) {
            try {
                const audioBuffer = await this.audioLoader.loadAsync(path);
                this.objectCache[id] = audioBuffer;
            } catch (error) {
                console.error(`Failed to load MP3 audio ${id} at ${path}:`, error);
                throw error;
            }
        }

        return this.objectCache[id];
    }

    async loadShader(path, id) {
        // If not in cache, load it
        const needs_loading = !this.objectCache[id];

        if (needs_loading) {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                this.objectCache[id] = await response.text();
            } catch (error) {
                console.error(error.message);
            }
        }

        return this.objectCache[id];
    }

    getObject(id, clone=true) {
        if (this.objectCache[id]) {
            let returnval = this.objectCache[id];
            if (clone) {
                returnval = returnval.clone();
            }
            return returnval;
        }
        return null;
    }

    getAnimations(id, clone=true) {
        if (this.animationCache[id]) {
            let returnval = this.animationCache[id];
            if (clone) {
                returnval = returnval.map((clip) => clip.clone());
            }
            return returnval;
        }
        return null;
    }

    isLoaded(id) {
        return id in this.objectCache;
    }

    deleteObject(id) {
        if (this.objectCache[id]) {
            delete this.objectCache[id];
        }
        if (this.animationCache[id]) {
            delete this.animationCache[id];
        }
    }

    clearCache() {
        this.objectCache = {};
        this.animationCache = {};
    }
}

const objectManager = new ObjectManager();
export default objectManager;

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ObjectManager {
    constructor() {
        this.gltfloader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.audioLoader = new THREE.AudioLoader();
        this.cache = {};
    }

    async loadTexture(path, id) {
        // If not in cache, load it
        const needs_loading = !this.cache[id];

        if (needs_loading) {
            const texture = await this.textureLoader.loadAsync(path);
            this.cache[id] = texture;
        }

        // Return a clone
        const clone = this.cache[id].clone();

        return clone;
    }

    async loadGLTF(path, id, material_map = null) {
        // If not in cache, load it
        const needs_loading = !this.cache[id];

        if (needs_loading) {
            const scene = await new Promise((resolve, reject) => {
                this.gltfloader.load(path, (gltf) => {
                    resolve(gltf.scene);
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
            
            this.cache[id] = scene;
        }

        // Return a clone
        const clone = this.cache[id].clone();

        if (!needs_loading && material_map) {
            this.cache[id].traverse((node) => {
                if (node.isMesh && material_map[node.name]) {
                    node.material = material_map[node.name];
                }
            });
        }

        return clone;
    }

    async loadMP3(path, id) {
        // If not in cache, load it
        const needs_loading = !this.cache[id];

        if (needs_loading) {
            try {
                const audioBuffer = await this.audioLoader.loadAsync(path);
                this.cache[id] = audioBuffer;
            } catch (error) {
                console.error(`Failed to load MP3 audio ${id} at ${path}:`, error);
                throw error;
            }
        }

        return this.cache[id];
    }

    async loadShader(path, id) {
        // If not in cache, load it
        const needs_loading = !this.cache[id];

        if (needs_loading) {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                this.cache[id] = await response.text();
            } catch (error) {
                console.error(error.message);
            }
        }

        return this.cache[id];
    }

    getObject(id, clone=true) {
        if (this.cache[id]) {
            let returnval = this.cache[id];
            if (clone) {
                returnval = returnval.clone();
            }
            return returnval;
        }
        return null;
    }

    isLoaded(id) {
        return id in this.cache;
    }

    deleteObject(id) {
        if (this.cache[id]) {
            delete this.cache[id];
        }
    }

    clearCache() {
        this.cache = {};
    }
}

const objectManager = new ObjectManager();
export default objectManager;

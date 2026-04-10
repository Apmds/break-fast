import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ObjectManager {
    constructor() {
        this.loader = new GLTFLoader();
        this.cache = {};
    }

    async loadObject(path, material_map = null) {
        // If not in cache, load it
        const needs_loading = !this.cache[path];

        if (needs_loading) {
            const scene = await new Promise((resolve, reject) => {
                this.loader.load(path, (gltf) => {
                    resolve(gltf.scene);
                }, undefined, (error) => {
                    console.error(`Failed to load object at ${path}:`, error);
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
            
            this.cache[path] = scene;
        }

        // Return a clone
        const clone = this.cache[path].clone();

        if (!needs_loading && material_map) {
            this.cache[path].traverse((node) => {
                if (node.isMesh && material_map[node.name]) {
                    node.material = material_map[node.name];
                }
            });
        }

        return clone;
    }

    getObject(path) {
        if (this.cache[path]) {
            return this.cache[path].clone();
        }
        return null;
    }

    isLoaded(path) {
        return path in this.cache;
    }

    deleteObject(path) {
        if (this.cache[path]) {
            delete this.cache[path];
        }
    }

    clearCache() {
        this.cache = {};
    }
}

const objectManager = new ObjectManager();
export default objectManager;

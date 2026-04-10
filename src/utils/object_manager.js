import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ObjectManager {
    constructor() {
        this.loader = new GLTFLoader();
        this.cache = {};
    }

    async loadObject(path) {
        // If not in cache, load it
        if (!this.cache[path]) {
            this.cache[path] = await new Promise((resolve, reject) => {
                this.loader.load(path, (gltf) => {
                    resolve(gltf.scene);
                }, undefined, (error) => {
                    console.error(`Failed to load object at ${path}:`, error);
                    reject(error);
                });
            });
        }

        // Return a clone of the cached scene so each instance is independent
        return this.cache[path].clone();
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

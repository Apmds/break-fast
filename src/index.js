import GameManager from './utils/game_manager.js';
import objectManager from './utils/object_manager.js';
import objects from './utils/object_paths.js';

async function preload_objects() {
    const loadPromises = objects.map((obj) => {
        switch (obj.type) {
            case "gltf":
                return objectManager.loadGLTF(obj.path, obj.id, obj.material_map);
            case "texture":
                return objectManager.loadTexture(obj.path, obj.id, obj.minFilter, obj.magFilter);
            case "mp3":
                return objectManager.loadMP3(obj.path, obj.id);
            case "shader":
                return objectManager.loadShader(obj.path, obj.id);
        }
    });

    await Promise.all(loadPromises);
}

async function init() {
    const progressBar = document.getElementById('loading-progress');
    const loadingScreen = document.getElementById('loading-screen');

    objectManager.loadingManager.onProgress = (url, loaded, total) => {
        progressBar.style.width = `${(loaded / total) * 100}%`;
    };

    await preload_objects();

    loadingScreen.classList.add('invisible');

    const gameManager = new GameManager();
    function animate() {
        requestAnimationFrame(animate);
        gameManager.frameUpdate();
    }
    animate();
}

window.onload = init
import GameManager from './utils/game_manager.js';
import objectManager from './utils/object_manager.js';
import objects from './utils/object_paths.js';

async function preload_objects() {
    const loadPromises = objects.map(async (obj) => {
        switch (obj.type) {
            case "gltf":
                return await objectManager.loadGLTF(obj.path, obj.id, obj.material_map);
                
            case "texture":
                return await objectManager.loadTexture(obj.path, obj.id);

            case "mp3":
                return await objectManager.loadMP3(obj.path, obj.id);
        }
    });

    await Promise.all(loadPromises);
}

async function init() {
    await preload_objects();

    const gameManager = new GameManager();
    function animate() {
        requestAnimationFrame(animate);

        gameManager.frameUpdate();
    }
    animate();
}

window.onload = init
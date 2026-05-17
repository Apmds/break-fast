import GameManager from './utils/game_manager.js';
import objectManager from './utils/object_manager.js';
import objects from './data/object_paths.js';

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


/* https://claude.ai/share/41278cda-119b-4647-9a0b-42f5d6266fd0 */
function make_item_ring_lines() {
    const ring = document.getElementById('ring');
    const count = 48;
    const radius = 40;

    for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i;
        const minLen = (70 + Math.random() * 12).toFixed(1);
        const maxLen = (80 + Math.random() * 12).toFixed(1);
        const gap  = radius;
        const gap2 = (radius + Math.random() * 20).toFixed(1);
        const dur  = (1.2 + Math.random() * 2).toFixed(2);
        const delay = (Math.random() * -4).toFixed(2);

        const el = document.createElement('div');
        el.className = 'line';
        el.style.cssText = `
            --angle: ${angle}deg;
            --min: ${minLen}px;
            --max: ${maxLen}px;
            --gap: ${gap}px;
            --gap2: ${gap2}px;
            --dur: ${dur}s;
            --delay: ${delay}s;
        `;
        ring.appendChild(el);
    }
}

async function init() {
    const progressBar = document.getElementById('loading-progress');
    const loadingScreen = document.getElementById('loading-screen');

    objectManager.loadingManager.onProgress = (url, loaded, total) => {
        progressBar.style.width = `${(loaded / total) * 100}%`;
    };

    await preload_objects();

    make_item_ring_lines();

    loadingScreen.classList.add('invisible');

    const gameManager = new GameManager();
    function animate() {
        requestAnimationFrame(animate);
        gameManager.frameUpdate();
    }
    animate();
}

window.onload = init
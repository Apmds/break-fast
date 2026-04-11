import { gameManager } from './utils/game_manager.js';

function init() {
    function animate() {
        requestAnimationFrame(animate);

        gameManager.frameUpdate();
    }
    animate();
}

window.onload = init
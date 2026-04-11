import { gameManager } from './utils/game_manager.js';

function init() {
    function animate() {
        requestAnimationFrame(animate);

        gameManager.frameUpdate();

        //const thing = new THREE.Vector3();
        //thing.addVectors(gameManager.player.position, sunpos)
        
        //keyLight.position.copy(thing);
        
        //keyLight.target.position.copy(gameManager.player.position);
        //keyLight.target.updateMatrixWorld();
    }
    animate();
}

window.onload = init
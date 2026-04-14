import * as THREE from 'three';
import objectManager from '../utils/object_manager.js';

function make_house(x, y, z) {
    const house = objectManager.getObject("house");
    house.position.set(x, y, z);
    
    // Enable shadows for the house and all its children
    house.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    
    return house;
}

export default make_house;
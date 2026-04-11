import * as THREE from 'three';
import objectManager from '../utils/object_manager.js';

async function make_house(x, y, z) {
    const houseMaterials = {
        "Ceiling": new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.5 }),
        "Walls": new THREE.MeshStandardMaterial({ color: 0xebcbb0, roughness: 0.7 }),
        "Garage Door": new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8, metalness: 0.3 }),
        "Window": new THREE.MeshStandardMaterial({ color: 0x87ceeb, roughness: 0.1, metalness: 0.5 }),
        "Door": new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.6 }),
        "Window Ceiling": new THREE.MeshStandardMaterial({ color: 0x87ceeb, roughness: 0.1, metalness: 0.5 }),
        "Cover": new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.8 }),
        "Cover Pillars": new THREE.MeshStandardMaterial({ color: 0xdaa520, roughness: 0.6 })
    };

    const house = await objectManager.loadObject('../assets/models/Buildings/house.glb', houseMaterials);
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
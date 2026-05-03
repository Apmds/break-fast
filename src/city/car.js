import * as THREE from 'three';
import WorldObject from '../utils/world_object.js';

class Car extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        const CAR_SCALE = 1.1;

        super(position, rotation, new THREE.Vector3(CAR_SCALE, CAR_SCALE, CAR_SCALE), interactable);

        this.model = 'car';
        this.createBasicBody();
    }
}

export default Car;

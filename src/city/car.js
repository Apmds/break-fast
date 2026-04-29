import * as THREE from 'three';
import WorldObject from '../utils/world_object.js';

class Car extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), scale = new THREE.Vector3(1, 1, 1), interactable = false) {
        super(position, rotation, scale, interactable);

        this.model = 'car';
    }
}

export default Car;

import * as THREE from 'three';
import objectManager from '../utils/object_manager.js';
import WorldObject from '../utils/world_object.js';

class House extends WorldObject {
    constructor(position, rotation = new THREE.Vector3()) {
        super(position, rotation, new THREE.Vector3(1, 1, 1), false);

        this.model = "house";
    }
}

export default House;
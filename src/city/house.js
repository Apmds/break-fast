import * as THREE from 'three';
import WorldObject from '../object/world_object.js';

class House extends WorldObject {
    constructor(position, rotation = new THREE.Vector3()) {
        super(position, rotation, new THREE.Vector3(1, 1, 1), false);

        this.model = "house";
        this.createBasicBody();
    }
}

export default House;
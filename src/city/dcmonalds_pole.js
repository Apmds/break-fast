import * as THREE from 'three';
import WorldObject from '../object/world_object.js';

class DcMonaldsPole extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        const RESTAURANT_SCALE = 5;

        super(position, rotation, new THREE.Vector3(RESTAURANT_SCALE, RESTAURANT_SCALE, RESTAURANT_SCALE), interactable);

        this.model = 'dcmonaldsPole';
        this.createBasicBody();
    }
}

export default DcMonaldsPole;

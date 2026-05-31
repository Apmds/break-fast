import * as THREE from 'three';
import WorldObject from '../world_object.js';

class DcMonalds extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        const RESTAURANT_SCALE = 2;

        super(position, rotation, new THREE.Vector3(RESTAURANT_SCALE, RESTAURANT_SCALE, RESTAURANT_SCALE), interactable);

        this._static = true;

        this.model = 'dcmonalds';
        this.createBasicBody();
    }
}

export default DcMonalds;

import * as THREE from 'three';
import WorldObject from '../object/world_object.js';

class House extends WorldObject {
    constructor(position, rotation = new THREE.Vector3()) {
        super(position, rotation, new THREE.Vector3(1, 1, 1), false);

        this.model = "house";
        this.createBasicBody();

        this._model.traverse((node) => {
            if (node.isMesh) {
                if (node.name == 'Cube004' || node.name == 'Cube004_1') {
                    node.castShadow = true;
                    node.receiveShadow = false;
                }
            }
        });
    }
}

export default House;
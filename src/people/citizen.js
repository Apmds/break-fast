import * as THREE from 'three';
import WorldObject from '../utils/world_object.js';


class Citizen extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), scale = 0.65) {
        const normalizedScale = typeof scale === 'number'
            ? new THREE.Vector3(scale, scale, scale)
            : scale;

        super(position, rotation, normalizedScale, false);

        this.model = 'citizen';
        this.model.userData.isCitizen = true;
        this.model.userData.outline = false;
    }
}


export default Citizen;
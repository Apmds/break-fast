import * as THREE from 'three';
import WorldObject from '../utils/world_object.js';


class Citizen extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        const numberScale = 0.65;
        const scale = new THREE.Vector3(numberScale, numberScale, numberScale);

        super(position, rotation, scale, interactable);

        this.model = 'citizen';
        this.model.userData.outline = false;


    }

    onInteract() {
        // Start dialogue
        console.log("YAY")
    }
}


export default Citizen;
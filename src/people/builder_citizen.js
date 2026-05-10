import * as THREE from 'three';
import Conversation from './conversation.js';
import objectManager from '../utils/object_manager.js';
import Citizen from './citizen.js';

class BuilderCitizen extends Citizen {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        super(position, rotation, interactable);

        this.showParts(["Citizen", "Hard_hat", "Construction_Shirt", "Construction_Pants"]);
    }
}


export default BuilderCitizen;
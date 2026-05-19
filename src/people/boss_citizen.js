import * as THREE from 'three';
import Conversation from './conversation.js';
import objectManager from '../utils/object_manager.js';
import Citizen from './citizen.js';

class BossCitizen extends Citizen {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        super(position, rotation, interactable);

        const material_map = {
            "Shirt": new THREE.MeshToonMaterial({color: 0xf9ad13, fog: false, gradientMap: objectManager.getObject("three_tone")}),
            "Pants": new THREE.MeshToonMaterial({color: 0x5c727c, fog: false, gradientMap: objectManager.getObject("three_tone")}),
            "Shoes": new THREE.MeshToonMaterial({color: 0x6b4b1c, fog: false, gradientMap: objectManager.getObject("three_tone")}),
            "Glasses": new THREE.MeshToonMaterial({color: 0x999999, fog: false, gradientMap: objectManager.getObject("three_tone")}),
            "Glasses_lens": new THREE.MeshToonMaterial({color: 0x222222, fog: false, gradientMap: objectManager.getObject("three_tone")}),
        }
        this.applyMaterialMap(material_map);

        this.showParts(["Citizen", "Glasses", "Glasses_lens", "Moustache", "Hard_hat", "Shirt", "Pants", "Shoes"]);
    }
}


export default BossCitizen;
import * as THREE from 'three';
import WorldObject from '../utils/world_object.js';
import Conversation from '../utils/conversation.js';


class Citizen extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        const numberScale = 0.65;
        const scale = new THREE.Vector3(numberScale, numberScale, numberScale);

        super(position, rotation, scale, interactable);

        this.model = 'citizen';
        this.model.userData.outline = false;

        this.dialogue = 
            new Conversation("hello", "guy").next(
            new Conversation("hi", "me").next(
            new Conversation("this is the end", "me", () => {
                this.interactable = false;
            }
        )))
    }

    onInteract() {
        // Start dialogue
        console.log(`${this.dialogue.talker}: ${this.dialogue.text}`)
        this.dialogue = this.dialogue.nextval;
    }
}


export default Citizen;
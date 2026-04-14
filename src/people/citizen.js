import * as THREE from 'three';
import WorldObject from '../utils/world_object.js';
import Conversation from '../utils/conversation.js';
import objectManager from '../utils/object_manager.js';


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
        
        // Play grunts - times equals half the dialogue text length
        const times = Math.floor(this.dialogue.text.length / 2);
        this.play_sound(times);
        
        this.dialogue = this.dialogue.nextval;
    }

    play_sound(times) {
        const grunts = ['grunt1', 'grunt2', 'grunt3', 'grunt4'];
        const delayBetweenSounds = 125; // milliseconds
        
        for (let i = 0; i < times; i++) {
            setTimeout(() => {
                const randomGrunt = grunts[Math.floor(Math.random() * grunts.length)];
                const audioBuffer = objectManager.getObject(randomGrunt, false);
                
                const listener = new THREE.AudioListener();
                const audio = new THREE.Audio(listener);
                audio.setBuffer(audioBuffer);
                
                // Get the audio context and source
                const context = listener.context;
                const source = audio.getOutput();
                
                // Create a high-pass filter to remove low frequencies
                const highPass = context.createBiquadFilter();
                highPass.type = 'highpass';
                highPass.frequency.value = 800;
                highPass.Q.value = 1;
                
                source.disconnect();
                source.connect(highPass);
                highPass.connect(context.destination);
                
                audio.play();
            }, i * delayBetweenSounds);
        }
    }
}


export default Citizen;
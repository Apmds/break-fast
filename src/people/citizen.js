import * as THREE from 'three';
import WorldObject from '../utils/world_object.js';
import Conversation from '../utils/conversation.js';
import objectManager from '../utils/object_manager.js';
import dialogueMap from '../utils/dialogue_map.js';

class Citizen extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        const numberScale = 0.65;
        const scale = new THREE.Vector3(numberScale, numberScale, numberScale);

        super(position, rotation, scale, interactable);

        this.model = 'citizen';
        this.model.userData.outline = false;
        
        this.player = null;
        this.inConversation = false;
        this.isTypingDialogue = false;
        this.dialogueTypewriterTimeouts = [];
        this.dialogueLetterSpeed = 30;

        this.dialogue_box = document.getElementById("dialog-box");
        this.dialogue_speaker = document.getElementById("dialog-speaker");
        this.dialogue_content = document.getElementById("dialog-content");

        this.dialogue = new Conversation().load(dialogueMap["placeholder"], () => {
            this.endConversation();
            return this.dialogue_start;
        });
        this.dialogue_start = this.dialogue;
    }

    onInteract(object) {
        if (this.dialogue === null) {
            return;
        }

        // Assuming the object is a Player
        
        // Lock camera and focus on citizen
        this.startConversation(object);

        if (this.isTypingDialogue) {
            this.revealFullDialogueText();
            return;
        }

        const currentDialogue = this.dialogue;

        // Start dialogue
        this.dialogue_speaker.innerText = currentDialogue.speaker.toUpperCase();
        this.typeDialogueText(currentDialogue.text, this.dialogueLetterSpeed);
        
        // Play grunts - times equals half the dialogue text length
        if (!currentDialogue.ended) {
            const times = Math.floor(currentDialogue.text.length / 2);
            this.play_sound(times);
        }

        this.dialogue = currentDialogue.nextval;
    }
    
    startConversation(player) {
        if (this.inConversation) {
            return;
        }

        this.player = player;
        this.inConversation = true;
        this.player.canMove = false;

        // Show dialog box
        this.dialogue_box.classList.remove("invisible")
    }
    
    endConversation() {
        this.clearTypewriterTimeouts();
        this.isTypingDialogue = false;

        this.inConversation = false;
        this.player.canMove = true;
        this.player = null;

        // Hide dialog box
        this.dialogue_box.classList.add("invisible");
    }

    typeDialogueText(text, lettersPerSecond) {
        this.clearTypewriterTimeouts();
        this.dialogue_content.innerText = '';

        if (text.length === 0) {
            this.isTypingDialogue = false;
            return;
        }

        this.isTypingDialogue = true;
        const safeSpeed = Math.max(1, lettersPerSecond);
        const delayBetweenLetters = Math.floor(1000 / safeSpeed);

        for (let i = 0; i < text.length + 1; i++) {
            const textToShow = text.slice(0, i);
            const timeoutId = setTimeout(() => {
                
                this.dialogue_content.innerText = textToShow;

                if (i === text.length - 1) {
                    this.isTypingDialogue = false;
                }
            }, i * delayBetweenLetters);

            this.dialogueTypewriterTimeouts.push(timeoutId);
        }
    }

    revealFullDialogueText() {
        this.clearTypewriterTimeouts();
        this.dialogue_content.innerText = this.dialogue.text;
        this.isTypingDialogue = false;
    }

    clearTypewriterTimeouts() {
        for (const timeoutId of this.dialogueTypewriterTimeouts) {
            clearTimeout(timeoutId);
        }
        this.dialogueTypewriterTimeouts = [];
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
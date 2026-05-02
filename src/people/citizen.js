import * as THREE from 'three';
import WorldObject from '../utils/world_object.js';
import Conversation from '../utils/conversation.js';
import objectManager from '../utils/object_manager.js';

class Citizen extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        const numberScale = 0.55;
        const scale = new THREE.Vector3(numberScale, numberScale, numberScale);

        super(position, rotation, scale, interactable);

        this.model = 'citizen';
        this.model.userData.outline = false;
        
        // Play idle animation on loop if available
        if (this._animations && this._animations.length > 0 && this._animationMixer) {
            const idleClip = this._animations.find((c) => /idle/i.test(c.name)) || this._animations[0];
            if (idleClip) {
                const action = this._animationMixer.clipAction(idleClip);
                action.reset();
                action.setLoop(THREE.LoopRepeat);
                action.play();
                this._currentAction = action;
            }
        }
        
        this.player = null;
        this.inConversation = false;
        this.isTypingDialogue = false;
        this.dialogueTypewriterTimeouts = [];
        this.soundTimeoutIds = [];
        this.dialogueLetterSpeed = 30;

        this.dialogue_box = document.getElementById("dialog-box");
        this.dialogue_speaker = document.getElementById("dialog-speaker");
        this.dialogue_content = document.getElementById("dialog-content");

        this.dialogue = new Conversation().load("bridge_start");
        this.last_dialogue = this.dialogue;
    }

    onInteract(object) {
        //console.log("BF:", this.dialogue);
        if (this.dialogue === null) {
            return;
        }

        if (this.isTypingDialogue) {
            if (this.last_dialogue.isAutoSkip()) {
                this.clearTypewriterTimeouts();
                this.isTypingDialogue = false;
                // Continue to start next dialogue
            } else {
                this.revealFullDialogueText();
                return;
            }
        }

        if (this.dialogue.ended) {
            this.endConversation();
            this.dialogue = this.dialogue.nextval;
            return;
        }

        // Assuming the object is a Player
        const currentDialogue = this.dialogue;
        
        // Lock camera and focus on citizen
        this.startConversation(object);

        // Advance state immediately
        this.goToNextDialogue();

        // Start dialogue
        this.dialogue_speaker.innerText = currentDialogue.speaker.toUpperCase();
        this.typeDialogueText(currentDialogue.text, this.dialogueLetterSpeed);
        
        // Play grunts - times equals half the dialogue text length
        if (!currentDialogue.ended) {
            const times = Math.floor(currentDialogue.text.length / 2);
            this.play_sound(times);
        }

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

    goToNextDialogue() {
        this.last_dialogue = this.dialogue;
        this.dialogue = this.dialogue.nextval;
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
        const shouldAutoSkip = this.last_dialogue.isAutoSkip();

        for (let i = 0; i <= text.length; i++) {
            const textToShow = text.slice(0, i);
            const isLastPart = i === text.length;

            const timeoutId = setTimeout(() => {
                
                this.dialogue_content.innerText = textToShow;

                if (isLastPart) {
                    this.isTypingDialogue = false;
                }
            }, i * delayBetweenLetters);

            this.dialogueTypewriterTimeouts.push(timeoutId);

            if (isLastPart && shouldAutoSkip) {
                const timeoutId = setTimeout(() => {
                    this.clearTypewriterTimeouts();
                    this.isTypingDialogue = false;
                    this.onInteract(this.player);
                }, (i + 1) * delayBetweenLetters);

                this.dialogueTypewriterTimeouts.push(timeoutId);
            }

        }
    }

    revealFullDialogueText() {
        this.clearTypewriterTimeouts();
        this.dialogue_content.innerText = this.last_dialogue.text;
        this.isTypingDialogue = false;
    }

    clearTypewriterTimeouts() {
        for (const timeoutId of this.dialogueTypewriterTimeouts) {
            clearTimeout(timeoutId);
        }
        this.dialogueTypewriterTimeouts = [];
        
        for (const timeoutId of this.soundTimeoutIds) {
            clearTimeout(timeoutId);
        }
        this.soundTimeoutIds = [];
    }

    play_sound(times) {
        const grunts = ['grunt1', 'grunt2', 'grunt3', 'grunt4'];
        const delayBetweenSounds = 70; // milliseconds
        
        for (let i = 0; i < times; i++) {
            const timeoutId = setTimeout(() => {
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
            this.soundTimeoutIds.push(timeoutId);
        }
    }
}


export default Citizen;
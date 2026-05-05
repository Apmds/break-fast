import * as THREE from 'three';
import WorldObject from '../utils/world_object.js';

class Car extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        const CAR_SCALE = 1.1;

        super(position, rotation, new THREE.Vector3(CAR_SCALE, CAR_SCALE, CAR_SCALE), interactable);

        this.model = 'car';
        this.createBasicBody();
        this.startLoopingAnimations(['car_vibrate', 'wheel_rotate', 'wheel_rim_rotate']);
    }

    startLoopingAnimations(animationNames) {
        if (!this._animationMixer || !this._animations) {
            return;
        }

        animationNames.forEach((name) => {
            const clip = this._animations.find((anim) => anim.name === name);
            if (!clip) {
                return;
            }

            const action = this._animationMixer.clipAction(clip);
            action.reset();
            action.setLoop(THREE.LoopRepeat);
            action.play();
        });
    }
}

export default Car;

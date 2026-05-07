import * as THREE from 'three';
import WorldObject from '../object/world_object.js';

class Car extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        const CAR_SCALE = 1.1;
        
        super(position, rotation, new THREE.Vector3(CAR_SCALE, CAR_SCALE, CAR_SCALE), interactable);
        
        this.animationNames = ['car_vibrate', 'wheel_rotate', 'wheel_rim_rotate'];
        this.model = 'car';
        this.createBasicBody();
    }

    runAnimation() {
        if (!this._animationMixer || !this._animations) {
            return;
        }

        this.animationNames.forEach((name) => {
            this.playAnimation(name, true);
        });
    }

    stopRunAnimation() {
        this.animationNames.forEach(() => {
            this.stopAnimation();
        });
    }
}

export default Car;

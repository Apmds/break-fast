import * as THREE from "three";
import WorldObject from "../object/world_object.js";

class CityHall extends WorldObject {
    constructor(position, rotation = new THREE.Vector3()) {
        const SCALE = 5;
        
        super(position, rotation, new THREE.Vector3(SCALE, SCALE, SCALE), false);
        
        this.model = 'city_hall';
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

export default CityHall;
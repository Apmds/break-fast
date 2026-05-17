import * as THREE from "three";
import WorldObject from "../object/world_object.js";

class CityHall extends WorldObject {
    constructor(position, rotation = new THREE.Vector3()) {
        const SCALE = 5;
        
        super(position, rotation, new THREE.Vector3(SCALE, SCALE, SCALE), false);
        
        this.model = 'city_hall';
        this.createBasicBody();
    }

    openDoors() {
        this.playAnimation("Open", false, true, false);
        this.playAnimation("Open.001", false, true, false);
    }

    closeDoors() {
        this.playAnimation("Open", false, true, true);
        this.playAnimation("Open.001", false, true, true);
    }
}

export default CityHall;
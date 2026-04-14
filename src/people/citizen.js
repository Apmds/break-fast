import * as THREE from 'three';
import objectManager from "../utils/object_manager.js";


class Citizen {
    constructor(x, y, z, rx = 0, ry = 0, rz = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.rx = rx;
        this.ry = ry;
        this.rz = rz;
        this.scale = 0.65;

        this.model = objectManager.getObject("citizen");
        this.model.position.set(this.x, this.y, this.z);
        this.model.rotation.set(this.rx, this.ry, this.rz);
        this.model.scale.set(this.scale, this.scale, this.scale);
    
        // Enable shadows for the citizen and all its children
        this.model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
    }
}


export default Citizen;
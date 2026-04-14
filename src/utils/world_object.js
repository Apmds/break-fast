import * as THREE from 'three';
import objectManager from "../utils/object_manager.js";

class WorldObject {
    constructor(position, rotation, scale, interactable = false) {
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;

        this.interactable = interactable;
    }

    update_model_matrix() {
        if (typeof this.model !== 'undefined') {
            this.model.position.copy(this.position);
            this.model.rotation.copy(this.rotation);
            this.model.scale.copy(this.scale);
        }
    }

    set position(val) {
        this.position = val;
        this.update_model_matrix();
    }

    set rotation(val) {
        this.rotation = val;
        this.update_model_matrix();
    }

    set scale(val) {
        this.scale = val;
        this.update_model_matrix();
    }

    get x() {
        return this.position.x;
    }

    get y() {
        return this.position.y;
    }

    get z() {
        return this.position.z;
    }

    get rx() {
        return this.rotation.x;
    }

    get ry() {
        return this.rotation.y;
    }

    get rz() {
        return this.rotation.z;
    }

    get sx() {
        return this.scale.x;
    }

    get sy() {
        return this.scale.y;
    }

    get sz() {
        return this.scale.z;
    }

    set interactable(val) {
        this.interactable = val;
        if (typeof this.model !== "undefined") {
            this.model.userData.interactable = val;
        }
    }

    set model(modelname) {
        this.model = objectManager.getObject(modelname);
        this.update_model_matrix();

        this.model.userData.interactable = this.interactable;
        if (this.interactable) {
            this.model.userData.outline = false;
        }

        // Enable shadows for the citizen and all its children
        this.model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
    }

    setOutline(enabled) {
        this.model.userData.outline = enabled;
    }

    get interactable() {
        if (typeof this.model === "undefined") {
            return this.interactable;
        }
        return this.model.userData.interactable;
    }
}

export default WorldObject;
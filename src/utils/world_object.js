import * as THREE from 'three';
import objectManager from "../utils/object_manager.js";

class WorldObject {
    constructor(position, rotation, scale, interactable = false) {
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;
        this._interactable = interactable;
        this._model = undefined;
    }

    update_model_matrix() {
        if (typeof this._model !== 'undefined') {
            this._model.position.copy(this._position);
            this._model.rotation.copy(this._rotation);
            this._model.scale.copy(this._scale);
        }
    }

    set position(val) {
        this._position = val;
        this.update_model_matrix();
    }

    get position() {
        return this._position;
    }

    set rotation(val) {
        this._rotation = val;
        this.update_model_matrix();
    }

    get rotation() {
        return this._rotation;
    }

    set scale(val) {
        this._scale = val;
        this.update_model_matrix();
    }

    get scale() {
        return this._scale;
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
        this._interactable = val;
        if (typeof this._model !== "undefined") {
            this._model.userData.interactable = val;
        }
    }

    set model(modelname) {
        this._model = objectManager.getObject(modelname);
        this.update_model_matrix();

        this._model.userData.worldObject = this;
        this._model.userData.interactable = this._interactable;
        if (this._interactable) {
            this._model.userData.outline = false;
        }

        // Enable shadows for the citizen and all its children
        this._model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
    }

    get model() {
        return this._model;
    }

    setOutline(enabled) {
        if (typeof this._model !== "undefined") {
            this._model.userData.outline = enabled;
        }
    }

    get interactable() {
        if (typeof this._model === "undefined") {
            return this._interactable;
        }
        return this._model.userData.interactable;
    }

    onInteract() {
        // Override when a subclass is interactable (to start a dialogue, for example)
    }
}

export default WorldObject;
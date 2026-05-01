import * as THREE from 'three';
import objectManager from "../utils/object_manager.js";

class WorldObject {
    constructor(position, rotation, scale, interactable = false) {
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;
        this._interactable = interactable;
        this._model = undefined;
        this._animationMixer = undefined;
        this._animations = null;
        this._currentAction = null;
    }

    update_model_matrix() {
        if (typeof this._model !== 'undefined') {
            this._model.position.copy(this._position);
            this._model.rotation.set(this._rotation.x, this._rotation.y, this._rotation.z);
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

        if (!this._interactable) {
            this.outline = false;
        }
    }

    set model(modelname) {
        this._model = objectManager.getObject(modelname);
        this._animations = objectManager.getAnimations(modelname);
        this._animationMixer = this._animations ? new THREE.AnimationMixer(this._model) : undefined;
        this._currentAction = null;
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

    set outline(enabled) {
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

    onInteract(object) {
        // Override when a subclass is interactable (to start a dialogue, for example)
    }

    playAnimation(anim_name, crossfade = false) {
        if (!this._animationMixer || !this._animations) {
            return;
        }

        const clip = this._animations.find((anim) => anim.name === anim_name);
        if (!clip) {
            return;
        }

        const nextAction = this._animationMixer.clipAction(clip);
        nextAction.reset().play();

        if (crossfade && this._currentAction && this._currentAction !== nextAction) {
            this._currentAction.crossFadeTo(nextAction, 0.2, false);
        }

        this._currentAction = nextAction;
    }

    stopAnimation() {
        if (!this._animationMixer || !this._currentAction) {
            return;
        }

        this._currentAction.stop();
        this._currentAction = null;
    }

    update(delta) {
        if (this._animationMixer) {
            this._animationMixer.update(delta);
        }
    }
}

export default WorldObject;
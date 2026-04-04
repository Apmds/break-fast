import CameraControls from './camera_controls.js';

class Player {
    constructor(camera, domElement = document.body) {
        this.camera = camera;
        this.cameraControls = new CameraControls(camera, domElement);
    }

    update(delta) {
        this.cameraControls.update(delta);
    }

    lock() {
        this.cameraControls.lock();
    }

    unlock() {
        document.exitPointerLock?.();
    }

    dispose() {
        this.cameraControls.dispose();
    }

    get position() {
        return this.camera.position;
    }

    get isLocked() {
        return this.cameraControls.isLocked;
    }

    set speed(value) {
        this.cameraControls.speed = value;
    }

    get speed() {
        return this.cameraControls.speed;
    }

    set sensitivity(value) {
        this.cameraControls.sensitivity = value;
    }

    get sensitivity() {
        return this.cameraControls.sensitivity;
    }
}

export default Player;

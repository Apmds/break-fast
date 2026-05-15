import * as THREE from 'three';

class MainMenu {
    constructor(camera, menuCameraPos, menuCameraEuler, playerStartPos, playerStartEuler) {
        this.menuElement = document.getElementById('main-menu');
        this.startButton = document.getElementById('start-button');
        this.onStart = null;
        this.onEnd = null;
        this.started = false;

        this.startButton.addEventListener('click', () => this.handleStart());

        this.cameraTransition = new CameraTransition(
            camera,
            menuCameraPos,
            playerStartPos,
            menuCameraEuler,
            playerStartEuler,
            3.0
        );
    }

    handleStart() {
        if (this.onStart) {
            this.onStart();
        }

        this.started = true;
        this.startButton.blur();
        this.hide();
    }

    hide() {
        this.menuElement.classList.add('invisible');
    }

    show() {
        this.menuElement.classList.remove('invisible');
    }

    setOnStartCallback(callback) {
        this.onStart = callback;
    }

    update(delta) {
        if (this.started) {
            this.cameraTransition.update(delta);
        }

        if (this.cameraTransition.isComplete) {
            this.started = false;
            if (this.onEnd) {
                this.onEnd();
            }
        }
    }
}

class CameraTransition {
    constructor(camera, fromPos, toPos, fromEuler, toEuler, duration = 3.0) {
        this.camera = camera;
        this.fromPos = fromPos.clone();
        this.toPos = toPos.clone();
        this.fromQuat = new THREE.Quaternion().setFromEuler(fromEuler);
        this.toQuat = new THREE.Quaternion().setFromEuler(toEuler);
        this.duration = duration;
        this.elapsed = 0;
        this.isComplete = false;
    }

    update(delta) {
        if (this.isComplete) return;

        this.elapsed += delta;
        const progress = Math.min(this.elapsed / this.duration, 1.0);

        // Ease-out cubic for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        // Lerp position
        const currentPos = new THREE.Vector3();
        currentPos.lerpVectors(this.fromPos, this.toPos, easeProgress);
        this.camera.position.copy(currentPos);

        // Slerp quaternion
        this.camera.quaternion.slerpQuaternions(this.fromQuat, this.toQuat, easeProgress);

        if (progress >= 1.0) {
            this.isComplete = true;
        }
    }
}

export default MainMenu;

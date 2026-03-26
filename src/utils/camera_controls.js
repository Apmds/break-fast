import * as THREE from 'three';
import { inputManager } from './input_manager.js';

class CameraControls {
    constructor(camera, domElement = document.body) {
        this.camera = camera;
        this.domElement = domElement;

        this.pitch = 0;
        this.yaw = 0;
        this.sensitivity = 0.002;
        this.speed = 70;
        this.isLocked = false;

        this.forward = new THREE.Vector3();
        this.right = new THREE.Vector3();
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onPointerLockChange = this.onPointerLockChange.bind(this);

        this.domElement.addEventListener('click', () => {
            this.lock();
        });
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('pointerlockchange', this.onPointerLockChange);
    }

    lock() {
        this.domElement.requestPointerLock();
    }

    onPointerLockChange() {
        this.isLocked = document.pointerLockElement === this.domElement;
    }

    onMouseMove(event) {
        if (!this.isLocked) return;

        this.yaw -= event.movementX * this.sensitivity;
        this.pitch -= event.movementY * this.sensitivity;

        const maxPitch = Math.PI / 2 - 0.1;
        this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
    }

    update(delta) {
        this.euler.set(this.pitch, this.yaw, 0);
        this.camera.quaternion.setFromEuler(this.euler);

        if (!this.isLocked) return;

        this.forward.set(0, 0, -1).applyQuaternion(this.camera.quaternion).normalize();
        this.right.set(1, 0, 0).applyQuaternion(this.camera.quaternion).normalize();

        let moveForward = 0;
        let moveRight = 0;

        if (inputManager.keyPressed("KeyW")) moveForward += 1;
        if (inputManager.keyPressed("KeyS")) moveForward -= 1;
        if (inputManager.keyPressed("KeyD")) moveRight += 1;
        if (inputManager.keyPressed("KeyA")) moveRight -= 1;

        let movSpeed = this.speed;
        if (inputManager.keyPressed("ShiftLeft")) {
            movSpeed *= 2.5;
        }

        if (moveForward !== 0) {
            this.camera.position.addScaledVector(this.forward, moveForward * movSpeed * delta);
        }

        if (moveRight !== 0) {
            this.camera.position.addScaledVector(this.right, moveRight * movSpeed * delta);
        }
    }

    dispose() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    }
}

export default CameraControls
import * as THREE from 'three';
import { inputManager } from './input_manager.js';

class CameraControls {
    constructor(camera, domElement = document.body) {
        this.camera = camera;
        this.domElement = domElement;

        this.pitch = 0;
        this.yaw = 0;
        this.sensitivity = 0.002;
        this.speed = 130;
        this.isLocked = false;
        this.canMove = true;

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
        if (!this.isLocked || !this.canMove) return;

        this.yaw -= event.movementX * this.sensitivity;
        this.pitch -= event.movementY * this.sensitivity;

        const maxPitch = Math.PI / 2 - 0.1;
        this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));
    }

    update(delta, physicsBody = null, moveVelocity = null) {
        this.euler.set(this.pitch, this.yaw, 0);
        this.camera.quaternion.setFromEuler(this.euler);

        if (!this.isLocked || !this.canMove) return;

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

        // If physics body provided, apply velocity instead of direct position
        if (physicsBody && moveVelocity) {
            moveVelocity.x = 0;
            moveVelocity.z = 0;

            if (moveForward !== 0) {
                moveVelocity.x += this.forward.x * moveForward * movSpeed;
                moveVelocity.z += this.forward.z * moveForward * movSpeed;
            }

            if (moveRight !== 0) {
                moveVelocity.x += this.right.x * moveRight * movSpeed * 0.5;
                moveVelocity.z += this.right.z * moveRight * movSpeed * 0.5;
            }

            // Apply velocity, preserving vertical velocity for gravity
            physicsBody.velocity.x = moveVelocity.x;
            physicsBody.velocity.z = moveVelocity.z;

            // Jump
            if (inputManager.keyPressed("Space")) {
                physicsBody.velocity.y = 15; // Jump force
            }
        } else {
            // Fallback movement for non-physics mode
            if (moveForward !== 0) {
                this.camera.position.addScaledVector(this.forward, moveForward * movSpeed * delta);
            }

            if (moveRight !== 0) {
                this.camera.position.addScaledVector(this.right, moveRight * movSpeed * delta);
            }
        }
    }

    dispose() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    }
}

export default CameraControls
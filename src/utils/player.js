import CameraControls from './camera_controls.js';
import * as CANNON from 'cannon-es';

class Player {
    constructor(camera, domElement = document.body, physicsWorld) {
        this.camera = camera;
        this.cameraControls = new CameraControls(camera, domElement);
        this.physicsWorld = physicsWorld;

        // Create physics body for player
        const physicsShape = new CANNON.Sphere(0.5); // 0.5m radius
        this.physicsBody = new CANNON.Body({
            mass: 1,
            shape: physicsShape,
            linearDamping: 0.9,
            angularDamping: 0.9,
        });
        this.physicsBody.position.copy(camera.position);
        this.physicsWorld.addBody(this.physicsBody);

        this.moveVelocity = new CANNON.Vec3(0, 0, 0);
    }

    update(delta) {
        this.cameraControls.update(delta, this.physicsBody, this.moveVelocity);
        
        // Update camera position to match physics body
        this.camera.position.copy(this.physicsBody.position);
        // Keep camera slightly above the body center
        this.camera.position.y += 0.2;
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

    dispose() {
        this.cameraControls.dispose();
        this.physicsWorld.removeBody(this.physicsBody);
    }
}

export default Player;

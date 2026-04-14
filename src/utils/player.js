import CameraControls from './camera_controls.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

class Player {
    constructor(camera, domElement = document.body, physicsWorld, scene = null) {
        this.camera = camera;
        this.cameraControls = new CameraControls(camera, domElement);
        this.physicsWorld = physicsWorld;
        this.scene = scene;

        // Create physics body for player
        const physicsShape = new CANNON.Sphere(1.2);
        this.physicsBody = new CANNON.Body({
            mass: 1,
            shape: physicsShape,
            linearDamping: 0.9,
            angularDamping: 0.9,
        });
        this.physicsBody.position.copy(camera.position);
        this.physicsWorld.addBody(this.physicsBody);

        this.moveVelocity = new CANNON.Vec3(0, 0, 0);
        this.raycaster = new THREE.Raycaster();
        this.rayOrigin = new THREE.Vector2(0, 0);
        this.raycastDistance = 10;
    }

    update(delta) {
        this.cameraControls.update(delta, this.physicsBody, this.moveVelocity);
        
        // Update camera position to match physics body
        this.camera.position.copy(this.physicsBody.position);
        // Keep camera slightly above the body center
        this.camera.position.y += 1.2;

        this.updateCitizenOutline();
    }

    updateCitizenOutline() {
        if (!this.scene) {
            return;
        }

        this.raycaster.setFromCamera(this.rayOrigin, this.camera);
        this.raycaster.far = this.raycastDistance;

        const intersections = this.raycaster.intersectObjects(this.scene.children, true);
        let hitCitizen = null;

        for (const hit of intersections) {
            const citizenRoot = this.findCitizenRoot(hit.object);
            if (citizenRoot) {
                hitCitizen = citizenRoot;
                break;
            }
        }

        this.scene.traverse((node) => {
            if (node.userData?.isCitizen) {
                node.userData.outline = node === hitCitizen;
            }
        });
    }

    findCitizenRoot(object) {
        let current = object;

        while (current) {
            if (current.userData?.isCitizen) {
                return current;
            }
            current = current.parent;
        }

        return null;
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

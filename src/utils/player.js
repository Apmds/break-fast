import CameraControls from './camera_controls.js';
import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import { inputManager } from './input_manager.js';

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
        this.physicsBody.position.set(camera.position.x, camera.position.y, camera.position.z);
        this.physicsWorld.addBody(this.physicsBody);

        this.moveVelocity = new CANNON.Vec3(0, 0, 0);
        this.raycaster = new THREE.Raycaster();
        this.rayOrigin = new THREE.Vector2(0, 0);
        this.raycastDistance = 10;
        this.currentHoveredObject = null;
        this.interactionKey = 'KeyE';


        this.inventory = [];
    }

    update(delta) {
        this.cameraControls.update(delta, this.physicsBody, this.moveVelocity);
        
        // Update camera position to match physics body
        this.camera.position.set(
            this.physicsBody.position.x,
            this.physicsBody.position.y + 1.2,
            this.physicsBody.position.z
        );
        this.handleInteraction();
    }

    handleInteraction() {
        if (inputManager.keyJustPressed(this.interactionKey) && this.currentHoveredObject && this.currentHoveredObject.interactable) {
            this.currentHoveredObject.onInteract(this);
        }
    
        this.updateRaycaster();
    }

    updateRaycaster() {
        if (!this.scene) {
            return;
        }

        this.raycaster.setFromCamera(this.rayOrigin, this.camera);
        this.raycaster.far = this.raycastDistance;

        const intersections = this.raycaster.intersectObjects(this.scene.children, true);
        let hitObject = null;

        this.currentHoveredObject = null;
        for (const hit of intersections) {
            const worldObject = this.findObjectRoot(hit.object);
            if (worldObject) {
                hitObject = worldObject;
                this.currentHoveredObject = hitObject;
                break;
            }
        }

        const interactableObjects = new Set();
        this.scene.traverse((node) => {
            const worldObject = node.userData?.worldObject;
            if (worldObject?.interactable) {
                interactableObjects.add(worldObject);
            }
        });

        interactableObjects.forEach((worldObject) => {
            worldObject.outline = worldObject === hitObject;
        });
    }

    findObjectRoot(object) {
        let current = object;

        while (current) {
            if (current.userData?.worldObject) {
                return current.userData.worldObject;
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

    set canMove(value) {
        this.cameraControls.canMove = value;

        if (!value) {
            this.stopMovement();
        }
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

    stopMovement() {
        if (this.moveVelocity) {
            this.moveVelocity.set(0, 0, 0);
        }

        if (this.physicsBody) {
            this.physicsBody.velocity.set(0, 0, 0);
            this.physicsBody.angularVelocity.set(0, 0, 0);
        }
    }
}

export default Player;

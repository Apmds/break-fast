import * as THREE from 'three';
import WorldObject from '../utils/world_object.js';
import Path from '../utils/path.js';

class Car extends WorldObject {
    constructor(position, rotation = new THREE.Vector3(), interactable = false) {
        const CAR_SCALE = 1.1;
        
        super(position, rotation, new THREE.Vector3(CAR_SCALE, CAR_SCALE, CAR_SCALE), interactable);
        
        this.animationNames = ['car_vibrate', 'wheel_rotate', 'wheel_rim_rotate'];
        this.model = 'car';
        this.createBasicBody();
        this.runAnimation();

        this._path = new Path();
        this._path
            .addPoint(new THREE.Vector3(15, 0.6, -367), new THREE.Vector3(0, Math.PI/2, 0))
            .addPoint(new THREE.Vector3(15, 0.6, -607), new THREE.Vector3(0, Math.PI/2, 0))
            .addPoint(new THREE.Vector3(15, 0.6, -612), new THREE.Vector3(0, Math.PI/4, 0), 10)
            .addPoint(new THREE.Vector3(20, 0.6, -612), new THREE.Vector3(0, 0, 0), 10)
            .addPoint(new THREE.Vector3(169, 0.6, -612), new THREE.Vector3(0, 0, 0))
            .addPoint(new THREE.Vector3(174, 0.6, -612), new THREE.Vector3(0, -Math.PI/4, 0), 10)
            .addPoint(new THREE.Vector3(174, 0.6, -607), new THREE.Vector3(0, -Math.PI/2, 0), 10)
            .addPoint(new THREE.Vector3(174, 0.6, -318), new THREE.Vector3(0, -Math.PI/2, 0))
            .addPoint(new THREE.Vector3(174, 0.6, -313), new THREE.Vector3(0, -Math.PI/2 -Math.PI/4, 0), 10)
            .addPoint(new THREE.Vector3(168, 0.6, -313), new THREE.Vector3(0, -Math.PI, 0), 10)
            .addPoint(new THREE.Vector3(59, 0.6, -313), new THREE.Vector3(0, -Math.PI, 0))
            ;

        this._lerpVal = 0;
        this._lastPath = this._path.getNext();
        this._currPath = this._path.getNext();
    }

    update(delta) {
        super.update(delta);

        this.position = this.position.lerpVectors(this._lastPath.position, this._currPath.position, this._lerpVal);
        this.rotation = this.rotation.lerpVectors(this._lastPath.rotation, this._currPath.rotation, this._lerpVal);
        
        this._lerpVal += this._currPath.speed * (delta / 10);

        if (this._lerpVal > 0.99) {
            this._lastPath = this._currPath;
            this._currPath = this._path.getNext();
            this._lerpVal = 0;
        }
    }

    runAnimation() {
        if (!this._animationMixer || !this._animations) {
            return;
        }

        this.animationNames.forEach((name) => {
            this.playAnimation(name, true);
        });
    }

    stopRunAnimation() {
        this.animationNames.forEach(() => {
            this.stopAnimation();
        });
    }
}

export default Car;

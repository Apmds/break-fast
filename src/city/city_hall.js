import * as THREE from "three";
import WorldObject from "../object/world_object.js";

class CityHall extends WorldObject {
    constructor(position, rotation = new THREE.Vector3()) {
        const SCALE = 5;
        
        super(position, rotation, new THREE.Vector3(SCALE, SCALE, SCALE), false);
        
        this.model = 'city_hall';
        //this.createBasicBody();

        this._addInteriorDarkness();

        this.openDoors();

        setTimeout(() => {
            this.closeDoors();
        }, 20000);
    }

    _addInteriorDarkness() {
        this._model.updateWorldMatrix(true, true);

        const invModel = new THREE.Matrix4().copy(this._model.matrixWorld).invert();
        const bbox = new THREE.Box3();

        this._model.traverse(node => {
            if (node.isMesh) {
                node.geometry.computeBoundingBox();
                const geoBbox = node.geometry.boundingBox.clone();
                const localMatrix = new THREE.Matrix4().multiplyMatrices(invModel, node.matrixWorld);
                geoBbox.applyMatrix4(localMatrix);
                bbox.union(geoBbox);
            }
        });

        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        bbox.getSize(size);
        bbox.getCenter(center);

        const mat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        const mat2 = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
        
        const center_main = new THREE.Vector3();
        center_main.addVectors(center, new THREE.Vector3(0, -2.5, -0.9));

        const center_left = new THREE.Vector3();
        center_left.addVectors(center, new THREE.Vector3(2.2, -6.5, 5.4));

        const center_right = new THREE.Vector3();
        center_right.addVectors(center, new THREE.Vector3(-2.2, -6.5, 5.4));

        const center_top = new THREE.Vector3();
        center_top.addVectors(center, new THREE.Vector3(-2.2, -4.8, 5.05));

        const center_bottom = new THREE.Vector3();
        center_bottom.addVectors(center, new THREE.Vector3(-2.2, -7.54, 5.6));

        const main_geo = new THREE.BoxGeometry(size.x * 0.95, size.y * 0.65, size.z * 0.75);
        const main_darkness = new THREE.Mesh(main_geo, mat);
        main_darkness.position.copy(center_main);
        this._model.add(main_darkness);


        const left_right_geo = new THREE.BoxGeometry(size.x * 0.1, size.y * 0.21, size.z * 0.1);
        const top_bottom_geo = new THREE.BoxGeometry(size.x * 0.3, size.y * 0.01, size.z * 0.1);
        const left_darkness = new THREE.Mesh(left_right_geo, mat);
        const right_darkness = new THREE.Mesh(left_right_geo, mat);
        const top_darkness = new THREE.Mesh(top_bottom_geo, mat);
        const bottom_darkness = new THREE.Mesh(top_bottom_geo, mat);
        left_darkness.position.copy(center_left);
        right_darkness.position.copy(center_right);
        top_darkness.position.copy(center_top);
        bottom_darkness.position.copy(center_bottom);
        this._model.add(left_darkness);
        this._model.add(right_darkness);
        this._model.add(top_darkness);
        this._model.add(bottom_darkness);


    }

    openDoors() {
        this.playAnimation("Open", false, true, false);
        this.playAnimation("Open.001", false, true, false);
    }

    closeDoors() {
        this.playAnimation("Open", false, true, true);
        this.playAnimation("Open.001", false, true, true);
    }
}

export default CityHall;
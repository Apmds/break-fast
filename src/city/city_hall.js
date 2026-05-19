import * as THREE from "three";
import WorldObject from "../object/world_object.js";

class CityHall extends WorldObject {
    constructor(position, rotation = new THREE.Vector3()) {
        const SCALE = 5;
        
        super(position, rotation, new THREE.Vector3(SCALE, SCALE, SCALE), true);
        
        this.model = 'city_hall';

        this.addOutlineIgnore("Stadhuis_blinn1_0");
        this._addInteriorDarkness();

        this._doorsOpened = false;
    }

    onInteract(object) {
        // BAD, BAD, BAD, hardcoded
        if (object.position.x > 145) {
            return;
        }
        if (object.position.z <= -164 || object.position.z > -155.5) {
            return;
        }

        if (!this._doorsOpened) {
            this.openDoors();
        } else {
            this.closeDoors();
        }
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
        center_left.addVectors(center, new THREE.Vector3(2.2, -6.5, -1));

        const center_right = new THREE.Vector3();
        center_right.addVectors(center, new THREE.Vector3(-2.2, -6.5, -1));

        const center_top = new THREE.Vector3();
        center_top.addVectors(center, new THREE.Vector3(-2.2, -4.8, -1.05));

        const center_bottom = new THREE.Vector3();
        center_bottom.addVectors(center, new THREE.Vector3(-2.2, -7.54, -0.6));

        const center_back = new THREE.Vector3();
        center_back.addVectors(center, new THREE.Vector3(-2.2, -6.5, -6.6));

        const main_geo = new THREE.BoxGeometry(size.x * 0.95, size.y * 0.65, size.z * 0.75);
        this._mainDarkness = new THREE.Mesh(main_geo, mat);
        this._mainDarkness.name = "main_darkness";
        this._mainDarkness.position.copy(center_main);
        this._model.add(this._mainDarkness);

        const left_right_geo = new THREE.BoxGeometry(size.x * 0.1, size.y * 0.21, size.z * 0.8);
        const top_bottom_geo = new THREE.BoxGeometry(size.x * 0.3, size.y * 0.01, size.z * 0.8);
        const back_geo = new THREE.BoxGeometry(size.x * 0.3, size.y * 0.21, size.z * 0.1);
        const left_darkness = new THREE.Mesh(left_right_geo, mat);
        const right_darkness = new THREE.Mesh(left_right_geo, mat);
        const top_darkness = new THREE.Mesh(top_bottom_geo, mat);
        const bottom_darkness = new THREE.Mesh(top_bottom_geo, mat);
        const back_darkness = new THREE.Mesh(back_geo, mat);
        left_darkness.position.copy(center_left);
        right_darkness.position.copy(center_right);
        top_darkness.position.copy(center_top);
        bottom_darkness.position.copy(center_bottom);
        back_darkness.position.copy(center_back);
        
        left_darkness.name = "left_darkness";
        right_darkness.name = "right_darkness";
        top_darkness.name = "top_darkness";
        bottom_darkness.name = "bottom_darkness";
        back_darkness.name = "back_darkness";

        this._model.add(left_darkness);
        this._model.add(right_darkness);
        this._model.add(top_darkness);
        this._model.add(bottom_darkness);
        this._model.add(back_darkness);
        
        this.addOutlineIgnore(this._mainDarkness.name);
        this.addOutlineIgnore(left_darkness.name);
        this.addOutlineIgnore(right_darkness.name);
        this.addOutlineIgnore(top_darkness.name);
        this.addOutlineIgnore(bottom_darkness.name);
        this.addOutlineIgnore(back_darkness.name);
    }

    setupCollisions() {
        if (!this._model) return;
        this._model.updateWorldMatrix(true, true);

        // Compute bounding box in model local space (same approach as _addInteriorDarkness)
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

        const SCALE = 5;

        // Creates a body aligned with model rotation from local-space center + half-extents
        const box = (localCenter, localHalf, mass = 0) => {
            const wp = localCenter.clone().applyMatrix4(this._model.matrixWorld);
            const wh = localHalf.clone().multiplyScalar(SCALE);
            return this.addCollisionBox(wp, wh, mass, this._model.quaternion);
        };

        const T  = 0.5;           // wall thickness (local units)
        const sx = size.x / 2;
        const sy = size.y / 2;
        const sz = size.z / 2;
        const cx = center.x;
        const cy = center.y;
        const cz = center.z;

        //box(new THREE.Vector3(cx, cy, cz),
        //    new THREE.Vector3(sx, sy, sz));

        // Back wall
        box(new THREE.Vector3(cx, cy, cz - sz + T / 2),
            new THREE.Vector3(sx, sy, T / 2));

        // Left wall
        box(new THREE.Vector3(cx - sx + T / 2, cy, cz - 1.2),
            new THREE.Vector3(T / 2, sy, sz * 0.85));

        // Right wall
        box(new THREE.Vector3(cx + sx - T / 2, cy, cz - 1.2),
            new THREE.Vector3(T / 2, sy, sz * 0.85));

        // Roof
        box(new THREE.Vector3(cx, cy + sy - T / 2, cz),
            new THREE.Vector3(sx, T / 2, sz));

        // Front walls (behind stairs)
        box(new THREE.Vector3(cx - (sx + 2) / 2, cy, sz - 2.3),
            new THREE.Vector3((sx - 2) / 2, sy, T / 2));
        box(new THREE.Vector3(cx + (sx + 2) / 2, cy, sz - 2.3),
            new THREE.Vector3((sx - 2) / 2, sy, T / 2));

        // Stairs
        box(new THREE.Vector3(cx, T/2, sz - 1.3),
            new THREE.Vector3(sx * 0.55, 0.2, 2.1 * T));

        // Header above door opening
        box(new THREE.Vector3(cx, cy + 2, sz - 2.3),
            new THREE.Vector3(5, sy*0.75, T / 2));

        // Interior walls

        // Left wall
        box(new THREE.Vector3(cx + 2.2, cy - 6.5, cz - 1),
            new THREE.Vector3(size.x * 0.05, size.y * 0.105, size.z * 0.4));

        // Right wall
        box(new THREE.Vector3(cx - 2.2, cy - 6.5, cz - 1),
            new THREE.Vector3(size.x * 0.05, size.y * 0.105, size.z * 0.4));

        // Back wall
        box(new THREE.Vector3(cx - 2.2, cy - 6.5, cz - 6.6),
            new THREE.Vector3(size.x * 0.15, size.y * 0.105, size.z * 0.05));

        // Top
        box(new THREE.Vector3(cx, cy - 4.8, cz),
            new THREE.Vector3(sx * 0.7, 0.2, sy * 0.7));

        // Columns
        box(new THREE.Vector3(cx - 4.65, sy*0.5, sz - 2),
            new THREE.Vector3(T*1.2, sy*0.5, T*1.2));
        box(new THREE.Vector3(cx - 1.6, sy*0.5, sz - 2),
            new THREE.Vector3(T*1.2, sy*0.5, T*1.2));

        box(new THREE.Vector3(cx + 4.65, sy*0.5, sz - 2),
            new THREE.Vector3(T*1.2, sy*0.5, T*1.2));
        box(new THREE.Vector3(cx + 1.6, sy*0.5, sz - 2),
            new THREE.Vector3(T*1.2, sy*0.5, T*1.2));

        // Floor
        box(new THREE.Vector3(cx, T/2, cz),
            new THREE.Vector3(sx * 0.8, 0.2, sy * 0.8));

        // --- Door collision body (fills opening when closed) ---
        //const doorLocalCenter = new THREE.Vector3(cx, doorCY, frontZ - T / 2);
        //this._doorClosedPos = doorLocalCenter.clone().applyMatrix4(this._model.matrixWorld);
        //this._doorBody = box(doorLocalCenter, new THREE.Vector3(doorHW, doorHH, T / 2));
    }

    hideDarkness() {
        if (this._mainDarkness) this._mainDarkness.visible = false;
    }

    openDoors() {
        this.playAnimation("Open", false, true, false);
        this._doorsOpened = true;
        if (this._doorBody) {
            this._doorBody.position.set(0, -1000, 0);
            this._doorBody.aabbNeedsUpdate = true;
        }
    }

    closeDoors() {
        this.playAnimation("Open", false, true, true);
        this._doorsOpened = false;
        if (this._doorBody && this._doorClosedPos) {
            this._doorBody.position.copy(this._doorClosedPos);
            this._doorBody.aabbNeedsUpdate = true;
        }
    }
}

export default CityHall;
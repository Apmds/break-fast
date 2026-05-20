import * as THREE from 'three';
import Scene from "../utils/scene.js";
import Car from "./car.js";
import { make_road } from "./road.js";
import { ROAD_DIR } from '../utils/road.js';
import make_skybox from './skybox.js';
import Path from '../object/path.js';
import UIUtils from '../utils/ui_utils.js';
import { make_river } from './water.js';

class EndScene extends Scene {
    constructor(camera, player) {
        super(camera, player);

        this._roadMoving = false;

        player.canMove = false;
        player.unlock();

        const [road] = make_road(50, -0.6, 0, ROAD_DIR.LEFT, 80, 0);
        this._road = road;
        this.addModel(this._road);

        this.addModel(make_river(0, -25, -200));

        this._car = new Car(new THREE.Vector3(100, 0, 0), new THREE.Vector3(0, Math.PI, 0));
        this._car.setPath(new Path()
            .addPoint(new THREE.Vector3(100, 0, 0), new THREE.Vector3(0, Math.PI, 0), 1)
            .addPoint(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI, 0), 3)
        );
        this._car.followPath(false, () => {
            this._roadMoving = true;

            setTimeout(() => {
                UIUtils.showEndMenu(player.inventory.map((el) => el.itemImage));
            }, 500);
        });
        this._car.runAnimation();
        this.add(this._car, "car");

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.addModel(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xfff3dc, 2.2);
        keyLight.name = "keyLight";
        keyLight.position.set(150, 300, 150);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(2048, 2048);
        keyLight.shadow.camera.near = 10;
        keyLight.shadow.camera.far = 800;
        keyLight.shadow.camera.left = -200;
        keyLight.shadow.camera.right = 200;
        keyLight.shadow.camera.top = 200;
        keyLight.shadow.camera.bottom = -200;
        keyLight.shadow.bias = -0.001;
        keyLight.shadow.normalBias = 0.05;
        this.addModel(keyLight);

        const fillLight = new THREE.DirectionalLight(0xbfd9ff, 0.55);
        fillLight.position.set(-180, 120, -220);
        this.addModel(fillLight);

        const rimLight = new THREE.DirectionalLight(0xffe8c9, 0.35);
        rimLight.position.set(80, 80, 350);
        this.addModel(rimLight);

        this.addModel(make_skybox());
        this.scene.fog = new THREE.Fog(0xAAAAAA, 300, 600);

        this._camPos = new THREE.Vector3(0, this._car.position.y + 12, this._car.position.z + 15);
    }

    update(delta) {
        super.update(delta);

        if (this._roadMoving) {
            this._road.position.x += 30 * delta;
            if (this._road.position.x > 50) {
                this._road.position.x -= 5;
            }
        }

        // Static camera
        this.camera.position.copy(this._camPos);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}

export default EndScene;

import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { make_tree, make_tree_crowns } from './trees.js';
import { make_road, make_road_corner, make_roundabout, road_width } from './road.js';
import { make_path_parts, make_road_paths, path_width } from './sidewalk.js';
import { make_bridge } from './bridge.js';
import make_skybox from './skybox.js';
import { ROAD_DIR, ROAD_CORNER_DIR } from '../utils/road.js';

import Citizen from '../people/citizen.js';
import make_house from './house.js';
import Scene from '../utils/scene.js';

class City extends Scene {
    constructor(camera) {
        super(camera);

        this.scene.add(make_city());
        this.scene.add(make_skybox());
        this.scene.fog = new THREE.Fog(0xAAAAAA, 300, 600);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        ambientLight.name = "ambientLight";
        this.add(ambientLight);
    
        const hemisphereLight = new THREE.HemisphereLight(0xd8ecff, 0x9bb07a, 0.55);
        hemisphereLight.name = "hemisphereLight";
        this.add(hemisphereLight);

        // Position of the sun (keylight)
        this.sunpos = new THREE.Vector3(150, 300, 150);
    
        const keyLight = new THREE.DirectionalLight(0xfff3dc, 2.2);
        keyLight.position.copy(this.sunpos);
        keyLight.lookAt(this.scene.position)
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(2048, 2048);
    
        keyLight.shadow.camera.near = 10;
        keyLight.shadow.camera.far = 1000;
        keyLight.shadow.camera.left = -200;
        keyLight.shadow.camera.right = 200;
        keyLight.shadow.camera.top = 200;
        keyLight.shadow.camera.bottom = -200;
    
        // Adjust biases
        keyLight.shadow.bias = -0.001;
        keyLight.shadow.normalBias = 0.07;
    
        keyLight.name = "keyLight";
        this.add(keyLight);
    
        const fillLight = new THREE.DirectionalLight(0xbfd9ff, 0.55);
        fillLight.position.set(-180, 120, -220);
        fillLight.name = "fillLight";
        this.add(fillLight);
    
        const rimLight = new THREE.DirectionalLight(0xffe8c9, 0.35);
        rimLight.position.set(80, 80, 350);
        rimLight.name = "rimLight";
        this.add(rimLight);

        // Physics world
        this.physicsWorld = new CANNON.World();
        this.physicsWorld.gravity.set(0, -9.82*5, 0);
        this.physicsWorld.defaultContactMaterial.friction = 0.1;

        // Ground body - using a large flat box instead of plane
        const groundShape = new CANNON.Box(new CANNON.Vec3(1500, 1, 1500)); // width, height, depth
        this.groundBody = new CANNON.Body({
            mass: 0,
            shape: groundShape,
        });
        this.groundBody.position.y = 0; // Slightly below player spawn
        this.physicsWorld.addBody(this.groundBody);

        // GUI
        this.gui.makeFolder('Camera Position');
        this.gui.add('Camera Position', 'X', camera.position, 'x').listen();
        this.gui.add('Camera Position', 'Y', camera.position, 'y').listen();
        this.gui.add('Camera Position', 'Z', camera.position, 'z').listen();

        this.gui.makeFolder('Lighting');
        
        this.gui.add('Lighting', 'key intensity', keyLight, 'intensity', 0, 5, 0.01);
        this.gui.add('Lighting', 'fill intensity', fillLight, 'intensity', 0, 2, 0.01);
        this.gui.add('Lighting', 'rim intensity', rimLight, 'intensity', 0, 2, 0.01);
        this.gui.add('Lighting', 'hemi intensity', hemisphereLight, 'intensity', 0, 2, 0.01);
    }

    update(delta) {
        super.update(delta);

        const keyLight = this.getObject("keyLight");
        keyLight.position.copy(new THREE.Vector3().addVectors(this.player.position, this.sunpos));
        
        keyLight.target.position.copy(this.player.position);
        keyLight.target.updateMatrixWorld();
    }
}

function make_city() {
    const city = new THREE.Object3D();

    // Base ground
    const base_ground = new THREE.Mesh(
        new THREE.BoxGeometry(420, 100, 800),
        new THREE.MeshToonMaterial({color: 0xAAAAAA, fog: false}),
    );
    base_ground.position.x = 60;
    base_ground.position.z = -350;
    base_ground.position.y = -50.01;
    city.add(base_ground);

    // Base ground on the other side of the bridge
    const base_ground_other_side = new THREE.Mesh(
        new THREE.BoxGeometry(600, 100, 900),
        new THREE.MeshToonMaterial({color: 0xAAAAAA})
    );
    base_ground_other_side.position.x = -1300;
    base_ground_other_side.position.z = -300;
    base_ground_other_side.position.y = -50.1;
    city.add(base_ground_other_side);

    // Base grass
    {
        const base_grass = new THREE.Mesh(
            new THREE.BoxGeometry(1000, 100, 1500),
            new THREE.MeshToonMaterial({color: 0x8f994e, fog: false})
        );
        base_grass.position.x = 400;
        base_grass.position.z = -300;
        base_grass.position.y = -50.2;
        city.add(base_grass);
    }

    {
        const base_grass = new THREE.Mesh(
            new THREE.BoxGeometry(85, 100, 170),
            new THREE.MeshToonMaterial({color: 0x8f994e, fog: false})
        );
        base_grass.position.x = -106;
        base_grass.position.z = -190;
        base_grass.position.y = -49.9;
        city.add(base_grass);
    }

    {
        const base_grass = new THREE.Mesh(
            new THREE.BoxGeometry(85, 100, 300),
            new THREE.MeshToonMaterial({color: 0x8f994e, fog: false})
        );
        base_grass.position.x = -106;
        base_grass.position.z = -500;
        base_grass.position.y = -49.9;
        city.add(base_grass);
    }

    let road_start;

    let [road, endpoint] = make_road_corner(0, 0, ROAD_CORNER_DIR.LEFT_UP, 50);
    city.add(road);

    road_start = endpoint.clone();
    [road, endpoint] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.UP, 50, 0);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.UP, 50));

    const [roundabout, endpoint_front, endpoint_left, endpoint_right] = make_roundabout(endpoint.x, endpoint.z - 50, 50);
    city.add(roundabout);

    // Bridge stuff
    {
        const [road_to_bridge, endpoint] = make_road(endpoint_left.x, 0, endpoint_right.z, ROAD_DIR.LEFT, 10, 0);
        city.add(road_to_bridge)

        const [bridge_ramp, endpoint_ramp] = make_road(endpoint.x, endpoint.y, endpoint.z, ROAD_DIR.LEFT, 16, THREE.MathUtils.degToRad(10), true);
        city.add(bridge_ramp);

        city.add(make_bridge(endpoint_ramp.x, endpoint_ramp.y, endpoint_ramp.z, ROAD_DIR.LEFT))
    }

    road_start = new THREE.Vector3(endpoint_front.x, 0, endpoint_front.z);
    [road, endpoint] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.UP, 50, 0);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.UP, 50));

    [road, endpoint] = make_road_corner(endpoint.x, endpoint.z, ROAD_CORNER_DIR.DOWN_RIGHT);
    city.add(road);

    road_start = endpoint.clone();
    [road, endpoint] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.RIGHT, 30, 0);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.RIGHT, 30));

    [road, endpoint] = make_road_corner(endpoint.x, endpoint.z, ROAD_CORNER_DIR.LEFT_DOWN);
    city.add(road);

    road_start = endpoint.clone();
    [road, endpoint] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.DOWN, 58, 0);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.DOWN, 58));

    
    road_start = new THREE.Vector3(endpoint.x - road_width / 2, 0, endpoint.z + (road_width / 2));
    [road] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.LEFT, 22, 0);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.LEFT, 22));
    
    road_start = new THREE.Vector3(endpoint.x, 0, endpoint.z);
    [road, endpoint] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.DOWN, 4, 0);
    city.add(road);
    let [single_path] = make_path_parts(0, 0, 4, 'right');
    single_path.position.set(-road_start.x - road_width/2 - path_width/2, 0, -road_start.z);
    single_path.rotateY(ROAD_DIR.DOWN);
    single_path.position.set(road_start.x + road_width/2 + path_width/2, 0, road_start.z);
    city.add(single_path);

    road_start = new THREE.Vector3(endpoint.x, 0, endpoint.z);
    [road] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.DOWN, 50, 0);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.DOWN, 50));

    // TODO: estrada sem saída


    city.add(make_tree(-40, 0, 200, 2));
    city.add(make_tree(-10, 0, 220, 1.5));
    city.add(make_tree(-30, 0, 230, 1.7));
    city.add(make_tree_crowns(90, 0, 170, 1));

    // Houses
    {
        const house = make_house(-30, 0, -400);
        house.rotation.y = Math.PI;
        city.add(house);
    }

    {
        const house = make_house(-30, 0, -480);
        house.rotation.y = Math.PI;
        city.add(house);
    }

    {
        const house = make_house(-30, 0, -560);
        house.rotation.y = Math.PI;
        city.add(house);
    }


    {
        const house = make_house(95, 0, -660);
        house.rotation.y = Math.PI/2;
        city.add(house);
    }

    
    {
        const house = make_house(230, 0, -400);
        house.rotation.y = 0;
        city.add(house);
    }

    {
        const house = make_house(230, 0, -480);
        house.rotation.y = 0;
        city.add(house);
    }

    {
        const house = make_house(230, 0, -560);
        house.rotation.y = 0;
        city.add(house);
    }


    {
        const house = make_house(230, 0, -220);
        house.rotation.y = 0;
        city.add(house);
    }

    {
        const house = make_house(230, 0, -120);
        house.rotation.y = 0;
        city.add(house);
    }

    {
        const house = make_house(-30, 0, -200);
        house.rotation.y = Math.PI;
        city.add(house);
    }

    // Citizens
    const citizen1 = new Citizen(
        new THREE.Vector3(0, 0, 45),
        new THREE.Vector3(0, 0, 0),
        true
    );
    city.add(citizen1.model);

    const citizen2 = new Citizen(
        new THREE.Vector3(30, 0, 80),
        new THREE.Vector3(0, Math.PI / 2, 0)
    );
    city.add(citizen2.model);

    const citizen3 = new Citizen(
        new THREE.Vector3(94, 0, 95),
        new THREE.Vector3(0, 0, 0)
    );
    city.add(citizen3.model);

    const citizen4 = new Citizen(
        new THREE.Vector3(10, 0, 60),
        new THREE.Vector3(0, Math.PI, 0)
    );
    city.add(citizen4.model);

    // Ensure every city mesh participates in shadow rendering.
    city.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    return city
}

export default City;
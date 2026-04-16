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
import PlaceHolderItem from '../items/placeholder.js';

class City extends Scene {
    constructor(camera) {
        super(camera);

        this.scene.add(make_city());
        this.scene.add(make_skybox());
        this.scene.fog = new THREE.Fog(0xAAAAAA, 300, 600);

        // Placeholder objects
        const item1 = new PlaceHolderItem(
            new THREE.Vector3(8, 0, -305),
            new THREE.Vector3(0, Math.PI/2, Math.PI/3),
            new THREE.Vector3(1, 1, 1)
        );
        this.scene.add(item1.model);

        const item2 = new PlaceHolderItem(
            new THREE.Vector3(3, 2, -312),
            new THREE.Vector3(Math.PI/2, 0, Math.PI/3),
            new THREE.Vector3(1, 1, 1)
        );
        this.scene.add(item2.model);

        const item3 = new PlaceHolderItem(
            new THREE.Vector3(10, 2, -309),
            new THREE.Vector3(0, Math.PI/3, Math.PI/2),
            new THREE.Vector3(1, 1, 1)
        );
        this.scene.add(item3.model);

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
        this.gui.hide();
        //this.gui.makeFolder('Camera Position');
        //this.gui.add('Camera Position', 'X', camera.position, 'x').listen();
        //this.gui.add('Camera Position', 'Y', camera.position, 'y').listen();
        //this.gui.add('Camera Position', 'Z', camera.position, 'z').listen();

        //this.gui.makeFolder('Lighting');
        
        //this.gui.add('Lighting', 'key intensity', keyLight, 'intensity', 0, 5, 0.01);
        //this.gui.add('Lighting', 'fill intensity', fillLight, 'intensity', 0, 2, 0.01);
        //this.gui.add('Lighting', 'rim intensity', rimLight, 'intensity', 0, 2, 0.01);
        //this.gui.add('Lighting', 'hemi intensity', hemisphereLight, 'intensity', 0, 2, 0.01);
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

    // Hand-placed tree scatter: very dense in the main grass area and lighter in side patches.
    {
        const classicTreesMain = [
            [483, -153, 0.9], [618, -411, 1.0], [373, -226, 1.1],
            [585, -276, 0.8],
            [498, -710, 0.8], [285, -675, 0.9], [538, -508, 1.0], [523, -676, 1.1],
            [430, -730, 0.8], [520, -443, 1.0], [590, -305, 1.1],
            [388, -600, 0.8], [613, -430, 0.9], [568, -260, 1.1],
            [360, -495, 0.8], [448, -536, 0.9],
            [423, -123, 0.8], [520, -395, 0.9], [475, -311, 1.1],
            [398, -300, 0.8], [443, -620, 0.9], [438, -206, 1.0], [510, -540, 1.1],
            [393, -210, 1.0],
            [408, -555, 0.8], [573, -581, 0.9], [388, -200, 1.1],
            [508, -295, 0.8], [615, -523, 1.1],
            [388, -438, 1.0], [463, -223, 1.1],
            [645, -751, 0.9], [498, -435, 1.1],
            [508, -291, 0.8], [273, -548, 0.9], [645, -416, 1.0],
            [415, -613, 0.9], [418, -205, 1.0],
            [333, -243, 0.9], [415, -541, 1.0], [310, -573, 1.1],
            [413, -551, 0.8], [328, -563, 1.1],
            [498, -301, 0.8], [433, -170, 1.1],
            [603, -263, 0.8], [403, -303, 0.9], [558, -128, 1.1],
            [298, -595, 0.9],
            [390, -520, 0.8], [398, -571, 1.0], [560, -498, 1.1],
        ];

        const crownTreesMain = [
            [328, -611, 0.9], [338, -451, 1.1], [558, -483, 0.9],
            [470, -291, 1.0], [543, -453, 1.1], [448, -730, 0.9], [498, -463, 1.0],
            [553, -760, 1.1], [548, -668, 1.0], [483, -381, 1.1],
            [318, -748, 0.9], [303, -710, 1.0], [600, -235, 0.9],
            [508, -455, 0.9], [315, -226, 1.0],
            [478, -356, 1.1], [498, -126, 1.1],
            [348, -146, 0.9], [640, -198, 1.1], [530, -303, 0.9],
            [300, -320, 1.0], [523, -245, 1.1], [550, -601, 0.9],
            [338, -416, 1.1],
            [638, -471, 1.1], [360, -123, 0.9],
            [430, -540, 1.1], [643, -706, 0.9],
            [333, -376, 0.9], [273, -338, 0.9],
            [630, -261, 1.0], [338, -216, 1.1], [580, -753, 0.9], [345, -661, 1.0],
            [390, -466, 1.1], [448, -713, 0.9], [473, -610, 1.0],
            [513, -606, 0.9], [435, -283, 1.1], [518, -278, 0.9],
            [308, -445, 1.1], [353, -476, 0.9],
            [325, -470, 0.9],
            [305, -475, 0.9], [400, -596, 0.9],
            [498, -121, 1.0],
            [343, -716, 0.9],
        ];

        const classicTreesSide = [
            [-138, -248, 0.8], [-104, -224, 0.9], [-78, -188, 1.0], [-126, -152, 1.1], [-92, -132, 0.8],
            [-140, -618, 0.9], [-108, -582, 1.0], [-76, -540, 1.1], [-132, -470, 0.8], [-98, -402, 0.9],
        ];

        const crownTreesSide = [
            [-122, -262, 0.9], [-88, -238, 1.0], [-70, -206, 1.1], [-136, -178, 0.9], [-106, -146, 1.0],
            [-124, -632, 1.1], [-90, -596, 0.9], [-72, -560, 1.0], [-120, -500, 1.1], [-86, -430, 0.9],
        ];

        for (let i = 0; i < classicTreesMain.length; i++) {
            const [x, z, scale] = classicTreesMain[i];
            city.add(make_tree(x, 0, z, scale));
        }

        for (let i = 0; i < crownTreesMain.length; i++) {
            const [x, z, scale] = crownTreesMain[i];
            city.add(make_tree_crowns(x, 0, z, scale));
        }

        for (let i = 0; i < classicTreesSide.length; i++) {
            const [x, z, scale] = classicTreesSide[i];
            city.add(make_tree(x, 0, z, scale));
        }

        for (let i = 0; i < crownTreesSide.length; i++) {
            const [x, z, scale] = crownTreesSide[i];
            city.add(make_tree_crowns(x, 0, z, scale));
        }
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
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { make_tree, make_tree_crowns, make_trees_instanced } from './trees.js';
import { make_road, make_road_corner, make_roundabout, road_width } from './road.js';
import { make_path_parts, make_road_paths, path_width } from './sidewalk.js';
import { make_bridge } from './bridge.js';
import make_skybox from './skybox.js';
import { ROAD_DIR, ROAD_CORNER_DIR } from '../utils/road.js';

import Citizen from '../people/citizen.js';
import Car from './car.js';
import DcMonalds from './dcmonalds.js';

import make_house from './house.js';
import Scene from '../utils/scene.js';
import PlaceHolderItem from '../items/placeholder.js';

class City extends Scene {
    constructor(camera) {
        super(camera);

        // Build city
        const cityGroup = new THREE.Object3D();
        const roadBodies = [];

        // Base ground
        const base_ground = new THREE.Mesh(
            new THREE.BoxGeometry(420, 100, 800),
            new THREE.MeshToonMaterial({color: 0xAAAAAA, fog: false}),
        );
        base_ground.position.x = 60;
        base_ground.position.z = -350;
        base_ground.position.y = -50.01;
        cityGroup.add(base_ground);

        // Base ground on the other side of the bridge
        const base_ground_other_side = new THREE.Mesh(
            new THREE.BoxGeometry(600, 100, 900),
            new THREE.MeshToonMaterial({color: 0xAAAAAA})
        );
        base_ground_other_side.position.x = -1300;
        base_ground_other_side.position.z = -300;
        base_ground_other_side.position.y = -50.1;
        cityGroup.add(base_ground_other_side);

        // Base grass
        {
            const base_grass = new THREE.Mesh(
                new THREE.BoxGeometry(1000, 100, 1500),
                new THREE.MeshToonMaterial({color: 0x8f994e, fog: false})
            );
            base_grass.position.x = 400;
            base_grass.position.z = -300;
            base_grass.position.y = -50.2;
            cityGroup.add(base_grass);
        }

        {
            const base_grass = new THREE.Mesh(
                new THREE.BoxGeometry(85, 100, 170),
                new THREE.MeshToonMaterial({color: 0x8f994e, fog: false})
            );
            base_grass.position.x = -106;
            base_grass.position.z = -190;
            base_grass.position.y = -49.9;
            cityGroup.add(base_grass);
        }

        {
            const base_grass = new THREE.Mesh(
                new THREE.BoxGeometry(85, 100, 300),
                new THREE.MeshToonMaterial({color: 0x8f994e, fog: false})
            );
            base_grass.position.x = -106;
            base_grass.position.z = -500;
            base_grass.position.y = -49.9;
            cityGroup.add(base_grass);
        }

        // Hand-placed tree scatter: very dense in the main grass area and lighter in side patches.
        {
            const classicTreesMain = [
                new THREE.Vector3(483, 0, -153), new THREE.Vector3(618, 0, -411), new THREE.Vector3(373, 0, -226),
                new THREE.Vector3(585, 0, -276),
                new THREE.Vector3(498, 0, -710), new THREE.Vector3(285, 0, -675), new THREE.Vector3(538, 0, -508), new THREE.Vector3(523, 0, -676),
                new THREE.Vector3(430, 0, -730), new THREE.Vector3(520, 0, -443), new THREE.Vector3(590, 0, -305),
                new THREE.Vector3(388, 0, -600), new THREE.Vector3(613, 0, -430), new THREE.Vector3(568, 0, -260),
                new THREE.Vector3(360, 0, -495), new THREE.Vector3(448, 0, -536),
                new THREE.Vector3(423, 0, -123), new THREE.Vector3(520, 0, -395), new THREE.Vector3(475, 0, -311),
                new THREE.Vector3(398, 0, -300), new THREE.Vector3(443, 0, -620), new THREE.Vector3(438, 0, -206), new THREE.Vector3(510, 0, -540),
                new THREE.Vector3(393, 0, -210),
                new THREE.Vector3(408, 0, -555), new THREE.Vector3(573, 0, -581), new THREE.Vector3(388, 0, -200),
                new THREE.Vector3(508, 0, -295), new THREE.Vector3(615, 0, -523),
                new THREE.Vector3(388, 0, -438), new THREE.Vector3(463, 0, -223),
                new THREE.Vector3(645, 0, -751), new THREE.Vector3(498, 0, -435),
                new THREE.Vector3(508, 0, -291), new THREE.Vector3(273, 0, -548), new THREE.Vector3(645, 0, -416),
                new THREE.Vector3(415, 0, -613), new THREE.Vector3(418, 0, -205),
                new THREE.Vector3(333, 0, -243), new THREE.Vector3(415, 0, -541), new THREE.Vector3(310, 0, -573),
                new THREE.Vector3(413, 0, -551), new THREE.Vector3(328, 0, -563),
                new THREE.Vector3(498, 0, -301), new THREE.Vector3(433, 0, -170),
                new THREE.Vector3(603, 0, -263), new THREE.Vector3(403, 0, -303), new THREE.Vector3(558, 0, -128),
                new THREE.Vector3(298, 0, -595),
                new THREE.Vector3(390, 0, -520), new THREE.Vector3(398, 0, -571), new THREE.Vector3(560, 0, -498),
            ];

            const crownTreesMain = [
                new THREE.Vector3(328, 0, -611), new THREE.Vector3(338, 0, -451), new THREE.Vector3(558, 0, -483),
                new THREE.Vector3(470, 0, -291), new THREE.Vector3(543, 0, -453), new THREE.Vector3(448, 0, -730), new THREE.Vector3(498, 0, -463),
                new THREE.Vector3(553, 0, -760), new THREE.Vector3(548, 0, -668), new THREE.Vector3(483, 0, -381),
                new THREE.Vector3(318, 0, -748), new THREE.Vector3(303, 0, -710), new THREE.Vector3(600, 0, -235),
                new THREE.Vector3(508, 0, -455), new THREE.Vector3(315, 0, -226),
                new THREE.Vector3(478, 0, -356), new THREE.Vector3(498, 0, -126),
                new THREE.Vector3(348, 0, -146), new THREE.Vector3(640, 0, -198), new THREE.Vector3(530, 0, -303),
                new THREE.Vector3(300, 0, -320), new THREE.Vector3(523, 0, -245), new THREE.Vector3(550, 0, -601),
                new THREE.Vector3(338, 0, -416),
                new THREE.Vector3(638, 0, -471), new THREE.Vector3(360, 0, -123),
                new THREE.Vector3(430, 0, -540), new THREE.Vector3(643, 0, -706),
                new THREE.Vector3(333, 0, -376), new THREE.Vector3(273, 0, -338),
                new THREE.Vector3(630, 0, -261), new THREE.Vector3(338, 0, -216), new THREE.Vector3(580, 0, -753), new THREE.Vector3(345, 0, -661),
                new THREE.Vector3(390, 0, -466), new THREE.Vector3(448, 0, -713), new THREE.Vector3(473, 0, -610),
                new THREE.Vector3(513, 0, -606), new THREE.Vector3(435, 0, -283), new THREE.Vector3(518, 0, -278),
                new THREE.Vector3(308, 0, -445), new THREE.Vector3(353, 0, -476),
                new THREE.Vector3(325, 0, -470),
                new THREE.Vector3(305, 0, -475), new THREE.Vector3(400, 0, -596),
                new THREE.Vector3(498, 0, -121),
                new THREE.Vector3(343, 0, -716),
            ];

            const classicTreesSide = [
                new THREE.Vector3(-138, 0, -248), new THREE.Vector3(-104, 0, -224), new THREE.Vector3(-78, 0, -188), new THREE.Vector3(-126, 0, -152), new THREE.Vector3(-92, 0, -132),
                new THREE.Vector3(-140, 0, -618), new THREE.Vector3(-108, 0, -582), new THREE.Vector3(-76, 0, -540), new THREE.Vector3(-132, 0, -470), new THREE.Vector3(-98, 0, -402),
            ];

            const crownTreesSide = [
                new THREE.Vector3(-122, 0, -262), new THREE.Vector3(-88, 0, -238), new THREE.Vector3(-70, 0, -206), new THREE.Vector3(-136, 0, -178), new THREE.Vector3(-106, 0, -146),
                new THREE.Vector3(-124, 0, -632), new THREE.Vector3(-90, 0, -596), new THREE.Vector3(-72, 0, -560), new THREE.Vector3(-120, 0, -500), new THREE.Vector3(-86, 0, -430),
            ];

            const makeRandomScales = (count, min, max) => Array.from(
                { length: count },
                () => THREE.MathUtils.randFloat(min, max)
            );

            const classicMainPositions = classicTreesMain;
            const crownMainPositions = crownTreesMain;
            const classicSidePositions = classicTreesSide;
            const crownSidePositions = crownTreesSide;

            const classicMainScales = makeRandomScales(classicMainPositions.length, 0.6, 0.8);
            const crownMainScales = makeRandomScales(crownMainPositions.length, 0.5, 0.7);
            const classicSideScales = makeRandomScales(classicSidePositions.length, 0.6, 0.8);
            const crownSideScales = makeRandomScales(crownSidePositions.length, 0.5, 0.7);

            cityGroup.add(make_trees_instanced(classicMainPositions, classicMainScales, make_tree));
            cityGroup.add(make_trees_instanced(crownMainPositions, crownMainScales, make_tree_crowns));
            cityGroup.add(make_trees_instanced(classicSidePositions, classicSideScales, make_tree));
            cityGroup.add(make_trees_instanced(crownSidePositions, crownSideScales, make_tree_crowns));
        }

        let road_start;

        let [road, endpoint, rBody] = make_road_corner(0, 0, ROAD_CORNER_DIR.LEFT_UP, 50);
        cityGroup.add(road);
        roadBodies.push(rBody);

        road_start = endpoint.clone();
        [road, endpoint, rBody] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.UP, 50, 0);
        cityGroup.add(road);
        roadBodies.push(rBody);
        cityGroup.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.UP, 50));

        const [roundabout, endpoint_front, endpoint_left, endpoint_right, raBody] = make_roundabout(endpoint.x, endpoint.z - 50, 50);
        cityGroup.add(roundabout);
        roadBodies.push(raBody);

        // Bridge stuff
        let bridgeBody;
        {
            const [road_to_bridge, endpoint, rbBody1] = make_road(endpoint_left.x, 0, endpoint_right.z, ROAD_DIR.LEFT, 10, 0);
            cityGroup.add(road_to_bridge)
            roadBodies.push(rbBody1);

            const [bridge_ramp, endpoint_ramp, rbBody2] = make_road(endpoint.x, endpoint.y, endpoint.z, ROAD_DIR.LEFT, 16, THREE.MathUtils.degToRad(10), true);
            cityGroup.add(bridge_ramp);
            roadBodies.push(rbBody2);

            const [bridge, bBody] = make_bridge(endpoint_ramp.x, endpoint_ramp.y, endpoint_ramp.z, ROAD_DIR.LEFT);
            cityGroup.add(bridge);
            bridgeBody = bBody;
        }

        road_start = new THREE.Vector3(endpoint_front.x, 0, endpoint_front.z);
        [road, endpoint, rBody] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.UP, 50, 0);
        cityGroup.add(road);
        roadBodies.push(rBody);
        cityGroup.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.UP, 50));

        [road, endpoint, rBody] = make_road_corner(endpoint.x, endpoint.z, ROAD_CORNER_DIR.DOWN_RIGHT);
        cityGroup.add(road);
        roadBodies.push(rBody);

        road_start = endpoint.clone();
        [road, endpoint, rBody] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.RIGHT, 30, 0);
        cityGroup.add(road);
        roadBodies.push(rBody);
        cityGroup.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.RIGHT, 30));

        [road, endpoint, rBody] = make_road_corner(endpoint.x, endpoint.z, ROAD_CORNER_DIR.LEFT_DOWN);
        cityGroup.add(road);
        roadBodies.push(rBody);

        road_start = endpoint.clone();
        [road, endpoint, rBody] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.DOWN, 58, 0);
        cityGroup.add(road);
        roadBodies.push(rBody);
        cityGroup.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.DOWN, 58));

        
        road_start = new THREE.Vector3(endpoint.x - road_width / 2, 0, endpoint.z + (road_width / 2));
        [road, , rBody] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.LEFT, 22, 0);
        cityGroup.add(road);
        roadBodies.push(rBody);
        cityGroup.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.LEFT, 22));
        
        road_start = new THREE.Vector3(endpoint.x, 0, endpoint.z);
        [road, endpoint, rBody] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.DOWN, 4, 0);
        cityGroup.add(road);
        roadBodies.push(rBody);
        let [single_path] = make_path_parts(0, 0, 4, 'right');
        single_path.position.set(-road_start.x - road_width/2 - path_width/2, 0, -road_start.z);
        single_path.rotateY(ROAD_DIR.DOWN);
        single_path.position.set(road_start.x + road_width/2 + path_width/2, 0, road_start.z);
        cityGroup.add(single_path);

        road_start = new THREE.Vector3(endpoint.x, 0, endpoint.z);
        [road, , rBody] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.DOWN, 50, 0);
        cityGroup.add(road);
        roadBodies.push(rBody);
        cityGroup.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.DOWN, 50));

        // Houses
        {
            const house = make_house(-30, 0, -400);
            house.rotation.y = Math.PI;
            cityGroup.add(house);
        }

        {
            const house = make_house(-30, 0, -480);
            house.rotation.y = Math.PI;
            cityGroup.add(house);
        }

        {
            const house = make_house(-30, 0, -560);
            house.rotation.y = Math.PI;
            cityGroup.add(house);
        }


        {
            const house = make_house(95, 0, -660);
            house.rotation.y = Math.PI/2;
            cityGroup.add(house);
        }

        
        {
            const house = make_house(230, 0, -400);
            house.rotation.y = 0;
            cityGroup.add(house);
        }

        {
            const house = make_house(230, 0, -480);
            house.rotation.y = 0;
            cityGroup.add(house);
        }

        {
            const house = make_house(230, 0, -560);
            house.rotation.y = 0;
            cityGroup.add(house);
        }


        {
            const house = make_house(230, 0, -220);
            house.rotation.y = 0;
            cityGroup.add(house);
        }

        {
            const house = make_house(230, 0, -120);
            house.rotation.y = 0;
            cityGroup.add(house);
        }

        {
            const house = make_house(-30, 0, -200);
            house.rotation.y = Math.PI;
            cityGroup.add(house);
        }

        // Add final city group to scene
        this.addModel(cityGroup);

        // Ensure every city mesh participates in shadow rendering.
        cityGroup.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        // Cars
        const cars = [
            new Car(new THREE.Vector3(-63, 0.6, -313), new THREE.Vector3(0, Math.PI, 0))
        ];

        cars.forEach((car, index) => this.add(car, `car_${index}`));

        const restaurant = new DcMonalds(new THREE.Vector3(-10, -0.5, -12), new THREE.Vector3(0, 0, 0));

        this.add(restaurant, "restaurant");

        // Citizens
        const citizen1 = new Citizen(
            new THREE.Vector3(-2, 0.4, -170),
            new THREE.Vector3(0, Math.PI/2, 0),
            true
        );
        this.add(citizen1, "citizen1");

        const citizen2 = new Citizen(
            new THREE.Vector3(23, 0.4, -233),
            new THREE.Vector3(0, Math.PI*0.3, 0)
        );
        this.add(citizen2, "citizen2");

        const citizen3 = new Citizen(
            new THREE.Vector3(17, 0.4, -228),
            new THREE.Vector3(0, Math.PI*1.3, 0)
        );
        this.add(citizen3, "citizen3");

        const citizen4 = new Citizen(
            new THREE.Vector3(-85, 0.4, -309),
            new THREE.Vector3(0, Math.PI / 2, 0),
            true
        );
        this.add(citizen4, "citizen4");

        this.addModel(make_skybox());
        this.scene.fog = new THREE.Fog(0xAAAAAA, 300, 600);

        // Placeholder objects
        const item1 = new PlaceHolderItem(
            new THREE.Vector3(8, 0, -305),
            new THREE.Vector3(0, Math.PI/2, Math.PI/3),
            new THREE.Vector3(1, 1, 1)
        );
        this.add(item1, "placeholderitem_1");

        const item2 = new PlaceHolderItem(
            new THREE.Vector3(3, 2, -312),
            new THREE.Vector3(Math.PI/2, 0, Math.PI/3),
            new THREE.Vector3(1, 1, 1)
        );
        this.add(item2, "placeholderitem_2");

        const item3 = new PlaceHolderItem(
            new THREE.Vector3(10, 2, -309),
            new THREE.Vector3(0, Math.PI/3, Math.PI/2),
            new THREE.Vector3(1, 1, 1)
        );
        this.add(item3, "placeholderitem_3");

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        ambientLight.name = "ambientLight";
        this.addModel(ambientLight);
    
        const hemisphereLight = new THREE.HemisphereLight(0xd8ecff, 0x9bb07a, 0.55);
        hemisphereLight.name = "hemisphereLight";
        this.addModel(hemisphereLight);

        // Position of the sun (keylight)
        this.sunpos = new THREE.Vector3(150, 300, 150);
    
        const keyLight = new THREE.DirectionalLight(0xfff3dc, 2.2);
        keyLight.position.copy(this.sunpos);
        keyLight.lookAt(this.scene.position)
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(4096, 4096);
    
        keyLight.shadow.camera.near = 10;
        keyLight.shadow.camera.far = 1200;
        keyLight.shadow.camera.left = -500;
        keyLight.shadow.camera.right = 500;
        keyLight.shadow.camera.top = 500;
        keyLight.shadow.camera.bottom = -500;
    
        // Adjust biases
        keyLight.shadow.bias = -0.001;
        keyLight.shadow.normalBias = 0.07;
    
        keyLight.name = "keyLight";
        this.addModel(keyLight);
    
        const fillLight = new THREE.DirectionalLight(0xbfd9ff, 0.55);
        fillLight.position.set(-180, 120, -220);
        fillLight.name = "fillLight";
        this.addModel(fillLight);
    
        const rimLight = new THREE.DirectionalLight(0xffe8c9, 0.35);
        rimLight.position.set(80, 80, 350);
        rimLight.name = "rimLight";
        this.addModel(rimLight);

        // Physics world
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

        if (bridgeBody) {
            this.physicsWorld.addBody(bridgeBody);
        }

        roadBodies.forEach(body => {
            if (body) this.physicsWorld.addBody(body);
        });

        // GUI
        //this.gui.hide();
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

export default City;
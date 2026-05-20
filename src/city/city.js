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

import Scene from '../utils/scene.js';
import PlaceHolderItem from '../items/placeholder.js';
import House from './house.js';
import Path from '../object/path.js';
import CityHall from './city_hall.js';
import BuilderCitizen from '../people/builder_citizen.js';
import StrawHat from '../items/straw_hat.js';
import Parasol from '../items/parasol.js';
import BossCitizen from '../people/boss_citizen.js';
import Sunglasses from '../items/sunglasses.js';
import DcMonaldsPole from './dcmonalds_pole.js';
import DcMonaldsGroundThing from './dcmonalds_ground_thing.js';

class City extends Scene {
    constructor(camera, onExit = null) {
        super(camera, null, onExit);

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

        // River (NOT good)
        const river = new THREE.Mesh(
            new THREE.BoxGeometry(1000, 40, 1800),
            new THREE.MeshToonMaterial({color: 0x2ea7d3, fog: false, transparent: true, opacity: 0.6}),
        );
        river.name = "river";
        river.position.x = -615;
        river.position.y = -60;
        river.position.z = -350;
        cityGroup.add(river);

        const bedrock = new THREE.Mesh(
            new THREE.BoxGeometry(1000, 10, 1800),
            new THREE.MeshToonMaterial({color: 0x2ea7d3, fog: false}),
        );
        bedrock.position.x = -615;
        bedrock.position.y = -80;
        bedrock.position.z = -350;
        cityGroup.add(bedrock);

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

        // THIS IS PROBABLY BAD
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
        
        // THIS SHOULD WORK FINE
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
        const houses = [
            new House(new THREE.Vector3(-30, 0, -400), new THREE.Vector3(0, Math.PI, 0)),
            new House(new THREE.Vector3(-30, 0, -480), new THREE.Vector3(0, Math.PI, 0)),
            new House(new THREE.Vector3(-30, 0, -560), new THREE.Vector3(0, Math.PI, 0)),
            new House(new THREE.Vector3(95, 0, -660), new THREE.Vector3(0, Math.PI/2, 0)),
            new House(new THREE.Vector3(230, 0, -400), new THREE.Vector3(0, 0, 0)),
            new House(new THREE.Vector3(230, 0, -480), new THREE.Vector3(0, 0, 0)),
            new House(new THREE.Vector3(230, 0, -560), new THREE.Vector3(0, 0, 0)),
            new House(new THREE.Vector3(230, 0, -220), new THREE.Vector3(0, 0, 0)),
            new House(new THREE.Vector3(230, 0, -120), new THREE.Vector3(0, 0, 0)),
            new House(new THREE.Vector3(-30, 0, -200), new THREE.Vector3(0, Math.PI, 0)),
        ];

        houses.forEach((house, idx) => {
            this.add(house, `house${idx}`);
        });

        // Add final city group to scene
        this.addModel(cityGroup);

        // Ensure every city mesh participates in shadow rendering.
        cityGroup.traverse((node) => {
            if (node.isMesh && node.name != "river") {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        // Cars
        const player_car = new Car(new THREE.Vector3(-63, 0.6, -313), new THREE.Vector3(0, Math.PI, 0));
        this.add(player_car, "player_car");

        const static_cars = [
        ];

        static_cars.forEach((car, index) => this.add(car, `car_${index}`));

        {
            const moving_car = new Car(new THREE.Vector3(15, 0.6, -367), new THREE.Vector3(0, Math.PI/2, 0));
            const path = new Path();
            path.addPoint(new THREE.Vector3(15, 0.6, -367), new THREE.Vector3(0, Math.PI/2, 0), 10)
                .addPoint(new THREE.Vector3(15, 0.6, -607), new THREE.Vector3(0, Math.PI/2, 0))
                .addPoint(new THREE.Vector3(15, 0.6, -612), new THREE.Vector3(0, Math.PI/4, 0), 10)
                .addPoint(new THREE.Vector3(20, 0.6, -612), new THREE.Vector3(0, 0, 0), 10)
                .addPoint(new THREE.Vector3(169, 0.6, -612), new THREE.Vector3(0, 0, 0))
                .addPoint(new THREE.Vector3(174, 0.6, -612), new THREE.Vector3(0, -Math.PI/4, 0), 10)
                .addPoint(new THREE.Vector3(174, 0.6, -607), new THREE.Vector3(0, -Math.PI/2, 0), 10)
                .addPoint(new THREE.Vector3(174, 0.6, -318), new THREE.Vector3(0, -Math.PI/2, 0))
                .addPoint(new THREE.Vector3(174, 0.6, -313), new THREE.Vector3(0, -Math.PI/2 -Math.PI/4, 0), 10)
                .addPoint(new THREE.Vector3(168, 0.6, -313), new THREE.Vector3(0, -Math.PI, 0), 10)
                .addPoint(new THREE.Vector3(57, 0.6, -313), new THREE.Vector3(0, -Math.PI, 0))
                .addPoint(new THREE.Vector3(48, 0.6, -331), new THREE.Vector3(0, -3*Math.PI/2 + Math.PI/6, 0), 10)
                .addPoint(new THREE.Vector3(34, 0.6, -346), new THREE.Vector3(0, -3*Math.PI/2 + 2*Math.PI/6, 0), 10)
                .addPoint(new THREE.Vector3(14, 0.6, -355), new THREE.Vector3(0, -3*Math.PI/2 + Math.PI/2, 0), 10)
                .addPoint(new THREE.Vector3(14, 0.6, -355), new THREE.Vector3(0, -3*Math.PI/2, 0), 10)
                .addPoint(new THREE.Vector3(14, 0.6, -355), new THREE.Vector3(0, Math.PI/2, 0), 1000);

            moving_car.setPath(path);
            moving_car.followPath();
            moving_car.runAnimation();

            this.add(moving_car, "moving_car_1");
        }

        const restaurant = new DcMonalds(new THREE.Vector3(-2, -0.5, -90), new THREE.Vector3(0, 0, 0));
        this.add(restaurant, "restaurant");

        const restaurant_pole = new DcMonaldsPole(new THREE.Vector3(-23, 1, -127), new THREE.Vector3(0, Math.PI/2, 0));
        this.add(restaurant_pole, "restaurant_pole");

        const restaurant_ground_thing = new DcMonaldsGroundThing(new THREE.Vector3(-50, 1, -68), new THREE.Vector3(0, 0, 0));
        this.add(restaurant_ground_thing, "restaurant_ground_thing");

        const city_hall = new CityHall(new THREE.Vector3(100, -0.5, -160), new THREE.Vector3(0, Math.PI/2, 0));
        this.add(city_hall, "city_hall");
        city_hall.setupCollisions();
        city_hall.collisionBodies.forEach(body => this.physicsWorld.addBody(body));
        this._cityHall = city_hall;
        this._cityHallEntered = false;
        this._cityHallExited = false;

        // Citizens
        const boss_guy = new BossCitizen(
            new THREE.Vector3(-2, 0.4, -170),
            new THREE.Vector3(0, Math.PI/2, 0),
            true
        );
        boss_guy.setPath(new Path()
            .addPoint(new THREE.Vector3(-2, 0.4, -170), new THREE.Vector3(0, Math.PI/2, 0))
            .addPoint(new THREE.Vector3(-2, 0.4, -170), new THREE.Vector3(0, Math.PI, 0), 100)
            
            .addPoint(new THREE.Vector3(-2, 0.4, -257), new THREE.Vector3(0, Math.PI, 0), 5)
            .addPoint(new THREE.Vector3(-2, 0.4, -257), new THREE.Vector3(0, Math.PI + 1.2, 0), 100)

            .addPoint(new THREE.Vector3(-12.7, 0.4, -260.5), new THREE.Vector3(0, Math.PI + 1.2, 0), 20)
            .addPoint(new THREE.Vector3(-12.7, 0.4, -260.5), new THREE.Vector3(0, Math.PI + 0.88, 0), 100)

            .addPoint(new THREE.Vector3(-25.1, 0.4, -269), new THREE.Vector3(0, Math.PI + 0.88, 0), 20)
            .addPoint(new THREE.Vector3(-25.1, 0.4, -269), new THREE.Vector3(0, Math.PI + 0.68, 0), 100)

            .addPoint(new THREE.Vector3(-35.2, 0.4, -281), new THREE.Vector3(0, Math.PI + 0.68, 0), 20)
            .addPoint(new THREE.Vector3(-35.2, 0.4, -281), new THREE.Vector3(0, Math.PI + 0.39, 0), 100)

            .addPoint(new THREE.Vector3(-41.6, 0.4, -296.1), new THREE.Vector3(0, Math.PI + 0.39, 0), 20)
            .addPoint(new THREE.Vector3(-41.6, 0.4, -296.1), new THREE.Vector3(0, Math.PI + 1.35, 0), 100)

            .addPoint(new THREE.Vector3(-83.2, 0.4, -305.5), new THREE.Vector3(0, Math.PI + 1.35, 0), 12)
            .addPoint(new THREE.Vector3(-83.2, 0.4, -305.5), new THREE.Vector3(0, Math.PI - 1.09, 0), 50)
        );
        boss_guy.loadDialogue("boss_restaurant", () => {
            boss_guy.playAnimation("fast_run", true, true);
            boss_guy.interactable = false;
            boss_guy.followPath(false, () => {
                boss_guy.playAnimation("idle", true, true);

                boss_guy.loadDialogue("boss_end", () => {
                    boss_guy.interactable = false;
                    boss_guy.removeGlasses();
                    this._sunglasses.show();

                    player_car.interactable = true;
                    player_car.onInteract = () => {
                        this.exit();
                    };
                });

                boss_guy.interactable = true;
            });

        });
        this.add(boss_guy, "boss_guy");

        const bridge_guy = new BuilderCitizen(
            new THREE.Vector3(-85, 0.4, -309),
            new THREE.Vector3(0, Math.PI / 2, 0),
            true
        );

        const crosshair = document.getElementById('crossair');
        bridge_guy.loadDialogue("bridge_start", () => {
            this.player.canMove = true;
            crosshair.classList.remove('invisible');
        });
        this.add(bridge_guy, "bridge_guy");

        this.addModel(make_skybox());
        this.scene.fog = new THREE.Fog(0xAAAAAA, 300, 600);
        
        // Not important citizens
        {
            const citizen2 = new Citizen(
                new THREE.Vector3(23, 0.4, -220),
                new THREE.Vector3(0, 0, 0),
                true
            );
            citizen2.showParts(["Citizen", "Hair", "Shirt", "Pants", "Shoes"]);
            citizen2.applyMaterialColors({
                "Hair": 0x28241f,
                "Pants": 0xdb7b32,
                "Shoes": 0x6b4b1c,
            })
            this.add(citizen2, "citizen2");
            
            const citizen3 = new Citizen(
                new THREE.Vector3(23, 0.4, -216),
                new THREE.Vector3(0, Math.PI, 0),
                true
            );
            citizen3.showParts(["Citizen", "Hair", "Shirt", "Pants", "Shoes"]);
            citizen3.applyMaterialColors({
                "Hair": 0x5b3902,
                "Shirt": 0x6dc3db,
                "Pants": 0x1c49ed,
                "Shoes": 0x6b4b1c,
            })
            this.add(citizen3, "citizen3");

            citizen2.loadDialogue("random_conversation", () => {
                citizen2.interactable = false;

                citizen3.dialogue = null;
                citizen3.interactable = false;
            })
            citizen3.loadDialogue("random_conversation", () => {
                citizen3.interactable = false;
                
                citizen2.dialogue = null;
                citizen2.interactable = false;
            })

            
            const citizen4 = new Citizen(
                new THREE.Vector3(23, 0.4, -393),
                new THREE.Vector3(0, Math.PI, 0)
            );
            citizen4.playAnimation("walk", true, true);
            citizen4.setPath(new Path()
                .addPoint(new THREE.Vector3(23, 0.4, -393), new THREE.Vector3(0, Math.PI, 0), 10)
                .addPoint(new THREE.Vector3(23, 0.4, -594.4), new THREE.Vector3(0, Math.PI, 0), 0.15)
                .addPoint(new THREE.Vector3(24, 0.4, -603.8), new THREE.Vector3(0, 3*Math.PI/4, 0))
                .addPoint(new THREE.Vector3(31, 0.4, -605), new THREE.Vector3(0, Math.PI/2, 0))
                .addPoint(new THREE.Vector3(159, 0.4, -605), new THREE.Vector3(0, Math.PI/2, 0), 0.15)

                .addPoint(new THREE.Vector3(159, 0.4, -605), new THREE.Vector3(0, 3*Math.PI/2, 0), 10)

                .addPoint(new THREE.Vector3(31, 0.4, -605), new THREE.Vector3(0, 3*Math.PI/2, 0), 0.15)
                .addPoint(new THREE.Vector3(24, 0.4, -603.8), new THREE.Vector3(0, 7*Math.PI/4, 0))
                .addPoint(new THREE.Vector3(23, 0.4, -594.4), new THREE.Vector3(0, 8*Math.PI/4, 0))
                .addPoint(new THREE.Vector3(23, 0.4, -393), new THREE.Vector3(0, 8*Math.PI/4, 0), 0.15)
            );
            citizen4.followPath(true);
            citizen4.showParts(["Citizen", "Hair", "Shirt", "Pants", "Shoes"]);
            citizen4.applyMaterialColors({
                "Hair": 0x3d2817,
                "Shirt": 0xe8714d,
                "Pants": 0x2d4a3f,
                "Shoes": 0x6b4b1c,
            })
            this.add(citizen4, "citizen4");

            const citizen5 = new Citizen(
                new THREE.Vector3(192, 0.4, -120),
                new THREE.Vector3(0, Math.PI, 0)
            );
            citizen5.playAnimation("walk", true, true);
            citizen5.setPath(new Path()
                .addPoint(new THREE.Vector3(192, 0.4, -120), new THREE.Vector3(0, Math.PI, 0), 10)
                .addPoint(new THREE.Vector3(192, 0.4, -608), new THREE.Vector3(0, Math.PI, 0), 0.05)
                .addPoint(new THREE.Vector3(192, 0.4, -608), new THREE.Vector3(0, Math.PI + 0.213, 0), 100)
                .addPoint(new THREE.Vector3(190.4, 0.4, -618.4), new THREE.Vector3(0, Math.PI + 0.213, 0), 1)
                .addPoint(new THREE.Vector3(190.4, 0.4, -618.4), new THREE.Vector3(0, Math.PI + 0.727, 0), 100)
                .addPoint(new THREE.Vector3(179.4, 0.4, -630.7), new THREE.Vector3(0, Math.PI + 0.727, 0), 1)
                .addPoint(new THREE.Vector3(179.4, 0.4, -630.7), new THREE.Vector3(0, 3*Math.PI/2, 0), 100)
                .addPoint(new THREE.Vector3(19, 0.4, -630.7), new THREE.Vector3(0, 3*Math.PI/2, 0), 0.2)

                .addPoint(new THREE.Vector3(19, 0.4, -630.7), new THREE.Vector3(0, Math.PI/2, 0), 10)

                .addPoint(new THREE.Vector3(179.4, 0.4, -630.7), new THREE.Vector3(0, Math.PI/2, 0), 0.2)
                .addPoint(new THREE.Vector3(179.4, 0.4, -630.7), new THREE.Vector3(0, 0.727, 0), 100)
                .addPoint(new THREE.Vector3(190.4, 0.4, -618.4), new THREE.Vector3(0, 0.727, 0), 1)
                .addPoint(new THREE.Vector3(190.4, 0.4, -618.4), new THREE.Vector3(0, 0.213, 0), 100)
                .addPoint(new THREE.Vector3(192, 0.4, -608), new THREE.Vector3(0, 0.213, 0), 1)
                .addPoint(new THREE.Vector3(192, 0.4, -120), new THREE.Vector3(0, 0, 0), 0.05)
            );
            citizen5.followPath(true);
            citizen5.showParts(["Citizen", "Hair", "Shirt", "Pants", "Shoes"]);
            citizen5.applyMaterialColors({
                "Hair": 0x4a2511,
                "Shirt": 0x7cb342,
                "Pants": 0xd4a574,
                "Shoes": 0x5c4033,
            })
            this.add(citizen5, "citizen5");

            const citizen6 = new Citizen(
                new THREE.Vector3(26, 0.4, -600),
                new THREE.Vector3(0, 0, 0)
            );
            citizen6.playAnimation("walk", true, true)
            citizen6.showParts(["Citizen", "Hair", "Shirt", "Pants", "Shoes"]);
            citizen6.applyMaterialColors({
                "Hair": 0x2c1810,
                "Shirt": 0xd32f2f,
                "Pants": 0x3e2723,
                "Shoes": 0x6b4b1c,
            })
            this.add(citizen6, "citizen6");
            
            const citizen7 = new Citizen(
                new THREE.Vector3(65, 0.4, -294),
                new THREE.Vector3(0, Math.PI/2, 0)
            );
            citizen7.playAnimation("walk", true, true)

            const c7_path1 = new Path()
                .addPoint(new THREE.Vector3(65, 0.4, -294), new THREE.Vector3(0, Math.PI/2, 0))
                .addPoint(new THREE.Vector3(165.5, 0.4, -294), new THREE.Vector3(0, Math.PI/2, 0), 0.3)
                .addPoint(new THREE.Vector3(165.5, 0.4, -294), new THREE.Vector3(0, 0, 0), 10)
                .addPoint(new THREE.Vector3(165.5, 0.4, -144), new THREE.Vector3(0, 0, 0), 0.15)
                .addPoint(new THREE.Vector3(165.5, 0.4, -144), new THREE.Vector3(0, -Math.PI/2, 0), 10)

            const c7_path2 = new Path()
                .addPoint(new THREE.Vector3(165.5, 0.4, -144), new THREE.Vector3(0, -Math.PI/2, 0))
                .addPoint(new THREE.Vector3(165.5, 0.4, -144), new THREE.Vector3(0, -Math.PI, 0), 10)
                .addPoint(new THREE.Vector3(165.5, 0.4, -294), new THREE.Vector3(0, -Math.PI, 0), 0.15)
                .addPoint(new THREE.Vector3(165.5, 0.4, -294), new THREE.Vector3(0, -Math.PI/2, 0), 10)
                .addPoint(new THREE.Vector3(65, 0.4, -294), new THREE.Vector3(0, -Math.PI/2, 0), 0.3)
                .addPoint(new THREE.Vector3(65, 0.4, -294), new THREE.Vector3(0, Math.PI/2, 0), 10)

            let c7_path1_onend;
            let c7_path2_onend;
            c7_path1_onend = () => {
                citizen7.playAnimation("idle", true, true);
                setTimeout(() => {
                    citizen7.playAnimation("walk", true, true);
                    citizen7.setPath(c7_path2);
                    citizen7.followPath(false, c7_path2_onend);
                }, 5000);
            };
            c7_path2_onend = () => {
                citizen7.playAnimation("idle", true, true);
                setTimeout(() => {
                    citizen7.playAnimation("walk", true, true);
                    citizen7.setPath(c7_path1);
                    citizen7.followPath(false, c7_path1_onend);
                }, 2500);
            };
            
            citizen7.setPath(c7_path1);
            citizen7.followPath(false, c7_path1_onend);
            citizen7.showParts(["Citizen", "Hair", "Shirt", "Pants", "Shoes"]);
            citizen7.applyMaterialColors({
                "Hair": 0x1a0f2e,
                "Shirt": 0x7c4dff,
                "Pants": 0x5e5e5e,
                "Shoes": 0x2a2a2a,
            })
            this.add(citizen7, "citizen7");
            
        }
        
        // Objects
        this._sunglasses = new Sunglasses(
            new THREE.Vector3(-68.1, 3.5, -312.2),
            new THREE.Vector3(0, Math.PI/2, Math.PI/3),
            new THREE.Vector3(1, 1, 1)
        );
        this._sunglasses.hide();
        this.add(this._sunglasses, "sunglasses_item");
        
        this._parasol = new Parasol(
            new THREE.Vector3(136, 2.1, -160),
            new THREE.Vector3(Math.PI/2 + 0.1, 0, 0),
            new THREE.Vector3(1, 1, 1)
        );
        this.add(this._parasol, "parasol_item");
        this._parasol.hide();

        const straw_hat = new StrawHat(
            new THREE.Vector3(10, 2, -309),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 1, 1)
        );
        this.add(straw_hat, "straw_hat_item");

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        ambientLight.name = "ambientLight";
        this.addModel(ambientLight);

        // Position of the sun (keylight)
        this.sunpos = new THREE.Vector3(150, 300, 150);
    
        const keyLight = new THREE.DirectionalLight(0xfff3dc, 2.2);
        keyLight.position.copy(this.sunpos);
        keyLight.lookAt(this.scene.position)
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(2048, 2048);
    
        keyLight.shadow.camera.near = 10;
        keyLight.shadow.camera.far = 1200;
        keyLight.shadow.camera.left = -200;
        keyLight.shadow.camera.right = 200;
        keyLight.shadow.camera.top = 200;
        keyLight.shadow.camera.bottom = -200;
    
        // Adjust biases
        keyLight.shadow.bias = -0.001;
        keyLight.shadow.normalBias = 0.05;
    
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

        // Debug UI
        this.debug_ui.makeFolder('Camera Position');
        this.debug_ui.add('Camera Position', 'X', camera.position, 'x').listen();
        this.debug_ui.add('Camera Position', 'Y', camera.position, 'y').listen();
        this.debug_ui.add('Camera Position', 'Z', camera.position, 'z').listen();

        this.debug_ui.makeFolder('Camera Rotation');
        this.debug_ui.add('Camera Rotation', 'X', camera.rotation, 'x').listen();
        this.debug_ui.add('Camera Rotation', 'Y', camera.rotation, 'y').listen();
        this.debug_ui.add('Camera Rotation', 'Z', camera.rotation, 'z').listen();

        this.debug_ui.makeFolder('Lighting');
        
        this.debug_ui.add('Lighting', 'key intensity', keyLight, 'intensity', 0, 5, 0.01);
        this.debug_ui.add('Lighting', 'fill intensity', fillLight, 'intensity', 0, 2, 0.01);
        this.debug_ui.add('Lighting', 'rim intensity', rimLight, 'intensity', 0, 2, 0.01);
    }

    update(delta) {
        super.update(delta);

        const keyLight = this.getObject("keyLight");
        keyLight.position.copy(new THREE.Vector3().addVectors(this.player.position, this.sunpos));

        keyLight.target.position.copy(this.player.position);
        keyLight.target.updateMatrixWorld();

        if (!this._cityHallEntered && this.player) {
            const px = this.player.position.x;
            const pz = this.player.position.z;
            if (px >= 63.6 && px <= 126.6 && pz >= -218.6 && pz <= -101.2) {
                this._cityHallEntered = true;
                this._onEnterCityHall();
            }
        }

        if (this._cityHallEntered && !this._cityHallExited && this.player) {
            const px = this.player.position.x;
            const pz = this.player.position.z;
            if (px >= 134.4 && pz >= -218.6 && pz <= -101.2) {
                this._cityHallExited = true;
                this._onExitCityHall();
            }
        }
    }

    _onEnterCityHall() {
        this.player.canMove = false;
        this.player.physicsBody.position.set(110, this.player.physicsBody.position.y, -161);
        this.player.physicsBody.velocity.set(0, 0, 0);
        this.player.physicsBody.angularVelocity.set(0, 0, 0);

        this._cityHall.closeDoors();

        setTimeout(() => {
            this.player.cameraControls.pitch = -0.148;
            this.player.cameraControls.yaw = Math.PI / 2;
            this._cityHall.hideDarkness();
            this._parasol.show();
            this.player.canMove = true;
            this._cityHall.openDoors();
        }, 5000);
    }

    _onExitCityHall() {
        this._cityHall.interactable = false;
        this._cityHall.closeDoors();
    }
}

export default City;
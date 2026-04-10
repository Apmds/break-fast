import * as THREE from 'three';
import { make_tree, make_tree_crowns } from './trees.js';
import { make_road, make_road_corner, make_roundabout, road_width } from './road.js';
import { make_path_parts, make_road_paths, path_width } from './sidewalk.js';
import { make_bridge } from './bridge.js';
import { ROAD_DIR, ROAD_CORNER_DIR } from '../utils/road.js';
import objectManager from '../utils/object_manager.js';

async function make_house(x, y, z) {
    const houseMaterials = {
        "Ceiling": new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.5 }),
        "Walls": new THREE.MeshStandardMaterial({ color: 0xebcbb0, roughness: 0.7 }),
        "Garage Door": new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8, metalness: 0.3 }),
        "Window": new THREE.MeshStandardMaterial({ color: 0x87ceeb, roughness: 0.1, metalness: 0.5 }),
        "Door": new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.6 }),
        "Window Ceiling": new THREE.MeshStandardMaterial({ color: 0x87ceeb, roughness: 0.1, metalness: 0.5 }),
        "Cover": new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.8 }),
        "Cover Pillars": new THREE.MeshStandardMaterial({ color: 0xdaa520, roughness: 0.6 })
    };


    const house = await objectManager.loadObject('./assets/models/house.glb', houseMaterials);
    house.position.set(x, y, z);
    
    // Enable shadows for the house and all its children
    house.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    
    return house;
}

function make_city() {
    const city = new THREE.Object3D();

    // Base ground
    const base_ground = new THREE.Mesh(
        new THREE.BoxGeometry(600, 100, 900),
        new THREE.MeshToonMaterial({color: 0xAAAAAA})
    );
    base_ground.position.x = 100;
    base_ground.position.z = -300;
    base_ground.position.y = -50.01;
    city.add(base_ground);

    const base_grass = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 100, 1500),
        new THREE.MeshToonMaterial({color: 0x8f994e})
    );
    base_grass.position.x = 400;
    base_grass.position.z = -300;
    base_grass.position.y = -50.2;
    city.add(base_grass);

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

    // Add multiple houses
    (async () => {
        city.add(await make_house(50, 0, 150));
        city.add(await make_house(100, 0, 100));
        city.add(await make_house(150, 0, 200));
    })();

    // Ensure every city mesh participates in shadow rendering.
    city.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });

    return city
}

export default make_city;
export { make_house };
import * as THREE from 'three';
import { make_tree } from './trees.js';
import { make_road, make_road_corner, make_roundabout, road_width } from './road.js';
import { make_path_parts, make_road_paths, path_width } from './sidewalk.js';



const ROAD_CORNER_DIR = {
    DOWN_LEFT: {"angle": 0, "offset": new THREE.Vector2(0, 0)},
    LEFT_DOWN: {"angle": 0, "offset": new THREE.Vector2(0.5, 0.5)},
    
    UP_RIGHT: {"angle": Math.PI, "offset": new THREE.Vector2(0, 0)},
    RIGHT_UP: {"angle": Math.PI, "offset": new THREE.Vector2(0.5, 0.5)},
    
    DOWN_RIGHT: {"angle": Math.PI/2, "offset": new THREE.Vector2(0.5, 0.5)},
    RIGHT_DOWN: {"angle": Math.PI/2, "offset": new THREE.Vector2(0, 0)},
    
    UP_LEFT: {"angle": -Math.PI/2, "offset": new THREE.Vector2(0.5, 0.5)},
    LEFT_UP: {"angle": -Math.PI/2, "offset": new THREE.Vector2(0, 0)},
};

const ROAD_DIR = {
    UP: 0,
    DOWN: Math.PI,
    LEFT: Math.PI/2,
    RIGHT: -Math.PI/2,
};

function make_city() {
    const city = new THREE.Object3D();
    let road_start;

    let [road, endpoint] = make_road_corner(0, 0, ROAD_CORNER_DIR.LEFT_UP, 50);
    city.add(road);

    road_start = endpoint.clone();
    [road, endpoint] = make_road(road_start.x, 0, road_start.z, ROAD_DIR.UP, 50, 0);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.UP, 50));

    const [roundabout, endpoint_front, endpoint_left, endpoint_right] = make_roundabout(endpoint.x, endpoint.z - 50, 50);
    city.add(roundabout);

    {
        const [road_to_bridge, endpoint] = make_road(endpoint_left.x, 0, endpoint_right.z, ROAD_DIR.LEFT, 10, 0);
        city.add(road_to_bridge)

        const [bridge_ramp] = make_road(endpoint.x, endpoint.y, endpoint.z, ROAD_DIR.LEFT, 16, THREE.MathUtils.degToRad(10));
        city.add(bridge_ramp);
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
    

    return city
}

export default make_city;
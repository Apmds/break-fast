import * as THREE from 'three';

import { make_road } from './road.js';
import { ROAD_DIR } from '../utils/road.js';

export function make_bridge(x, y, z, direction) {
    const bridge = new THREE.Object3D();
    
    const [road] = make_road(0, 0, 0, ROAD_DIR.UP, 70, 0);

    bridge.add(road);
    
    bridge.position.set(x, y, z);
    bridge.rotateY(direction);
    return bridge;
}
import * as THREE from 'three';

import { make_road, part_length, between_parts_length } from './road.js';
import { ROAD_DIR } from '../utils/road.js';

export function make_bridge(x, y, z, direction) {
    const bridge = new THREE.Object3D();
    const bridge_parts = 180;
    const bridge_length = (bridge_parts * part_length) + ((bridge_parts - 1) * between_parts_length) + between_parts_length;
    
    const [road] = make_road(0, 0, 0, ROAD_DIR.UP, bridge_parts, 0, true);

    bridge.add(road);

    const pillarHeight = 90;
    const pillarGeo = new THREE.CylinderGeometry(7, 9, pillarHeight, 14);
    const pillarMat = new THREE.MeshToonMaterial({ color: 0xbdbdbd });

    const pillarFront = new THREE.Mesh(pillarGeo, pillarMat);
    pillarFront.position.set(0, -pillarHeight / 2 -0.01, -bridge_length * 0.33);
    bridge.add(pillarFront);

    const pillarBack = new THREE.Mesh(pillarGeo, pillarMat);
    pillarBack.position.set(0, -pillarHeight / 2 -0.01, -bridge_length * 0.66);
    bridge.add(pillarBack);
    
    bridge.position.set(x, y, z);
    bridge.rotateY(direction);
    return bridge;
}
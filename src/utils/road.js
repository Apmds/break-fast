import * as THREE from 'three';

export const ROAD_CORNER_DIR = {
    DOWN_LEFT: {"angle": 0, "offset": new THREE.Vector2(0, 0)},
    LEFT_DOWN: {"angle": 0, "offset": new THREE.Vector2(0.5, 0.5)},
    
    UP_RIGHT: {"angle": Math.PI, "offset": new THREE.Vector2(0, 0)},
    RIGHT_UP: {"angle": Math.PI, "offset": new THREE.Vector2(0.5, 0.5)},
    
    DOWN_RIGHT: {"angle": Math.PI/2, "offset": new THREE.Vector2(0.5, 0.5)},
    RIGHT_DOWN: {"angle": Math.PI/2, "offset": new THREE.Vector2(0, 0)},
    
    UP_LEFT: {"angle": -Math.PI/2, "offset": new THREE.Vector2(0.5, 0.5)},
    LEFT_UP: {"angle": -Math.PI/2, "offset": new THREE.Vector2(0, 0)},
};

export const ROAD_DIR = {
    UP: 0,
    DOWN: Math.PI,
    LEFT: Math.PI/2,
    RIGHT: -Math.PI/2,
};

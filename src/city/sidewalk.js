import * as THREE from 'three';
import { part_length, between_parts_length, road_width } from './road.js';
import objectManager from '../utils/object_manager.js';

export const path_width = 5;
export const path_height = 0.4;
export const path_gray_width = 1.2;

const sidewalk_gray_material = new THREE.MeshToonMaterial({ color: 0xD6D6D6, side: THREE.DoubleSide });

const getSidewalkYellowMaterial = (repeatS, repeatT) => {
    const aoMap = objectManager.getObject("pavement_ao"); aoMap.wrapS = THREE.RepeatWrapping; aoMap.wrapT = THREE.RepeatWrapping; aoMap.repeat.set(repeatS, repeatT);
    const roughnessMap  = objectManager.getObject("pavement_roughness"); roughnessMap.wrapS = THREE.RepeatWrapping; roughnessMap.wrapT = THREE.RepeatWrapping; roughnessMap.repeat.set(repeatS, repeatT);
    const normalMap = objectManager.getObject("pavement_normal"); normalMap.wrapS = THREE.RepeatWrapping; normalMap.wrapT = THREE.RepeatWrapping; normalMap.repeat.set(repeatS, repeatT);

    const sidewalk_yellow_material = new THREE.MeshStandardMaterial({
        color: 0xEFD56B,
        aoMap: aoMap,
        roughnessMap: roughnessMap,
        normalMap: normalMap,
    });

    return sidewalk_yellow_material;
};


export function make_road_paths(x, z, direction, num_parts) {
    const paths = new THREE.Object3D();

    const road_length = (num_parts * part_length) + ((num_parts-1) * between_parts_length) + (2*between_parts_length/2);
    const path_offset = road_width/2 + path_width/2;

    let [left_path] = make_path(-path_offset, 0, road_length, 'right');
    let [right_path] = make_path(path_offset, 0, road_length, 'left');

    paths.add(left_path);
    paths.add(right_path);

    paths.position.set(-x, 0, -z);
    paths.rotateY(direction);
    paths.position.set(x, 0, z);

    return paths;
}

export function make_path_parts(x, z, num_parts, gray_side) {
    const road_length = (num_parts * part_length) + ((num_parts-1) * between_parts_length) + (2*between_parts_length/2);

    return make_path(x, z, road_length, gray_side);
}

export function make_path(x, z, length, gray_side) {
    const path = new THREE.Object3D();

    const yellow_width = path_width - path_gray_width;

    const grayGeo = new THREE.BoxGeometry(path_gray_width, path_height, length);
    const grayMat = sidewalk_gray_material;
    const grayMesh = new THREE.Mesh(grayGeo, grayMat);

    const yellowGeo = new THREE.BoxGeometry(yellow_width, path_height, length);
    const yellowMat = getSidewalkYellowMaterial(1, length/5);
    const yellowMesh = new THREE.Mesh(yellowGeo, yellowMat);

    if (gray_side === 'left') {
        grayMesh.position.x = -(path_width/2 - path_gray_width/2 + 0.01);
        yellowMesh.position.x = path_gray_width/2;
    } else {
        grayMesh.position.x = path_width/2 - path_gray_width/2 + 0.01;
        yellowMesh.position.x = -path_gray_width/2;
    }

    grayMesh.position.y = path_height/2 + 0.01;
    grayMesh.position.z = -length/2;
    yellowMesh.position.y = path_height/2;
    yellowMesh.position.z = -length/2;

    path.add(grayMesh);
    path.add(yellowMesh);

    path.position.set(x, 0, z);

    const endPoint = new THREE.Vector3(x, 0, z - length);

    return [path, endPoint];
}
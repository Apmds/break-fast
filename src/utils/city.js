import * as THREE from 'three';

const ROAD_CORNER_DIR = {
    DOWN_RIGHT: "down_right",
    DOWN_LEFT: "down_left",
    UP_RIGHT: "up_right",
    UP_LEFT: "up_left",
};

const ROAD_DIR = {
    UP: 0,
    DOWN: Math.PI,
    LEFT: Math.PI/2,
    RIGHT: -Math.PI/2,
};

function make_city() {
    const city = new THREE.Object3D();
    city.add(make_tree(0, 0, 0));

    let [road, endpoint] = make_road(10, 0, ROAD_DIR.UP, 10);
    city.add(road);
    console.log(endpoint);

    [road, endpoint] = make_road(endpoint.x, endpoint.z, ROAD_DIR.LEFT, 10);
    city.add(road);
    console.log(endpoint);

    return city
}

function make_road(x, z, direction, num_parts) {
    const road = new THREE.Object3D();

    const part_length = 6;
    const part_width = 1;
    const between_parts_length = part_length*0.66;

    const road_length = (num_parts * part_length) + ((num_parts-1) * between_parts_length) + (2*between_parts_length/2);
    const road_width = 40;

    const roadGeo = new THREE.PlaneGeometry(road_width, road_length);
    const roadMat = new THREE.MeshToonMaterial({color: 0x444444});
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotateX(-Math.PI/2);
    roadMesh.position.z -= road_length/2;

    const partGeo = new THREE.PlaneGeometry(part_width, part_length);
    const partMat = new THREE.MeshToonMaterial({color: 0xDDDDDD});
    for (let i = 0; i < num_parts; i++) {
        const partMesh = new THREE.Mesh(partGeo, partMat);
        partMesh.rotateX(-Math.PI/2);

        partMesh.position.z = -(i*(between_parts_length + part_length) + between_parts_length/2 + part_length/2);
        partMesh.position.y = 0.01;

        road.add(partMesh);
    }
    road.add(roadMesh);
    
    road.position.set(-x, 0, -z);
    road.rotateY(direction);
    road.position.set(x, 0, z);
    
    const endPoint = new THREE.Vector3(x + road_length*Math.sin(direction), 0, z - road_length*Math.cos(direction));

    return [road, endPoint];
}

function make_road_corner(direction) {
    const road = new THREE.Object3D();

    
    return road;
}

function make_tree(x, y, z) {
    const tree = new THREE.Object3D();

    const logHeight = 20;
    const logGeo = new THREE.CylinderGeometry(0.5, 0.8, logHeight, 8);
    const logMat = new THREE.MeshToonMaterial({ color: 0x1a0a00 });
    const log = new THREE.Mesh(logGeo, logMat);
    log.position.set(0, logHeight / 2, 0);
    tree.add(log);

    const leaves = [
        {y: 28, r: 2.2, drop: 3.5, seg: 7},
        {y: 24, r: 5.0, drop: 5.5, seg: 8},
        {y: 19, r: 8.5, drop: 7.0, seg: 9},
        {y: 14, r: 11.5, drop: 8.0, seg: 10},
        {y: 9, r: 14.0, drop: 9.5, seg: 11},
    ];

    const darkGreen  = new THREE.Color(0x2d4a1e);
    const brightGreen = new THREE.Color(0x3caf1d);

    for (let i = 0; i < leaves.length; i++) {
        const currLeaves = leaves[i];

        // Shadow leaves
        const innerGeo = new THREE.ConeGeometry(
            currLeaves.r * 0.78,
            currLeaves.drop * 1.3,
            currLeaves.seg,
            1,
            true
        );
        const innerMat = new THREE.MeshToonMaterial({
            color: darkGreen,
            side: THREE.DoubleSide,
        });
        const innerLeaves = new THREE.Mesh(innerGeo, innerMat);
        innerLeaves.position.set(0, currLeaves.y, 0);
        tree.add(innerLeaves);

        // Outer leaves
        const outerGeo = new THREE.ConeGeometry(
            currLeaves.r,
            currLeaves.drop,
            currLeaves.seg,
            1,
            true
        );
        const outerMat = new THREE.MeshToonMaterial({
            color: brightGreen,
            side: THREE.DoubleSide,
        });
        const outerLeaves = new THREE.Mesh(outerGeo, outerMat);
        outerLeaves.position.set(0, currLeaves.y, 0);

        tree.add(outerLeaves);
    }

    tree.position.set(x, y, z);
    return tree;
}

function make_tree_old(x, y, z) {
    const tree = new THREE.Object3D();

    const logHeight = 20;
    const logGeo = new THREE.CylinderGeometry(0.3, 1, logHeight, 16);
    const logMat = new THREE.MeshToonMaterial({ color: 0x8B5A2B });
    const log = new THREE.Mesh(logGeo, logMat);
    log.position.set(0, logHeight/2, 0);

    const leafSpacing = 2;
    const topOffset = 4;

    for (let i = 0; i < 10; i++) {
        const height = (11 - i)*0.6;
        const radius = i*i*0.01 + i*0.6;
        const ypos = logHeight + topOffset - i*leafSpacing;
        const light = 1;

        const leavesGeo = new THREE.ConeGeometry(radius, height, 6 + i, 1, true);
        const leavesMat = new THREE.MeshToonMaterial({
            color: new THREE.Color().setHSL(107, 72/255, light),
            side: THREE.DoubleSide,
        });
        const leaves = new THREE.Mesh(leavesGeo, leavesMat);

        leaves.position.set(0, ypos, 0);
        tree.add(leaves);
    }

    tree.add(log);
    tree.position.set(x, y, z);

    return tree;
}

export default make_city;
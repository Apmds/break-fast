import * as THREE from 'three';

const road_width = 20;
const part_length = 3;
const part_width = 0.33;
const between_parts_length = part_length*0.66;

const path_width = 5;
const path_height = 0.4;
const path_gray_width = 1.2;

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
    [road, endpoint] = make_road(road_start.x, road_start.z, ROAD_DIR.UP, 50);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.UP, 50));

    city.add(make_roundabout(endpoint.x, endpoint.z - 50, 50));

    road_start = new THREE.Vector3(endpoint.x, 0, endpoint.z - 100);
    [road, endpoint] = make_road(road_start.x, road_start.z, ROAD_DIR.UP, 50);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.UP, 50));

    [road, endpoint] = make_road_corner(endpoint.x, endpoint.z, ROAD_CORNER_DIR.DOWN_RIGHT);
    city.add(road);

    road_start = endpoint.clone();
    [road, endpoint] = make_road(road_start.x, road_start.z, ROAD_DIR.RIGHT, 30);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.RIGHT, 30));

    [road, endpoint] = make_road_corner(endpoint.x, endpoint.z, ROAD_CORNER_DIR.LEFT_DOWN);
    city.add(road);

    road_start = endpoint.clone();
    [road, endpoint] = make_road(road_start.x, road_start.z, ROAD_DIR.DOWN, 58);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.DOWN, 58));

    // TODO: estrada com 3 caminhos
    
    road_start = new THREE.Vector3(endpoint.x - road_width / 2, 0, endpoint.z + (road_width / 2));
    [road] = make_road(road_start.x, road_start.z, ROAD_DIR.LEFT, 22);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.LEFT, 22));
    
    road_start = new THREE.Vector3(endpoint.x, 0, endpoint.z);
    [road, endpoint] = make_road(road_start.x, road_start.z, ROAD_DIR.DOWN, 4);
    city.add(road);
    let [single_path] = make_path_parts(0, 0, 4, 'right');
    single_path.position.set(-road_start.x - road_width/2 - path_width/2, 0, -road_start.z);
    single_path.rotateY(ROAD_DIR.DOWN);
    single_path.position.set(road_start.x + road_width/2 + path_width/2, 0, road_start.z);
    city.add(single_path);

    road_start = new THREE.Vector3(endpoint.x, 0, endpoint.z);
    [road] = make_road(road_start.x, road_start.z, ROAD_DIR.DOWN, 50);
    city.add(road);
    city.add(make_road_paths(road_start.x, road_start.z, ROAD_DIR.DOWN, 50));

    // TODO: estrada sem saída


    city.add(make_tree(-40, 0, 200, 2));
    city.add(make_tree(-10, 0, 220, 1.5));
    city.add(make_tree(-30, 0, 230, 1.7));
    

    return city
}

function make_road(x, z, direction, num_parts) {
    const road = new THREE.Object3D();    

    const road_length = (num_parts * part_length) + ((num_parts-1) * between_parts_length) + (2*between_parts_length/2);

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
    
    const endPoint = new THREE.Vector3(x - road_length*Math.sin(direction), 0, z - road_length*Math.cos(direction));

    return [road, endPoint];
}

function make_road_corner(x, z, direction) {
    const road = new THREE.Object3D();

    const num_parts = 3;

    const roadGeo = new THREE.CircleGeometry(road_width, 10, 0, Math.PI/2);
    const roadMat = new THREE.MeshToonMaterial({color: 0x444444});
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotateX(-Math.PI/2);
    roadMesh.position.x = -road_width/2;

    roadMesh.position.x += road_width*direction.offset.x;
    roadMesh.position.z += road_width*direction.offset.y;

    const partGeo = new THREE.PlaneGeometry(part_width, part_length);
    const partMat = new THREE.MeshToonMaterial({color: 0xDDDDDD});
    const partRadius = road_width/2;
    const partCenterX = -road_width/2;
    const partCenterZ = 0;

    for (let i = 0; i < num_parts; i++) {
        const partMesh = new THREE.Mesh(partGeo, partMat);
        partMesh.rotateX(-Math.PI/2);

        const arcOffset = i*(between_parts_length + part_length) + between_parts_length/2 + part_length/2;
        const partAngle = arcOffset/partRadius;

        partMesh.position.x = partCenterX + partRadius*Math.cos(partAngle-Math.PI/2);
        partMesh.position.y = 0.01;
        partMesh.position.z = partCenterZ + partRadius*Math.sin(partAngle-Math.PI/2);
        partMesh.rotateZ(-partAngle+Math.PI/2);

        partMesh.position.x += road_width*direction.offset.x;
        partMesh.position.z += road_width*direction.offset.y;

        road.add(partMesh);
    }

    road.add(roadMesh);
    
    road.position.set(-x, 0, -z);
    road.rotateY(direction.angle);
    road.position.set(x, 0, z);

    const endOffset = new THREE.Vector3(
        -road_width/2 + 2*road_width*direction.offset.x,
        0,
        -road_width/2 + 2*road_width*direction.offset.y
    )
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), direction.angle);
    const endPoint = new THREE.Vector3(x + endOffset.x, 0, z + endOffset.z);

    return [road, endPoint];
}

function make_roundabout(x, z, radius) {
    const roundabout = new THREE.Object3D();

    const roadGeo = new THREE.RingGeometry(radius - road_width, radius, 40);
    const roadMat = new THREE.MeshToonMaterial({ color: 0x444444, side: THREE.DoubleSide });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotateX(-Math.PI/2);
    roundabout.add(roadMesh);

    // Blend pads remove tiny visual seams where straight roads meet the ring.
    const joinGeo = new THREE.PlaneGeometry(road_width, road_width);
    const joinMat = new THREE.MeshToonMaterial({ color: 0x444444, side: THREE.DoubleSide });
    const joinOffsets = [
        new THREE.Vector2(0, radius - road_width/2),
        new THREE.Vector2(0, -(radius - road_width/2)),
        new THREE.Vector2(radius - road_width/2, 0),
        new THREE.Vector2(-(radius - road_width/2), 0),
    ];

    for (let i = 0; i < joinOffsets.length; i++) {
        const joinMesh = new THREE.Mesh(joinGeo, joinMat);
        joinMesh.rotateX(-Math.PI/2);
        joinMesh.position.set(joinOffsets[i].x, 0.002, joinOffsets[i].y);
        roundabout.add(joinMesh);
    }

    const baseRadius = Math.max(4, radius - road_width - 9);
    const baseHeight = 1.4;
    const baseGeo = new THREE.CylinderGeometry(baseRadius, baseRadius + 0.8, baseHeight, 24);
    const baseMat = new THREE.MeshToonMaterial({ color: 0xa4b774 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = baseHeight/2;
    roundabout.add(baseMesh);

    const curbGeo = new THREE.CylinderGeometry(baseRadius + 1.1, baseRadius + 1.1, 0.35, 24, 1, true);
    const curbMat = new THREE.MeshToonMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    const curbMesh = new THREE.Mesh(curbGeo, curbMat);
    curbMesh.position.y = 0.175;
    roundabout.add(curbMesh);

    const marking_count = 28;
    const marking_radius = radius - road_width/2;
    const markingGeo = new THREE.BoxGeometry(part_width, 0.05, part_length*0.8);
    const markingMat = new THREE.MeshToonMaterial({ color: 0xDDDDDD });

    for (let i = 0; i < marking_count; i++) {
        const angle = (i/marking_count) * Math.PI*2;
        const markingMesh = new THREE.Mesh(markingGeo, markingMat);
        markingMesh.position.x = marking_radius * Math.cos(angle);
        markingMesh.position.y = 0.03;
        markingMesh.position.z = marking_radius * Math.sin(angle);
        markingMesh.rotateY(-angle);
        roundabout.add(markingMesh);
    }

    roundabout.position.set(x, 0, z);

    return roundabout;
}

function make_road_paths(x, z, direction, num_parts) {
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

function make_path_parts(x, z, num_parts, gray_side) {
    const road_length = (num_parts * part_length) + ((num_parts-1) * between_parts_length) + (2*between_parts_length/2);

    return make_path(x, z, road_length, gray_side);
}

function make_path(x, z, length, gray_side) {
    const path = new THREE.Object3D();

    const yellow_width = path_width - path_gray_width;

    const grayGeo = new THREE.BoxGeometry(path_gray_width, path_height, length);
    const grayMat = new THREE.MeshToonMaterial({ color: 0xD6D6D6 });
    const grayMesh = new THREE.Mesh(grayGeo, grayMat);

    const yellowGeo = new THREE.BoxGeometry(yellow_width, path_height, length);
    const yellowMat = new THREE.MeshToonMaterial({ color: 0xEFE3B2 });
    const yellowMesh = new THREE.Mesh(yellowGeo, yellowMat);

    if (gray_side === 'left') {
        grayMesh.position.x = -(path_width/2 - path_gray_width/2);
        yellowMesh.position.x = path_gray_width/2;
    } else {
        grayMesh.position.x = path_width/2 - path_gray_width/2;
        yellowMesh.position.x = -path_gray_width/2;
    }

    grayMesh.position.y = path_height/2;
    grayMesh.position.z = -length/2;
    yellowMesh.position.y = path_height/2;
    yellowMesh.position.z = -length/2;

    path.add(grayMesh);
    path.add(yellowMesh);

    path.position.set(x, 0, z);

    const endPoint = new THREE.Vector3(x, 0, z - length);

    return [path, endPoint];
}

function make_tree(x, y, z, scale) {
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
    tree.scale.set(scale, scale, scale);
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
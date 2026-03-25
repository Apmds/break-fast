import * as THREE from 'three';

export const road_width = 20;
export const part_length = 3;
export const part_width = 0.33;
export const between_parts_length = part_length*0.66;

export function make_road(x, y, z, direction, num_parts, tilt_angle) {
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
    
    road.position.set(-x, y, -z);
    road.rotateY(direction);
    road.rotateX(tilt_angle);
    road.position.set(x, y, z);
    
    const horizontal_length = road_length * Math.cos(tilt_angle);
    const endPoint = new THREE.Vector3(
        x - horizontal_length*Math.sin(direction),
        y + road_length*Math.sin(tilt_angle),
        z - horizontal_length*Math.cos(direction)
    );

    return [road, endPoint];
}

export function make_road_corner(x, z, direction) {
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

export function make_roundabout(x, z, radius) {
    const roundabout = new THREE.Object3D();

    const roadGeo = new THREE.RingGeometry(radius - road_width, radius, 40);
    const roadMat = new THREE.MeshToonMaterial({ color: 0x444444 });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotateX(-Math.PI/2);
    roundabout.add(roadMesh);

    // Blend pads remove tiny visual seams where straight roads meet the ring.
    const joinGeo = new THREE.PlaneGeometry(road_width, road_width);
    const joinMat = new THREE.MeshToonMaterial({ color: 0x444444 });
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
    const curbMat = new THREE.MeshToonMaterial({ color: 0xcccccc });
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

    const frontEndpoint = new THREE.Vector3(x, 0, z - radius);
    const leftEndpoint = new THREE.Vector3(x - radius, 0, z);
    const rightEndpoint = new THREE.Vector3(x + radius, 0, z);

    return [roundabout, frontEndpoint, leftEndpoint, rightEndpoint];
}

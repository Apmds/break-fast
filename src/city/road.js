import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export const road_width = 20;
export const part_length = 3;
export const part_width = 0.33;
export const between_parts_length = part_length*0.66;

export function make_road(x, y, z, direction, num_parts, tilt_angle = 0, has_barriers = false) {
    const road = new THREE.Object3D();    

    const road_length = (num_parts * part_length) + ((num_parts-1) * between_parts_length) + (2*between_parts_length/2);

    const roadGeo = new THREE.PlaneGeometry(road_width, road_length);
    const roadMat = new THREE.MeshToonMaterial({color: 0x444444, side: THREE.DoubleSide, fog: false});
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotateX(-Math.PI/2);
    roadMesh.position.z -= road_length/2;

    const partGeo = new THREE.PlaneGeometry(part_width, part_length);
    const partMat = new THREE.MeshToonMaterial({color: 0xDDDDDD, side: THREE.DoubleSide, fog: false});
    for (let i = 0; i < num_parts; i++) {
        const partMesh = new THREE.Mesh(partGeo, partMat);
        partMesh.rotateX(-Math.PI/2);

        partMesh.position.z = -(i*(between_parts_length + part_length) + between_parts_length/2 + part_length/2);
        partMesh.position.y = 0.01;

        road.add(partMesh);
    }
    road.add(roadMesh);

    // Physics body - only if not flat on ground OR has barriers
    let roadBody = null;
    if (y !== 0 || tilt_angle !== 0 || has_barriers) {
        roadBody = new CANNON.Body({ mass: 0 });
        
        // Floor collision only if elevated or tilted (otherwise rely on ground plane)
        if (y !== 0 || tilt_angle !== 0) {
            const roadShape = new CANNON.Box(new CANNON.Vec3(road_width / 2, 0.5, road_length / 2));
            roadBody.addShape(roadShape, new CANNON.Vec3(0, -0.5, -road_length / 2));
        }

        if (has_barriers) {
            const railHeightBottom = 0.8;
            const railHeightTop = 1.2;
            const railThickness = 0.14;
            const postHeight = 1.3;
            const postThickness = 0.2;
            const sideOffset = road_width / 2 - postThickness / 2;
            const postSpacing = 5;

            // Simplified rail collision
            const railCollisionHeight = 1.5;
            const railShape = new CANNON.Box(new CANNON.Vec3(0.5 / 2, railCollisionHeight / 2, road_length / 2));
            roadBody.addShape(railShape, new CANNON.Vec3(-road_width / 2, railCollisionHeight / 2, -road_length / 2));
            roadBody.addShape(railShape, new CANNON.Vec3(road_width / 2, railCollisionHeight / 2, -road_length / 2));

            const railGeo = new THREE.BoxGeometry(railThickness, railThickness, road_length);
            const postGeo = new THREE.BoxGeometry(postThickness, postHeight, postThickness);
            const barrierMat = new THREE.MeshToonMaterial({ color: 0xd7d7d7, side: THREE.DoubleSide , fog: false});

            const leftRailTop = new THREE.Mesh(railGeo, barrierMat);
            leftRailTop.position.set(-sideOffset, railHeightTop, -road_length / 2);
            road.add(leftRailTop);

            const leftRailBottom = new THREE.Mesh(railGeo, barrierMat);
            leftRailBottom.position.set(-sideOffset, railHeightBottom, -road_length / 2);
            road.add(leftRailBottom);

            const rightRailTop = new THREE.Mesh(railGeo, barrierMat);
            rightRailTop.position.set(sideOffset, railHeightTop, -road_length / 2);
            road.add(rightRailTop);

            const rightRailBottom = new THREE.Mesh(railGeo, barrierMat);
            rightRailBottom.position.set(sideOffset, railHeightBottom, -road_length / 2);
            road.add(rightRailBottom);

            const postCount = Math.floor(road_length / postSpacing) + 1;
            for (let i = 0; i < postCount; i++) {
                const z = -i * postSpacing;

                const leftPost = new THREE.Mesh(postGeo, barrierMat);
                leftPost.position.set(-sideOffset, postHeight / 2, z);
                road.add(leftPost);

                const rightPost = new THREE.Mesh(postGeo, barrierMat);
                rightPost.position.set(sideOffset, postHeight / 2, z);
                road.add(rightPost);
            }
        }

        // Sync body transform
        roadBody.position.set(x, y, z);
        const quatY = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(0, 1, 0), direction);
        const quatX = new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(1, 0, 0), tilt_angle);
        roadBody.quaternion.copy(quatY.mult(quatX));
    }
    
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

    return [road, endPoint, roadBody];
}

export function make_road_corner(x, z, direction) {
    const road = new THREE.Object3D();

    const num_parts = 3;

    const roadGeo = new THREE.CircleGeometry(road_width, 10, 0, Math.PI/2);
    const roadMat = new THREE.MeshToonMaterial({color: 0x444444, side: THREE.DoubleSide, fog: false});
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotateX(-Math.PI/2);
    roadMesh.position.x = -road_width/2;

    roadMesh.position.x += road_width*direction.offset.x;
    roadMesh.position.z += road_width*direction.offset.y;

    const partGeo = new THREE.PlaneGeometry(part_width, part_length);
    const partMat = new THREE.MeshToonMaterial({color: 0xDDDDDD, side: THREE.DoubleSide, fog: false});
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

    // Flat corners at y=0 don't need collision (rely on ground plane)
    const roadBody = null;

    const endOffset = new THREE.Vector3(
        -road_width/2 + 2*road_width*direction.offset.x,
        0,
        -road_width/2 + 2*road_width*direction.offset.y
    )
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), direction.angle);
    const endPoint = new THREE.Vector3(x + endOffset.x, 0, z + endOffset.z);

    return [road, endPoint, roadBody];
}

export function make_roundabout(x, z, radius) {
    const roundabout = new THREE.Object3D();

    const roadGeo = new THREE.RingGeometry(radius - road_width, radius, 40);
    const roadMat = new THREE.MeshToonMaterial({ color: 0x444444, side: THREE.DoubleSide , fog: false});
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotateX(-Math.PI/2);
    roundabout.add(roadMesh);

    // Blend pads
    const joinGeo = new THREE.PlaneGeometry(road_width, road_width);
    const joinMat = new THREE.MeshToonMaterial({ color: 0x444444, side: THREE.DoubleSide , fog: false});
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
    const baseMat = new THREE.MeshToonMaterial({ color: 0xa4b774, side: THREE.DoubleSide , fog: false});
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = baseHeight/2;
    roundabout.add(baseMesh);

    const curbGeo = new THREE.CylinderGeometry(baseRadius + 1.1, baseRadius + 1.1, 0.35, 24, 1, true);
    const curbMat = new THREE.MeshToonMaterial({ color: 0xcccccc, side: THREE.DoubleSide , fog: false});
    const curbMesh = new THREE.Mesh(curbGeo, curbMat);
    curbMesh.position.y = 0.175;
    roundabout.add(curbMesh);

    const marking_count = 28;
    const marking_radius = radius - road_width/2;
    const markingGeo = new THREE.BoxGeometry(part_width, 0.05, part_length*0.8);
    const markingMat = new THREE.MeshToonMaterial({ color: 0xDDDDDD, side: THREE.DoubleSide , fog: false});

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

    // Flat roundabouts at y=0 don't need collision (rely on ground plane)
    const roadBody = null;

    const frontEndpoint = new THREE.Vector3(x, 0, z - radius);
    const leftEndpoint = new THREE.Vector3(x - radius, 0, z);
    const rightEndpoint = new THREE.Vector3(x + radius, 0, z);

    return [roundabout, frontEndpoint, leftEndpoint, rightEndpoint, roadBody];
}
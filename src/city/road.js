import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import objectManager from '../utils/object_manager.js';

export const road_width = 20;
export const part_length = 3;
export const part_width = 0.33;
export const between_parts_length = part_length*0.66;

const road_material = new THREE.MeshToonMaterial({color: 0x444444, side: THREE.DoubleSide, fog: false});
const road_part_material = new THREE.MeshToonMaterial({color: 0xDDDDDD, side: THREE.DoubleSide, fog: false});
const barrier_material = new THREE.MeshToonMaterial({ color: 0xd7d7d7, side: THREE.DoubleSide , fog: false});
const sidewalk_gray_material = new THREE.MeshToonMaterial({ color: 0xD6D6D6, side: THREE.DoubleSide });
const roundabout_middle_ring_material = new THREE.MeshToonMaterial({ color: 0xcccccc, side: THREE.DoubleSide , fog: false});
const roundabout_middle_material = new THREE.MeshToonMaterial({ color: 0xa4b774, side: THREE.DoubleSide , fog: false});

const sidewalk_width = 7;
const sidewalk_gray_width = 1.2;
const sidewalk_height = 0.4;

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

const createRingSegmentMesh = (innerRadius, outerRadius, thetaStart, thetaLength, height, material, curveSegments = 24) => {
    const thetaEnd = thetaStart + thetaLength;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerRadius, thetaStart, thetaEnd, false);
    shape.lineTo(innerRadius * Math.cos(thetaEnd), innerRadius * Math.sin(thetaEnd));
    shape.absarc(0, 0, innerRadius, thetaEnd, thetaStart, true);
    shape.lineTo(outerRadius * Math.cos(thetaStart), outerRadius * Math.sin(thetaStart));

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: false,
        curveSegments: curveSegments,
    });

    return new THREE.Mesh(geometry, material);
};

export function make_road(x, y, z, direction, num_parts, tilt_angle = 0, has_barriers = false) {
    //return [new THREE.Object3D(), new THREE.Vector3(), new CANNON.Body({ mass: 0 })];

    const road = new THREE.Object3D();    

    const road_length = (num_parts * part_length) + ((num_parts-1) * between_parts_length) + (2*between_parts_length/2);

    const roadGeo = new THREE.PlaneGeometry(road_width, road_length);
    const roadMat = road_material;
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotateX(-Math.PI/2);
    roadMesh.position.z -= road_length/2;

    const partGeo = new THREE.PlaneGeometry(part_width, part_length);
    const partsInstanced = new THREE.InstancedMesh(partGeo, road_part_material, num_parts);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < num_parts; i++) {
        dummy.rotation.set(-Math.PI/2, 0, 0);
        dummy.position.set(0, 0.01, -(i*(between_parts_length + part_length) + between_parts_length/2 + part_length/2));
        dummy.updateMatrix();
        partsInstanced.setMatrixAt(i, dummy.matrix);
    }
    road.add(partsInstanced);
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
            const barrierDummy = new THREE.Object3D();

            const railsInstanced = new THREE.InstancedMesh(railGeo, barrier_material, 4);
            const railPositions = [
                [-sideOffset, railHeightTop,    -road_length / 2],
                [-sideOffset, railHeightBottom, -road_length / 2],
                [ sideOffset, railHeightTop,    -road_length / 2],
                [ sideOffset, railHeightBottom, -road_length / 2],
            ];
            for (let i = 0; i < 4; i++) {
                barrierDummy.position.set(...railPositions[i]);
                barrierDummy.rotation.set(0, 0, 0);
                barrierDummy.updateMatrix();
                railsInstanced.setMatrixAt(i, barrierDummy.matrix);
            }
            road.add(railsInstanced);

            const postCount = Math.floor(road_length / postSpacing) + 1;
            const postsInstanced = new THREE.InstancedMesh(postGeo, barrier_material, postCount * 2);
            for (let i = 0; i < postCount; i++) {
                const z = -i * postSpacing;
                barrierDummy.rotation.set(0, 0, 0);
                barrierDummy.position.set(-sideOffset, postHeight / 2, z);
                barrierDummy.updateMatrix();
                postsInstanced.setMatrixAt(i * 2,     barrierDummy.matrix);
                barrierDummy.position.set( sideOffset, postHeight / 2, z);
                barrierDummy.updateMatrix();
                postsInstanced.setMatrixAt(i * 2 + 1, barrierDummy.matrix);
            }
            road.add(postsInstanced);
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
    //return [new THREE.Object3D(), new THREE.Vector3(), new CANNON.Body({ mass: 0 })];

    const road = new THREE.Object3D();

    const num_parts = 3;

    const roadGeo = new THREE.CircleGeometry(road_width, 10, 0, Math.PI/2);
    const roadMat = road_material;
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotateX(-Math.PI/2);
    roadMesh.position.x = -road_width/2;

    roadMesh.position.x += road_width*direction.offset.x;
    roadMesh.position.z += road_width*direction.offset.y;

    const partGeo = new THREE.PlaneGeometry(part_width, part_length);
    const partRadius = road_width/2;
    const partCenterX = -road_width/2;
    const partCenterZ = 0;
    const partsInstanced = new THREE.InstancedMesh(partGeo, road_part_material, num_parts);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < num_parts; i++) {
        const arcOffset = i*(between_parts_length + part_length) + between_parts_length/2 + part_length/2;
        const partAngle = arcOffset/partRadius;

        dummy.rotation.set(0, 0, 0);
        dummy.rotateX(-Math.PI/2);
        dummy.rotateZ(-partAngle+Math.PI/2);
        dummy.position.set(
            partCenterX + partRadius*Math.cos(partAngle-Math.PI/2) + road_width*direction.offset.x,
            0.01,
            partCenterZ + partRadius*Math.sin(partAngle-Math.PI/2) + road_width*direction.offset.y
        );
        dummy.updateMatrix();
        partsInstanced.setMatrixAt(i, dummy.matrix);
    }
    road.add(partsInstanced);

    road.add(roadMesh);

    const sidewalkInnerRadius = road_width;
    const sidewalkGrayOuterRadius = sidewalkInnerRadius + sidewalk_gray_width;
    const sidewalkOuterRadius = sidewalkInnerRadius + sidewalk_width;
    const sidewalkCenterX = -road_width/2 + road_width * direction.offset.x;
    const sidewalkCenterZ = road_width * direction.offset.y;

    const sidewalkGray = createRingSegmentMesh(
        sidewalkInnerRadius,
        sidewalkGrayOuterRadius,
        0,
        Math.PI/2,
        sidewalk_height,
        sidewalk_gray_material,
    );
    sidewalkGray.rotateX(-Math.PI/2);
    sidewalkGray.position.set(sidewalkCenterX, 0.01, sidewalkCenterZ);
    road.add(sidewalkGray);

    const sidewalkYellow = createRingSegmentMesh(
        sidewalkGrayOuterRadius,
        sidewalkOuterRadius,
        0,
        Math.PI/2,
        sidewalk_height,
        getSidewalkYellowMaterial(0.2, 0.2),
    );
    sidewalkYellow.rotateX(-Math.PI/2);
    sidewalkYellow.position.set(sidewalkCenterX, 0.01, sidewalkCenterZ);
    road.add(sidewalkYellow);
    
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
    //return [new THREE.Object3D(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new CANNON.Body({ mass: 0 })];

    const roundabout = new THREE.Object3D();

    const roadGeo = new THREE.RingGeometry(radius - road_width, radius, 40);
    const roadMat = road_material;
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotateX(-Math.PI/2);
    roundabout.add(roadMesh);

    // Blend pads
    const joinGeo = new THREE.PlaneGeometry(road_width, road_width);
    const joinMat = road_material;
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

    // Outer sidewalk ring with gaps where roads connect
    const pathWidth = sidewalk_width;
    const pathGrayWidth = sidewalk_gray_width;
    const pathHeight = sidewalk_height;
    const pathRaise = 0.12;
    const pathInnerRadius = radius + 0.02;
    const pathGrayOuterRadius = pathInnerRadius + pathGrayWidth;
    const pathOuterRadius = pathInnerRadius + pathWidth;
    const pathGrayMat = sidewalk_gray_material;
    const pathYellowMat = getSidewalkYellowMaterial(0.2, 0.2);
    const corridorHalfWidth = road_width / 2;
    const gapRatio = Math.min(0.95, corridorHalfWidth / pathInnerRadius);
    const maxGapHalfAngle = Math.PI / 4 - 0.05;
    const gapHalfAngle = Math.min(maxGapHalfAngle, Math.asin(gapRatio));
    const quadrantArc = Math.PI / 2 - 2 * gapHalfAngle;
    const yellowGapExtra = 0.02;
    const yellowGapHalfAngle = Math.min(maxGapHalfAngle, gapHalfAngle + yellowGapExtra);
    const yellowQuadrantArc = Math.PI / 2 - 2 * yellowGapHalfAngle;
    const curveSegments = 24;

    const addPathSegment = (innerRadius, outerRadius, material, thetaStart, thetaLength) => {
        if (thetaLength <= 0) {
            return;
        }
        const mesh = createRingSegmentMesh(
            innerRadius,
            outerRadius,
            thetaStart,
            thetaLength,
            pathHeight,
            material,
            curveSegments,
        );
        mesh.rotateX(-Math.PI/2);
        mesh.position.y = pathRaise + 0.01;
        roundabout.add(mesh);
    };

    for (let i = 0; i < 4; i++) {
        const thetaStart = i * Math.PI / 2 + gapHalfAngle;
        const yellowThetaStart = i * Math.PI / 2 + yellowGapHalfAngle;
        addPathSegment(pathInnerRadius, pathGrayOuterRadius, pathGrayMat, thetaStart, quadrantArc);
        addPathSegment(pathGrayOuterRadius, pathOuterRadius, pathYellowMat, yellowThetaStart, yellowQuadrantArc);
    }

    const baseRadius = Math.max(4, radius - road_width - 9);
    const baseHeight = 1.4;
    const baseGeo = new THREE.CylinderGeometry(baseRadius, baseRadius + 0.8, baseHeight, 24);
    const baseMat = roundabout_middle_material;
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = baseHeight/2;
    roundabout.add(baseMesh);

    const curbGeo = new THREE.CylinderGeometry(baseRadius + 1.1, baseRadius + 1.1, 0.35, 24, 1, true);
    const curbMat = roundabout_middle_ring_material;
    const curbMesh = new THREE.Mesh(curbGeo, curbMat);
    curbMesh.position.y = 0.175;
    roundabout.add(curbMesh);

    const marking_count = 28;
    const marking_radius = radius - road_width/2;
    const markingGeo = new THREE.BoxGeometry(part_width, 0.05, part_length*0.8);
    const markingsInstanced = new THREE.InstancedMesh(markingGeo, road_part_material, marking_count);
    const markingDummy = new THREE.Object3D();
    for (let i = 0; i < marking_count; i++) {
        const angle = (i/marking_count) * Math.PI*2;
        markingDummy.position.set(marking_radius * Math.cos(angle), 0.03, marking_radius * Math.sin(angle));
        markingDummy.rotation.set(0, -angle, 0);
        markingDummy.updateMatrix();
        markingsInstanced.setMatrixAt(i, markingDummy.matrix);
    }
    roundabout.add(markingsInstanced);

    roundabout.position.set(x, 0, z);

    // Flat roundabouts at y=0 don't need collision (rely on ground plane)
    const roadBody = null;

    const frontEndpoint = new THREE.Vector3(x, 0, z - radius);
    const leftEndpoint = new THREE.Vector3(x - radius, 0, z);
    const rightEndpoint = new THREE.Vector3(x + radius, 0, z);

    return [roundabout, frontEndpoint, leftEndpoint, rightEndpoint, roadBody];
}
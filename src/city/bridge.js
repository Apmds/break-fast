import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { make_road, part_length, between_parts_length, road_width } from './road.js';
import { ROAD_DIR } from '../utils/road.js';

export function make_bridge(x, y, z, direction) {
    const bridge = new THREE.Object3D();
    const bridge_parts = 180;
    const bridge_length = (bridge_parts * part_length) + ((bridge_parts - 1) * between_parts_length) + between_parts_length;
    
    const [road] = make_road(0, 0, 0, ROAD_DIR.UP, bridge_parts, 0, true);
    road.traverse((child) => {
        if (child.material) {
            child.material.fog = true;
        }
    });
    bridge.add(road);

    // Create physics body
    const bridgeBody = new CANNON.Body({ mass: 0 });

    // Road surface collision
    const roadShape = new CANNON.Box(new CANNON.Vec3(road_width / 2, 0.5, bridge_length / 2));
    bridgeBody.addShape(roadShape, new CANNON.Vec3(0, -0.5, -bridge_length / 2));

    // Side guardrails collision
    const railHeight = 2;
    const railThickness = 0.5;
    const sideRailShape = new CANNON.Box(new CANNON.Vec3(railThickness / 2, railHeight / 2, bridge_length / 2));
    // Left rail
    bridgeBody.addShape(sideRailShape, new CANNON.Vec3(-road_width / 2, railHeight / 2, -bridge_length / 2));
    // Right rail
    bridgeBody.addShape(sideRailShape, new CANNON.Vec3(road_width / 2, railHeight / 2, -bridge_length / 2));

    const road_volume = new THREE.Mesh(
        new THREE.BoxGeometry(road_width, 3, bridge_length),
        new THREE.MeshToonMaterial({ color: 0x777777 })
    );
    road_volume.position.x = 0;
    road_volume.position.y = -1.55;
    road_volume.position.z = -bridge_length/2;
    bridge.add(road_volume);

    const road_volume2 = new THREE.Mesh(
        new THREE.BoxGeometry(road_width/3, 4, bridge_length),
        new THREE.MeshToonMaterial({ color: 0x777777 })
    );
    road_volume2.position.x = 0;
    road_volume2.position.y = -4.5;
    road_volume2.position.z = -bridge_length/2;
    bridge.add(road_volume2);

    const frontPillarBaseZ = -bridge_length * 0.201;
    const backPillarBaseZ = -bridge_length * (1 - 0.201);

    // Relative template values (measured from front pillar base)
    const relTopZ = -136 - frontPillarBaseZ;
    const relGroundAnchorZ1 = 63 - frontPillarBaseZ;
    const relGroundAnchorZ2 = 63 - frontPillarBaseZ;
    const relStayAnchorStartZ = -bridge_length * 0.245 - frontPillarBaseZ;
    const relStayAnchorEndZ = -bridge_length * 0.5 - frontPillarBaseZ;

    function make_cables(pillarBaseZ, rotationY = 0) {
        const object = new THREE.Object3D();
        object.position.set(0, 0, pillarBaseZ);
        object.rotateY(rotationY);

        const cablePillarHeight = 180;
        const cablePillarGeo = new THREE.CylinderGeometry(1, 2.5, cablePillarHeight, 14);
        const cablePillarMat = new THREE.MeshToonMaterial({ color: 0xbdbdbd });
        const cableBridgeSupportGeo = new THREE.BoxGeometry(road_width*1.6, 6, 7.5);

        const cablePillarFront = new THREE.Object3D();
        const cablePillarFrontLeft = new THREE.Mesh(cablePillarGeo, cablePillarMat);
        const cablePillarFrontRight = new THREE.Mesh(cablePillarGeo, cablePillarMat);
        cablePillarFrontLeft.position.x = -(road_width/2)*0.7;
        cablePillarFrontLeft.rotateZ(THREE.MathUtils.degToRad(-4));
        cablePillarFrontRight.position.x = (road_width/2)*0.7;
        cablePillarFrontRight.rotateZ(THREE.MathUtils.degToRad(4));

        cablePillarFront.position.set(0, cablePillarHeight/2 - 20, 0);
        cablePillarFront.rotateX(THREE.MathUtils.degToRad(30));
        cablePillarFront.add(cablePillarFrontLeft);
        cablePillarFront.add(cablePillarFrontRight);

        const cablePillarFrontBridgeSupport = new THREE.Mesh(cableBridgeSupportGeo, cablePillarMat);
        cablePillarFrontBridgeSupport.rotateX(-THREE.MathUtils.degToRad(30));
        cablePillarFrontBridgeSupport.position.y = -cablePillarHeight/2 + 2;
        cablePillarFrontBridgeSupport.position.z = 1;
        cablePillarFront.add(cablePillarFrontBridgeSupport);

        object.add(cablePillarFront);

        // PILLAR COLLISIONS
        const pillarShape = new CANNON.Box(new CANNON.Vec3(2.5, cablePillarHeight / 2, 2.5));
        const pillarY = cablePillarHeight / 2 - 20;

        const quatY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
        const quatFront = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(30));

        // Left Pillar
        const qL = quatY.clone().multiply(quatFront).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(-4)));
        const pL = new THREE.Vector3(-(road_width/2)*0.7, pillarY, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
        bridgeBody.addShape(pillarShape, new CANNON.Vec3(pL.x, pL.y, pL.z + pillarBaseZ), new CANNON.Quaternion(qL.x, qL.y, qL.z, qL.w));

        // Right Pillar
        const qR = quatY.clone().multiply(quatFront).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(4)));
        const pR = new THREE.Vector3((road_width/2)*0.7, pillarY, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
        bridgeBody.addShape(pillarShape, new CANNON.Vec3(pR.x, pR.y, pR.z + pillarBaseZ), new CANNON.Quaternion(qR.x, qR.y, qR.z, qR.w));

        // ANCHOR COLLISIONS (Simplified big box)
        const cablePairs = [
            {
                top: new THREE.Vector3(-1, 147.5, relTopZ),
                base: new THREE.Vector3(-18, -14, relGroundAnchorZ1),
            },
            {
                top: new THREE.Vector3(1, 147.5, relTopZ),
                base: new THREE.Vector3(21, -14, relGroundAnchorZ2),
            },
        ];

        const anchorShape = new CANNON.Box(new CANNON.Vec3(12/2, 10/2, 8/2));
        cablePairs.forEach(pair => {
            const basePos = new THREE.Vector3(pair.base.x, pair.base.y + 5, pair.base.z).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
            bridgeBody.addShape(anchorShape, new CANNON.Vec3(basePos.x, basePos.y, basePos.z + pillarBaseZ));
        });

        // GROUND CABLE COLLISIONS
        cablePairs.forEach(pair => {
            const cableDir = new THREE.Vector3().subVectors(pair.base, pair.top);
            const cableLen = cableDir.length();
            const cablePos = new THREE.Vector3().addVectors(pair.top, pair.base).multiplyScalar(0.5);
            const cableQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), cableDir.clone().normalize());

            // Apply pillar rotation
            cablePos.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationY);
            const finalQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationY).multiply(cableQuat);

            const cableShape = new CANNON.Cylinder(0.45, 0.45, cableLen, 8);
            bridgeBody.addShape(cableShape, 
                new CANNON.Vec3(cablePos.x, cablePos.y, cablePos.z + pillarBaseZ),
                new CANNON.Quaternion(finalQuat.x, finalQuat.y, finalQuat.z, finalQuat.w)
            );
        });

        // Visual setup
        const cableGeo = new THREE.CylinderGeometry(0.45, 0.45, 1, 12);
        const cableMat = new THREE.MeshToonMaterial({ color: 0x9f9f9f });
        const anchorBaseMat = new THREE.MeshToonMaterial({ color: 0x787878 });
        const anchorClampMat = new THREE.MeshToonMaterial({ color: 0xb7b7b7 });
        const anchorBoltMat = new THREE.MeshToonMaterial({ color: 0xe2e2e2 });

        for (let i = 0; i < cablePairs.length; i++) {
            const { top, base } = cablePairs[i];
            const cableDir = new THREE.Vector3().subVectors(base, top);
            const cableLen = cableDir.length();
            const cable = new THREE.Mesh(cableGeo, cableMat);
            cable.position.copy(top).add(base).multiplyScalar(0.5);
            cable.scale.y = cableLen;
            cable.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), cableDir.normalize());
            object.add(cable);

            const anchorBase = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 8), anchorBaseMat);
            anchorBase.position.set(base.x, base.y + 2, base.z);
            object.add(anchorBase);

            const clamp = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.5, 5.5), anchorClampMat);
            clamp.position.set(base.x, base.y + 4.7, base.z);
            object.add(clamp);

            const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4, 8), anchorBoltMat);
            bolt.position.set(base.x, base.y + 6, base.z);
            object.add(bolt);

            const nut = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.8, 6), anchorBoltMat);
            nut.position.set(base.x, base.y + 8.2, base.z);
            nut.rotateY(THREE.MathUtils.degToRad(30));
            object.add(nut);
        }

        const stayCableGeo = new THREE.CylinderGeometry(0.22, 0.22, 1, 10);
        const stayCableMat = new THREE.MeshToonMaterial({ color: 0xb0b0b0 });
        const leftStart = new THREE.Vector3(-1, 147.5, relTopZ);
        const rightStart = new THREE.Vector3(1, 147.5, relTopZ);
        const anchorY = 1.1;
        const anchorZStart = relStayAnchorStartZ;
        const anchorZEnd = relStayAnchorEndZ;
        const totalCableSlots = 5;
        const anchorStep = (anchorZEnd - anchorZStart) / (totalCableSlots - 1);

        for (let i = 1; i < totalCableSlots; i++) {
            const anchorZ = anchorZStart + anchorStep * i;
            const leftEnd = new THREE.Vector3(-road_width * 0.52, anchorY, anchorZ);
            const rightEnd = new THREE.Vector3(road_width * 0.52, anchorY, anchorZ);
            const leftDir = new THREE.Vector3().subVectors(leftEnd, leftStart);
            const leftCable = new THREE.Mesh(stayCableGeo, stayCableMat);
            leftCable.position.copy(leftStart).add(leftEnd).multiplyScalar(0.5);
            leftCable.scale.y = leftDir.length();
            leftCable.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), leftDir.normalize());
            object.add(leftCable);
            const rightDir = new THREE.Vector3().subVectors(rightEnd, rightStart);
            const rightCable = new THREE.Mesh(stayCableGeo, stayCableMat);
            rightCable.position.copy(rightStart).add(rightEnd).multiplyScalar(0.5);
            rightCable.scale.y = rightDir.length();
            rightCable.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rightDir.normalize());
            object.add(rightCable);
        }
        return object;
    }

    const cables_front = make_cables(frontPillarBaseZ, 0);
    const cables_back = make_cables(backPillarBaseZ, Math.PI);
    bridge.add(cables_front);
    bridge.add(cables_back);

    const supportPillarHeight = 90;
    const supportPillarGeo = new THREE.CylinderGeometry(7, 9, supportPillarHeight, 14);
    const supportPillarMat = new THREE.MeshToonMaterial({ color: 0xbdbdbd });
    const supportPillarFront = new THREE.Mesh(supportPillarGeo, supportPillarMat);
    supportPillarFront.position.set(0, -supportPillarHeight / 2 -0.01, -bridge_length * 0.25);
    bridge.add(supportPillarFront);
    const supportPillarBack = new THREE.Mesh(supportPillarGeo, supportPillarMat);
    supportPillarBack.position.set(0, -supportPillarHeight / 2 -0.01, -bridge_length * 0.75);
    bridge.add(supportPillarBack);
    
    bridge.position.set(x, y, z);
    bridge.rotateY(direction);
    bridgeBody.position.set(x, y, z);
    bridgeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), direction);
    return [bridge, bridgeBody];
}
import * as THREE from 'three';

export function make_tree(x, y, z, scale) {
    const tree = new THREE.Object3D();

    const logHeight = 20;
    const logGeo = new THREE.CylinderGeometry(0.5, 0.8, logHeight, 8);
    const logMat = new THREE.MeshToonMaterial({ color: 0x47300a , fog: false });
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
            fog: false
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
            fog: false
        });
        const outerLeaves = new THREE.Mesh(outerGeo, outerMat);
        outerLeaves.position.set(0, currLeaves.y, 0);

        tree.add(outerLeaves);
    }

    tree.position.set(x, y, z);
    tree.scale.set(scale, scale, scale);
    return tree;
}

export function make_tree_crowns(x, y, z, scale) {
    const tree = new THREE.Object3D();

    const logMat = new THREE.MeshToonMaterial({ color: 0x47300a , fog: false });

    const logSegments = [
        // Main log
        {
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Vector3(0, 0, 0),
            topRadius: 0.7,
            bottomRadius: 1.2,
            height: 4,
        },
        {
            position: new THREE.Vector3(0, 4, 0),
            rotation: new THREE.Vector3(0.0, 0.0, THREE.MathUtils.degToRad(15)),
            topRadius: 0.55,
            bottomRadius: 0.65,
            height: 3,
        },
        {
            position: new THREE.Vector3(-0.8, 6.7, 0),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(5), 0.0, THREE.MathUtils.degToRad(-15)),
            topRadius: 0.5,
            bottomRadius: 0.55,
            height: 3.5,
        },
        {
            position: new THREE.Vector3(0.1, 10, 0.3),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(-5), 0.0, THREE.MathUtils.degToRad(-6)),
            topRadius: 0.5,
            bottomRadius: 0.5,
            height: 1.2,
        },
        {
            position: new THREE.Vector3(0.2, 11, 0.2),
            rotation: new THREE.Vector3(0.0, 0.0, THREE.MathUtils.degToRad(0)),
            topRadius: 0.4,
            bottomRadius: 0.5,
            height: 1.6,
        },
        {
            position: new THREE.Vector3(0.15, 12.5, 0.2),
            rotation: new THREE.Vector3(0.0, 0.0, THREE.MathUtils.degToRad(-2)),
            topRadius: 0.3,
            bottomRadius: 0.4,
            height: 4,
        },


        // Branch 1
        {
            position: new THREE.Vector3(0, 11.6, 0),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(8), 0.0, THREE.MathUtils.degToRad(-70)),
            topRadius: 0.3,
            bottomRadius: 0.3,
            height: 3,
        },
        {
            position: new THREE.Vector3(2.7, 12.5, 0),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(0), 0.0, THREE.MathUtils.degToRad(-37)),
            topRadius: 0.26,
            bottomRadius: 0.3,
            height: 1.5,
        },


        // Branch 2
        {
            position: new THREE.Vector3(0, 13, 0),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(60), 0.0, 0.0),
            topRadius: 0.25,
            bottomRadius: 0.3,
            height: 2,
        },
        {
            position: new THREE.Vector3(0, 13.9, 1.7),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(20), 0.0, 0.0),
            topRadius: 0.2,
            bottomRadius: 0.25,
            height: 2,
        },


        // Branch 3
        {
            position: new THREE.Vector3(0, 14.1, 0),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(-60), 0.0, 0.0),
            topRadius: 0.25,
            bottomRadius: 0.3,
            height: 2,
        },
        {
            position: new THREE.Vector3(0, 15, -1.7),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(-20), 0.0, 0.0),
            topRadius: 0.2,
            bottomRadius: 0.25,
            height: 1.4,
        },
    ];

    for (let i = 0; i < logSegments.length; i++) {
        const segment = logSegments[i];
        const pivot = new THREE.Object3D();
        pivot.position.copy(segment.position);
        pivot.rotation.set(segment.rotation.x, segment.rotation.y, segment.rotation.z);

        // Cylinder origin is centered, so moving it by height/2 places its base on the pivot.
        const log = new THREE.Mesh(
            new THREE.CylinderGeometry(segment.topRadius, segment.bottomRadius, segment.height, 10),
            logMat
        );
        log.position.set(0, segment.height / 2, 0);
        pivot.add(log);
        tree.add(pivot);
    }

    const crownLayers = [
        // Bottom-wide base layer — anchors the whole canopy low and wide
        {
            position: new THREE.Vector3(0.0, 11.5, 0.0),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(5), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0)),
            radius: 6.5,
            color: 0x2d8a14,
        },
        // Left lobe
        {
            position: new THREE.Vector3(-5.0, 12.0, 0.5),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(-9), THREE.MathUtils.degToRad(30), THREE.MathUtils.degToRad(14)),
            radius: 5.2,
            color: 0x3aa31e,
        },
        // Right lobe
        {
            position: new THREE.Vector3(5.2, 12.0, -0.5),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(-8), THREE.MathUtils.degToRad(-32), THREE.MathUtils.degToRad(-27)),
            radius: 5.0,
            color: 0x34951b,
        },
        // Front lobe
        {
            position: new THREE.Vector3(0.5, 12.8, 4.8),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(17), THREE.MathUtils.degToRad(20), THREE.MathUtils.degToRad(7)),
            radius: 4.8,
            color: 0x3fa826,
        },
        // Back lobe
        {
            position: new THREE.Vector3(-0.5, 12.5, -4.8),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(-15), THREE.MathUtils.degToRad(-20), THREE.MathUtils.degToRad(-8)),
            radius: 4.7,
            color: 0x2e9016,
        },
        // Mid-left upper
        {
            position: new THREE.Vector3(-3.5, 14.5, 1.5),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(20), THREE.MathUtils.degToRad(40), THREE.MathUtils.degToRad(-15)),
            radius: 4.4,
            color: 0x48b52c,
        },
        // Mid-right upper
        {
            position: new THREE.Vector3(3.8, 14.5, -1.0),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(-18), THREE.MathUtils.degToRad(-35), THREE.MathUtils.degToRad(14)),
            radius: 4.3,
            color: 0x46ad2a,
        },
        // Center upper
        {
            position: new THREE.Vector3(0.5, 15.5, 0.5),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(10), THREE.MathUtils.degToRad(15), THREE.MathUtils.degToRad(5)),
            radius: 4.8,
            color: 0x3aa31e,
        },
        // Top cap
        {
            position: new THREE.Vector3(0.2, 17.5, 0.2),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(5), THREE.MathUtils.degToRad(10), THREE.MathUtils.degToRad(-5)),
            radius: 3.8,
            color: 0x52c233,
        },
        // Extra front-left fill
        {
            position: new THREE.Vector3(-2.5, 13.5, 3.5),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(12), THREE.MathUtils.degToRad(25), THREE.MathUtils.degToRad(-10)),
            radius: 4.0,
            color: 0x339719,
        },
        // Extra back-right fill
        {
            position: new THREE.Vector3(2.5, 13.5, -3.5),
            rotation: new THREE.Vector3(THREE.MathUtils.degToRad(-12), THREE.MathUtils.degToRad(-22), THREE.MathUtils.degToRad(10)),
            radius: 3.9,
            color: 0x3fa826,
        },
    ];

    for (let i = 0; i < crownLayers.length; i++) {
        const layer = crownLayers[i];
        const crownMat = new THREE.MeshToonMaterial({
            color: layer.color,
            side: THREE.DoubleSide,
            fog: false
        });
        const crown = new THREE.Mesh(
            new THREE.SphereGeometry(layer.radius, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2),
            crownMat
        );
        crown.position.copy(layer.position);
        crown.rotation.set(layer.rotation.x, layer.rotation.y, layer.rotation.z);
        tree.add(crown);
    }

    tree.position.set(x, y, z);
    tree.scale.set(scale, scale, scale);
    return tree;
}
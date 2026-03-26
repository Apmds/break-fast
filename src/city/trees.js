import * as THREE from 'three';

export function make_tree(x, y, z, scale) {
    const tree = new THREE.Object3D();

    const logHeight = 20;
    const logGeo = new THREE.CylinderGeometry(0.5, 0.8, logHeight, 8);
    const logMat = new THREE.MeshToonMaterial({ color: 0x47300a });
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

export function make_tree_crowns(x, y, z, scale) {
    const tree = new THREE.Object3D();

    const logMat = new THREE.MeshToonMaterial({ color: 0x47300a });

    const logSegments = [
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

    //const crownLeafMat = new THREE.MeshToonMaterial({ color: 0x3caf1d });
    //const crownLeaf = new THREE.Mesh(new THREE.SphereGeometry(4.7, 10, 8), crownLeafMat);
    //crownLeaf.position.set(0, 18.5, 0);
    //tree.add(crownLeaf);

    tree.position.set(x, y, z);
    tree.scale.set(scale, scale, scale);
    return tree;
}
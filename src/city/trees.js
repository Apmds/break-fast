import * as THREE from 'three';

export function make_tree(x, y, z, scale) {
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


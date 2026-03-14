import * as THREE from 'three';

function make_city() {
    const city = new THREE.Object3D();
    city.add(make_tree(0, 0, 0));

    return city
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

export default make_city;
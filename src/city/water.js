import * as THREE from 'three';

export function make_river(x, y, z) {
    const group = new THREE.Object3D();

    const water = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 40, 1800),
        new THREE.MeshToonMaterial({ color: 0x2ea7d3, fog: false, transparent: true, opacity: 0.6 })
    );
    water.name = "river";

    const bedrock = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 10, 1800),
        new THREE.MeshToonMaterial({ color: 0x2ea7d3, fog: false })
    );
    bedrock.position.y = -20;

    group.add(water);
    group.add(bedrock);
    group.position.set(x, y, z);
    return group;
}

export function make_lake(width, depth) {
    const group = new THREE.Object3D();

    const water = new THREE.Mesh(
        new THREE.BoxGeometry(width, 1.5, depth),
        new THREE.MeshToonMaterial({ color: 0x2ea7d3, transparent: true, opacity: 0.7 })
    );
    water.name = "lake";
    water.position.y = 0.75;

    const bed = new THREE.Mesh(
        new THREE.BoxGeometry(width, 3, depth),
        new THREE.MeshToonMaterial({ color: 0x1a6e8a })
    );
    bed.position.y = -0.75;

    group.add(water);
    group.add(bed);
    return group;
}

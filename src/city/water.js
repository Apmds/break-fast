import * as THREE from 'three';

const WATER_COLOR = 0x2ea7d3;
const WATERBED_COLOR = 0x1a6e8a;

export function make_river(x, y, z) {
    const group = new THREE.Object3D();

    const water = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 40, 1800),
        new THREE.MeshToonMaterial({ color: WATER_COLOR, fog: false, transparent: true, opacity: 0.6 })
    );
    water.name = "river";

    const bedrock = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 10, 1800),
        new THREE.MeshToonMaterial({ color: WATER_COLOR, fog: false })
    );
    bedrock.position.y = -20;

    group.add(water);
    group.add(bedrock);
    group.position.set(x, y, z);
    return group;
}

export function make_lake(width, depth, height) {
    const group = new THREE.Object3D();

    const water = new THREE.Mesh(
        new THREE.BoxGeometry(width, height*0.75, depth),
        new THREE.MeshToonMaterial({ color: WATER_COLOR, transparent: true, opacity: 0.7 })
    );
    water.name = "lake";
    water.position.set(0, height*0.75 / 2 + height/4, 0);

    const bed = new THREE.Mesh(
        new THREE.BoxGeometry(width, height*0.25, depth),
        new THREE.MeshToonMaterial({ color: WATERBED_COLOR })
    );
    bed.position.set(0, -height*0.25 / 2 + height/4, 0);

    group.add(water);
    group.add(bed);
    return group;
}

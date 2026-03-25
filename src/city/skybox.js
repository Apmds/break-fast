
import * as THREE from 'three';

function make_skybox() {
    const geometry = new THREE.BoxGeometry(5000,5000,5000);
    var materials = [
         new THREE.MeshBasicMaterial({
              map : new THREE.TextureLoader().load('../assets/skybox/px.png'),
              side : THREE.BackSide,
         }),
         new THREE.MeshBasicMaterial({
              map : new THREE.TextureLoader().load('../assets/skybox/nx.png'),
              side : THREE.BackSide,
         }),
         new THREE.MeshBasicMaterial({
              map : new THREE.TextureLoader().load('../assets/skybox/py.png'),
              side : THREE.BackSide,
         }),
         new THREE.MeshBasicMaterial({
              map : new THREE.TextureLoader().load('../assets/skybox/ny.png'),
              side : THREE.BackSide,
         }),
         new THREE.MeshBasicMaterial({
              map : new THREE.TextureLoader().load('../assets/skybox/pz.png'),
              side : THREE.BackSide,
         }),
         new THREE.MeshBasicMaterial({
              map : new THREE.TextureLoader().load('../assets/skybox/nz.png'),
              side : THREE.BackSide,
         }),
    ];
    const skybox = new THREE.Mesh(geometry,materials);

    return skybox
}

export default make_skybox;


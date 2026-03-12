import * as THREE from 'three';

function init() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 400);
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    


    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

window.onload = init
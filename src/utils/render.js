import * as THREE from 'three';

class Renderer {
    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
    }

    addToDom() {
        document.body.appendChild(this.renderer.domElement);
    }

    update() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    render(scene, camera) {
        this.renderer.render(scene, camera);
    }
}

export default Renderer;
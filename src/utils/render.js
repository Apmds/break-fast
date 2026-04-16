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

        this.outlineScale = 1.0;
        this.outlineHelpers = new Map();
        this.outlineMaterial = new THREE.ShaderMaterial({
            uniforms: {
            outlineColor: { value: new THREE.Color(0xffffff) }, // Your outline color
            thickness: { value: 0.1 } // The consistent thickness you want
        },
        vertexShader: `
            uniform float thickness;
            void main() {
                // Push the vertex outward along its normal
                vec3 pos = position + normal * thickness;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 outlineColor;
            void main() {
                gl_FragColor = vec4(outlineColor, 1.0);
            }
        `,
        side: THREE.BackSide, // This is crucial to make it an "inverted hull"
        })
        // this.outlineMaterial = new THREE.MeshBasicMaterial({
        //     color: 0xffffff,
        //     side: THREE.BackSide,
        //     toneMapped: false,
        //     fog: false,
        //     depthWrite: false,
        //     transparent: true,
        //     opacity: 1.0,
        // });
    }

    ensureOutlineHelper(sourceMesh) {
        let helper = this.outlineHelpers.get(sourceMesh.uuid);
        if (helper) {
            return helper;
        }

        helper = new THREE.Mesh(sourceMesh.geometry, this.outlineMaterial);
        helper.name = `${sourceMesh.name || 'mesh'}_outline`;
        helper.userData.isOutlineHelper = true;
        helper.userData.sourceUUID = sourceMesh.uuid;
        helper.castShadow = false;
        helper.receiveShadow = false;
        helper.raycast = () => null;
        helper.renderOrder = 999;
        helper.scale.setScalar(this.outlineScale);

        sourceMesh.add(helper);
        this.outlineHelpers.set(sourceMesh.uuid, helper);
        return helper;
    }

    syncOutlineHelpers(scene) {
        const activeMeshIds = new Set();

        scene.traverse((node) => {
            if (node.userData?.outline !== true || node.userData?.isOutlineHelper === true) {
                return;
            }

            node.traverse((child) => {
                if (!child.isMesh || child.userData?.isOutlineHelper === true) {
                    return;
                }

                activeMeshIds.add(child.uuid);
                const helper = this.ensureOutlineHelper(child);
                helper.visible = true;
            });
        });

        this.outlineHelpers.forEach((helper, sourceId) => {
            if (!helper.parent) {
                this.outlineHelpers.delete(sourceId);
                return;
            }

            helper.visible = activeMeshIds.has(sourceId);
        });
    }

    addToDom() {
        document.body.appendChild(this.renderer.domElement);
    }

    removeFromDom() {
        document.body.removeChild(this.renderer.domElement);
    }

    update() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    get domElement() {
        return this.renderer.domElement;
    }

    render(scene, camera) {
        this.syncOutlineHelpers(scene);
        this.renderer.render(scene, camera);
    }
}

export default Renderer;
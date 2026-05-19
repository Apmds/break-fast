import * as THREE from 'three';

const objects = [
    {
        "id": "house",
        "path": "../assets/models/Buildings/house.glb",
        "type": "gltf",
        "material_map": null,/*{
            "Ceiling": new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.5 , fog: false }),
            "Walls": new THREE.MeshStandardMaterial({ color: 0xebcbb0, roughness: 0.7 , fog: false }),
            "Garage Door": new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8, metalness: 0.3 , fog: false }),
            "Window": new THREE.MeshStandardMaterial({ color: 0x87ceeb, roughness: 0.1, metalness: 0.5 , fog: false }),
            "Door": new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.6 , fog: false }),
            "Window Ceiling": new THREE.MeshStandardMaterial({ color: 0x87ceeb, roughness: 0.1, metalness: 0.5 , fog: false }),
            "Cover": new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.8 , fog: false }),
            "Cover Pillars": new THREE.MeshStandardMaterial({ color: 0xdaa520, roughness: 0.6 , fog: false })
        }*/
    },

    {
        "id": "city_hall",
        "path": "../assets/models/Buildings/city_hall.glb",
        "type": "gltf",
        "material_map": null,
    },

    {
        "id": "dcmonalds",
        "path": "../assets/models/Buildings/dcmonalds.glb",
        "type": "gltf",
        "material_map": null,
    },

    {
        "id": "car",
        "path": "../assets/models/Cars/car.glb",
        "type": "gltf",
        "material_map": null,
    },

    {
        "id": "citizen",
        "path": "../assets/models/People/citizen.glb",
        "type": "gltf",
        "material_map": null,
    },

    {
        "id": "straw_hat",
        "path": "../assets/models/Objects/straw_hat.glb",
        "type": "gltf",
        "material_map": null,
    },

    {
        "id": "parasol",
        "path": "../assets/models/Objects/parasol.glb",
        "type": "gltf",
        "material_map": null,
    },

    {
        "id": "sunglasses",
        "path": "../assets/models/Objects/sunglasses.glb",
        "type": "gltf",
        "material_map": null,
    },

    // Skybox textures
    {
        "id": "skybox_px",
        "path": "../assets/skybox/px.png",
        "type": "texture",
    },
    {
        "id": "skybox_nx",
        "path": "../assets/skybox/nx.png",
        "type": "texture",
    },

    {
        "id": "skybox_py",
        "path": "../assets/skybox/py.png",
        "type": "texture",
    },
    {
        "id": "skybox_ny",
        "path": "../assets/skybox/ny.png",
        "type": "texture",
    },

    {
        "id": "skybox_pz",
        "path": "../assets/skybox/pz.png",
        "type": "texture",
    },
    {
        "id": "skybox_nz",
        "path": "../assets/skybox/nz.png",
        "type": "texture",
    },

    // Tone textures for MeshToonMaterial
    {
        "id": "three_tone",
        "path": "../assets/textures/threeTone.jpg",
        "type": "texture",
        "minFilter": "nearest",
        "magFilter": "nearest",
    },

    {
        "id": "five_tone",
        "path": "../assets/textures/fiveTone.jpg",
        "type": "texture",
        "minFilter": "nearest",
        "magFilter": "nearest",
    },

    // Ground textures
    {
        "id": "pavement_ao",
        "path": "../assets/textures/pavement/PavingStones145_1K-JPG_AmbientOcclusion.jpg",
        "type": "texture",
    },
    {
        "id": "pavement_roughness",
        "path": "../assets/textures/pavement/PavingStones145_1K-JPG_Roughness.jpg",
        "type": "texture",
    },
    {
        "id": "pavement_normal",
        "path": "../assets/textures/pavement/PavingStones145_1K-JPG_NormalGL.jpg",
        "type": "texture",
    },
    {
        "id": "pavement_displacement",
        "path": "../assets/textures/pavement/PavingStones145_1K-JPG_Displacement.jpg",
        "type": "texture",
    },

    // Citizen grunt
    {
        "id": "grunt1",
        "path": "../assets/sounds/grunt1.mp3",
        "type": "mp3",
    },
    {
        "id": "grunt2",
        "path": "../assets/sounds/grunt2.mp3",
        "type": "mp3",
    },
    {
        "id": "grunt3",
        "path": "../assets/sounds/grunt3.mp3",
        "type": "mp3",
    },
    {
        "id": "grunt4",
        "path": "../assets/sounds/grunt4.mp3",
        "type": "mp3",
    },


    // Shaders
    {
        "id": "outline_vert_shader",
        "path": "../assets/shaders/outline/outline.vert",
        "type": "shader",
    },
    {
        "id": "outline_frag_shader",
        "path": "../assets/shaders/outline/outline.frag",
        "type": "shader",
    }
];

export default objects;
<template>
    <div ref="container" class="three-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';

const props = defineProps({
    imageUrl: String,
    hotspots: Array
});

const emit = defineEmits(['hotspot-click']);

const container = ref(null);
let scene, camera, renderer, sphere;
let isUserInteracting = false;
let onPointerDownMouseX = 0, onPointerDownMouseY = 0;
let lon = 0, onPointerDownLon = 0;
let lat = 0, onPointerDownLat = 0;
let phi = 0, theta = 0;

const init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.TextureLoader().load(props.imageUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    
    const material = new THREE.MeshBasicMaterial({ map: texture });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add Hotspots
    props.hotspots?.forEach(h => addHotspot(h));

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.value.appendChild(renderer.domElement);

    container.value.addEventListener('pointerdown', onPointerDown);
    container.value.addEventListener('wheel', onDocumentMouseWheel);
    window.addEventListener('resize', onWindowResize);

    animate();
};

const addHotspot = (data) => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e30513';
    ctx.beginPath();
    ctx.arc(32, 32, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.stroke();

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    
    const radius = 450;
    sprite.position.x = radius * Math.cos(data.phi) * Math.sin(data.theta);
    sprite.position.y = radius * Math.sin(data.phi);
    sprite.position.z = radius * Math.cos(data.phi) * Math.cos(data.theta);
    
    sprite.scale.set(30, 30, 1);
    sprite.userData = { isHotspot: true, data: data };
    scene.add(sprite);
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onPointerDown = (event) => {
    if (event.isPrimary === false) return;
    
    // Raycasting for hotspots
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    const clickedHotspot = intersects.find(i => i.object.userData.isHotspot);
    if (clickedHotspot) {
        emit('hotspot-click', clickedHotspot.object.userData.data);
        return;
    }

    isUserInteracting = true;
    onPointerDownMouseX = event.clientX;
    onPointerDownMouseY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat;
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
};

const onPointerMove = (event) => {
    if (event.isPrimary === false) return;
    lon = (onPointerDownMouseX - event.clientX) * 0.1 + onPointerDownLon;
    lat = (event.clientY - onPointerDownMouseY) * 0.1 + onPointerDownLat;
};

const onPointerUp = () => {
    isUserInteracting = false;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
};

const onDocumentMouseWheel = (event) => {
    const fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
};

const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

const animate = () => {
    requestAnimationFrame(animate);
    update();
};

const update = () => {
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    const x = 500 * Math.sin(phi) * Math.cos(theta);
    const y = 500 * Math.cos(phi);
    const z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(x, y, z);
    renderer.render(scene, camera);
};

onMounted(init);

onBeforeUnmount(() => {
    if (renderer) {
        renderer.dispose();
        container.value.removeChild(renderer.domElement);
    }
    window.removeEventListener('resize', onWindowResize);
});

// Watch for image changes
watch(() => props.imageUrl, (newUrl) => {
    if (sphere) {
        const texture = new THREE.TextureLoader().load(newUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        sphere.material.map = texture;
        sphere.material.needsUpdate = true;
    }
});
</script>

<style scoped>
.three-container {
    width: 100%;
    height: 100%;
    cursor: grab;
}

.three-container:active {
    cursor: grabbing;
}
</style>

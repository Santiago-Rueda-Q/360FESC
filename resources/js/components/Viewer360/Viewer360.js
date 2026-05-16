import { ref, onMounted, onBeforeUnmount, watch, reactive } from 'vue';
import * as THREE from 'three';
import { createHotspotSprite, animateHotspots } from './hotspots';
import { setupControls } from './controls';

export default {
    name: 'Viewer360',
    props: {
        imageUrl: String,
        hotspots: Array,
        previewHotspot: Object,
        editMode: { type: Boolean, default: false }
    },
    emits: ['hotspot-click', 'add-hotspot'],
    setup(props, { emit }) {
        const container = ref(null);
        
        let scene, camera, renderer, sphere;
        const hotspotsGroup = new THREE.Group();
        let previewSprite = null;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const viewState = reactive({
            lon: 0, lat: 0,
            phi: 0, theta: 0,
            onPointerDownMouseX: 0, onPointerDownMouseY: 0,
            onPointerDownLon: 0, onPointerDownLat: 0,
            isUserInteracting: false
        });

        const bridge = {
            state: viewState,
            camera: null,
            sphere: null,
            hotspotsGroup,
            raycaster,
            mouse,
            props,
            emit
        };

        let controls;

        const init = () => {
            scene = new THREE.Scene();
            scene.add(hotspotsGroup);

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
            bridge.camera = camera;
            
            const geometry = new THREE.SphereGeometry(500, 60, 40);
            geometry.scale(-1, 1, 1);

            const texture = new THREE.TextureLoader().load(props.imageUrl);
            texture.colorSpace = THREE.SRGBColorSpace;
            
            const material = new THREE.MeshBasicMaterial({ map: texture });
            sphere = new THREE.Mesh(geometry, material);
            bridge.sphere = sphere;
            scene.add(sphere);

            renderHotspots();
            updatePreview();

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            
            if (container.value) {
                container.value.appendChild(renderer.domElement);
                controls = setupControls(bridge); 
                container.value.addEventListener('pointerdown', controls.onPointerDown);
                container.value.addEventListener('wheel', controls.onDocumentMouseWheel);
            }
            
            window.addEventListener('resize', onWindowResize);
            animate();
        };

        const renderHotspots = () => {
            while(hotspotsGroup.children.length > 0) hotspotsGroup.remove(hotspotsGroup.children[0]);
            props.hotspots?.forEach(h => hotspotsGroup.add(createHotspotSprite(h)));
        };

        const updatePreview = () => {
            if (previewSprite) scene.remove(previewSprite);
            if (props.previewHotspot) {
                previewSprite = createHotspotSprite(props.previewHotspot, true);
                scene.add(previewSprite);
            }
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
            viewState.lat = Math.max(-85, Math.min(85, viewState.lat));
            viewState.phi = THREE.MathUtils.degToRad(90 - viewState.lat);
            viewState.theta = THREE.MathUtils.degToRad(viewState.lon);

            const x = 500 * Math.sin(viewState.phi) * Math.cos(viewState.theta);
            const y = 500 * Math.cos(viewState.phi);
            const z = 500 * Math.sin(viewState.phi) * Math.sin(viewState.theta);

            camera.lookAt(x, y, z);
            
            const time = Date.now() * 0.003;
            animateHotspots(hotspotsGroup, previewSprite, time);

            renderer.render(scene, camera);
        };

        onMounted(init);

        onBeforeUnmount(() => {
            if (renderer) {
                renderer.dispose();
                if (container.value) container.value.removeChild(renderer.domElement);
            }
            window.removeEventListener('resize', onWindowResize);
        });

        watch(() => props.imageUrl, (url) => {
            if (sphere) {
                const texture = new THREE.TextureLoader().load(url);
                texture.colorSpace = THREE.SRGBColorSpace;
                sphere.material.map = texture;
                sphere.material.needsUpdate = true;
            }
        });

        watch(() => props.hotspots, renderHotspots, { deep: true, immediate: true });
        watch(() => props.previewHotspot, updatePreview, { deep: true });

        return { container };
    }
};

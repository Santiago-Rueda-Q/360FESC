<template>
    <div class="recorrido-wrapper">
        <nav class="overlay-nav glass">
            <button class="btn-back" @click="$emit('back')">
                <span v-html="Icons.ArrowRight" style="transform: rotate(180deg); display: inline-block;"></span>
                {{ $t('back') }}
            </button>
            <div class="current-location">
                <h2>{{ campusName }}</h2>
            </div>
        </nav>

        <div class="viewer-container">
            <Viewer360 
                v-if="espacio"
                :image-url="espacio.imagen_360"
                :hotspots="espacio.hotspots"
                @hotspot-click="onHotspotClick"
            />
            <div v-else class="loading-state flex-center">
                <div class="spinner"></div>
                <p>{{ $t('loading') }}</p>
            </div>
        </div>

        <!-- Hotspot Info Panel -->
        <Transition name="slide-up">
            <div v-if="selectedHotspot" class="info-panel glass">
                <button class="close-btn" @click="selectedHotspot = null">&times;</button>
                <h3>{{ selectedHotspot.titulo }}</h3>
                <p>{{ selectedHotspot.descripcion }}</p>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Icons } from '../utils/icons';
import Viewer360 from '../components/Viewer360.vue';

const props = defineProps(['slug']);
defineEmits(['back']);

const espacio = ref(null);
const selectedHotspot = ref(null);

const campusName = computed(() => {
    return props.slug === 'cucuta' ? 'Sede Principal Cúcuta' : 'Sede Ocaña';
});

const fetchEspacio = async () => {
    // Placeholder for API call
    // setTimeout simulates API delay
    setTimeout(() => {
        espacio.value = {
            nombre: campusName.value,
            imagen_360: 'https://threejs.org/examples/textures/2294472375_b9a84c113b_o.jpg', // Sample 360 texture
            hotspots: [
                { id: 1, titulo: 'Biblioteca', descripcion: 'Espacio de estudio y consulta.', theta: 0, phi: 0 },
                { id: 2, titulo: 'Cafetería', descripcion: 'Zona de descanso y alimentación.', theta: 1.5, phi: 0.5 }
            ]
        };
    }, 1500);
};

const onHotspotClick = (hotspot) => {
    selectedHotspot.value = hotspot;
};

onMounted(fetchEspacio);
</script>

<style scoped>
.recorrido-wrapper {
    position: relative;
    width: 100%;
    height: 100vh;
    background: #000;
    overflow: hidden;
}

.overlay-nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.btn-back {
    background: none;
    border: none;
    color: white;
    font-family: var(--font-secondary);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1rem;
}

.current-location h2 {
    color: white;
    font-size: 1.2rem;
}

.viewer-container {
    width: 100%;
    height: 100%;
}

.loading-state {
    flex-direction: column;
    height: 100%;
    color: white;
    gap: 1rem;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(227, 5, 19, 0.3);
    border-top: 4px solid var(--fesc-red);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.info-panel {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 500px;
    padding: 2rem;
    border-radius: 20px;
    color: var(--fesc-gray);
    z-index: 200;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.slide-up-enter-active, .slide-up-leave-active {
    transition: all 0.5s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
    transform: translate(-50%, 100%);
    opacity: 0;
}

:deep(svg) {
    width: 20px;
    height: 20px;
    stroke: currentColor;
}
</style>

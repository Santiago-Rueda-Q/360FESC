<template>
    <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
    points: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['marker-click']);
const mapContainer = ref(null);
let map;

onMounted(() => {
    map = L.map(mapContainer.value).setView([7.8939, -72.5078], 13); // Default Cúcuta

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    props.points.forEach(point => {
        const marker = L.marker([point.lat, point.lng]).addTo(map);
        marker.bindPopup(`<b>${point.nombre}</b><br>${point.descripcion}`);
        marker.on('click', () => {
            emit('marker-click', point);
        });
    });
});

onBeforeUnmount(() => {
    if (map) {
        map.remove();
    }
});
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    z-index: 1;
}

:deep(.leaflet-popup-content-wrapper) {
    border-radius: 10px;
    font-family: var(--font-secondary);
}

:deep(.leaflet-popup-tip) {
    background: white;
}
</style>

import { ref, onMounted, computed } from 'vue';
import { Icons } from '../utils/icons';
import Viewer360 from '../components/Viewer360.vue';

const props = defineProps(['slug']);
const emits = defineEmits(['back']);

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

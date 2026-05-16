import { ref, onMounted, computed, watch } from 'vue';
import { Icons } from '../utils/icons';
import Viewer360 from '../components/Viewer360/index.vue';
import TourSidebar from '../components/TourSidebar/index.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    name: 'Recorrido',
    components: { Viewer360, TourSidebar },
    props: ['slug'],
    setup(props) {
        const router = useRouter();
        const espacio = ref(null);
        const selectedHotspot = ref(null);
        const showMap = ref(false);

        const locations = ref([]);

        const campusName = computed(() => {
            return espacio.value?.campus === 'ocana' ? 'Sede Ocaña' : 'Sede Cúcuta';
        });

        const fetchEspacio = async () => {
            try {
                const response = await axios.get(`/api/espacios/${props.slug}`);
                espacio.value = response.data;
                
                // Fetch all spaces for the sidebar accordion
                const allSpacesRes = await axios.get('/api/espacios');
                locations.value = allSpacesRes.data.map(s => ({
                    name: s.nombre,
                    slug: s.slug,
                    campus: s.campus
                }));
            } catch (error) {
                console.error("Error cargando espacio:", error);
                if(error.response?.status === 404) {
                    alert('Recorrido no encontrado');
                    router.push('/');
                }
            }
        };

        // Escuchar cambios en la URL
        watch(() => props.slug, () => {
            fetchEspacio();
        });

        const onHotspotClick = (hotspot) => {
            // Si el hotspot tiene una zona vinculada (target_espacio), navegamos a ella
            if (hotspot.target_espacio && hotspot.target_espacio.slug) {
                console.log("Navegando a:", hotspot.target_espacio.slug);
                handleNavigate(hotspot.target_espacio.slug);
            } else {
                // Si no, mostramos el panel de información habitual
                selectedHotspot.value = hotspot;
            }
        };

        const handleNavigate = (slug) => {
            router.push(`/recorrido/${slug}`);
        };

        const goHome = () => {
            router.push('/');
        };

        const showLocation = () => {
            const maps = {
                cucuta: 'https://maps.app.goo.gl/Cnb49u6dAV5PvWD16',
                ocana: 'https://maps.app.goo.gl/xzHUgKpXjzBFro9'
            };
            window.open(maps[props.slug] || maps.cucuta, '_blank');
        };

        onMounted(fetchEspacio);

        return {
            espacio,
            selectedHotspot,
            showMap,
            locations,
            campusName,
            onHotspotClick,
            handleNavigate,
            goHome,
            showLocation,
            Icons
        };
    }
};

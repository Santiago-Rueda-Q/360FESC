import { ref, onMounted, computed } from 'vue';
import { Icons } from '../utils/icons';
import Viewer360 from '../components/Viewer360.vue';
import TourSidebar from '../components/TourSidebar.vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Recorrido',
    components: { Viewer360, TourSidebar },
    props: ['slug'],
    setup(props) {
        const router = useRouter();
        const espacio = ref(null);
        const selectedHotspot = ref(null);
        const showMap = ref(false);

        const locations = [
            { name: 'Sede Cúcuta', slug: 'cucuta' },
            { name: 'Sede Ocaña', slug: 'ocana' },
            { name: 'Biblioteca', slug: 'biblioteca' },
        ];

        const campusName = computed(() => {
            const loc = locations.find(l => l.slug === props.slug);
            return loc ? loc.name : props.slug;
        });

        const fetchEspacio = async () => {
            setTimeout(() => {
                espacio.value = {
                    nombre: campusName.value,
                    imagen_360: 'https://threejs.org/examples/textures/2294472375_b9a84c113b_o.jpg',
                    hotspots: [
                        { id: 1, titulo: 'Biblioteca', descripcion: 'Espacio de estudio y consulta.', theta: 0, phi: 0 },
                        { id: 2, titulo: 'Cafetería', descripcion: 'Zona de descanso y alimentación.', theta: 1.5, phi: 0.5 }
                    ]
                };
            }, 1000);
        };

        const onHotspotClick = (hotspot) => {
            selectedHotspot.value = hotspot;
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

import { ref, computed } from 'vue';
import { Icons } from '../../utils/icons';

export default {
    name: 'TourSidebar',
    props: {
        locations: Array, // All spaces for both sedes
        currentLocation: String
    },
    emits: ['navigate', 'go-home', 'show-info', 'show-location', 'show-gallery'],
    setup(props) {
        const isCollapsed = ref(false);
        const activeSede = ref('cucuta'); // Default open

        const cucutaLocations = computed(() => {
            return props.locations?.filter(l => l.campus === 'cucuta') || [];
        });

        const ocanaLocations = computed(() => {
            return props.locations?.filter(l => l.campus === 'ocana') || [];
        });

        return {
            isCollapsed,
            activeSede,
            cucutaLocations,
            ocanaLocations,
            Icons
        };
    }
};

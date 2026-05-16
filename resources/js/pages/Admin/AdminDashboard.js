import { ref, onMounted, computed } from 'vue';
import { Icons } from '../../utils/icons';
import axios from 'axios';
import { useRouter } from 'vue-router';
import ZoneFormModal from '../../components/Admin/ZoneFormModal.vue';
import HotspotEditorModal from '../../components/Admin/HotspotEditorModal.vue';

export default {
    name: 'AdminDashboard',
    components: {
        ZoneFormModal,
        HotspotEditorModal
    },
    setup() {
        const router = useRouter();
        const currentCampus = ref('cucuta');
        const showUserMenu = ref(false);
        const theme = ref(localStorage.getItem('admin-theme') || 'dark');
        const espacios = ref([]);
        
        // Modals & Editors
        const showZoneModal = ref(false);
        const editingHotspots = ref(false);
        const currentZone = ref(null);
        const zoneToDelete = ref(null);
        
        // Form Data
        const zoneForm = ref({
            id: null,
            nombre: '',
            slug: '',
            descripcion: '',
            imagen_360: '',
            campus: 'cucuta'
        });

        const fixedCampuses = [
            { name: 'Cúcuta', slug: 'cucuta' },
            { name: 'Ocaña', slug: 'ocana' }
        ];

        const currentCampusName = computed(() => {
            return fixedCampuses.find(c => c.slug === currentCampus.value)?.name;
        });

        const zones = computed(() => {
            return espacios.value.filter(e => e.campus === currentCampus.value);
        });

        const fetchEspacios = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/admin/espacios', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                espacios.value = response.data;
                
                // Actualizar currentZone si estamos editando hotspots, para que los nuevos puntos tengan su ID real.
                if (editingHotspots.value && currentZone.value) {
                    const updatedZone = response.data.find(z => z.id === currentZone.value.id);
                    if (updatedZone) {
                        currentZone.value = updatedZone;
                    }
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    router.push('/');
                }
                // Mock data
                espacios.value = [
                    { id: 1, nombre: 'Entrada Principal', campus: 'cucuta', imagen_360: 'https://threejs.org/examples/textures/2294472375_b9a84c113b_o.jpg', hotspots: [] },
                    { id: 2, nombre: 'Biblioteca', campus: 'cucuta', imagen_360: 'https://threejs.org/examples/textures/2294472375_b9a84c113b_o.jpg', hotspots: [] }
                ];
            }
        };

        const toggleTheme = () => {
            theme.value = theme.value === 'dark' ? 'light' : 'dark';
            localStorage.setItem('admin-theme', theme.value);
        };

        const openZoneModal = (zona = null) => {
            if (zona) {
                zoneForm.value = { ...zona };
            } else {
                zoneForm.value = { id: null, nombre: '', slug: '', descripcion: '', imagen_360: '', campus: currentCampus.value };
            }
            showZoneModal.value = true;
        };

        const saveZone = async (formData) => {
            try {
                const token = localStorage.getItem('auth_token');
                if (formData.id) {
                    await axios.put(`/api/admin/espacios/${formData.id}`, formData, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } else {
                    await axios.post('/api/admin/espacios', formData, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
                showZoneModal.value = false;
                fetchEspacios();
            } catch (error) {
                alert('Error al guardar zona');
            }
        };

        const deleteZone = (zona) => {
            zoneToDelete.value = zona;
        };

        const executeDeleteZone = async () => {
            if (!zoneToDelete.value) return;
            const id = zoneToDelete.value.id;
            try {
                const token = localStorage.getItem('auth_token');
                await axios.delete(`/api/admin/espacios/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                zoneToDelete.value = null;
                fetchEspacios();
            } catch (error) {
                console.error(error);
                alert('Error al eliminar zona');
            }
        };

        const logout = () => {
            localStorage.removeItem('auth_token');
            router.push('/');
        };

        const editHotspots = (zona) => {
            currentZone.value = zona;
            editingHotspots.value = true;
        };

        const handleViewportClick = (event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;
        };

        onMounted(fetchEspacios);

        return {
            currentCampus,
            fixedCampuses,
            currentCampusName,
            zones,
            showUserMenu,
            theme,
            toggleTheme,
            showZoneModal,
            zoneForm,
            openZoneModal,
            saveZone,
            deleteZone,
            executeDeleteZone,
            editingHotspots,
            currentZone,
            zoneToDelete,
            editHotspots,
            handleViewportClick,
            logout,
            fetchEspacios,
            Icons
        };
    }
};

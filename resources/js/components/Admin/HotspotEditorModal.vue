<template>
    <div class="hotspot-editor-overlay">
        <div class="editor-header">
            <div class="header-info">
                <h3>Vincular Zonas desde: {{ zone.nombre }}</h3>
                <p>Navega en la esfera 3D y haz clic en el lugar deseado para colocar un punto de conexión (Hotspot).</p>
            </div>
            <button @click="$emit('close')" class="btn-secondary">Cerrar Editor</button>
        </div>
        
        <div class="editor-body">
            <div class="editor-viewport">
                <!-- Usando el mismo Viewer360 de la vista pública -->
                <Viewer360 
                    :imageUrl="zone.imagen_360" 
                    :hotspots="zone.hotspots"
                    :editMode="true"
                    @add-hotspot="handleViewportClick"
                    @hotspot-click="confirmDeleteHotspotRequest"
                />

                <!-- Panel flotante a la izquierda (Sidebar) -->
                <div class="hotspot-config-panel">
                    <template v-if="newHotspot">
                        <h4>Crear Conexión</h4>
                        <div class="form-group">
                            <label>Título (Ej. Ir a Biblioteca)</label>
                            <input type="text" v-model="hsForm.titulo" placeholder="Flecha indicadora">
                        </div>
                        <div class="form-group">
                            <label>Zona Destino a Vincular</label>
                            <select v-model="hsForm.target_espacio_id" required>
                                <option value="" disabled>Selecciona la zona destino...</option>
                                <option v-for="target in availableTargets" :key="target.id" :value="target.id">
                                    {{ target.nombre }}
                                </option>
                            </select>
                        </div>
                        <div class="panel-actions">
                            <button @click="cancelNewHotspot" class="btn-secondary">Cancelar</button>
                            <button @click="saveHotspot" class="btn-primary" :disabled="!hsForm.target_espacio_id">Guardar</button>
                        </div>
                    </template>

                    <template v-else>
                        <h4>Conexiones Activas</h4>
                        <p class="text-muted" style="font-size: 0.85rem; margin-top: 0.5rem">Haz clic en la esfera 3D para añadir un nuevo hotspot.</p>
                        <div v-if="!zone.hotspots || zone.hotspots.length === 0" class="empty-state">
                            No hay puntos creados.
                        </div>
                        <ul v-else class="hotspot-list">
                            <li v-for="hs in zone.hotspots" :key="hs.id" class="hotspot-item">
                                <div class="hs-info">
                                    <strong>{{ hs.titulo }}</strong>
                                </div>
                                <div class="hs-actions">
                                    <button @click="openEditDialog(hs)" class="btn-icon" title="Editar">✏️</button>
                                    <button @click="confirmDeleteHotspotRequest(hs)" class="btn-icon" title="Eliminar">&times;</button>
                                </div>
                            </li>
                        </ul>
                    </template>
                </div>
            </div>
        </div>

        <!-- Dialog Box for Editing -->
        <div v-if="hotspotToEdit" class="confirm-dialog-overlay">
            <div class="confirm-dialog edit-dialog">
                <h4>Editar Conexión</h4>
                <div class="form-group" style="text-align: left; margin-bottom: 1rem;">
                    <label>Título</label>
                    <input type="text" v-model="editForm.titulo" placeholder="Ej: Ir a Pasillo">
                </div>
                <div class="form-group" style="text-align: left; margin-bottom: 1.5rem;">
                    <label>Zona Destino</label>
                    <select v-model="editForm.target_espacio_id" required>
                        <option value="" disabled>Selecciona la zona destino...</option>
                        <option v-for="target in availableTargets" :key="target.id" :value="target.id">
                            {{ target.nombre }}
                        </option>
                    </select>
                </div>
                <div class="dialog-actions">
                    <button @click="hotspotToEdit = null" class="btn-secondary">Cancelar</button>
                    <button @click="updateHotspot" class="btn-primary">Actualizar</button>
                </div>
            </div>
        </div>

        <!-- Custom Delete Dialog Box -->
        <div v-if="hotspotToDelete" class="confirm-dialog-overlay">
            <div class="confirm-dialog">
                <h4>Eliminar Conexión</h4>
                <p>¿Estás seguro de eliminar el punto de conexión "{{ hotspotToDelete.titulo }}"?</p>
                <div class="dialog-actions">
                    <button @click="hotspotToDelete = null" class="btn-secondary">Cancelar</button>
                    <button @click="deleteHotspot" class="btn-danger">Eliminar</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { ref, reactive, computed } from 'vue';
import axios from 'axios';
import Viewer360 from '../Viewer360.vue';

export default {
    name: 'HotspotEditorModal',
    components: { Viewer360 },
    props: {
        zone: {
            type: Object,
            required: true
        },
        allZones: {
            type: Array,
            required: true
        }
    },
    emits: ['close', 'refresh'],
    setup(props, { emit }) {
        const newHotspot = ref(null);
        const hotspotToDelete = ref(null);

        const hsForm = reactive({
            titulo: '',
            target_espacio_id: '',
            theta: 0,
            phi: 0,
            x: 0, 
            y: 0
        });

        const hotspotToEdit = ref(null);
        const editForm = reactive({
            titulo: '',
            target_espacio_id: ''
        });

        const availableTargets = computed(() => {
            return props.allZones.filter(z => z.id !== props.zone.id);
        });

        // Este método ahora recibe {theta, phi} desde el Viewer360
        const handleViewportClick = ({ theta, phi }) => {
            newHotspot.value = { theta, phi };
            hsForm.theta = theta;
            hsForm.phi = phi;
            hsForm.x = 0; 
            hsForm.y = 0; 
        };

        const cancelNewHotspot = () => {
            newHotspot.value = null;
            hsForm.titulo = '';
            hsForm.target_espacio_id = '';
        };

        const saveHotspot = async () => {
            try {
                if(!hsForm.titulo) {
                    const targetZone = availableTargets.value.find(z => z.id === hsForm.target_espacio_id);
                    hsForm.titulo = `Ir a ${targetZone?.nombre || 'Siguiente'}`;
                }

                const token = localStorage.getItem('auth_token');
                await axios.post(`/api/admin/espacios/${props.zone.id}/hotspots`, hsForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                newHotspot.value = null;
                emit('refresh'); 
            } catch (error) {
                console.error(error);
                alert('Error al guardar hotspot');
            }
        };

        const openEditDialog = (hs) => {
            hotspotToEdit.value = hs;
            editForm.titulo = hs.titulo;
            editForm.target_espacio_id = hs.target_espacio_id;
        };

        const updateHotspot = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                await axios.put(`/api/admin/hotspots/${hotspotToEdit.value.id}`, editForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                hotspotToEdit.value = null;
                emit('refresh');
            } catch (error) {
                console.error(error);
                alert('Error al actualizar hotspot');
            }
        };

        const confirmDeleteHotspotRequest = (hs) => {
            // El componente emite la 'data' del hotspot al hacer clic
            hotspotToDelete.value = hs;
        };

        const deleteHotspot = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                await axios.delete(`/api/admin/hotspots/${hotspotToDelete.value.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                hotspotToDelete.value = null;
                emit('refresh');
            } catch (error) {
                console.error(error);
                alert('Error al eliminar hotspot');
            }
        };

        return {
            newHotspot,
            hotspotToDelete,
            hsForm,
            hotspotToEdit,
            editForm,
            availableTargets,
            handleViewportClick,
            cancelNewHotspot,
            saveHotspot,
            openEditDialog,
            updateHotspot,
            confirmDeleteHotspotRequest,
            deleteHotspot
        };
    }
};
</script>

<style scoped>
.hotspot-editor-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: var(--admin-bg);
    z-index: 2000;
    display: flex;
    flex-direction: column;
}

.editor-header {
    padding: 1.5rem 2rem;
    background: var(--admin-surface);
    border-bottom: 1px solid var(--admin-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-info h3 { margin: 0; font-size: 1.25rem; }
.header-info p { margin: 0.5rem 0 0 0; color: var(--admin-text-muted); font-size: 0.9rem; }

.editor-body {
    flex: 1;
    display: flex;
    position: relative;
    overflow: hidden;
}

.editor-viewport {
    flex: 1;
    position: relative;
    background: #000;
}

.hotspot-config-panel {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 320px;
    background: rgba(20, 20, 20, 0.85); /* transculent */
    backdrop-filter: blur(10px);
    border: 1px solid var(--admin-border);
    border-radius: 15px;
    padding: 1.5rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    z-index: 100;
    max-height: calc(100% - 40px);
}

.hotspot-config-panel h4 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--admin-text);
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--admin-text-muted);
}

.form-group input, .form-group select {
    width: 100%;
    padding: 0.8rem;
    background: var(--admin-input-bg);
    border: 1px solid var(--admin-border);
    border-radius: 8px;
    color: var(--admin-text);
}

.panel-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.panel-actions button {
    flex: 1;
}

/* Custom Dialog Box for Deletion */
.confirm-dialog-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
}

.confirm-dialog {
    background: var(--admin-surface);
    border: 1px solid var(--admin-border);
    padding: 2rem;
    border-radius: 12px;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.confirm-dialog h4 {
    margin: 0 0 1rem 0;
    color: var(--admin-text);
    font-size: 1.2rem;
}

.confirm-dialog p {
    color: var(--admin-text-muted);
    margin-bottom: 2rem;
}

.dialog-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.btn-secondary {
    background: var(--admin-border);
    color: var(--admin-text);
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
}

.btn-danger {
    background: #e30513;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
}

/* Sidebar List Styles */
.hotspot-list {
    list-style: none;
    padding: 0;
    margin: 1rem 0 0 0;
    flex: 1;
    overflow-y: auto;
}

.hotspot-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem;
    background: var(--admin-input-bg);
    border: 1px solid var(--admin-border);
    border-radius: 8px;
    margin-bottom: 0.5rem;
}

.hs-info strong {
    display: block;
    color: var(--admin-text);
    font-size: 0.95rem;
}

.btn-icon {
    background: transparent;
    border: none;
    color: var(--admin-text-muted);
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.2s;
    line-height: 1;
}

.btn-icon:hover {
    color: #e30513;
}

.empty-state {
    color: var(--admin-text-muted);
    padding: 2rem 0;
    text-align: center;
    font-style: italic;
}
</style>

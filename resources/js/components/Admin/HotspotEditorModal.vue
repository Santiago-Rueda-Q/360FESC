<template>
    <div class="hotspot-editor-overlay">
        <div class="editor-header">
            <div class="header-info">
                <h3>Vincular Zonas desde: {{ zone.nombre }}</h3>
                <p>Navega en la esfera 3D y haz clic en el lugar deseado para colocar un punto de conexión (Hotspot).</p>
            </div>
            <button @click="$emit('close')" class="btn-close-editor">
                <span>✕</span> Cerrar Editor
            </button>
        </div>
        
        <div class="editor-body">
            <div class="editor-viewport">
                <Viewer360 
                    :imageUrl="zone.imagen_360" 
                    :hotspots="localHotspots"
                    :previewHotspot="newHotspot"
                    :editMode="true"
                    @add-hotspot="handleViewportClick"
                    @hotspot-click="confirmDeleteHotspotRequest"
                />

                <!-- Floating Sidebar -->
                <div class="hotspot-config-panel">
                    <!-- Create Connection Section -->
                    <div v-if="newHotspot" class="creation-box">
                        <h4 style="color: #fff; margin-bottom: 0.5rem;">Nueva Conexión</h4>
                        <div class="form-group">
                            <label style="color: #ccc; font-size: 0.8rem;">Título</label>
                            <input type="text" v-model="hsForm.titulo" placeholder="Ej: Ir a Pasillo">
                        </div>
                        <div class="form-group">
                            <label style="color: #ccc; font-size: 0.8rem;">Zona Destino</label>
                            <select v-model="hsForm.target_espacio_id" required>
                                <option value="" disabled>Seleccionar zona...</option>
                                <option v-for="target in availableTargets" :key="target.id" :value="target.id">
                                    {{ target.nombre }}
                                </option>
                            </select>
                        </div>
                        <div class="panel-actions">
                            <button @click="cancelNewHotspot" class="btn-secondary">Cancelar</button>
                            <button @click="saveHotspot" class="btn-primary" :disabled="!hsForm.target_espacio_id">Guardar</button>
                        </div>
                        <hr style="border: 0; border-top: 1px solid #333; margin: 1rem 0;">
                    </div>

                    <!-- Active Connections List -->
                    <h4 style="color: #fff; margin-bottom: 0.2rem;">Conexiones Activas</h4>
                    <p class="text-muted" style="color: #aaa; font-size: 0.75rem; margin-bottom: 0.8rem;">
                        {{ newHotspot ? 'Finaliza el guardado para continuar.' : 'Haz clic en la esfera para añadir puntos.' }}
                    </p>
                    
                    <div v-if="!localHotspots || localHotspots.length === 0" class="empty-state" style="color: #aaa;">
                        No hay puntos creados.
                    </div>
                    <ul v-else class="hotspot-list">
                        <li v-for="hs in localHotspots" :key="hs.id" class="hotspot-item">
                            <div class="hs-info">
                                <strong style="color: #fff;">{{ hs.titulo }}</strong>
                            </div>
                            <div class="hs-actions">
                                <button @click="openEditDialog(hs)" class="btn-icon" title="Editar">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                </button>
                                <button @click="confirmDeleteHotspotRequest(hs)" class="btn-icon delete" title="Eliminar">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- CUSTOM DIALOG BOXES (Floating inside overlay) -->
            <Transition name="fade">
                <div v-if="hotspotToDelete" class="custom-dialog-overlay">
                    <div class="custom-dialog">
                        <h4>Eliminar Conexión</h4>
                        <p>¿Estás seguro de eliminar "<strong>{{ hotspotToDelete.titulo }}</strong>"? Esta acción es irreversible.</p>
                        <div class="dialog-actions">
                            <button @click="hotspotToDelete = null" class="btn-dialog-cancel">Cancelar</button>
                            <button @click="deleteHotspot" class="btn-dialog-confirm">Eliminar</button>
                        </div>
                    </div>
                </div>
            </Transition>

            <Transition name="fade">
                <div v-if="hotspotToEdit" class="custom-dialog-overlay">
                    <div class="custom-dialog">
                        <h4>Editar Conexión</h4>
                        <div class="form-group" style="text-align: left;">
                            <label>Título</label>
                            <input type="text" v-model="editForm.titulo">
                        </div>
                        <div class="form-group" style="text-align: left;">
                            <label>Zona Destino</label>
                            <select v-model="editForm.target_espacio_id">
                                <option v-for="target in availableTargets" :key="target.id" :value="target.id">
                                    {{ target.nombre }}
                                </option>
                            </select>
                        </div>
                        <div class="dialog-actions">
                            <button @click="hotspotToEdit = null" class="btn-dialog-cancel">Cancelar</button>
                            <button @click="updateHotspot" class="btn-dialog-confirm">Actualizar</button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue';
import axios from 'axios';
import Viewer360 from '../Viewer360/index.vue';

export default {
    name: 'HotspotEditorModal',
    components: { Viewer360 },
    props: {
        zone: { type: Object, required: true },
        allZones: { type: Array, required: true }
    },
    emits: ['close', 'refresh'],
    setup(props, { emit }) {
        const newHotspot = ref(null);
        const hotspotToDelete = ref(null);
        const hotspotToEdit = ref(null);
        const localHotspots = ref([...(props.zone.hotspots || [])]);

        const hsForm = reactive({ titulo: '', target_espacio_id: '', theta: 0, phi: 0 });
        const editForm = reactive({ titulo: '', target_espacio_id: '' });

        watch(() => props.zone.hotspots, (newList) => {
            localHotspots.value = [...(newList || [])];
        }, { deep: true });

        const availableTargets = computed(() => props.allZones.filter(z => z.id !== props.zone.id));

        const handleViewportClick = ({ theta, phi }) => {
            newHotspot.value = { theta, phi };
            hsForm.theta = theta;
            hsForm.phi = phi;
        };

        const cancelNewHotspot = () => {
            newHotspot.value = null;
            hsForm.titulo = '';
            hsForm.target_espacio_id = '';
        };

        const saveHotspot = async () => {
            try {
                if(!hsForm.target_espacio_id) return;
                if(!hsForm.titulo) {
                    const targetZone = availableTargets.value.find(z => z.id === hsForm.target_espacio_id);
                    hsForm.titulo = `Ir a ${targetZone?.nombre || 'Siguiente'}`;
                }
                const tempId = 'temp_' + Date.now();
                localHotspots.value.push({ id: tempId, ...hsForm });
                
                const payload = { ...hsForm };
                cancelNewHotspot();

                const token = localStorage.getItem('auth_token');
                await axios.post(`/api/admin/espacios/${props.zone.id}/hotspots`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                emit('refresh'); 
            } catch (error) {
                console.error(error);
                emit('refresh'); 
            }
        };

        const openEditDialog = (hs) => {
            hotspotToEdit.value = hs;
            editForm.titulo = hs.titulo;
            editForm.target_espacio_id = hs.target_espacio_id;
        };

        const updateHotspot = async () => {
            try {
                const id = hotspotToEdit.value.id;
                const index = localHotspots.value.findIndex(h => h.id === id);
                if (index !== -1) {
                    localHotspots.value[index].titulo = editForm.titulo;
                    localHotspots.value[index].target_espacio_id = editForm.target_espacio_id;
                }
                hotspotToEdit.value = null;
                const token = localStorage.getItem('auth_token');
                await axios.put(`/api/admin/hotspots/${id}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
                emit('refresh');
            } catch (error) { console.error(error); emit('refresh'); }
        };

        const confirmDeleteHotspotRequest = (hs) => { hotspotToDelete.value = hs; };

        const deleteHotspot = async () => {
            const id = hotspotToDelete.value.id;
            const index = localHotspots.value.findIndex(h => h.id === id);
            if (index !== -1) localHotspots.value.splice(index, 1);
            hotspotToDelete.value = null;
            if (String(id).startsWith('temp_')) return;
            try {
                const token = localStorage.getItem('auth_token');
                await axios.delete(`/api/admin/hotspots/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                emit('refresh');
            } catch (error) { console.error(error); emit('refresh'); }
        };

        return {
            newHotspot, hotspotToDelete, hotspotToEdit, hsForm, editForm, localHotspots, availableTargets,
            handleViewportClick, cancelNewHotspot, saveHotspot, openEditDialog, updateHotspot,
            confirmDeleteHotspotRequest, deleteHotspot
        };
    }
};
</script>

<style scoped>
.hotspot-editor-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: #000;
    z-index: 2000;
    display: flex;
    flex-direction: column;
}

.editor-header {
    padding: 1rem 2rem;
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-info h3 { color: white; margin: 0; font-size: 1.1rem; font-weight: 700; }
.header-info p { color: #666; margin: 0.2rem 0 0 0; font-size: 0.75rem; }

.btn-close-editor {
    background: rgba(255, 255, 255, 0.05);
    color: #eee;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.5rem 1.2rem;
    border-radius: 100px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-close-editor:hover {
    background: #e30513;
    border-color: #e30513;
    color: white;
    transform: translateY(-1px);
}

.editor-body { flex: 1; position: relative; }
.editor-viewport { width: 100%; height: 100%; position: relative; }

.hotspot-config-panel {
    position: absolute;
    top: 20px; left: 20px;
    width: 300px;
    background: rgba(15, 15, 15, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 1.5rem;
    z-index: 100;
    max-height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 50px rgba(0,0,0,0.6);
}

.form-group { margin-bottom: 1rem; }
.form-group label { display: block; color: #888; margin-bottom: 0.5rem; font-size: 0.75rem; }
.form-group input, .form-group select {
    width: 100%;
    padding: 0.7rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: white;
    font-size: 0.85rem;
    outline: none;
}

.form-group select option {
    background: #222;
    color: white;
}

.panel-actions { display: flex; gap: 0.5rem; }
.btn-primary { background: #e30513; color: white; border: none; padding: 0.7rem; border-radius: 10px; cursor: pointer; flex: 1; font-weight: bold; font-size: 0.85rem; }
.btn-secondary { background: rgba(255, 255, 255, 0.1); color: white; border: none; padding: 0.7rem; border-radius: 10px; cursor: pointer; flex: 1; font-size: 0.85rem; }

.hotspot-list { list-style: none; padding: 0; flex: 1; overflow-y: auto; margin-top: 0.5rem; }
.hotspot-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.8rem; background: rgba(255, 255, 255, 0.05); border-radius: 10px; margin-bottom: 0.6rem;
    border: 1px solid rgba(255, 255, 255, 0.03);
}
.hs-info strong { color: white; font-size: 0.9rem; }
.hs-actions { display: flex; gap: 0.4rem; }
.btn-icon { background: none; border: none; color: #777; cursor: pointer; transition: 0.2s; padding: 5px; }
.btn-icon:hover { color: white; }
.btn-icon.delete:hover { color: #ff4444; }

/* Custom Dialog Style (Professional replacement for alert/confirm) */
.custom-dialog-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(5px);
    display: flex; align-items: center; justify-content: center;
    z-index: 3000;
}
.custom-dialog {
    background: #1a1a1a;
    padding: 2.5rem;
    border-radius: 20px;
    width: 100%;
    max-width: 420px;
    border: 1px solid #333;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}
.custom-dialog h4 { color: white; margin: 0 0 1rem 0; font-size: 1.2rem; }
.custom-dialog p { color: #aaa; margin-bottom: 2rem; line-height: 1.6; }
.dialog-actions { display: flex; gap: 1rem; justify-content: center; }
.btn-dialog-cancel { background: #333; color: white; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; min-width: 100px; }
.btn-dialog-confirm { background: #e30513; color: white; border: none; padding: 12px 24px; border-radius: 10px; cursor: pointer; font-weight: bold; min-width: 100px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

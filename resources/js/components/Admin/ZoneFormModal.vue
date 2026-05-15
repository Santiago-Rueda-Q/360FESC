<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-card">
            <div class="modal-header">
                <h3>{{ isEditing ? 'Editar Zona' : 'Nueva Zona' }}</h3>
                <button @click="$emit('close')" class="close-btn">&times;</button>
            </div>
            <form @submit.prevent="submit" class="modal-body">
                <div class="form-group">
                    <label>Nombre de la Zona</label>
                    <input type="text" v-model="form.nombre" @input="generateMeta" placeholder="Ej: Pasillo A" required>
                </div>
                
                <div class="form-group">
                    <label>Slug (Generado automáticamente)</label>
                    <input type="text" v-model="form.slug" readonly class="readonly-input">
                </div>

                <div class="form-group">
                    <label>Imagen 360 (Panorámica)</label>
                    <ImageUploader v-model="form.imagen_360" />
                </div>

                <div class="form-group">
                    <label>Descripción / Meta (SEO)</label>
                    <textarea v-model="form.descripcion" rows="3" placeholder="Se genera a partir del nombre, pero puedes editarla..."></textarea>
                </div>

                <div class="modal-actions">
                    <button type="button" @click="$emit('close')" class="btn-secondary">Cancelar</button>
                    <button type="submit" class="btn-primary" :disabled="!form.imagen_360">Guardar Zona</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { reactive, watch } from 'vue';
import ImageUploader from './ImageUploader.vue';

export default {
    name: 'ZoneFormModal',
    components: { ImageUploader },
    props: {
        zona: {
            type: Object,
            default: () => null
        },
        campus: {
            type: String,
            required: true
        }
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
        const isEditing = !!props.zona?.id;
        
        const form = reactive({
            id: props.zona?.id || null,
            nombre: props.zona?.nombre || '',
            slug: props.zona?.slug || '',
            descripcion: props.zona?.descripcion || '',
            imagen_360: props.zona?.imagen_360 || '',
            campus: props.campus
        });

        // Slugify helper
        const stringToSlug = (str) => {
            return str.toLowerCase().trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        };

        const generateMeta = () => {
            if (!isEditing || (isEditing && form.nombre !== props.zona.nombre)) {
                form.slug = stringToSlug(form.nombre);
                
                if (!form.descripcion || form.descripcion === `Vista panorámica de ${props.zona?.nombre}`) {
                    form.descripcion = `Vista panorámica interactiva de ${form.nombre} en la sede ${props.campus.toUpperCase()}.`;
                }
            }
        };

        const submit = () => {
            if (!form.imagen_360) {
                alert("Debes subir una imagen 360 antes de guardar.");
                return;
            }
            emit('save', { ...form });
        };

        return {
            isEditing,
            form,
            generateMeta,
            submit
        };
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-card {
    background: var(--admin-surface, #141414);
    width: 90%;
    max-width: 500px;
    border-radius: 20px;
    border: 1px solid var(--admin-border, #262626);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    color: var(--admin-text, #fff);
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--admin-border, #262626);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
}

.close-btn {
    background: transparent;
    border: none;
    color: var(--admin-text-muted, #888);
    font-size: 1.5rem;
    cursor: pointer;
}

.close-btn:hover {
    color: #e30513;
}

.modal-body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--admin-text-muted, #888);
}

.form-group input, .form-group textarea {
    padding: 0.8rem;
    background: var(--admin-bg, #0a0a0a);
    border: 1px solid var(--admin-border, #262626);
    border-radius: 10px;
    color: var(--admin-text, #fff);
}

.readonly-input {
    opacity: 0.7;
    cursor: not-allowed;
}

.modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
}

.btn-secondary {
    background: var(--admin-border, #262626);
    color: var(--admin-text, #fff);
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
}

.btn-primary {
    background: #e30513;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>

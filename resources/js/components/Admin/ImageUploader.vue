<template>
    <div class="image-uploader">
        <label class="uploader-dropzone" :class="{ 'has-image': previewUrl }">
            <input type="file" accept="image/jpeg, image/png, image/webp" @change="handleFileChange" class="hidden-input" />
            
            <div v-if="!previewUrl && !isUploading" class="upload-placeholder">
                <span class="upload-icon" v-html="Icons.Upload"></span>
                <p>Haz clic o arrastra una imagen panorámica (360°)</p>
                <small>Formatos: JPG, PNG, WEBP</small>
            </div>

            <div v-if="previewUrl" class="image-preview-container">
                <img :src="previewUrl" alt="Panorama Preview" class="panorama-preview-img" />
                <div class="preview-overlay">
                    <button type="button" @click.prevent="triggerFileInput" class="btn-change">Cambiar Imagen</button>
                </div>
            </div>

            <div v-if="isUploading" class="upload-progress">
                <div class="spinner"></div>
                <p>Subiendo... {{ uploadProgress }}%</p>
            </div>
        </label>
    </div>
</template>

<script>
import { ref, watch } from 'vue';
import { Icons } from '../../utils/icons';
import axios from 'axios';

// Adding an upload icon locally if it's not in Icons
const UploadIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
    </svg>
`;

export default {
    name: 'ImageUploader',
    props: {
        modelValue: {
            type: String,
            default: ''
        }
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const previewUrl = ref(props.modelValue);
        const isUploading = ref(false);
        const uploadProgress = ref(0);

        watch(() => props.modelValue, (newVal) => {
            if (newVal && !newVal.startsWith('blob:')) {
                previewUrl.value = newVal;
            }
        });

        const handleFileChange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            // Generate local preview
            previewUrl.value = URL.createObjectURL(file);
            
            // Upload file
            const formData = new FormData();
            formData.append('imagen', file);

            isUploading.value = true;
            uploadProgress.value = 0;

            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.post('/api/admin/upload-panorama', formData, {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}` 
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        uploadProgress.value = percentCompleted;
                    }
                });

                // Update the v-model with the returned URL from backend
                emit('update:modelValue', response.data.url);
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Error al subir la imagen. Verifica el formato o tamaño.");
                previewUrl.value = props.modelValue; // Revert on error
            } finally {
                isUploading.value = false;
            }
        };

        const triggerFileInput = (e) => {
            e.target.closest('.uploader-dropzone').querySelector('input[type="file"]').click();
        };

        return {
            previewUrl,
            isUploading,
            uploadProgress,
            handleFileChange,
            triggerFileInput,
            Icons: { ...Icons, Upload: UploadIcon }
        };
    }
};
</script>

<style scoped>
.image-uploader {
    width: 100%;
    margin-bottom: 1rem;
}

.hidden-input {
    display: none;
}

.uploader-dropzone {
    display: block;
    border: 2px dashed var(--admin-border);
    border-radius: 12px;
    background: var(--admin-input-bg);
    cursor: pointer;
    overflow: hidden;
    position: relative;
    transition: all 0.3s;
    min-height: 150px;
}

.uploader-dropzone:hover {
    border-color: #e30513;
}

.upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: var(--admin-text-muted);
    text-align: center;
}

.upload-icon {
    width: 32px;
    height: 32px;
    margin-bottom: 1rem;
    color: var(--admin-text-muted);
}

.upload-placeholder p {
    margin: 0 0 0.5rem 0;
    font-weight: 600;
    color: var(--admin-text);
}

.image-preview-container {
    width: 100%;
    height: 200px;
    position: relative;
}

.panorama-preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.preview-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.image-preview-container:hover .preview-overlay {
    opacity: 1;
}

.btn-change {
    background: #e30513;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}

.upload-progress {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #e30513;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>

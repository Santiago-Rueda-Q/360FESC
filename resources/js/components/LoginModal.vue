<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
                <div class="login-modal glass animate__animated animate__zoomIn">
                    <button class="close-btn" @click="$emit('close')">&times;</button>
                    <div class="login-header">
                        <img src="/logo-fesc.png" alt="FESC Logo" class="login-logo" onerror="this.src='https://fesc.edu.co/portal/images/logo_fesc.png'">
                        <h2>Acceso Administrativo</h2>
                    </div>
                    <form @submit.prevent="handleLogin" class="login-form">
                        <div class="form-group">
                            <label>Usuario</label>
                            <input type="text" v-model="email" placeholder="Ingresa tu usuario" required>
                        </div>
                        <div class="form-group">
                            <label>Contraseña</label>
                            <input type="password" v-model="password" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="btn-login" :disabled="loading">
                            {{ loading ? 'Iniciando...' : 'Entrar' }}
                        </button>
                    </form>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineProps(['show']);
const emit = defineEmits(['close']);
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);

import axios from 'axios';

const handleLogin = async () => {
    loading.value = true;
    try {
        const response = await axios.post('/api/login', {
            email: email.value,
            password: password.value
        });
        
        localStorage.setItem('auth_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        router.push('/admin');
        emit('close');
    } catch (error) {
        alert(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.login-modal {
    background: white;
    width: 90%;
    max-width: 400px;
    padding: 2.5rem;
    border-radius: 24px;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.close-btn {
    position: absolute;
    top: 15px; right: 20px;
    background: none; border: none;
    font-size: 1.5rem; cursor: pointer;
    color: #64748b;
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;
}

.login-logo {
    width: 120px;
    margin-bottom: 1rem;
}

.login-header h2 {
    font-size: 1.25rem;
    color: var(--fesc-gray);
    font-weight: 700;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #475569;
}

.form-group input {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 2px solid #f1f5f9;
    border-radius: 12px;
    font-family: inherit;
    transition: all 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--fesc-red);
    background: white;
}

.btn-login {
    width: 100%;
    padding: 1rem;
    background: var(--fesc-red);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-login:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
}

.btn-login:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

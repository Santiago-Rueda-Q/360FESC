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

<script src="./LoginModal.js"></script>
<style scoped src="./LoginModal.css"></style>

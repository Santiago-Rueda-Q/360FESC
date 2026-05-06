<template>
    <div :class="['tour-sidebar', { 'collapsed': isCollapsed }]">
        <button class="toggle-sidebar" @click="isCollapsed = !isCollapsed">
            <span v-html="Icons.ArrowRight" :style="{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', display: 'inline-block' }"></span>
        </button>

        <div class="sidebar-content">
            <div class="sidebar-header">
                <img src="/logo-fesc.png" alt="FESC Logo" class="sidebar-logo" onerror="this.src='https://fesc.edu.co/portal/images/logo_fesc.png'">
            </div>

            <nav class="sidebar-nav">
                <div class="nav-section">
                    <ul>
                        <li v-for="(loc, index) in locations" :key="index" :class="{ active: currentLocation === loc.slug }">
                            <a @click="$emit('navigate', loc.slug)">{{ loc.name.toUpperCase() }} ></a>
                        </li>
                        <li><a @click="$emit('go-home')">VER TODAS LAS SEDES ></a></li>
                    </ul>
                </div>
            </nav>

            <div class="sidebar-footer">
                <button class="icon-btn" @click="$emit('show-info')" v-html="Icons.Info" title="Información"></button>
                <button class="icon-btn" @click="$emit('show-location')" v-html="Icons.MapPin" title="Ubicación"></button>
                <button class="icon-btn" @click="$emit('show-gallery')" v-html="Icons.Maximize" title="Mapa"></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icons } from '../utils/icons';

defineProps({
    locations: Array,
    currentLocation: String
});

defineEmits(['navigate', 'go-home', 'show-info', 'show-location', 'show-gallery']);

const isCollapsed = ref(false);
</script>

<style scoped>
.tour-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 320px;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6));
    backdrop-filter: blur(15px);
    z-index: 1000;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
}

.tour-sidebar.collapsed {
    transform: translateX(-320px);
}

.toggle-sidebar {
    position: absolute;
    right: -45px;
    top: 50%;
    transform: translateY(-50%);
    width: 45px;
    height: 60px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 0 12px 12px 0;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-left: none;
}

.sidebar-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 3rem 2rem;
}

.sidebar-header {
    margin-bottom: 4rem;
}

.sidebar-logo {
    width: 180px;
    filter: brightness(0) invert(1);
}

.sidebar-nav {
    flex: 1;
}

.nav-section ul {
    list-style: none;
    padding: 0;
}

.nav-section li {
    margin-bottom: 1.5rem;
    position: relative;
}

.nav-section a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: var(--font-secondary);
    display: block;
    padding: 5px 0;
}

.nav-section a:hover {
    color: var(--fesc-red);
    padding-left: 10px;
}

.nav-section li.active a {
    color: var(--fesc-red);
    font-weight: 700;
}

.sidebar-footer {
    display: flex;
    gap: 25px;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.icon-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    width: 28px;
    height: 28px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
}

.icon-btn:hover {
    transform: translateY(-5px);
    color: var(--fesc-red);
    opacity: 1;
}

.icon-btn :deep(svg) {
    width: 100%;
    height: 100%;
    stroke-width: 2;
}
</style>

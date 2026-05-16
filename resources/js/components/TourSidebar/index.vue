<template>
    <div :class="['tour-sidebar', { 'collapsed': isCollapsed }]">
        <button class="toggle-sidebar" @click="isCollapsed = !isCollapsed">
            <span v-html="Icons.ArrowRight" :style="{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', display: 'inline-block' }"></span>
        </button>

        <div class="sidebar-content">
            <div class="sidebar-header" @click="$emit('go-home')" title="Volver al Inicio" style="cursor: pointer;">
                <img src="/FESC.svg" alt="FESC Logo" class="sidebar-logo">
            </div>

            <nav class="sidebar-nav">
                <div class="nav-section">
                    <!-- Acordeón de Sedes -->
                    <div class="accordion-item">
                        <div class="accordion-header" @click="activeSede = activeSede === 'cucuta' ? '' : 'cucuta'">
                            <span>SEDE CÚCUTA</span>
                            <span v-html="Icons.ChevronDown" :class="{ 'rotate': activeSede === 'cucuta' }"></span>
                        </div>
                        <Transition name="slide-down">
                            <ul v-if="activeSede === 'cucuta'">
                                <li v-for="loc in cucutaLocations" :key="loc.slug" :class="{ active: currentLocation === loc.slug }">
                                    <a @click="$emit('navigate', loc.slug)">{{ loc.name }}</a>
                                </li>
                            </ul>
                        </Transition>
                    </div>

                    <div class="accordion-item">
                        <div class="accordion-header" @click="activeSede = activeSede === 'ocana' ? '' : 'ocana'">
                            <span>SEDE OCAÑA</span>
                            <span v-html="Icons.ChevronDown" :class="{ 'rotate': activeSede === 'ocana' }"></span>
                        </div>
                        <Transition name="slide-down">
                            <ul v-if="activeSede === 'ocana'">
                                <li v-for="loc in ocanaLocations" :key="loc.slug" :class="{ active: currentLocation === loc.slug }">
                                    <a @click="$emit('navigate', loc.slug)">{{ loc.name }}</a>
                                </li>
                            </ul>
                        </Transition>
                    </div>

                    <div class="nav-footer-links">
                        <a @click="$emit('go-home')" class="all-sedes-link">VER TODAS LAS SEDES</a>
                    </div>
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

<script src="./TourSidebar.js"></script>
<style scoped src="./TourSidebar.css"></style>

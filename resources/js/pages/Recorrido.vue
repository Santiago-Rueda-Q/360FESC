<template>
    <div class="recorrido-wrapper">
        <nav class="overlay-nav glass">
            <button class="btn-back" @click="$emit('back')">
                <span v-html="Icons.ArrowRight" style="transform: rotate(180deg); display: inline-block;"></span>
                {{ $t('back') }}
            </button>
            <div class="current-location">
                <h2>{{ campusName }}</h2>
            </div>
        </nav>

        <div class="viewer-container">
            <Viewer360 
                v-if="espacio"
                :image-url="espacio.imagen_360"
                :hotspots="espacio.hotspots"
                @hotspot-click="onHotspotClick"
            />
            <div v-else class="loading-state flex-center">
                <div class="spinner"></div>
                <p>{{ $t('loading') }}</p>
            </div>
        </div>

        <!-- Hotspot Info Panel -->
        <Transition name="slide-up">
            <div v-if="selectedHotspot" class="info-panel glass">
                <button class="close-btn" @click="selectedHotspot = null">&times;</button>
                <h3>{{ selectedHotspot.titulo }}</h3>
                <p>{{ selectedHotspot.descripcion }}</p>
            </div>
        </Transition>
    </div>
</template>

<script setup src="./Recorrido.js"></script>
<style scoped src="./Recorrido.css"></style>

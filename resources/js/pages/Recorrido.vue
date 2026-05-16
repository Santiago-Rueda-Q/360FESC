<template>
    <div class="recorrido-wrapper">
        <TourSidebar 
            :locations="locations"
            :currentLocation="slug"
            @navigate="handleNavigate"
            @go-home="goHome"
            @show-info="selectedHotspot = null"
            @show-location="showLocation"
            @show-gallery="showMap = !showMap"
        />

        <div class="tour-home-btn" @click="goHome" title="Volver al Inicio">
            <img src="/FESC.svg" alt="FESC Logo" />
        </div>


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

<script src="./Recorrido.js"></script>
<style scoped src="./Recorrido.css"></style>

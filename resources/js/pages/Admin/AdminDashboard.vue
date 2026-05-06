<template>
    <div :class="['admin-wrapper', theme]">
        <nav class="admin-top-nav">
            <div class="nav-left">
                <div class="brand">
                    <img src="/favicon.svg" alt="FESC Icon" class="nav-icon">
                    <img src="/FESC.svg" alt="FESC Logo" class="nav-logo">
                    <span class="brand-divider">|</span>
                    <span class="brand-tag">360 ADMIN</span>
                </div>
            </div>

            <div class="nav-center">
                <button 
                    v-for="campus in fixedCampuses" 
                    :key="campus.slug"
                    :class="['campus-tab', { active: currentCampus === campus.slug }]"
                    @click="currentCampus = campus.slug"
                >
                    <span class="icon" v-html="Icons.MapPin"></span>
                    {{ campus.name }}
                </button>
            </div>

            <div class="nav-right">
                <button class="theme-toggle" @click="toggleTheme" :title="theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'">
                    <span v-if="theme === 'dark'" v-html="Icons.Sun"></span>
                    <span v-else v-html="Icons.Moon"></span>
                </button>

                <div class="user-dropdown">
                    <button class="user-btn" @click="showUserMenu = !showUserMenu">
                        <span class="user-avatar">A</span>
                        Admin
                    </button>
                    <div v-if="showUserMenu" class="dropdown-panel">
                        <button @click="openPasswordModal">Cambiar Contraseña</button>
                        <button @click="logout" class="logout-btn">Cerrar Sesión</button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="admin-container">
            <div class="admin-header-actions">
                <h2>Gestión de Zonas: {{ currentCampusName }}</h2>
                <button class="btn-primary" @click="openZoneModal()">Nueva Zona</button>
            </div>

            <div class="zones-grid">
                <div v-for="zona in zones" :key="zona.id" class="zone-card">
                    <div class="zone-preview">
                        <img :src="zona.imagen_360" alt="Preview">
                        <div class="zone-overlay">
                            <button @click="editHotspots(zona)">Gestionar Hotspots</button>
                        </div>
                    </div>
                    <div class="zone-info">
                        <h3>{{ zona.nombre }}</h3>
                        <p>{{ zona.hotspots?.length || 0 }} Hotspots</p>
                        <div class="zone-actions">
                            <button @click="openZoneModal(zona)">Editar</button>
                            <button @click="deleteZone(zona.id)" class="delete">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Zone Modal -->
        <div v-if="showZoneModal" class="modal-overlay" @click.self="showZoneModal = false">
            <div class="modal-card">
                <div class="modal-header">
                    <h3>{{ zoneForm.id ? 'Editar Zona' : 'Nueva Zona' }}</h3>
                    <button @click="showZoneModal = false" class="close-btn">&times;</button>
                </div>
                <form @submit.prevent="saveZone" class="modal-body">
                    <div class="form-group">
                        <label>Nombre de la Zona</label>
                        <input type="text" v-model="zoneForm.nombre" placeholder="Ej: Entrada Principal" required>
                    </div>
                    <div class="form-group">
                        <label>Slug (URL)</label>
                        <input type="text" v-model="zoneForm.slug" placeholder="ej-entrada-principal" required>
                    </div>
                    <div class="form-group">
                        <label>URL Imagen 360</label>
                        <input type="text" v-model="zoneForm.imagen_360" placeholder="https://..." required>
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea v-model="zoneForm.descripcion" rows="3"></textarea>
                    </div>
                    <div class="modal-actions">
                        <button type="button" @click="showZoneModal = false" class="btn-secondary">Cancelar</button>
                        <button type="submit" class="btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Hotspot Editor Overlay -->
        <div v-if="editingHotspots" class="hotspot-editor-overlay">
            <div class="editor-header">
                <h3>Editando Hotspots: {{ currentZone.nombre }}</h3>
                <button @click="editingHotspots = false">Cerrar Editor</button>
            </div>
            <div class="editor-body">
                <div class="editor-viewport" ref="editorViewport" @click="handleViewportClick">
                    <img :src="currentZone.imagen_360" class="panorama-preview">
                    <div v-for="hs in currentZone.hotspots" 
                         :key="hs.id" 
                         class="hs-marker"
                         :style="{ left: hs.x + '%', top: hs.y + '%' }">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./AdminDashboard.js"></script>
<style scoped src="./AdminDashboard.css"></style>

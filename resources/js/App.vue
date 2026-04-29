<template>
    <div class="app-container">
        <Home v-if="page === 'home'" @navigate="navigate" />
        <Recorrido v-else-if="page === 'recorrido'" :slug="slug" @back="navigate('home')" />
        
        <!-- Simple Router Placeholder -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Home from './pages/Home.vue';
import Recorrido from './pages/Recorrido.vue';

const page = ref('home');
const slug = ref('');

const parseRoute = () => {
    const path = window.location.pathname;
    if (path.startsWith('/recorrido/')) {
        page.value = 'recorrido';
        slug.value = path.replace('/recorrido/', '');
    } else {
        page.value = 'home';
    }
};

const navigate = (newPage, newSlug = '') => {
    page.value = newPage;
    slug.value = newSlug;
    const path = newPage === 'home' ? '/' : `/recorrido/${newSlug}`;
    window.history.pushState({}, '', path);
};

onMounted(() => {
    parseRoute();
    window.addEventListener('popstate', parseRoute);
});
</script>

<style scoped>
.app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>

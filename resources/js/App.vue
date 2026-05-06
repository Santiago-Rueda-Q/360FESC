<template>
    <div class="app-container">
        <Home v-if="page === 'home'" @navigate="navigate" />
        <Recorrido v-else-if="page === 'recorrido'" :slug="slug" @back="navigate('home')" />
        
        <!-- Simple Router Placeholder -->
    </div>
</template>

<script setup src="./App.js"></script>
<style scoped src="./App.css"></style>

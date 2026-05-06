<template>
    <div class="app-wrapper">
        <router-view></router-view>
    </div>
</template>

<style>
@import 'animate.css';

:root {
    --fesc-red: #e30513;
    --fesc-wine: #8a0b12;
    --fesc-gray: #4a4a49;
    --bg: #ffffff;
    --font-primary: 'Inter', sans-serif;
    --font-secondary: 'Outfit', sans-serif;
}

body {
    margin: 0;
    font-family: var(--font-primary);
    background: var(--bg);
}
</style>

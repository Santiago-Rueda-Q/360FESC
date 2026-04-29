import './bootstrap';
import { createApp } from 'vue';
import App from './App.vue';
import { messages } from './lang/translations';

// For simple translation helper
const lang = document.documentElement.lang || 'es';
const t = (key) => messages[lang]?.[key] || key;

const app = createApp(App);

// Global properties
app.config.globalProperties.$t = t;

app.mount('#app');

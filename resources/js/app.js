import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { messages } from './lang/translations';

const app = createApp(App);

// Implementación global de $t para traducciones
const locale = 'es';
app.config.globalProperties.$t = (key) => {
    return messages[locale][key] || key;
};

app.use(router);
app.mount('#app');

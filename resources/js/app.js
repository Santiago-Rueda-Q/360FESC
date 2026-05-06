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

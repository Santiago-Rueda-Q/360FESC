import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Recorrido from './pages/Recorrido.vue';
import AdminDashboard from './pages/Admin/AdminDashboard.vue';

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/recorrido/:slug', component: Recorrido, name: 'recorrido', props: true },
    { path: '/admin', component: AdminDashboard, name: 'admin' },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;

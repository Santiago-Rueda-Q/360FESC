import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Loader from '../components/Loader.vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { Icons } from '../utils/icons';

export default {
    name: 'Home',
    components: { Loader, Header, Footer },
    setup() {
        const router = useRouter();

        const campuses = [
            {
                slug: 'cucuta',
                name: 'Sede Principal Cúcuta',
                image: '/Sedes/SedeCucuta.webp',
                description: 'Ubicada en la Av. 4 #15-14, nuestra sede principal cuenta con modernos laboratorios, biblioteca y espacios diseñados para tu crecimiento académico.',
                maps: 'https://maps.app.goo.gl/Cnb49u6dAV5PvWD16',
                instagram: 'https://www.instagram.com/fesc.edusuperior/',
                facebook: 'https://www.facebook.com/Fesc.edusuperior'
            },
            {
                slug: 'ocana',
                name: 'Sede Ocaña',
                image: '/Sedes/SedeOcaña.webp',
                description: 'En el corazón de Ocaña, brindamos educación de calidad con el respaldo institucional de FESC y Comfanorte.',
                maps: 'https://maps.app.goo.gl/xzHUgKpXjzBFro9',
                instagram: 'https://www.instagram.com/fesc.ocana/',
                facebook: 'https://www.facebook.com/fesc.eduocana'
            }
        ];

        const refresh = () => window.location.reload();

        const navigateToCampus = (slug) => {
            router.push({ name: 'recorrido', params: { slug } });
        };

        return {
            campuses,
            refresh,
            navigateToCampus,
            Icons
        };
    }
};

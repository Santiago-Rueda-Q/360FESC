import { ref } from 'vue';
import Loader from '../components/Loader.vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const emits = defineEmits(['navigate']);

const campuses = [
    {
        slug: 'cucuta',
        name: 'Sede Principal Cúcuta',
        image: '/Sedes/SedeCucuta.webp',
        description: 'Ubicada en la Av. 4 #15-14, nuestra sede principal cuenta con modernos laboratorios, biblioteca y espacios diseñados para tu crecimiento académico.'
    },
    {
        slug: 'ocana',
        name: 'Sede Ocaña',
        image: '/Sedes/SedeOcaña.webp',
        description: 'En el corazón de Ocaña, brindamos educación de calidad con el respaldo institucional de FESC y Comfanorte.'
    }
];

const refresh = () => window.location.reload();

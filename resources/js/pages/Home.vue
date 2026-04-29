<template>
    <div class="home-container">
        <Loader />
        <Header @go-home="refresh" />

        <main class="main-content">
            <!-- Decorative Triangles -->
            <div class="decorations">
                <div class="decor-tri pastel-purple"></div>
                <div class="decor-tri pastel-yellow"></div>
                <div class="decor-tri pastel-mint"></div>
                <div class="decor-tri pastel-blue"></div>
            </div>

            <section class="hero-section container animate__animated animate__fadeIn">
                <h1 class="main-title">Nuestras <span>SEDES</span></h1>
                <p class="hero-text">
                    Haz clic en las tarjetas y descubre nuestras sedes a través de los Recorridos 360°. 
                    ¡Explora cada espacio como si estuvieras allí!
                </p>
            </section>

            <section class="campus-grid container">
                <div 
                    v-for="campus in campuses" 
                    :key="campus.slug"
                    class="campus-card animate__animated animate__zoomIn"
                >
                    <div class="card-image-container" @click="$emit('navigate', 'recorrido', campus.slug)">
                        <!-- Blur Background Image -->
                        <img 
                            :src="campus.image" 
                            :alt="'sede ' + campus.slug" 
                            class="campus-img-blur"
                            loading="lazy"
                        >
                        <!-- Main Image -->
                        <img 
                            :src="campus.image" 
                            :alt="'sede ' + campus.slug" 
                            class="campus-img"
                            loading="lazy"
                        >
                        <div class="card-overlay">
                            <span class="explore-badge">{{ $t('explore') }}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3>{{ campus.name }}</h3>
                        <p class="campus-desc">{{ campus.description }}</p>
                    </div>
                </div>
            </section>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Loader from '../components/Loader.vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

defineEmits(['navigate']);

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
</script>

<style scoped>
@import 'animate.css';

.home-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: 80px;
    background: var(--bg);
}

.main-content {
    flex: 1;
    position: relative;
    padding: 60px 0;
    overflow: hidden;
}

.decorations {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
}

.decor-tri {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.05));
    border-radius: 10px;
}

.pastel-purple {
    top: 10%; left: 5%;
    border-width: 0 40px 70px 40px;
    border-color: transparent transparent #e0c3fc transparent;
    transform: rotate(15deg);
}

.pastel-yellow {
    top: 60%; right: 5%;
    border-width: 0 50px 85px 50px;
    border-color: transparent transparent #fef9c3 transparent;
    transform: rotate(-20deg);
}

.pastel-mint {
    bottom: 20%; left: 10%;
    border-width: 0 35px 60px 35px;
    border-color: transparent transparent #d1fae5 transparent;
    transform: rotate(45deg);
}

.pastel-blue {
    top: 30%; right: 15%;
    border-width: 0 45px 75px 45px;
    border-color: transparent transparent #dbeafe transparent;
    transform: rotate(160deg);
}

.hero-section {
    text-align: center;
    margin-bottom: 60px;
    position: relative;
    z-index: 1;
}

.main-title {
    font-size: 3.5rem;
    color: var(--fesc-gray);
    margin-bottom: 20px;
}

.main-title span {
    color: var(--fesc-red);
}

.hero-text {
    max-width: 700px;
    margin: 0 auto;
    color: #666;
    font-size: 1.1rem;
    line-height: 1.8;
}

.campus-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 40px;
    padding: 0 20px;
    position: relative;
    z-index: 1;
}

.campus-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 15px 45px rgba(0,0,0,0.05);
    transition: transform 0.4s ease;
}

.campus-card:hover {
    transform: translateY(-15px);
}

.card-image-container {
    height: 300px;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    background: #f0f0f0;
}

.campus-img-blur {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(10px) brightness(0.8);
    transform: scale(1.1);
    opacity: 0.6;
}

.campus-img {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
    z-index: 1;
}

.campus-card:hover .campus-img {
    transform: scale(1.05);
}

.card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 2;
}

.campus-card:hover .card-overlay {
    opacity: 1;
}

.explore-badge {
    background: white;
    color: var(--fesc-red);
    padding: 12px 30px;
    border-radius: 30px;
    font-weight: 700;
    font-family: var(--font-secondary);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.card-body {
    padding: 30px;
}

.card-body h3 {
    margin-bottom: 15px;
    color: var(--fesc-wine);
}

.campus-desc {
    color: #777;
    font-size: 0.95rem;
    line-height: 1.6;
    text-align: justify;
}

@media (max-width: 768px) {
    .campus-grid {
        grid-template-columns: 1fr;
    }
    .main-title {
        font-size: 2.5rem;
    }
}
</style>

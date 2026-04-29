<template>
    <div class="home-wrapper">
        <header class="hero">
            <div class="logo-container">
                <h1 class="institutional-title">FESC<span>360</span></h1>
            </div>
            <p class="subtitle">{{ $t('welcome') }}</p>
        </header>

        <main class="selection-container">
            <h2 class="section-title">{{ $t('select_campus') }}</h2>
            
            <div class="cards-grid">
                <!-- Sede Cúcuta -->
                <div 
                    class="campus-card" 
                    @click="$emit('navigate', 'recorrido', 'cucuta')"
                    v-observe-visibility="onVisible"
                >
                    <div class="card-image bg-cucuta"></div>
                    <div class="card-content">
                        <h3>{{ $t('campus_cucuta') }}</h3>
                        <p>Sede principal con acceso a todas las facultades.</p>
                        <button class="btn btn-primary">
                            {{ $t('explore') }}
                            <span v-html="Icons.ArrowRight"></span>
                        </button>
                    </div>
                </div>

                <!-- Sede Ocaña -->
                <div 
                    class="campus-card" 
                    @click="$emit('navigate', 'recorrido', 'ocana')"
                >
                    <div class="card-image bg-ocana"></div>
                    <div class="card-content">
                        <h3>{{ $t('campus_ocana') }}</h3>
                        <p>Nuestra sede en el corazón de Ocaña.</p>
                        <button class="btn btn-primary">
                            {{ $t('explore') }}
                            <span v-html="Icons.ArrowRight"></span>
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <footer class="home-footer">
            <p>&copy; 2026 Fundación de Estudios Superiores Comfanorte - FESC</p>
        </footer>
    </div>
</template>

<script setup>
import { Icons } from '../utils/icons';

defineEmits(['navigate']);

const onVisible = (isVisible) => {
    // Lazy load or animation trigger logic
};
</script>

<style scoped>
.home-wrapper {
    background-color: var(--fesc-light-gray);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
}

.hero {
    text-align: center;
    margin-bottom: 3rem;
    animation: fadeInDown 0.8s ease-out;
}

.institutional-title {
    font-size: 4rem;
    color: var(--fesc-gray);
    letter-spacing: -2px;
}

.institutional-title span {
    color: var(--fesc-red);
}

.subtitle {
    font-size: 1.2rem;
    color: var(--fesc-wine);
    opacity: 0.8;
}

.selection-container {
    max-width: 1000px;
    width: 100%;
}

.section-title {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--fesc-gray);
    position: relative;
}

.section-title::after {
    content: '';
    display: block;
    width: 50px;
    height: 4px;
    background: var(--fesc-red);
    margin: 10px auto;
    border-radius: 2px;
}

.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.campus-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
}

.campus-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(227, 5, 19, 0.15);
}

.card-image {
    height: 200px;
    background-size: cover;
    background-position: center;
    transition: transform 0.5s ease;
}

.campus-card:hover .card-image {
    transform: scale(1.1);
}

.bg-cucuta { background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://placehold.co/600x400/e30513/white?text=Cucuta+Sede'); }
.bg-ocana { background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('https://placehold.co/600x400/9c0f06/white?text=Ocana+Sede'); }

.card-content {
    padding: 1.5rem;
}

.card-content h3 {
    margin-bottom: 0.5rem;
    color: var(--fesc-wine);
}

.card-content p {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1.5rem;
}

.home-footer {
    margin-top: auto;
    padding: 2rem;
    color: #999;
    font-size: 0.8rem;
}

@keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

span :deep(svg) {
    width: 18px;
    height: 18px;
    vertical-align: middle;
    margin-left: 5px;
}
</style>

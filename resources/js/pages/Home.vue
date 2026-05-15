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
                    <div class="card-image-container" @click="navigateToCampus(campus.slug)">
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
                            <span class="explore-badge">Explorar</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <h3>{{ campus.name }}</h3>
                        <p class="campus-desc">{{ campus.description }}</p>
                        <div class="campus-social">
                            <a :href="campus.maps" target="_blank" class="social-btn" v-html="Icons.MapPin"></a>
                            <a :href="campus.instagram" target="_blank" class="social-btn" v-html="Icons.Instagram"></a>
                            <a :href="campus.facebook" target="_blank" class="social-btn" v-html="Icons.Facebook"></a>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <Footer />
    </div>
</template>

<script src="./Home.js"></script>
<style scoped src="./Home.css"></style>

<script src="./loader.js"></script>

<template>
    <Transition name="fade">
        <div v-if="visible" class="loader-overlay">
            <div class="loader-content">
                <div class="fesc-word">
                    <span 
                        v-for="(char, index) in chars" 
                        :key="index" 
                        class="char"
                        :class="char.class"
                    >{{ char.letter }}</span>
                </div>
                <div class="loader-line-container">
                    <div class="loader-line" ref="loaderLine"></div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style src="../../css/components/loader.css" scoped></style>

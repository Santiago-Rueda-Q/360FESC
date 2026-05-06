<script src="./header.js"></script>

<template>
    <nav class="main-header">
        <div class="container header-content">
            <div class="logo-area" @click="$emit('go-home')">
                <img src="/FESC.svg" alt="FESC Logo" class="header-logo">
            </div>
            <div class="nav-links">
                <span class="institutional-tag">{{ $t('welcome') }}</span>
            </div>
        </div>
    </nav>
</template>

<style src="../../css/components/header.css"></style>

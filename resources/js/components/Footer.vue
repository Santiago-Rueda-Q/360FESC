<script src="./footer.js"></script>

<template>
    <footer class="main-footer">
        <div class="footer-bg-elements">
            <div class="triangle tri-1"></div>
            <div class="triangle tri-2"></div>
        </div>
        
        <div class="container footer-content">
            <div class="footer-grid">
                <div class="footer-logos">
                    <img src="/FESC.svg" alt="FESC Logo" class="footer-logo-img">
                    <img src="/IDSE.svg" alt="IDSE Logo" class="footer-logo-img">
                    <img src="/Software.svg" alt="Software Logo" class="footer-logo-img">
                </div>
                
                <div class="footer-dev-text">
                    <h4>Desarrollado por el Semillero de Investigación IDSE</h4>
                    <div class="dev-names">
                        <p>Santiago Rueda Quintero</p>
                        <p>Nick Alejandro Ortega Mendez</p>
                        <p>Nelly Fabiola Cano Oviedo</p>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <div class="footer-bottom-flex">
                    <small>Innovación en Desarrollo de Software Empresarial - IDSE/FESC</small>
                    <button class="btn-admin-login" @click="openLogin">Admin Access</button>
                </div>
                <p>&copy; {{ year }}. Todos los derechos reservados.</p>
            </div>
        </div>
        <LoginModal :show="showLogin" @close="showLogin = false" />
    </footer>
</template>

<style src="../../css/components/footer.css" scoped></style>

import { ref } from 'vue';
import LoginModal from './LoginModal/index.vue';

export default {
    name: 'Footer',
    components: { LoginModal },
    setup() {
        const showLogin = ref(false);
        const openLogin = () => {
            showLogin.value = true;
        };

        const year = ref(new Date().getFullYear());

        return {
            showLogin,
            openLogin,
            year
        };
    }
};

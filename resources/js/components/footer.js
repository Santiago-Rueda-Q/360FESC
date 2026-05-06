import { ref } from 'vue';
import LoginModal from './LoginModal.vue';

export default {
    name: 'Footer',
    components: { LoginModal },
    setup() {
        const showLogin = ref(false);

        const openLogin = () => {
            showLogin.value = true;
        };

        return {
            showLogin,
            openLogin
        };
    }
};

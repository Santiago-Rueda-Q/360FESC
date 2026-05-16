import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    name: 'LoginModal',
    props: ['show'],
    emits: ['close'],
    setup(props, { emit }) {
        const router = useRouter();
        const email = ref('');
        const password = ref('');
        const loading = ref(false);

        const handleLogin = async () => {
            loading.value = true;
            try {
                const response = await axios.post('/api/login', {
                    email: email.value,
                    password: password.value
                });
                
                localStorage.setItem('auth_token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                router.push('/admin');
                emit('close');
            } catch (error) {
                const errorMsg = error.response?.data?.message || 'Error al iniciar sesión';
                alert(errorMsg);
            } finally {
                loading.value = false;
            }
        };

        return {
            email,
            password,
            loading,
            handleLogin
        };
    }
};

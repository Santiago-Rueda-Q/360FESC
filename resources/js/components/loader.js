import { ref, onMounted } from 'vue';
import { createTimeline, stagger } from 'animejs';

export default {
    name: 'Loader',
    setup() {
        const visible = ref(true);
        const chars = [
            { letter: 'F', class: 'char-f' },
            { letter: 'E', class: 'char-e' },
            { letter: 'S', class: 'char-s' },
            { letter: 'C', class: 'char-c' }
        ];
        const loaderLine = ref(null);

        onMounted(() => {
            const tl = createTimeline({
                onComplete: () => {
                    setTimeout(() => {
                        visible.value = false;
                    }, 800);
                }
            });

            tl
            .add('.char', {
                opacity: [0, 1],
                translateY: [20, 0],
                delay: stagger(150),
                duration: 1000,
                ease: 'outExpo'
            })
            .add(loaderLine.value, {
                width: ['0%', '100%'],
                duration: 800,
                ease: 'outExpo'
            }, '-=500')
            .add('.loader-content', {
                scale: [1, 1.2],
                opacity: [1, 0],
                duration: 600,
                ease: 'inBack'
            });
        });

        return {
            visible,
            chars,
            loaderLine
        };
    }
};

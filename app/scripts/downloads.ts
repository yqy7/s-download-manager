import createApp from "./app";
import downloadPage from '../component/downloadPage.vue';

createApp({
    el: '#app',
    components: {
        'app-root': downloadPage
    }
});

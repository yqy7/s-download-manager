import createApp from "./app";
import optionsPage from '../component/optionsPage.vue';

createApp({
    el: '#app',
    components: {
        'app-root': optionsPage
    }
});

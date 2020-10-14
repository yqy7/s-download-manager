import createApp from "./app";
import popupView from '../component/popup.vue';

createApp({
    el: '#app',
    components: {
        'app-root': popupView
    }
});


import createApp from "./app";
import popup from '../component/popup.vue';
import sniffer from '../component/sniffer.vue';

const routes = {
    '/': popup,
    '/sniffer': sniffer
}

let app = createApp({
    el: '#app'
}, routes);

(<any>globalThis).app = app;

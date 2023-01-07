import {createApp} from 'vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import 'normalize.css/normalize.css'

import Popup from '../components/Popup.vue'
import PopupDownload from '../components/PopupDownload.vue'
import Sniffer from '../components/Sniffer.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: PopupDownload
        },
        {
            path: '/sniffer',
            component: Sniffer
        }
    ]
})

const app = createApp(Popup)
app.use(router)
app.config.globalProperties.i18n = chrome.i18n.getMessage
app.mount('#app')

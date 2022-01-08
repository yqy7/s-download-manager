import {createApp} from 'vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import 'normalize.css/normalize.css'

import popup from '../component/popup.vue'
import popupDownload from '../component/popupDownload.vue'
import sniffer from '../component/sniffer.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: popupDownload
        },
        {
            path: '/sniffer',
            component: sniffer
        }
    ]
})

const app = createApp(popup)
app.use(router)
app.config.globalProperties.i18n = chrome.i18n.getMessage
app.mount('#app')

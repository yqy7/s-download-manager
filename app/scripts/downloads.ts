import {createApp} from 'vue'
import 'normalize.css/normalize.css'

import DownloadPage from '../components/DownloadPage.vue';

const app = createApp(DownloadPage)
app.config.globalProperties.i18n = chrome.i18n.getMessage
app.mount('#app')

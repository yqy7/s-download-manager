import {createApp} from 'vue'
import 'normalize.css/normalize.css'

import optionsPage from '../component/optionsPage.vue'

const app = createApp(optionsPage)
app.config.globalProperties.i18n = chrome.i18n.getMessage
app.mount('#app')

import {createApp} from 'vue'
import 'normalize.css/normalize.css'

import OptionsPage from '../components/OptionsPage.vue'

const app = createApp(OptionsPage)
app.config.globalProperties.i18n = chrome.i18n.getMessage
app.mount('#app')

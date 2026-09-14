import { createApp } from 'vue' // Creates the Vue app
import { IonicVue } from '@ionic/vue' // Uses Ionic with Vue
import App from './App.vue' // Main app component
import router from './router' // Page navigation
import '@ionic/vue/css/core.css' // Ionic basic styles
import '@ionic/vue/css/normalize.css' // Normalizes styles
import '@ionic/vue/css/structure.css' // Ionic page structure
import '@ionic/vue/css/typography.css' // Text styles
import '@ionic/vue/css/padding.css' // Padding styles
import '@ionic/vue/css/float-elements.css' // Float styles
import '@ionic/vue/css/text-alignment.css' // Text alignment
import '@ionic/vue/css/text-transformation.css' // Text formatting
import '@ionic/vue/css/flex-utils.css' // Flexbox styles
import '@ionic/vue/css/display.css' // Display styles
import './theme/variables.css' // App theme styles

const app = createApp(App) // Creates the app
app.use(IonicVue) // Adds Ionic
app.use(router) // Adds page navigation
router.isReady().then(() => { // Waits for the router
  app.mount('#app') // Starts the app
})
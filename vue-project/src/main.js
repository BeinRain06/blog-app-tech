import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// HTML Symbol to use in project

/* ballot X (&#10008; | &#x2718;) 
multiplication X (&#10005; | &#x2715;)
check mark (&#10003; | &#x2713;)
angle down (&#xfe40; | &#65088;)
curly logical OR (&#8910; | &#x22CE;)
*/

app.use(createPinia())
app.use(router)

app.mount('#app')

import { createApp } from "vue";
import "./style.css";

import App from "./App.vue";
import PrimeVue from "primevue/config";
import Editor from "primevue/editor";
import { createPinia } from "pinia";

import router from "./router";
import VueScrollTo from "vue-scrollto";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.use(VueScrollTo);

app.component("Editor", Editor);

app.mount("#app");

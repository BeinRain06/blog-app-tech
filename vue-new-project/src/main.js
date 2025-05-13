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

/* Quill Editor Config */

{
  /* <QuillEditor theme="snow" :toolbar = "[
              [{header : [2, 3, 4,5, 6, false] }], // header levels

[{font: [] }], // fontt family
[{size: ['small', false, 'large', 'huge']}], // font size
['bold', 'italic', 'underline', 'strike'], // formatting buttons
[{color: []}, {background : []}], // text and background colors
[{script: 'sub'}, {script: 'super'}], // subscript and superscript
[{list: 'ordered'}, {list: 'bullet'}], // Lists
[{indent: '-1', indent: '+1'}], // indentation
[{align: []}], // Alignment options
['blockquote', 'code-block'], // BlockQuote and code block
['link', 'image', 'video'], // media options
['clean'] // clean formatting

]"/> */
}

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './app.vue';
import router from './router';

const pinia = createPinia();

const app = createApp(App);

app.use(router);

app.use(pinia);

app.mount('#app');

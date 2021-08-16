import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import globalComponents from '@/components/index';

import '@/icons/index';
import 'normalize.css';
import '@/styles/index.scss';
import 'element-plus/lib/theme-chalk/index.css';
import 'animate.css';

const app = createApp(App);
app.use(ElementPlus, {
  size: 'small',
});
app.use(globalComponents);
app.use(store);
app.use(router);
app.mount('#app');

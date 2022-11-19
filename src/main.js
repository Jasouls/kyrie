import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installIcons from '@/icons'
import Antd from 'ant-design-vue'

import 'ant-design-vue/dist/antd.css'



import './utils/permission';

import './styles/index.less';

const app = createApp(App)
installIcons(app)
app.use(store).use(router).use(Antd).mount('#app')

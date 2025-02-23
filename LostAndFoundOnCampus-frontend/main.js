import Vue from 'vue'
import App from './App'
import store from '@/vuex/index.js'
import api from '@/request/api.js'
import util from '@/common/util.js'
import Time from '@/common/time.js'

Vue.config.productionTip = false
Vue.prototype.$store=store
Vue.prototype.$api=api
Vue.prototype.$util=util

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()

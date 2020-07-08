import Vue from 'vue';
// import DatetimePicker from 'mint-ui';
import App from './App';
// import loading from "./components/loadingCar";
import mFooter from "./components/footer";
import mHeader from "./components/header";
import loading from "./components/loading.vue";
import nextPage from "./components/next-page.vue";
import router from './router';
import store from './store';
// import dialog from 'assets/commonjs/dialog';
import val from 'assets/commonjs/validate';//表单验证插件
// import 'assets/commonjs/hammer';//touch事件封装插件
import 'assets/commonjs/commonFunctions';//全局方法
import 'assets/commonjs/commonDirective';//全局指令
// import 'assets/commonjs/qrcode.js';
import 'assets/commonjs/interceptor'//全局拦截器
// import 'assets/commonjs/filters.js'//全局拦截器

// import 'assets/style/link.less';//全局样式可以用  但是全局less函数要在每个需要的模块里再引用一遍
import "assets/style/mobiscroll/mobiscroll.javascript.css";
// import 'mint-ui/lib/style.css'
import VueScroller from 'vue-scroller'

Vue.use(VueScroller)

import { Toast } from 'vant';
Vue.use(Toast);
// Vue.use(dialog);
// Vue.use(DatetimePicker);
// Vue.prototype.mui = mui;
// mui.init();


Vue.config.productionTip = false;
// Vue.component("loadingCar",loading);
Vue.component("mFooter",mFooter);
Vue.component("mHeader",mHeader);
Vue.component("mLoad",loading);
Vue.component("next",nextPage);
/* 这里是整个页面的入口，定义了DOM对象和整个页面的路由程序。
*  template会将el指向的DOM对象整个替换掉。
* */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App}
});


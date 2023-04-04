import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/zh-CN";
// import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control

import Antd from "ant-design-vue"; //ant design
import "ant-design-vue/dist/antd.css"; //ant design

if (process.env.NODE_ENV === "production") {
  const { mockXHR } = require("../mock");
  mockXHR();
}

//清空表单
import resetForm from "@/utils/resetForm";
Vue.prototype.$resetForm = resetForm;

//信息提示框
import myconfirm from "@/utils/myconfirm";
Vue.prototype.$myconfirm = myconfirm;

//对象快速复制
import objCoppy from "@/utils/objCoppy";
Vue.prototype.$objCoppy = objCoppy;

//按钮权限判断
import hasPermission from "@/permission/index";
Vue.prototype.hasPerm = hasPermission;

//echarts
import echarts from "echarts";
Vue.prototype.$echarts = echarts;

Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(Antd);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});

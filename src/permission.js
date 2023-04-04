import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  //设置页面标题
  document.title = getPageTitle(to.meta.title);

  //获取token
  const hasToken = getToken();

  if (hasToken) {
    //判断是否登陆来的请求
    if (to.path === "/login") {
      //跳转到首页
      next({ path: "/" });
      NProgress.done();
    } else {
      //从store里面获取用户信息
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      if (hasRoles) {
        //权限存在直接放行
        next();
      } else {
        try {
          //如果用户信息不存在，那么会从服务器获取用户信息
          const { roles } = await store.dispatch("user/getInfo");
          //从服务器获取菜单路由信息
          const accessRoutes = await store.dispatch(
            "permission/generateRoutes",
            roles
          );
          let obj = { path: "*", redirect: "/404", hidden: true };
          accessRoutes.push(obj);
          //返回的数据动态添加到路由
          router.addRoutes(accessRoutes);
          //next()
          next({ ...to, replace: true });
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    //判断路由是否在白名单中
    if (whiteList.indexOf(to.path) !== -1) {
      //在则放行
      next();
    } else {
      //不在则跳转到登录
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

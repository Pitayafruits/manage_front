import { constantRoutes } from "@/router";
import { getMenuList } from "@/api/user";
import Layout from "@/layout";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      //动态找到页面路径
      const component = tmp.component;
      if (route.component) {
        //判断是一级菜单
        if (component == "Layout") {
          tmp.component = Layout;
        } else {
          tmp.component = (resolve) =>
            require([`@/views${component}`], resolve);
        }
      }
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  routes: [],
  addRoutes: [],
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
};

const actions = {
  //获取路由数据
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      getMenuList()
        .then((res) => {
          let accessedRoutes;
          if (res.code == 200) {
            accessedRoutes = filterAsyncRoutes(res.data, roles);
          }
          //返回的数据存到vuex里面
          commit("SET_ROUTES", accessedRoutes);
          resolve(accessedRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  //   generateRoutes({ commit }, roles) {
  //     return new Promise((resolve) => {
  //       let accessedRoutes;
  //       if (roles.includes("admin")) {
  //         accessedRoutes = asyncRoutes || [];
  //       } else {
  //         accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
  //       }
  //       commit("SET_ROUTES", accessedRoutes);
  //       resolve(accessedRoutes);
  //     });
  //   },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/layout";

export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "欢迎访问", icon: "el-icon-star-off" },
      },
    ],
  },

  //权限管理
  // {
  //   path: "/user",
  //   component: Layout,
  //   name: "user",
  //   alwaysShow: true,
  //   meta: { title: "权限管理", icon: "el-icon-tickets" },
  //   children: [
  //     {
  //       path: "/worker",
  //       name: "worker",
  //       component: () => import("@/views/user/worker"),
  //       meta: { title: "物业人员管理" },
  //     },
  //     {
  //       path: "/role",
  //       name: "role",
  //       component: () => import("@/views/user/role"),
  //       meta: { title: "角色管理" },
  //     },
  //     {
  //       path: "/menu",
  //       name: "menu",
  //       component: () => import("@/views/user/menu"),
  //       meta: { title: "权限管理" },
  //     },
  //   ],
  // },

  // //楼盘管理
  // {
  //   path: "/houseBuilding",
  //   component: Layout,
  //   name: "houseBuilding",
  //   alwaysShow: true,
  //   meta: { title: "楼盘管理", icon: "el-icon-office-building" },
  //   children: [
  //     {
  //       path: "/building",
  //       name: "building",
  //       component: () => import("@/views/houseBuilding/building"),
  //       meta: { title: "楼宇管理" },
  //     },
  //     {
  //       path: "/unit",
  //       name: "unit",
  //       component: () => import("@/views/houseBuilding/unit"),
  //       meta: { title: "单元管理" },
  //     },
  //     {
  //       path: "/house",
  //       name: "house",
  //       component: () => import("@/views/houseBuilding/house"),
  //       meta: { title: "房屋管理" },
  //     },
  //   ],
  // },

  // //车位管理
  // {
  //   path: "/parking",
  //   component: Layout,
  //   name: "parking",
  //   alwaysShow: true,
  //   meta: { title: "车辆管理", icon: "el-icon-truck" },
  //   children: [
  //     {
  //       path: "/parkingList",
  //       name: "parkingList",
  //       component: () => import("@/views/parking/parkingList"),
  //       meta: { title: "车位管理" },
  //     },
  //   ],
  // },

  // //业主管理
  // {
  //   path: "/liver",
  //   component: Layout,
  //   name: "liver",
  //   alwaysShow: true,
  //   meta: { title: "业主管理", icon: "el-icon-user" },
  //   children: [
  //     {
  //       path: "/liverList",
  //       name: "liverList",
  //       component: () => import("@/views/liver/liver"),
  //       meta: { title: "业主列表" },
  //     },
  //   ],
  // },

  // //收费管理
  // {
  //   path: "/pay",
  //   component: Layout,
  //   name: "pay",
  //   alwaysShow: true,
  //   meta: { title: "收费管理", icon: "el-icon-money" },
  //   children: [
  //     {
  //       path: "/electricList",
  //       name: "electricList",
  //       component: () => import("@/views/pay/electric"),
  //       meta: { title: "电费管理" },
  //     },
  //     {
  //       path: "/waterList",
  //       name: "waterList",
  //       component: () => import("@/views/pay/water"),
  //       meta: { title: "水费管理" },
  //     },
  //     {
  //       path: "/parkList",
  //       name: "parkList",
  //       component: () => import("@/views/pay/park"),
  //       meta: { title: "停车费管理" },
  //     },
  //   ],
  // },

  // //小区管理
  // {
  //   path: "/community",
  //   component: Layout,
  //   name: "community",
  //   alwaysShow: true,
  //   meta: { title: "小区管理", icon: "el-icon-bangzhu" },
  //   children: [
  //     {
  //       path: "/commInfo",
  //       name: "commInfo",
  //       component: () => import("@/views/community/commInfo"),
  //       meta: { title: "小区信息管理" },
  //     },
  //     {
  //       path: "/facilities",
  //       name: "facilities",
  //       component: () => import("@/views/community/facilities"),
  //       meta: { title: "周边设施管理" },
  //     },
  //     {
  //       path: "/notice",
  //       name: "notice",
  //       component: () => import("@/views/community/notice"),
  //       meta: { title: "物业公告管理" },
  //     },
  //   ],
  // },

  // //投诉管理
  // {
  //   path: "/liverComplaint",
  //   component: Layout,
  //   name: "liverComplaint",
  //   alwaysShow: true,
  //   meta: { title: "投诉管理", icon: "el-icon-edit-outline" },
  //   children: [
  //     {
  //       path: "/myComplaint",
  //       name: "myComplaint",
  //       component: () => import("@/views/complaint/myComplaint"),
  //       meta: { title: "我的投诉" },
  //     },
  //     {
  //       path: "/complaintList",
  //       name: "complaintList",
  //       component: () => import("@/views/complaint/complaintList"),
  //       meta: { title: "投诉列表" },
  //     },
  //   ],
  // },

  // //维修管理
  // {
  //   path: "/liverRepair",
  //   component: Layout,
  //   name: "liverRepair",
  //   alwaysShow: true,
  //   meta: { title: "维修管理", icon: "el-icon-thumb" },
  //   children: [
  //     {
  //       path: "/myRepair",
  //       name: "myRepair",
  //       component: () => import("@/views/repair/myRepair"),
  //       meta: { title: "我的报修" },
  //     },
  //     {
  //       path: "/repairList",
  //       name: "repairList",
  //       component: () => import("@/views/repair/repairList"),
  //       meta: { title: "维修列表" },
  //     },
  //   ],
  // },

  // { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;

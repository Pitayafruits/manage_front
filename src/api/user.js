import http from "@/utils/http";
import { getUserId } from "@/utils/auth";

//首页获取物业人员列表
export async function getAllWorkerApi() {
  return await http.get("/worker/workerList");
}
//获取物业人员列表
export async function getWorkerListApi(parm) {
  return await http.get("/worker/list", parm);
}
//新增物业人员
export async function addWorkerApi(parm) {
  return await http.post("/worker", parm);
}

//编辑物业人员
export async function editWorkerApi(parm) {
  return await http.put("/worker", parm);
}

//删除物业人员
export async function deleteWorkerApi(parm) {
  return await http.delete("/worker", parm);
}

//员工登录
export async function login(parm) {
  return await http.post("/user/login", parm);
}

//获取用户信息
export async function getInfo() {
  let parm = { userId: getUserId() };
  return await http.get("/user/getInfo", parm);
}

//根据用户id获取角色
export async function getRoleByUserIdApi(parm) {
  return await http.get("/user/getRoleByUserId", parm);
}

//保存用户角色
export async function assignSaveApi(parm) {
  return await http.post("/user/saveRole", parm);
}

//获取菜单数据
export async function getMenuList() {
  return await http.get("/user/getMenuList", null);
}

//退出登录
export async function loginOut() {
  return await http.post("/user/loginOut", null);
}

//修改密码
export async function resetPasswordApi(parm) {
  return await http.post("/user/resetPassword", parm);
}

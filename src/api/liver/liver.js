import http from "@/utils/http";

//新增
export async function addLiverApi(parm) {
  return await http.post("/liver", parm);
}

//获取角色列表
export async function getRoleListApi() {
  return await http.get("/role/roleList", null);
}

//分页查询
export async function getLiverListApi(parm) {
  return await http.get("/liver/list", parm);
}

//根据业主id查询业主
export async function getLiverById(parm) {
  return await http.get("/liver/getLiverById", parm);
}

//编辑
export async function editLiverApi(parm) {
  return await http.put("/liver", parm);
}

//查询房屋列表
export async function getHouseListApi(parm) {
  return await http.get("/house/list", parm);
}

//业主分配房屋
export async function assignHouseSaveApi(parm) {
  return await http.post("/liver/assignLiverHouse", parm);
}

//获取车位列表
export async function getParkingListApi(parm) {
  return await http.get("/parking/list", parm);
}

//业主分配车位
export async function assignParkSaveApi(parm) {
  return await http.post("/liver/assignLiverPark", parm);
}

//退房
export async function backHouseApi(parm) {
  return await http.post("/liver/backHouse", parm);
}

//退车位
export async function backParkingApi(parm) {
  return await http.post("/liver/backParking", parm);
}

//删除业主
export async function deleteLiverApi(parm) {
  return await http.delete("/liver", parm);
}

//查询业主数量
export async function getLiverNumApi() {
  return await http.get("/liver/getLiverNum", null);
}

//重置密码发送短信
export async function sendPhoneMsgApi(parm) {
  return await http.post("/liver/sendMsg", parm);
}

//重置密码
export async function liverResetPassAPi(parm) {
  return await http.post("/liver/resetPassword", parm);
}

import http from "@/utils/http";

//查询列表
export async function getHouseListApi(parm) {
  return await http.get("/house/list", parm);
}

//新增
export async function addHouseApi(parm) {
  return await http.post("/house", parm);
}

//查询楼宇列表
export async function getBuildingApi() {
  return await http.get("/building/unitList", null);
}

//根据楼宇id查询单元列表
export async function getUnitListByIdApi(parm) {
  return await http.get("/unit/getUnitListByBuildingId", parm);
}

//编辑
export async function editHouseApi(parm) {
  return await http.put("/house", parm);
}

//删除
export async function deleteHouseApi(parm) {
  return await http.delete("/house", parm);
}

//查询房屋数量
export async function getHouseNumApi() {
  return await http.get("/house/getHouseNum", null);
}

import http from "@/utils/http";

//获取单元列表
export async function getUnitListApi(parm) {
  return await http.get("/unit/list", parm);
}

//新增单元
export async function addUnitApi(parm) {
  return await http.post("/unit", parm);
}

//单元列表查询
export async function unitListApi() {
  return await http.get("/building/unitList", null);
}

//编辑单元
export async function editUnitApi(parm) {
  return await http.put("/unit", parm);
}

//删除单元
export async function deleteUnitApi(parm) {
  return await http.delete("/unit", parm);
}

import http from "@/utils/http";

//添加设施
export async function addFacilitiesApi(parm) {
  return await http.post("/facilities", parm);
}

//分页查询
export async function getFacilitiesListApi(parm) {
  return await http.get("/facilities/list", parm);
}

//编辑
export async function editFacilitiesApi(parm) {
  return await http.put("/facilities", parm);
}

//删除
export async function deleteFacilitiesApi(parm) {
  return await http.delete("/facilities", parm);
}

//首页查询设施分页列表
export async function getIndexFacListApi() {
  return await http.get("/facilities/getFacList", null);
}

import http from "@/utils/http";

//获取楼宇列表
export async function getBuildingListApi(parm) {
  return await http.get("/building/list", parm);
}

//新增楼宇
export async function addBuildingApi(parm) {
  return await http.post("/building", parm);
}

//编辑楼宇
export async function editBuildingApi(parm) {
  return await http.put("/building", parm);
}

//删除楼宇
export async function deleteBuildingApi(parm) {
  return await http.delete("/building", parm);
}

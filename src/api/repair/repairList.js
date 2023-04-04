import http from "@/utils/http";

//维修列表
export async function getRepairListApi(parm) {
  return await http.get("/repair/list", parm);
}

//新增
export async function addRepairApi(parm) {
  return await http.post("/repair", parm);
}

//编辑
export async function editRepairApi(parm) {
  return await http.put("/repair", parm);
}

//删除
export async function deleteRepairApi(parm) {
  return await http.delete("/repair", parm);
}

//我的报修
export async function getMyRepairApi(parm) {
  return await http.get("/repair/myRepair", parm);
}

//处理报修
export async function overRepairApi(parm) {
  return await http.put("/repair/overRepair", parm);
}

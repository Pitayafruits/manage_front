import http from "@/utils/http";

//投诉列表
export async function getComplaintListApi(parm) {
  return await http.get("/complaint/list", parm);
}

//新增
export async function addComplaintApi(parm) {
  return await http.post("/complaint", parm);
}

//编辑
export async function editComplaintApi(parm) {
  return await http.put("/complaint", parm);
}

//删除
export async function deleteComplaintApi(parm) {
  return await http.delete("/complaint", parm);
}

//我的投诉
export async function getMyComplaintApi(parm) {
  return await http.get("/complaint/myComplaint", parm);
}

//处理投诉
export async function sloveComplaintApi(parm) {
  return await http.put("/complaint/overComplaint", parm);
}

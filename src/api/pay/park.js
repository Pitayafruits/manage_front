import http from "@/utils/http";

//分页查询
export async function getParkListApi(parm) {
  return await http.get("/park/list", parm);
}

//数据回显 查询车位列表
export async function getListNoPageApi() {
  return await http.get("/park/getListNoPage", null);
}

//新增
export async function addParkApi(parm) {
  return await http.post("/park", parm);
}

//编辑
export async function editParkApi(parm) {
  return await http.put("/park", parm);
}

//删除
export async function deleteParkApi(parm) {
  return await http.delete("/park", parm);
}

//缴费
export async function payParkApi(parm) {
  return await http.post("/park/payPark", parm);
}

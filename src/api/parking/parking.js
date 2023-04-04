import http from "@/utils/http";

//获取列表
export async function getParkingListApi(parm) {
  return await http.get("/parking/list", parm);
}

//新增
export async function addParkingApi(parm) {
  return await http.post("/parking", parm);
}

//编辑
export async function editParkingApi(parm) {
  return await http.put("/parking", parm);
}

//删除
export async function deleteParkingApi(parm) {
  return await http.delete("/parking", parm);
}

//查询车位数量
export async function getParkingNumApi() {
  return await http.get("/parking/getParkingNum", null);
}

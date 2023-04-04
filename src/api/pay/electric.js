import http from "@/utils/http";

//根据单元id查询房屋列表
export async function getHouseListByUnitIdApi(parm) {
  return await http.get("/house/getHouseListByUnitId", parm);
}

//新增电费
export async function addElectricApi(parm) {
  return await http.post("/electric", parm);
}

//分页查询
export async function getElectricListApi(parm) {
  return await http.get("/electric/list", parm);
}

//编辑电费
export async function editElectricApi(parm) {
  return await http.put("/electric", parm);
}

//删除电费
export async function deleteElectricApi(parm) {
  return await http.delete("/electric", parm);
}

//缴电费
export async function payElectricApi(parm) {
  return await http.post("/electric/payElectric", parm);
}

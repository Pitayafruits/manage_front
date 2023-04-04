import http from "@/utils/http";

//根据单元id查询房屋列表
export async function getHouseListByUnitIdApi(parm) {
  return await http.get("/house/getHouseListByUnitId", parm);
}

//新增水费
export async function addWaterApi(parm) {
  return await http.post("/water", parm);
}

//分页查询
export async function getWaterListApi(parm) {
  return await http.get("/water/list", parm);
}

//编辑水费
export async function editWaterApi(parm) {
  return await http.put("/water", parm);
}

//删除水费
export async function deleteWaterApi(parm) {
  return await http.delete("/water", parm);
}

//缴水费
export async function payWaterApi(parm) {
  return await http.post("/water/payWater", parm);
}

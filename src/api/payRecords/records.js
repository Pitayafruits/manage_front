import http from "@/utils/http";

//水费查询
export async function getLiverWaterListApi(parm) {
  return await http.get("/records/waterList", parm);
}

//电费查询
export async function getLiverElectricListApi(parm) {
  return await http.get("/records/electricList", parm);
}

//停车费查询
export async function getLiverParkListApi(parm) {
  return await http.get("/records/parkList", parm);
}

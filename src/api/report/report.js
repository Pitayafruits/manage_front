import http from "@/utils/http";

//按月份查询投诉数量
export async function getComplaintCountApi() {
  return await http.get("/report/getComplaintCount");
}

//按月份查询报修数量
export async function getRepairCountApi() {
  return await http.get("/report/getRepairCount");
}

//房屋入住率
export async function getHouseStatusApi() {
  return await http.get("/report/getHouseStatus");
}

//小区各栋楼的人数
export async function getLiverBuildApi() {
  return await http.get("/report/getLiverCount");
}

//车位使用率
export async function getParkingStatusApi() {
  return await http.get("/report/getParkingStatus");
}

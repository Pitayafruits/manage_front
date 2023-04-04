import http from "@/utils/http";

//获取小区基本信息
export async function getCommInfoApi() {
  return http.get("/community/info");
}

//修改小区基本信息
export async function saveCommInfoApi(parm) {
  return http.put("/community/update", parm);
}

//首页获取小区基本信息
export async function getIndexCommInfoApi() {
  return await http.get("/community/comminfo");
}

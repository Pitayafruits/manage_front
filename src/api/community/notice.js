import http from "@/utils/http";

//分页查询
export async function getNoticeListApi(parm) {
  return await http.get("/notice/list", parm);
}

//添加
export async function addNoticeApi(parm) {
  return await http.post("/notice", parm);
}

//编辑
export async function editNoticeApi(parm) {
  return await http.put("/notice", parm);
}

//删除
export async function deleteNoticeApi(parm) {
  return await http.delete("notice", parm);
}

//首页分页查询
export async function getIndexNoticeListApi(parm) {
  return await http.get("/notice/getNoticeList", parm);
}

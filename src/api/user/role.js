import http from "@/utils/http";

//获取角色列表
export async function getRoleListApi(parm) {
  return await http.get("/role/list", parm);
}

//新增角色
export async function addRoleApi(parm) {
  return await http.post("/role", parm);
}

//编辑角色
export async function editRoleApi(parm) {
  return await http.put("/role", parm);
}

//删除角色
export async function deleteRoleApi(parm) {
  return await http.delete("/role", parm);
}

//获取分配权限树数据
export async function getAssignTreeApi(parm) {
  return await http.post("/role/getAssignTree", parm);
}

//保存分配的权限
export async function assignSaveApi(parm) {
  return await http.post("/role/saveAssignTree", parm);
}

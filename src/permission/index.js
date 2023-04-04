//判断按钮权限
export default function hasPermission(parm) {
  let tag = false;
  let codeList = JSON.parse(sessionStorage.getItem("codeList"));
  for (let i = 0; i < codeList.length; i++) {
    if (codeList[i] === parm) {
      tag = true;
      break;
    }
  }
  return tag;
}

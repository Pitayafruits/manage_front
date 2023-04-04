//清空表單
export default function resetForm(formName, obj) {
  //清空表单
  if (this.$refs[formName]) {
    this.$refs[formName].resetFields();
  }
  //清空数据域
  Object.keys(obj).forEach((key) => {
    obj[key] = "";
  });
}

//对象的快速复制  不存在的key不复制
export default async function objCoppy(obj1, obj2) {
  Object.keys(obj2).forEach((key) => {
    obj2[key] = obj1[key];
  });
}

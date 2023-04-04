import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import qs from "qs";

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_PRO,
  timeout: 5000,
});

// 请求发送之前拦截器
service.interceptors.request.use(
  (config) => {
    // 如果token存在，把token添加到请求头部
    if (store.getters.token) {
      config.headers["token"] = getToken();
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

// 请求返回之后的处理
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (res.code !== 200) {
      Message({
        message: res.msg || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      //token过期或验证失败
      if (res.code === 600) {
        MessageBox.confirm("登陆已过期，请重新登录", "提示", {
          confirmButtonText: "登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.msg,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

//请求方法
const http = {
  post(url, params) {
    return service.post(url, params, {
      transformRequest: [
        (params) => {
          return JSON.stringify(params);
        },
      ],
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  put(url, params) {
    return service.put(url, params, {
      transformRequest: [
        (params) => {
          return JSON.stringify(params);
        },
      ],
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  //parm =>  {id:10}
  // http://localhost:8089/api/user?id=10
  get(url, params) {
    return service.get(url, {
      params: params,
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    });
  },
  //parm =>  {id:10}
  // http://localhost:8089/api/user/10
  getRestApi(url, params) {
    let _params;
    if (Object.is(params, undefined || null)) {
      _params = "";
    } else {
      _params = "/";
      for (const key in params) {
        console.log(key);
        console.log(params[key]);
        // eslint-disable-next-line no-prototype-builtins
        if (
          params.hasOwnProperty(key) &&
          params[key] !== null &&
          params[key] !== ""
        ) {
          _params += `${params[key]}/`;
        }
      }
      //去掉参数最后一位?
      _params = _params.substr(0, _params.length - 1);
    }
    console.log(_params);
    if (_params) {
      return service.get(`${url}${_params}`);
    } else {
      return service.get(url);
    }
  },
  //parm =>  {id:10}
  // http://localhost:8089/api/user/10
  delete(url, params) {
    let _params;
    if (Object.is(params, undefined || null)) {
      _params = "";
    } else {
      _params = "/";
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (
          params.hasOwnProperty(key) &&
          params[key] !== null &&
          params[key] !== ""
        ) {
          _params += `${params[key]}/`;
        }
      }
      //去掉参数最后一位?
      _params = _params.substr(0, _params.length - 1);
    }
    if (_params) {
      return service.delete(`${url}${_params}`).catch((err) => {
        // message.error(err.msg)
        return Promise.reject(err);
      });
    } else {
      return service.delete(url).catch((err) => {
        // message.error(err.msg)
        return Promise.reject(err);
      });
    }
  },
  upload(url, params) {
    return service.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
export default http;

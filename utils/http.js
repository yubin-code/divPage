import cof from "../config.js";
import { getData } from "./util.js";

/**
 * 网络请求
 */
const Request = (type, url, data, call) => {
  // 所有的请求都是需要一个appid
  // data.appid = cof.APPID
  let user = getData('user') || {};
  let header = { "Content-Type": 'application/json' }
  header["Authorization"] = "Bearer " + (user.token || '')

  wx.request({
    header,
    method: type,
    url: url,
    data: data,
    success: (res) => {
      (typeof call == "function") && call(res.data, "");
    },
    fail: (err) => {
      (typeof call == "function") && call(null, err.errMsg);
    }
  });
}
// get请求
const Get = (url, data, call) => Request('GET', cof.HOST + url, data, call);
// post请求
const Post = (url, data, call) => Request('POST', cof.HOST + url, data, call);
// Put请求
const Put = (url, data, call) => Request('Put', cof.HOST + url, data, call);
/**
 * 上传文件
 * @param url 上传的url地址
 * @param file 上传的文件
 * @param name 上传的文件名
 * @param data 附带的数据
 * @param call 回调
 */
const Upload = (url, file, name, data, call) => {
  let user = getData('user') || {};
  let header = { "Content-Type": 'multipart/form-data' }
  header["Authorization"] = "Bearer " + (user.token || '')
  wx.uploadFile({
    url: cof.HOST + url,
    filePath: file,
    name: name,
    formData: data,
    header,
    success: (res) => {
      if (typeof (res.data) == "string") {
        (typeof call == "function") && call(JSON.parse(res.data), "");
      } else {
        (typeof call == "function") && call(res.data, "");
      }
    },
    fail: (err) => {
      // (typeof call == "function") && call(null, err.errMsg);
    }
  });
};
/**
 * 下载文件
 */
const downFile = (url, call) => {
  wx.downloadFile({
    url: cof.HOST + url,
    success: function (res) {
      (typeof call == "function") && call(res.tempFilePath, "");
    }
  })
}

// 导出模块
export {
  Get,
  Post,
  Put,
  Request,
  Upload,
  downFile
};
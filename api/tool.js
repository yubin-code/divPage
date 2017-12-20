import { showModal } from '../utils/util.js';
import { Post, Get, Upload } from '../utils/http.js'

// 获取验证码
const getCode = (tel, callback) => {
  Get('/api/user/phoneVerify/' + tel, {}, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0){
      showModal({ content: '获取验证码失败' });
      return false;
    }
    typeof callback == "function" && callback();
  });
}

// 校验验证码
const checkCode = (tel, code, callback) => {
  Post('/api/user/phoneVerify/' + tel + '/' + code, {}, res => {
    if (res.status.code !== 0){
      showModal({ content: '验证码错误' });
      return false;
    }
    typeof callback == "function" && callback();
  });
}

// 上传图片
const updata = (file, name, callback) => {
  Upload('/api/resource/upload',file, name, {}, callback);
}

export {
  getCode,
  checkCode,
  updata
}
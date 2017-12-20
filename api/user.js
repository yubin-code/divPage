import { setData, getData, showModal } from '../utils/util.js';
import { Post, Get } from '../utils/http.js'
const login = (e, _this, callback) => {
  let userInfo = e.detail;
  wx.login({
    success: (res) => {
      if (res.code) {
        // 登录成功
        delete userInfo.errMsg;
        delete userInfo.rawData;
        delete userInfo.userInfo;
        let d = {
          code: res.code,
          user: userInfo
        }
        Post('/api/login', d, (data) => {
          if (data.status.code === 0 && data.status.message == 'success'){
            setData('user', data.data);
            _this.setData({ user: data.data });
            typeof callback == "function" && callback(data.data);
          }else {
            showModal({ content: '授权失败请重新授权' });
          }
        })
      }else {
        // 获取登录失败
        showModal({ content: '授权失败请重新授权' });
      }
    }
  })
}

// 获取用户资料
const getUser = () => {
  return getData('user');
}

// 获取用户场景
const getSummary = callback => {
  Get('/api/user/summary', {}, res => {
    if (res.status.code !== 0){
      // return showModal({ content: '请您先授权登录' });
      return false;
    }
    let user = Object.assign(res.data, getUser());
    typeof callback == "function" && callback(user);
  });
}

export {
  login,
  getUser,
  getSummary
}
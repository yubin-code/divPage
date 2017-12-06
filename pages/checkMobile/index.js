import { showModal, setData, getData } from '../../utils/util.js';
import { checkCode, getCode } from "../../api/tool.js";

//index.js
//获取应用实例
const app = getApp()
Page({
  data: { tel: '', code: '', sum: 0 },
  onLoad: function () {

  },
  bindTel: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  bindCode (e){
    this.setData({
      code: e.detail.value
    })
  },
  getCode (){
    if (this.checkTel()) return false;
    if (this.data.sum !== 0 ) return false;
    getCode(this.data.tel, () => {
      let sum = 60;
      this.setData({ sum });
      let time = setInterval(() => {
        sum--;
        if (sum == 0){
          clearInterval(time);
        }
        this.setData({ sum });
      }, 1000);
    });
  },
  checkCode () {
    if (this.checkTel()) return false;
    if (this.checkCo()) return false;
    
    // 校验验证码
    checkCode(this.data.tel, this.data.code,() => {
      let user = getData('user');
      user.telVerified = true;
      setData('user', user);
      wx.navigateBack({ delta: 1 })
    });
  },

  checkTel (){
    if (!/^((\(\d{2,3}\))|(\d{3}\-))?1\d{10}$/.test(this.data.tel)) {
      showModal({ content: '请输入正确手机号' });
      return true;
    }
  },
  checkCo (){
    if (this.data.code.length <= 0){
      showModal({ content: '请输入验证码' });
      return true;
    }
  }
})

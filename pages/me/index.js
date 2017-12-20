//index.js
//获取应用实例
const app = getApp();
import { login, getUser } from "../../api/user.js";
import { getSummary } from "../../api/user.js";
Page({
  data: {
    tel: '15831676447',
    status:{
      '0': '',
      '1': "手机未认证，只能制作场景，不可发布场景"
    }
  },
  onLoad: function () {
    let user = getUser() || '';
    this.setData({ user });
  },
  onShow (){
    getSummary(data => {
      data.sIndex = 0;
      if (!data.telVerified) {
        data.sIndex = 1;
      }
      
      this.setData(data);
    });
  },
  Phone (){
    wx.makePhoneCall({ phoneNumber: this.data.tel })
  },
  login(e) {
    login(e, this, (user) => {
      getSummary(data => {
        data.sIndex = 0;
        if (!data.telVerified) {
          data.sIndex = 1;
        }
        this.setData(data);
      });
    });
  }
})

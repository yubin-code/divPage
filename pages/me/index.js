//index.js
//获取应用实例
const app = getApp();
import { getSummary } from "../../api/user.js";
Page({
  data: {
    tel: '13661210020'
  },
  onLoad: function () {

  },
  onShow (){
    getSummary(data => {
      this.setData(data);
    });
  },
  Phone (){
    wx.makePhoneCall({ phoneNumber: this.data.tel })
  }
})

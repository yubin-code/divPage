import { login, getUser } from "../../api/user.js";
import { getBuildin } from "../../api/scenes.js";
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {},
  onShow (){
    getBuildin({ page: 1, size: 20 }, data => {
      this.setData({ list: data });
    });
  },
  onLoad: function () {
    let user = getUser() || '';
    this.setData({ user });
    wx.getSystemInfo({
      success: (res) => {
        this.setData({ width: res.windowWidth, height: res.windowHeight });
      }
    });
  },
  login (e){
    login(e, this);
  }
})

import { getScenesList } from "../../api/scenes.js";
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {},
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      let index = res.target.dataset.index;
      let data = this.data.list[index];
      let share = { path: '/pages/divPage/index?id=' + data._id + '&uid=' + data.ref};
      if (data.title) share['title'] = data.description || data.title;
      if (data.cover) share['imageUrl'] = data.cover;
      return share;
    }
  },
  onShow(){
    getScenesList({ page: 1, size: 20}, data => {
      this.setData({ list: data });
    });
  },
  onLoad: function () {
    wx.hideShareMenu()
  },
})

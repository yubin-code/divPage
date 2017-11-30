//index.js
//获取应用实例
const app = getApp()
Page({
  data: {},
  onShareAppMessage: function () {
    return {
      title:"测试分享",
      path: '/pages/index/index',
    };
  },
  onLoad: function () {},
})

//index.js
import { setData, getData } from "../../utils/util.js"
//获取应用实例
const app = getApp()
Page({
  data: {
    cover:{}
  },
  onShareAppMessage: function () {
    return {
      title:"测试分享",
      path: '/pages/index/index',
    };
  },
  onLoad: function () {
    let cover = getData("cover");
    this.setData(cover);
  },
  getImg (){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album'],
      success: res => {
        var tempFilePaths = res.tempFilePaths
        this.setData({ image: tempFilePaths[0] });
      }
    })
  },
  formSubmit (e){
    let data = e.detail.value;
    data.image = this.data.image;
    setData("cover", data);
    wx.navigateBack({ delta: 1 })
  },
})

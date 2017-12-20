import { createChanne, getChanneDetails, updateChanne } from "../../api/channel.js";
//index.js
//获取应用实例
const app = getApp()
Page({
  data: { channelName: '' },
  onLoad: function (param) {
    if (param.mode == 'add'){
      this.setData({ mode: 'add' });
      wx.setNavigationBarTitle({ title: '添加渠道' })
    }
    if (param.id){
      getChanneDetails(param.id, details => {
        let channelName = details.channelName;
        this.setData({ details, channelName });
      });
    }
    
  },
  bindName(e) {
    this.setData({
      channelName: e.detail.value
    })
  },
  submit (){
    let channelName = this.data.channelName;

    if (this.data.mode == 'add'){
      // 创建新的渠道
      createChanne({ channelName }, () => {
        wx.navigateBack({ delta: 1 })
      });
      return false;
    }

    if (this.data.details._id){
      let newChannelName = channelName
      updateChanne(this.data.details._id ,{ newChannelName }, () => {
        wx.navigateBack({ delta: 1 })
      });
    }
  }
})

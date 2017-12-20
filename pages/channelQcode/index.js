import { getUser } from "../../api/user.js";
import { getScenesList } from "../../api/scenes.js";
import { getQcode, downCode, shareChanne } from "../../api/channel.js";
import { showModal, getData, showToast } from "../../utils/util.js"
import cof from "../../config.js"
//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
  },
  onShareAppMessage: function (res) {
    // 来自页面内转发按钮
    let scene = this.data.scene;
    return shareChanne({
      id: scene.id,
      uid: scene.uid,
      channelid: scene.channelid,
      title: scene.title,
      cover: scene.cover,
    });
  },
  onLoad(param) {
    let user = getUser() || '';
    this.setData({ user, scene: param });
    wx.hideShareMenu();
    getQcode({
      scenesId: this.data.scene.id,
      channelId: this.data.scene.channelid
    }, data => {
      let qcode = [cof.HOST, 'api/resource/image', (data && data.qrUri)].join('/')
      this.setData({ qcode});
    });
  },
  onShow(){
    let page = this.data.page;
    let size = this.data.size;
    let user = getData('user');// 获取用户信息
    getScenesList({ page: 1, size: (page * size) }, list=>{
      this.setData({ list, user });
    });
  },
  downQcode (){
    // 下载二维码
    wx.showLoading({ title: '下载中' })
    downCode(this.data.qcode, data => {
      wx.hideLoading()
      showToast("下载成功", 'success');
    })
  },
})
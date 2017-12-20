import { login, getUser } from "../../api/user.js";
import { getDefaultChanne, getChanneList, shareChanne } from "../../api/channel.js";
import { showModal, getData } from "../../utils/util.js"
//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    page: 1,
    size: 10,
    list: [],
    // 0 不显示
    // 1 加载中
    // 2 没有数据
    isLoad: 0
  },
  onShareAppMessage: function (res) {
    let index = res.target.dataset.index;
    // 来自页面内转发按钮
    let scene = this.data.scene;
    return shareChanne({
      id: scene.id,
      uid: scene.uid || this.data.user.uid,
      channelid: this.data.list[index].id,
      title: scene.title,
      cover: scene.cover,
    });
  },
  onShow(){
    let page = this.data.page;
    let size = this.data.size;
    let user = getData('user');// 获取用户信息
    getChanneList({ page: 1, size: (page * size) }, list=>{
      this.setData({ list, user });
    });
    // 获取默认渠道
    getDefaultChanne(dataDefault => {
      this.setData({ dataDefault });
    });
  },
  getList(){
    let page = ++this.data.page;
    getChanneList({ page, size: this.data.size }, data => {
      if (data.length == 0){
        --this.data.page;
        this.setData({ isLoad: 2 });
        return false;
      }
      let list = [... this.data.list, ...data];
      this.setData({ list, isLoad: 0 });
    });
  },
  scrollButtom (e){
    if (this.data.isLoad == 0){
      this.setData({ isLoad: 1 });
      this.getList();
    }
  },
  onLoad: function (param) {
    let user = getUser() || '';
    this.setData({ user, scene: param});
    wx.hideShareMenu();
  },
  noShare (e){
    let index = e.target.dataset.index;
    let data = this.data.list[index];

    // 用户没有认证不能分享
    if (!this.data.user.telVerified){
      showModal({ content: '手机没有认证不能分享' }, () => {
        wx.navigateTo({ url: 'pages/checkMobile/index' })
      });
      return false;
    }
    
    // 如果这个场景没有上线就不能分享
    if (!data.online) {
      showModal({ content: '场景没有上线不能分享' });
      return false;
    }
  },
  login(e) {
    login(e, this, (user) => {
      let page = this.data.page;
      let size = this.data.size;
      getScenesList({ page: 1, size: (page * size) }, list => {
        this.setData({ list, user });
      });
    });
  }
})
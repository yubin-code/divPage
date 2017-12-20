import { login, getUser } from "../../api/user.js";
import { getScenesList } from "../../api/scenes.js";
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      let index = res.target.dataset.index;
      let data = this.data.list[index];
      let share = { path: 'pages/share/index?id=' + data._id + '&uid=' + data.ref};
      if (data.title) share['title'] = data.description || data.title;
      if (data.cover) share['imageUrl'] = data.cover;
      return share;
    }
  },
  onShow(){
    let page = this.data.page;
    let size = this.data.size;
    let user = getData('user');// 获取用户信息
    getScenesList({ page: 1, size: (page * size) }, list=>{
      this.setData({ list, user });
    });
  },
  getList(){
    let page = ++this.data.page;
    getScenesList({ page, size: this.data.size }, data => {
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
  onLoad: function () {
    let user = getUser() || '';
    this.setData({ user });
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
    
    let id = data.id;
    let cover = data.cover;
    let title = data.description || data.title;
    wx.navigateTo({ url: '/pages/channel/index?id=' + id + '&cover=' + cover + '&title=' + title})
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
//index.js
//获取应用实例
const app = getApp()
import JyoComponent from '../../core/JyoComponent';
import { getUser } from "../../api/user.js";
import { shareChanne } from "../../api/channel.js";
import { getScenes, addIntention } from "../../api/scenes.js";
import { showModal, remoData, setData, getData } from '../../utils/util.js';
Page({
  data: {
    parts: [],     // 页面构成部分
    partsIndex: 0, // 组件部分下表防止报错
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
  onLoad: function (parem) {
    this.setData({ scene: parem });
    // 获取初始化数据
    let layout = JyoComponent.create("Layout", "layout", this);
    layout.mode = false;
    this.getParts(parem);
    // 表单提交的数据
    layout.submit = res => {
      // 组装数据 
      let data = {
        ref_scenes: this.data.id,
        channel: parem.channelid,
        formData: res.data
      }

      // 重置数据
      let parts = this.data.parts;
      let item = parts[res.detail.index];
      for (let k in item.field) {
        item.field[k].input = '';
      }
      parts[res.detail.index] = item;

      this.setData({ parts });

      // 添加线索
      addIntention(data, (data) => {
        // 提示添加成功
        showModal({ content: res.detail.prompt });
      });
    }


  },
  onShow (){
    let user = getData('user');// 获取用户信息
    this.setData({ user });
  },
  getParts(parem){
    getScenes((parem.id || parem.systemId), data => {
      // 显示页面数据
      let parts = data.parts || [];
      let id = data._id;
      // 如果是模版id那么不保存id
      if (parem.buildin == 'true'){
        id = ''
      }
      
      // 如果场景没有上线那么就不能访问
      if (!!id && !parem.mode && !data.online){
        showModal({ content: '此场景已下线' }, () => {
          wx.navigateBack({ delta: 1 })
        });
        return false;
      }


      this.setData({ parts, id });
      // 获取页面详情
      setData('outline', data);
    });
  }
})

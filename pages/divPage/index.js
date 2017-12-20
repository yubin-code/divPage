//index.js
//获取应用实例
const app = getApp()
import JyoComponent from '../../core/JyoComponent';
import { getUser } from "../../api/user.js";
import { scenesCreate, getScenes, editScenes, addIntention } from "../../api/scenes.js";
import { showModal, remoData, setData } from '../../utils/util.js';
Page({
  data: {
    parts: [],     // 页面构成部分
    partsIndex: 0, // 组件部分下表防止报错
  },
  onLoad: function (parem) {

    let layout = JyoComponent.create("Layout", "layout", this);
    
    layout.init(parem);
    
    // 获取初始化数据
    (parem.id || parem.systemId) && this.getParts(parem, layout);
    
    layout.dblclick = e => {
      let index = e.currentTarget.dataset.index;
      console.log("双击了")
    }
    
    layout.click = data => {
      console.log("单击了");
    }
    
    // 添加数据
    layout.addComponent = (card) => {
      let data = this.data;
      let parts = [...data.parts, card]
      let lay = data.layout;
      // 默认选中
      let index = (parts.length - 1)
      layout.layoutIndex = index;
      lay.layoutIndex = index;
      
      this.setData({ parts, layout: lay});
    }
    
    // 编辑数据
    layout.editComponent = (val) => {
      
      let parts = this.data.parts
      let index = layout.getIndex;
      let card = parts[index]

      parts[index] = Object.assign(card, val);

      this.setData({ parts });
    }
    
    // 点击保存数据保存数据
    layout.save = (data, nxet) => {
      data.parts = this.data.parts || [];
      if (this.data.parts.length == 0){
        showModal({ content: '没有任何编辑操作保存失败' }, ()=>{
          nxet();
        });
        return false;
      }

      // 如果没有封面, 
      if (!data.cover){
        let parts = data.parts
        for (let k in parts){
          let item = parts[k];
          if (item.key == 'background'){
            data.cover = item.src;
          }
        }
      }
      
      // 如果没有标题
      if (!data.title) {
        data.title = '未设置标题'
      }
      
      if (!this.data.id){
        delete data.id;
        // 添加数据
        scenesCreate(data, res => {
          // 保存返回的id方便修改数据 
          this.setData({ id: res.data.id });
          nxet(); // 下一步
          showModal({ content: '保存数据成功' });
        });
        return false;
      }
      
      // 修改数据
      editScenes(this.data.id, data, () => {
        // wx.navigateBack({ delta: 1 })
        nxet(); // 下一步
        showModal({ content: '修改数据成功' });
        wx.navigateBack({ delta: 1 })
      });
    }
    
    // 删除数据
    layout.delComponent = (index) => {
      let parts = this.data.parts
      parts.splice(index, 1);
      this.setData({ parts });
    }

    // 移动背景图
    layout.moveBg = (bgtype) =>{
      let parts = this.data.parts;
      let _thisLayout = this.data.layout;
      let bgIndex = _thisLayout.bgIndex
      
      if (bgtype == "left"){
        for (let i = (bgIndex - 1); i >= 0; i--) {
          let card = parts[i];
          if (card.key == "background"){
            let tCard = parts[bgIndex];
            _thisLayout.bgIndex = i;
            parts[i] = tCard
            parts[bgIndex] = card;
            break;
          }
        }
      }
      
      if (bgtype == "right"){
        for (let i = 0; i < parts.length; i++){
          let card = parts[i];
          if (i > bgIndex && card.key == "background"){
            let tCard = parts[bgIndex];
            _thisLayout.bgIndex = i;
            parts[i] = tCard
            parts[bgIndex] = card;
            break;
          }
        }
      }
      this.setData({ parts, layout: _thisLayout });
    }
    
    // 表单提交的数据
    layout.submit = res => {
      // 组装数据 
      let data = {
        ref_scenes: this.data.id,
        formData: res.data
      }
      
      // 重置数据
      let parts = this.data.parts;
      let item = parts[res.detail.index];
      for (let k in item.field){
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
    
    // 修改样式
    layout.updataStyle = style => {
      let parts = this.data.parts;
      let index = layout.getIndex;
      parts[index] = Object.assign(parts[index], style)
      this.setData({ parts });
    }
  },
  onUnload (){
    remoData('outline');
  },
  getParts(parem, layout){
    let user = getUser('user');
    getScenes((parem.id || parem.systemId) + "?update=1", data => {
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

      let index = 0;
      for (let item in parts){
        let Zindex = parts[item].pureAttr['z-index'];
        if (Zindex > index){
          index = Zindex;
        }
      }
      // 修改index 的默认值
      layout.Zindex = index;
      this.setData({ parts, id });
      // 获取页面详情
      setData('outline', data);
    });
  }
})

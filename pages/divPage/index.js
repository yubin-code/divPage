//index.js
//获取应用实例
const app = getApp()
import JyoComponent from '../../core/JyoComponent';
Page({
  data: {
    parts: [
      // {
      //   type: 'text',
      //   title: '文字',
      //   key: 'text',
      //   class: ["layout-text-style"],
      //   val: "xxxxx",
      //   attr: {
      //     "font-size": 20 + "rpx",
      //     color: "#999",
      //     "text-align": "left"
      //   },
      // },
      // {
      //   "type": "video",
      //   "class": [
      //     "layout-video-style"
      //   ],
      //   "src": "3123",
      //   "attr": {
      //     "top": 89,
      //     "let": 0,
      //     "z-index": 101,
      //     "left": 8
      //   },
      //   "css": "",
      //   "clientY": -147,
      //   "clientX": -205,
      //   poster: "/core/images/poster.png",
      // }
    ], // 页面构成部分
    partsIndex: 0, // 组件部分下表防止报错
  },
  onShareAppMessage: function () {
    return {
      title:"测试分享",
      path: '/pages/index/index',
    };
  },
  onLoad: function (parem) {
    let layout = JyoComponent.create("Layout", "layout", this);
    
    layout.init(parem);

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
      this.setData({ parts });
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
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '没有任何编辑操作保存失败',
          success: (res) => nxet()
        })
        return false;
      }

      // 下一步
      nxet();
      // 所有的页面数据 
      console.log(data)
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
    layout.submit = (data) => {
      console.log(data);
    }

    // 修改样式
    layout.updataStyle = style => {
      let parts = this.data.parts;
      let index = layout.getIndex;
      parts[index] = Object.assign(parts[index], style)
      this.setData({ parts });
    }
  },
})

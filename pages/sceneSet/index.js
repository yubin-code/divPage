//index.js
import { setData, getData, showModal } from "../../utils/util.js"
import { updata } from "../../api/tool.js"
import { getScenes, editScenes } from "../../api/scenes.js";
import cof from "../../config.js"

//获取应用实例
const app = getApp()
Page({
  data: {
    cover:{}
  },
  onLoad: function (param) {
    // 编辑数据
    if (param.operation == 'edit'){
      let id = param.id;
      let operation = param.operation;
      // 场景详细信息
      getScenes(id + "?update=1", data => {
        this.setData({ data, id, operation });
      });
      return false;
    }

    let data = getData("outline");
    let image = data.cover;
    this.setData({ data, image });
  },
  getImg (){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album'],
      success: res => {
        var tempFilePaths = res.tempFilePaths[0];

        updata(tempFilePaths, 'file', res => {
          if (res.status.code !== 0) return showModal({ msg: '上传图片错误！' });

          // 拼装图片地址
          let imgUrl = [cof.HOST, '/api/resource/image', (res.data && res.data.imgName)].join('/')
          this.setData({ image: imgUrl})
          
        });
      }
    })
  },
  formSubmit (e){
    
    // 修改资料
    if (this.data.operation){
      let data = e.detail.value;
      data.cover = this.data.image;
      editScenes(this.data.id, data, () => {
        wx.navigateBack({ delta: 1 })
      });
      return false;
    }
    
    let data = e.detail.value;
    data.cover = this.data.image;
    setData("outline", data);
    wx.navigateBack({ delta: 1 })
  }
})

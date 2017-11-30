import Base from '../Base/Base';
import Style from './model/Style';
import Model from './model/Model'; 
import Menu from './model/Menu';
import Comp from './model/Comp';

const setData = (k, v) => wx.setStorageSync(k, v)
const getData = k => wx.getStorageSync(k)

const checkIsNull = (o) => typeof o !== "undefined" && o !== '';
const showModal = (o) => {
  wx.showModal({
    title: (o.title || '提示'),
    content: (o.msg || ''),
    showCancel: false    
  })
}

const prompt = (data, callback) => {
  wx.showModal({
    title: data.title || '提示',
    content: data.info,
    success: function (res) {
      if (res.confirm) {
        typeof callback !== "undefined" && callback({});
        console.log('用户点击确定')
      } else if (res.cancel) {
        typeof callback !== "undefined" && callback();
      }
    }
  })
}
const delay = (callback, time) => {
  typeof callback == "function" && setTimeout(callback, time);
}

class Layout extends Base {
  constructor(page, id) {
    super(page, id);
    wx.getSystemInfo({
      success: (res) => {
        this.screenHeight = res.windowHeight;
        this.screenWidth = res.windowWidth;
      }
    });

    
    this.Menu = Menu._data;       // 获取菜单
    this.Style = Style._data;     // 获取样式组件
    this.ChildMenu = Menu._child; // 获取子类菜单
    // 模式 false 预览模式 true 编辑模式
    this.mode = true;
    this.isScroll = true;
    this.Zindex = 100;
    this.route = "";
    this.LayoutLoad = {}
    // this.tools = this.tool;
    // 开始拖动
    this.LayoutMoveStart = "LayoutMoveStart" + this._eventId;
    page[this.LayoutMoveStart] = e => {
      let index = e.currentTarget.dataset.index;
      let parts = this._page.data.parts;
      let t = e.touches[0];
      let p = parts[index];
      let g = e.currentTarget;
      p.clientY = (g.offsetTop - t.clientY) + 60;
      p.clientX = (g.offsetLeft - t.clientX) + 60;
      this.localData({ parts });
    }
    // 拖动中
    this.LayoutMove = "LayoutMove" + this._eventId;
    page[this.LayoutMove] = e => {
      index = e.currentTarget.dataset.index;
      if (this.layoutIndex != index) return false;
      
      let index = e.currentTarget.dataset.index;
      let parts = this._page.data.parts;
      var touchs = e.touches[0];
      var pageX = touchs.pageX;
      var pageY = touchs.pageY;
      var x = pageX + (parts[index].clientX || 0) - 30;
      var y = pageY + (parts[index].clientY || 0) - 30;
      
      parts[index].attr.top = (y - 30);
      parts[index].attr.left = (x - 30);
      this.setLayout("isScroll", false);
      this.localData({ parts });
    };
    
    // 拖动结束
    this.LayoutMoveEnd = "LayoutMoveEnd" + this._eventId;
    page[this.LayoutMoveEnd] = e => {
      this.touchEndTime = e.timeStamp;
      this.setLayout("isScroll", true);
    };
    
    // 点击事件
    this.LayoutTap = "LayoutTap" + this._eventId;
    this.touchEndTime = 0;
    this.touchStartTime = 0;
    page[this.LayoutTap] = e => {
      if (!this.mode) return false;
      this.touchStartTime = e.timeStamp
      if (this.touchEndTime - this.touchStartTime < 350) {
        var currentTime = e.timeStamp
        var lastTapTime = this.lastTapTime
        this.lastTapTime = currentTime

        // 双击事件
        if (currentTime - lastTapTime < 300) {
          clearTimeout(this.lastTapTimeoutFunc);
          if (typeof this.dblclick == "function") {
            this.layoutIndex = e.currentTarget.dataset.index;
            this.layoutType = e.currentTarget.dataset.type;
            this.update();
            this.iscallback(this.dblclick, e);
            return false;
          }
        } else {
          // 单击事件
          this.lastTapTimeoutFunc = setTimeout(() => {
            if (typeof this.click == "function") {
              let data = e.currentTarget.dataset;
              this.iscallback(this.click, data);
              return false;
            }
          }, 300);
        }
      }
    };

    // 菜单底部按钮粗发器
    this.nav = "nav" + this._eventId;
    page[this.nav] = e => {
      this.layoutType = e.currentTarget.dataset.type;
      this.copmode = e.currentTarget.dataset.mode;
      this[this.layoutType]();
      this.update();
    }

    // 二级菜单粗发器
    this.childNav = "childNav" + this._eventId;
    page[this.childNav] = e => {
      let data = e.currentTarget.dataset;
      this.copmode = data.mode;
      if (data.type == "edit"){
        return this[data.key]();
      }

      this[data.type]();
      this.childNavType = data.type;
    }
    
    // 编译css
    this.css = "css" + this._eventId;
    page[this.css] = e => {
      let data = e.currentTarget.dataset;
      let value = e.detail.value || data.value
      let style = this.getNewStyle({ [data.key]: value })
      this.iscallback(this.updataStyle, style);
    }

    // 添加背景图
    this.addBg = "addBg" + this._eventId;
    page[this.addBg] = e => {
      this.copmode = e.currentTarget.dataset.mode
      this.background(true);
    }

    // 选中背景图
    this.selectBg = "selectBg" + this._eventId;
    page[this.selectBg] = e => {
      this.bgIndex = e.currentTarget.dataset.index;
      this.update();
    }

    // 滚动滚动条的时候
    this.LayoutScroll = "LayoutScroll" + this._eventId;
    page[this.LayoutScroll] = e => {
      this.scrollTo = e.detail.scrollTop;
      this.update()
    }
    // 拨打电话
    this.phone = "phone" + this._eventId;
    page[this.phone] = e => {
      let data = e.currentTarget.dataset;
      wx.makePhoneCall({ phoneNumber: data.value });
    }
    // 关闭窗口按钮
    this.closeWindow = "closeWindow" + this._eventId;
    page[this.closeWindow] = e => {
      this.closewindows();
    }
    // 滚动条被点击
    this.LayoutScrollClick = "LayoutScrollClick" + this._eventId;
    page[this.LayoutScrollClick] = e => {
      this.isText = false;
      this.update();
    }

    // 保存页面
    this.LayoutSave = "LayoutSave" + this._eventId;
    page[this.LayoutSave] = e => {
      let data = getData("cover")
      this.LayoutLoad = {
        show: true,
        title: "页面数据保存中"
      }
      this.update();
      typeof this.save == "function" && this.save.call(this, data, () =>{
        this.LayoutLoad = { show: false }
        this.update();
      });
    }

    // 下拉选择性
    this.optionClick = "optionClick" + this._eventId;
    page[this.optionClick] = e => {
      let itemList = [];
      let key = e.currentTarget.dataset.key;
      let field = this.myModel.field[key];
      let attr = [];
      for (let item in field.option){
        attr.push(field.option[item].name);
      }
      
      wx.showActionSheet({
        itemList: attr,
        success: (res) => {
          field.optionIndex = res.tapIndex;
          this.update();
        }
      })
    }
    

  // 添加文字
   this.LayoutformText = "LayoutformText" + this._eventId;
    page[this.LayoutformText] = e => {
      let form = e.detail.value;
      if (this.copmode == 0) {
        let card = this.createCard('text', { val: form, })
        if (card) {
          this.isText = false;
          this.iscallback(this.addComponent, card);
        }
      }

      if (this.copmode == 1) {
        this.isText = false;
        this.iscallback(this.editComponent, {
          val: form
        });
      }
      this.update();
    }
    // 预览
    this.LayoutPreview = "LayoutPreview" + this._eventId;
    page[this.LayoutPreview] = e => {
      this.mode = !this.mode;
      this.layoutIndex = "-";
      this.layoutType = "";
      this.update();
    }

    // 表单模块 窗口
    this.layoutGengduo = "layoutGengduo" + this._eventId;
    page[this.layoutGengduo] = e => {
      // 打开更多设置窗口
      this.openWindow("more", "left");
      this.update();
    }

    // 更多设置表单 窗口
    this.distribute = "distribute" + this._eventId;
    page[this.distribute] = e => {
      let data = e.detail.value;
      this.myModel['message'] = data.message;
      this.myModel['tels'] = data.tels;
      this.closewindows();
    }

    // 系统表单提交
    this.submitForm = "submitForm" + this._eventId;
    page[this.submitForm] = e => {
      let data = e.detail.value;
      console.log(data)
      let check = Model.check(data);
      if (check.msg){
        showModal(check);
        return false;
      }
      switch (this.myForm.type) {
        case "tel": // 添加电话组件
          this.addTel(data);
          break;
        case "video":
          this.addVideo(data);
          break;
      }            
    }

    // 数据模型提交数据
    this.submitModel = "submitModel" + this._eventId;
    page[this.submitModel] = e => {
      let data = e.detail.value;
      let myModel = this.myModel.field;
      // 拼装数据
      let attr = {};
      for (let item in data){
        attr[item] = {}
        if (item.indexOf("_") > 0){
          let field = item.split("_");
          delete attr[item];
          switch (field[1]){
            case "checkKey":
              attr[field[0]].checkKey = data[item]
              break;
            case "prompt":
              attr[field[0]].prompt = data[item]
              break;
            case "type":
              attr[field[0]].type = data[item]
              break;
          }
          continue;
        }
        attr[item].name = data[item]
      }

      for (let key in myModel){
        let item = myModel[key]
        if (attr[item.key]){
          let val = attr[item.key];
          attr[item.key] = Object.assign(item, val);
        }
      }

      data = { field: attr }
      data.message = this.myModel.message
      data.tels = this.myModel.tels

      
      // 执行添加或修改数据
      if (this.copmode == 0) {
        let card = this.createCard('form', {
          ...data
        })
        if (card) {
          this.iscallback(this.addComponent, card);
        }
      }

      if (this.copmode == 1) {
        this.iscallback(this.editComponent, data);
      }

      this.closewindows();
    }

    // 当输入框失去焦点的时候触发
    this.bindblur = "bindblur" + this._eventId;
    page[this.bindblur] = e => {
      let tager = e.target.dataset;
      let data = e.detail;
      if (tager.key){
        data = { [tager.key]: data.value }
      }
      let myModel = this.myModel.field;
      myModel[tager.index] = Object.assign(myModel[tager.index], data );
      this.update();
    }
    // 用户自定义表提交
    this.UserForm = "UserForm" + this._eventId;
    page[this.UserForm] = e => {
      let data = e.detail.value;
      // 验证字段
      let check = Model.check(data);
      if (check.msg) {
        showModal(check);
        return false;
      }

      // 具体的行为
    }
  };


  // 初始化数据结构
  init(data) {
    this.mode = (data.mode == 'true' ? true : false)
    this.update();
  };
  // 动画结束
  animationEnd(){
    let layout = this.LayoutData;
    layout.animationClass = true;
    this.localData({ layout });
    delay(() => {
      this.animationClass = false;
      this.layoutIndex = "-";
      this.layoutType = "";
      this.bgIndex = "-";
      this.layoutIsStyle = false;
      this.LayoutStyleList = ""; // 样式列表
      this.update()
    }, 300);
  }
  // 左移
  leftShift (){
    this.iscallback(this.moveBg, "left");
  }
  // 右移
  rightShift(){
    this.iscallback(this.moveBg, "right");
  }
  // 背景图 
  background (isTrue){
    if (!isTrue && this.copmode == 0) return false;
    this.getImg((url, info) => {
      let width = (info.width > 750 ? 750 : info.width) || 100;
      width = width / 7.5;
      if (this.copmode == 0) {
        let card = this.createCard('background', {
          src: url,
          attr: { width: width + "%", },
        })
        if (card) {
          this.iscallback(this.addComponent, card);
        }
      }
      if (this.copmode == 1) {
        this.iscallback(this.editComponent, {
          src: url,
          css: this.getNewStyle({ width }).css
        });
      }
    });
  }
  // 添加文字
  text (){
    this.isText = true;
    this.update();
  }
  // 表单页面数据生成
  form (){
    this.openWindow("form", "left");
    let parts = this.itemParts;
    // 支持的数据类型
    let option = [{
      name: "纯文本",     // 数据类型
      checkKey: "string" // 验证类型
    }, {
      name: "姓名",     // 数据类型
      checkKey: "string" // 验证类型
    }, {
      name: "电话",
      checkKey: "tel"
    }];
    
    let mo = Model.createForm({
      type: "from",   // 创建电话
      submit: "submitModel",
      bindblur: "bindblur",
      more: "layoutGengduo",
      distribute: "distribute",
      message: (parts && parts.message || "微秀落地页[${pageName}],有新客来啦,来自${channel},访客信息[${user},${tel}]"),
      tels: (parts && parts.tels || ""), 
    }, {
        user: {
          option,
          optionClick: "optionClick",
          checkKey:(parts && parts.field['user'].checkKey || ''),
          value: (parts && parts.field['user'].name || '姓名')
        },
        tel: {
          option,
          optionClick: "optionClick",
          check: true,
          checkKey:(parts && parts.field['tel'].checkKey || ''),
          value: (parts && parts.field['tel'].name || '电话')
        },
        button: {
          fictitious: true,
          submit: true,
          value: (parts && parts.field['button'].name || '提交'),
          prompt: (parts && parts.field['button'].prompt || '提交成功')
         },
        submit: { system: true, formType: 'submit'},
        cancel: { system: true, name: "取消", click: "closeWindow", type: "button"},
      });
    
    mo = JSON.stringify(mo)
    this.myModel = JSON.parse(mo);
    this.update();
  }

  // 电话页面数据生成
  tel() {
    this.openWindow("form", "left");

    let parts = this.itemParts;
        
    let mo = Model.createForm({
      type: 'tel',   // 创建电话
      submit: "submitForm",
    }, {
        value: {
          name: "按钮名称",
          placeholder: "请输入名称",
          type: 'input',
          value: (parts && parts.value || '')
        },
        tel: {
          value: (parts && parts.tel || '')
        },
        submit: { system: true, },
        button: { name: "取消", click: "closeWindow" },
    });
    mo = JSON.stringify(mo)
    this.myForm = JSON.parse(mo);
    this.update();
  }

  // 视频
  video (){
    this.openWindow("form", "left");

    let parts = this.itemParts;

    let mo = Model.createForm({
      type: 'video',   // 创建视频
      submit: "submitForm",
    }, {
        url: {
          value: (parts && parts.url || '')
        },
        switch: {
          value: (parts && parts.switch || '')
        },
        submit: { system: true, },
        button: { name: "取消", click: "closeWindow" },
      });

    mo = JSON.stringify(mo)
    this.myForm = JSON.parse(mo);
    this.update();
  }
  // 添加图片
  img (){
    this.getImg((url, info) => {
      let width = (info.width > 750 ? 750 : info.width) || 100;
      width = width / 7.5;
      if (this.copmode == 0) {
        let card = this.createCard('img', {
          name: '图片', key: 'img',
          src: url,
          pureAttr: { width },
          attr: { width: width , }
        })

        if (card) {
          this.iscallback(this.addComponent, card);
        }
      }
      // 编辑图片
      if (this.copmode == 1) {
        let attr = Object.assign(this.itemParts.attr, {
          width: width + "%"
        })
        let css = this.compileCss(attr);
        this.iscallback(this.editComponent, {
          src: url,
          pureAttr: { width },
          attr,
          css
        });
      }
    });
  }

  // 获取图片详情
  getImg (callback){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album'],
      success: res => {
        this.setLayout("LayoutLoad", { show: true, title: "图片加载中" });
        let src = res.tempFilePaths[0];
        wx.getImageInfo({
          src,
          success: res => {
            this.uploadImg(src, url => {
              this.setLayout("LayoutLoad", 
              { show: false, title: "" });
              
              if (typeof callback == "function") {
                return callback(url, res);
              }
              callback();
            })
          }
        })
      }
    })
  }

  // 上传图片
  uploadImg (url, callback){
    typeof callback == "function" && callback(url);
  }

  // 修改样式
  style (){
    this.LayoutStyleList = this.Menu[this.layoutType].style;
    this.layoutIsStyle = true;
    this.update();
  }
  
  // 上移
  upMove() {
    let style = this.getNewStyle({ "z-index": ++this.Zindex });
    this.iscallback(this.updataStyle, style);
  }
  // 下移
  downMove() {
    let style = this.getNewStyle({ "z-index": --this.Zindex });
    this.iscallback(this.updataStyle, style);
  }
  // 删除元素
  del(e) {
    prompt({
      info: "您确定要删除这个组件吗？"
    }, (data) => {
      if (data) {
        if (this.layoutType != "background") {
          this.animationEnd();
        }

        // 如果没有背景图了就把背景图下标初始化
        let parts = this._page.parts;
        let isBg = true;
        for (let item in parts){
          if (parts[item].type == 'background'){
            isBg = false;
            break;
          }
        }
        this.iscallback(this.delComponent, this.getIndex);

        // 没有背景图就隐藏导航
        if (isBg) {
          this.bgIndex = "-";
          this.update();
        }
      }
    })
  }

  // 结束编辑
  end() {
    this.animationEnd();
  }
  
  // 关闭窗口
  closewindows (){
    let layout = this.LayoutData;
    layout.windowAnimation = true;
    this.localData({ layout });
    setTimeout(() => {
      let route = this.route
      let attr = route.split("/");
      attr.splice((attr.length - 1), 1);
      this.route = attr.join("/");
      this.windowAnimation = false;
      this.update();
    }, 300);

  }

  // 添加电话
  addTel (data){
    if (this.copmode == 0) {
      let card = this.createCard('button', {
        ...data
      })
      if (card) {
        this.iscallback(this.addComponent, card);
      }
    }
    if (this.copmode == 1) {
      this.iscallback(this.editComponent, data);
    }
    delete this.myForm;
    this.closewindows();
  }

  // 添加视频
  addVideo(data){
    if (this.copmode == 0) {
      let card = this.createCard('video', {
        ...data
      })
      if (card) {
        this.iscallback(this.addComponent, card);
      }
    }
    if (this.copmode == 1) {
      this.iscallback(this.editComponent, data);
    }
    delete this.myForm;
    this.closewindows();
  }
  // 添加组件
  createCard(key, json) {
    let card = {},
        attr = {}
    card = JSON.stringify(Object.assign(Comp.create({ key, ...json }), json, attr));
    // 转为字符串防止数据被关联
    card = JSON.parse(card)
    card.attr["z-index"] = (++this.Zindex);
    card.attr.top = this.scrollTo || 0;
    card.attr.left = 0;
    let css = this.getNewStyle(card.attr);
    card.css = css.css;
    card.pureAttr = css.pureAttr;
    return card
  }

  // 打开一个新的窗口
  openWindow(route, mode){
    this.route = [this.route, route].join("/");
    // 是否显示新的窗口
    this.window = true;
    // 进入页面的模式 top 从下往上 left 从又到左边
    this.EntryMode = mode;
  }
  
  // 把json的css 编译成html的css
  compileCss(style){
    let css = JSON.stringify(style)
      .replace(/,/g, ";")
      .replace(/"|{|}/g, "")
      .replace(/|{|}/g, "");
    return css;
  }


  // 生成一个新的css样式
  getNewStyle(json){
    let pureAttr = this.itemParts && this.itemParts.pureAttr || {};
    pureAttr = Object.assign(pureAttr, json);

    // 如果是数字那么就加上rpx
    for (let item in json){
      let after = ""
      if (Number.isFinite(json[item]) && item != "z-index" && item != "left" && item != "top" ){
        after = "rpx";
      }

      if (item == "width" && Number.isFinite(json[item])) {
        after = "%";
      }
      
      json[item] += after;
    }
    
    let parts = this.itemParts && this.itemParts.attr || {};
    return {
      css: this.compileCss(Object.assign(parts, json)),
      pureAttr
    }
  }

  iscallback (callback, data){
    typeof callback == "function" && callback.call(this, data);
  }
  
  // 大内容局部更新
  setLayout (k, v) {
    let layout = this.LayoutData;
    layout[k] = v;
    this.localData({ layout });
  }
  
  get getIndex () {
    let index = '';
    if (Number.isFinite(this.LayoutData.layoutIndex))
      index = this.LayoutData.layoutIndex;
    if (Number.isFinite(this.LayoutData.bgIndex))
      index = this.LayoutData.bgIndex;
    return index;
  }

  // 获取工具栏
  get tool (){
    return tools
  }
  
  // 获取页面组件数据
  get itemParts() {
    return this._page.data.parts[this.getIndex];
  }
  get LayoutData() {
    return this._page.data.layout
  }
  get name() {
    return "Layout";
  };
  
  set _language(value) {
    this.language = value;

    switch (value) {
      // 设置中文
      case "zh_CN":
        this.lang = [];
        break;
      default:
        this.lang = [];
    }
    this.update();
  };
}

module.exports = Layout;
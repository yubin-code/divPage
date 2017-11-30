// css 组件注册器
let Menu = {
  // icon 地址
  iconPath: "/core/images/",
  _data: {},
  _child: {}
}

/**
 * param obj Object 生成的组件
 * title 样式标题
 * key 样式key
 * iconPath 样式组件按钮图标， 没有图标就不填写
 * iconSelect  样式组件被选中图标， 没有就不添加
 * color 样式组件文字颜色
 * colorSelect 样式文字被选中颜色
 * defaultValue 样式默认值
 * type 类型
 * click 样式被点击促发事件
 * min 样式的最小值
 * max 样式最大值
 * child 样式子类
 * comps
 */
Menu.create = function (obj) {
  let model = {};
  let child = obj && obj.child || {};
  model.iconPath = this.iconPath + obj.key + '.png'
  model.iconSelect = this.iconPath + obj.key + '-a.png';
  model.color = "#999";
  model.colorSelect = "#4685F6";
  model.startAnimation = "layout-animation-upward", // 开始动画
  model.endAnimation = "layout-animation-down",  //结束动画
  model.click = "nav";
  return Object.assign(model, obj);
}

/**
 * 创建样式
 * param title String 组件名称
 * param key String 组件下标
 * param obj Object 附加功能
 */
Menu.add = function (name, key, obj) {
  this._data[key] = Menu.create({ name, key, ...obj });
}


Menu.addChild = function (name, key, obj){
  obj.click = "childNav";
  this._child[key] = Menu.create({ name, key, ...obj });
}

Menu.addChild("编辑", "edit", { });
Menu.addChild("样式", "style", {});
Menu.addChild("上移", "upMove", {});
Menu.addChild("下移", "downMove", {});
Menu.addChild("左移", "leftShift", {});
Menu.addChild("右移", "rightShift", {});
Menu.addChild("删除", "del", {});
Menu.addChild("完成", "end", { show: true });


Menu.add("文字", "text", {
  child: [ "edit", "style", "upMove", "downMove", "del", "end"],
  style: ["text-align", "color", "width", "font-size"],
});
// child 子类菜单都有那些
// 这个组件拥有的 style 样式
Menu.add("图片", "img", {
  child: ["edit", "style", "upMove", "downMove", "del", "end"],
  style: ["width"]
});
Menu.add("背景", "background", {
  add: "addBg",       // 添加背景
  select: "selectBg", // 选中背景图
  child: ["edit", "leftShift", "rightShift", "del", "end"],
});
Menu.add("表单", "form", {
  child: ["edit", "style", "upMove", "downMove", "del", "end"],
  style: ["text-align", "color", "background", "width", "font-size"],
});
Menu.add("电话", "tel", {
  child: ["edit", "style", "upMove", "downMove", "del", "end"],
  style: ["text-align", "color", "background", "width", "font-size"],
});
Menu.add("视频", "video", {
  child: ["edit", "style", "upMove", "downMove", "del", "end"],
  style: [ "width", "height"],
});

module.exports = Menu



const list = ["#000000", "#ffffff", "#545454", "#686868", "#a9a9a9", "#3ee3c3", "#00aa97", "#009a7c", "#099360", "#00ab64", "#7dbf43", "#b8d988", "#f6df00", "#dab40b", "#b08401", "#a3711c", "#cc6f22", "#f87f2e", "#fa5628", "#ee3227", "#f276aa", "#fc45a9", "#c72aaf", "#9422c0", "#7647f5", "#6766f8", "#2d45b1", "#0061b8", "#027bc0", "#68acdb"] // 所有的颜色的色值
// css 组件注册器
let Style = {
  // icon 地址
  iconPath: "/core/images/",
  _data: {},
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
Style.create = function (obj) {
  let model = {};
  let child = obj && obj.child || {};
  model.iconPath = this.iconPath + obj.key + '.png'
  model.iconSelect = this.iconPath + obj.key + '-a.png';
  model.color = "#999";
  model.colorSelect = "#4685F6";
  model.defaultValue = "";
  model.click = "css";
  model.min = 0;
  model.max = 100;
  model.child = {}
  if (child) {
    for (let item in child) {
      let com = child[item];
      if (model.child) {
        model.child[item] = this.create({ name: com.title, key: com.key, ...com });
        delete obj.child;
      }
    }
  }
  return Object.assign(model, obj);
}

/**
 * 创建样式
 * param title String 组件名称
 * param key String 组件下标
 * param obj Object 附加功能
 */
Style.add = function (name, key, obj) {
  this._data[key] = Style.create({ name, key, ...obj });
}

/**
 * 将json css编译成纯的css
 * param obj Object json对象
 * return String
 */
Style.getCss = function (obj){
  return SON.stringify(obj)
    .replace(/,/g, ";")
    .replace(/"|{|}/g, "")
    .replace(/|{|}/g, "");
}

Style.add("居中", "text-align", { type: 'tab',
  child: {
    left: {
      name: "左对齐",
      key: "left",
    },
    center: {
      name: "居中",
      key: "center"
    },
    right: {
      name: "右对齐",
      key: "left"
    },
  },
})
Style.add("宽度", "width", {
  type: 'slider', front: "窄", after: "宽",
});
Style.add("高度", "height", {
  type: 'slider', front: "低", after: "高"
});
Style.add("文字", "color", { type: 'color', list });
Style.add("字体大小", "font-size", {
  type: 'slider', front: "小", after: "大"
});
Style.add("背景", "background", { type: 'color', list });

module.exports = Style



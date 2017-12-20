let Comp = {
  model: {
    button: {
      click: "phone",
      action: "tel",
      type: "tel",
      attr: {
        "text-align": "left",
        "font-size": 30,
        "width": 30,
        "color": "#000000"
      },
      pureAttr: {}
    },
    text:{
      type: 'text',
      pureAttr: {},
      attr: {
        "text-align": "left",
        "font-size": 30,
        "width": 95,
        "color": "#000000"
      }
    },
    img: {
      attr: {
        "left": 0
      },
      pureAttr:{}
    },
    background:{
      attr: {},
      pureAttr: {}
    },
    video: {
      type: "video",
      poster: "/core/images/poster.png",
      attr: {
        "left": 0,
        "width": 80,
        "height": 200
      },
      pureAttr: {}
    },
    form: {
      type: "form",
      attr: {
        "width": 80,
        "font-size": 30,
        "text-align": "left",
        "background": "#999",
        "color": "#fff",
        "left":0,
      },
      pureAttr: {},
      submit: "UserForm",
    }
  },
  // 保存字段
  _data: {}
}
/**
 * param obj Object 生成的组件
 */
Comp.create = function (obj) {
  let key = this.model[obj.key];

  if (!key){
    throw new ReferenceError("不存在的组件" + obj.key);
  }
  let model = {
    class: ["layout-"+ obj.key +"-style"],
  }

  return { ...key, ...model, ...obj}
}

/**
 * 添加组件
 * param title String 组件名称
 * param key String 组件下标
 * param obj Object 附加功能
 */
Comp.add = function (name, key, obj) {
  this._data[key] = this.create({ name, key, ...obj });
}

module.exports = Comp
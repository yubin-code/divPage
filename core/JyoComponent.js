// 共享值，当前主题配色
let theme = "Jyo-Theme-Light";

// 共享值，当前语言
let language = wx.getSystemInfoSync().language;
// 已创建的组件
let createdComponent = [];

let appInstance = getApp();
let oldErrorEvent = appInstance.onError;
appInstance.onError = function (e) {
  if (typeof oldErrorEvent === "function") oldErrorEvent.call(this, e);
  console.dir(e);
};

let JyoComponent = {
  // 组件表
  _components: {},
  get theme() {
    /// <summary>获取主题配色</summary>
    /// <returns type="String">主题配色</returns>

    return theme;
  },
  set theme(value) {
    /// <sumarry>设置主题配色</summary>
    /// <param name="value" type="String">配色方案名称，目前仅支持Light和Dark</param>

    theme = value;
    if (theme !== "Light" && theme !== "Dark") {
      theme = "Light";
      console.warn("配色方案不存在");
    }

    theme = "Jyo-Theme-" + theme;

    createdComponent.map(function (value, index) {
      value._theme = theme;
      value.update();
    });
  },
  get language() {
    /// <summary>获取语言</summary>
    /// <returns type="String">地区语言码</returns>

    return language;
  },
  set language(value) {
    /// <sumarry>设置语言</summary>
    /// <param name="value" type="String">地区语言码</param>

    language = value;

    createdComponent.map(function (value, index) {
      value._language = language;
    });
  }
};

JyoComponent.create = function (name, id, page) {
  /// <summary>创建组件实例</summary>
  /// <param name="name" type="String">组件名称</param>
  /// <param name="id" type="String">自定义组件ID名</param>
  /// <param name="page" type="Object">页面对象</param>
  /// <returns type="Object">组件实例对象</returns>

  let component = JyoComponent._components[name];

  if (typeof component === "undefined") {
    throw "无效的组件名：" + name;
  }

  component = new component(page, id);
  component._theme = theme;
  component._language = language;
  component.update();
  createdComponent.push(component);

  let oldUnloadFn = page.onUnload;
  page.onUnload = function (e) {
    for (let i = 0; i < createdComponent.length; i++) {
      if (createdComponent[i] === component) {
        createdComponent.splice(i, 1);
        break;
      }
    }

    if (typeof oldUnloadFn === "function") {
      oldUnloadFn.call(page, e);
    }
  };

  return component;
};

JyoComponent.register = function (name, obj) {
  /// <summary>注册组件</summary>
  /// <param name="name" type="String">组件名称</param>
  /// <param name="obj" type="Function">组件类</param>

  this._components[name] = obj;
};

JyoComponent.unregister = function (name, obj) {
  /// <summary>反注册组件</summary>
  /// <param name="name" type="String">组件名称</param>
  /// <param name="obj" type="Function">组件类</param>

  delete this._components[name];
};

// Layout视图组件
import Layout from "Layout/Layout";
JyoComponent.register("Layout", Layout);

module.exports = JyoComponent;

// git: x: 1005:1005::/home/git:/usr/bin / g - shell
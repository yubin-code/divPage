class Base {
  constructor(page, id) {
    /// <summary>组件构造函数</summary>
    /// <param name="page" type="Object">页面对象</param>
    /// <param name="id" type="String">要绑定的元素ID</param>

    if (this.name === "Base") {
      throw new ReferenceError("Base 类不能被直接调用");
    }

    this._page = page;
    this._id = id;
    this._eventId = `_${id}_R${(Math.random() * 1000000000) | 0}`;
    this._isVisible = false;
  };

  get name() {
    /// <summary>获取组件名称</summary>
    /// <returns type="String">组件名称</returns>

    return "Base";
  };

  get isVisible() {
    /// <summary>获取是否可见</summary>
    /// <returns type="Boolean">是否可见</returns>

    return this._isVisible;
  };

  set isVisible(value) {
    /// <summary>设置是否可见</summary>
    /// <param name="value" type="Boolean">是否可见</param>

    this._isVisible = value;
    this.update();
  };

  init() {
    /// <summary>初始化组件</summary>

    this.update();
    console.info(`${this.name} 组件 "${this._id}" 初始化已完成`);
  };

  update() {
    /// <summary>更新数据</summary>

    let setDataObj = {};
    let newObj = {};

    for (let i in this) {
      if (typeof this[i] === "function") continue;
      switch (i) {
        case "_page": continue;
        default:
          newObj[i] = this[i];
          break;
      }
    }

    setDataObj[this._id] = newObj;

    this._page.setData(setDataObj);
  };
  
  // 局部数据刷新
  localData (data){
    this._page.setData(data);
  }
}

module.exports = Base;
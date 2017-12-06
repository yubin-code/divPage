
/**
 * 验证规格有
 * 手机 tel 身份证 id url 地址 url 纯文本 string
 */
let Model = {
  format: {
    // 纯文本
    string: {},
    tel: { // 手机号
      reg: /^((\(\d{2,3}\))|(\d{3}\-))?1\d{10}$/
    },
    id:{ // 身份证
      reg: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    },
    url:{
      reg: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/
    }
  },
  base: {
    name: "",
    key: "",
    fictitious: false,  // 虚构的组件 目前无用
    system: false,      // 系统组件
    isShow: true,       // 是否显示这个组件
  },
  // 数据类型
  // option: [{
  //   name: "纯文本",     // 数据类型
  //   checkKey: "string" // 验证类型
  // }, {
  //   name: "姓名",     // 数据类型
  //   checkKey: "string" // 验证类型
  // },{
  //   name: "电话",
  //   checkKey: "tel"
  // }],
  form: {
    submit: "submitForm", // 发送的函数
    url:"",   // 请求的地址
    method:"post",  // 请求方式
    // custom: false,  //
  },
  // 保存字段
  _data: {}
}
/**
 * param obj Object 生成的组件
 */
Model.create = function (obj) {
  let model = {}
  model.camouflage = false; // 是否伪装是组件
  model.inputType = 'text'; // 组件type
  model.placeholder = ''    // 表单提示
  // 是否校验
  if (obj.checkKey) {
    model.reg = this.format[obj.checkKey].reg;
  }
  return Object.assign(model, obj); 
}

/**
 * 校验字段
 */
Model.check = function (data){
  for (let item in data){
    let _data = this._data[item]
    // 判断是否需要校验
    let reg = _data.reg;
    if (reg && !reg.test(data[item])){
      return { msg: (_data.prompt || _data.placeholder)}
    }
  }
  return false;
}

/**
 * 获取指定模型数据
 * param data String 需要获取的组件名称
 * return Object
 */
Model.createForm = function(conf, data) {
  let model = [];
  for (let item in data) {
    let mo = data[item]
    // 如果这个组件不存在那么就自定这个组件
    if (!this._data[item]){
      this._data[item] = this.base;
      this._data[item].key = item;
    }
    // 是否校验
    if (mo.check){
      mo.reg = this.format[(mo.checkKey || item)].reg;
    }
    let val = Object.assign(this._data[item], mo);
    model.push(val);
    this._data[item] = val;
  }

  let configure = Object.assign(this.form, conf);
  return { ...configure, field: model};
}
/**
 * 添加组件
 * param title String 组件名称
 * param key String 组件下标
 * param obj Object 附加功能
 */
Model.add = function (name, key, obj){
  this._data[key] = this.create({ name, key, ...obj });
}

Model.add("名字", "user", { 
  placeholder: "请输入名字",
  type: 'input',
  formSwitch: 'formSwitch'
  });
Model.add("电话", "tel", {
    placeholder: "请输入电话",
    prompt: "电话号码不正确",
    type: 'input',
    checkKey: "tel",
    formSwitch: 'formSwitch'
  });
Model.add("地址", "url", {
  placeholder: "请输入地址",
  type: 'input',
  formSwitch: 'formSwitch'
});
Model.add("企业名称", "enterprise", {
  placeholder: "请输入企业名称",
  type: 'input',
  formSwitch: 'formSwitch'
});
Model.add("职位", "occupation", {
  placeholder: "请输入职位",
  type: 'input',
  formSwitch: 'formSwitch'
});
Model.add("提交", "submit", { 
  type: 'button',
  formType: "submit",
 });

Model.add("自动播放", "switch", { type: 'switch' });
Model.add("提交", "button", { type: 'button' });

// 添加组件
module.exports = Model
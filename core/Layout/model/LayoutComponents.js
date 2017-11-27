// 字体基本默认配置
const FontSize = 30;  // 字体默认大小
const FontColor = "#000000";  // 字体默认颜色
const bgColor = "#1D203B";  // 默认背景颜色
const bgColorSize = "#fff";  // 默认背景颜色
const TextAlign = "left";  // 字体默认排版
// const FontWidth = 95;      // 文字默认宽度
const colorList = ["#000000", "#ffffff", "#545454", "#686868", "#a9a9a9", "#3ee3c3", "#00aa97", "#009a7c", "#099360", "#00ab64", "#7dbf43", "#b8d988", "#f6df00", "#dab40b", "#b08401", "#a3711c", "#cc6f22", "#f87f2e", "#fa5628", "#ee3227", "#f276aa", "#fc45a9", "#c72aaf", "#9422c0", "#7647f5", "#6766f8", "#2d45b1", "#0061b8", "#027bc0", "#68acdb"] // 所有的颜色的色值

// 可用组件
module.exports = {
  components: {
    text: {
      type: 'text',
      title: '文字',
      class: ["layout-text-style"],
      attr: {
        "font-size": FontSize + "rpx", 
        color: FontColor,
        "text-align": TextAlign
      },
    },
    img: {
      title: '图片',
      type: 'img',
      class: ["layout-image-style"],
      attr: {
        width:80
      }
    },
    background: {
      title: '背景图片',
      type: 'background',
      class: ["layout-background-img-style"],
      attr: {}
    },
    // 按钮
    button: {
      type: 'button',
      class: ["layout-button-style"],
      click: "",  // 促发器
      action: "", // 按钮的行为
      title: "",  // 按钮文字
      value: "",  // 值
      attr: {
        "font-size": FontSize + "rpx",
        "color": bgColorSize,
        "text-align": TextAlign,
        "background": bgColor
      },   // 属性
    },
    // 视频
    video:{
      type: 'video',
      class: ["layout-video-style"],
      poster: "/core/images/poster.png",
      src:"",
      attr: { width: "80%", height:"500rpx"},
      pureAttr: { width: 80, height:500}
    },
    // 表单
    form: {
      type: 'form',
      class: ["layout-myform-style"],
      attr: { width: "80%", "text-align": TextAlign},
      btattr: {},
      pureAttr: { width: 80 },
    }
  },
  tools: {
    text: {
      title: '文字',
      comtype: 'text',
      iconPath: "/core/images/nav-text.png",
      startAnimation: "layout-animation-upward", // 开始动画
      endAnimation: "layout-animation-down",  //结束动画
      tool: [
        {
          name: "编辑",
          click: "addData",
          iconPath: "/core/images/tool-edit.png",
        },
        {
          name: "样式",
          click: "   ",
          iconPath: "/core/images/tool-style.png",
          startAnimation: "layout-animation-max-height",//开始动画
          endAnimation: "layout-animation-min-height", //结束动画
          style: {
            TextAlign:{
              align:{
                left: {
                  title: "左对齐",
                  iconPath: "/core/images/align-left.png",
                  iconSelect: "/core/images/align-left-a.png",
                  colorSelect: "#4685F6"
                },
                center: {
                  title: "居中",
                  iconPath: "/core/images/align-center.png",
                  iconSelect: "/core/images/align-center-a.png",
                  colorSelect: "#4685F6"
                },
                right: {
                  title: "右对齐",
                  iconPath: "/core/images/align-right.png",
                  iconSelect: "/core/images/align-right-a.png",
                  colorSelect: "#4685F6"
                }
              },
              defaultValue: TextAlign,
              click:"TextAlign"
            },
            FontColor:{
              colorList,
              defaultValue: FontColor,
              click: "FontColor",
              title:"文字",
              type: "color"
            },
            FontSize: {
              min: 24,
              max: 150,
              defaultValue: FontSize,
              click: "FontSize"
            },
            boxWidth: {
              min:0,
              max: 100,
              click: "boxWidth"
            }
          }
        },{
          name: "上移",
          click: "LayoutLayerUpper",
          iconPath: "/core/images/tool-upward.png",
        }, {
          name: "下移",
          click: "LayoutLayerLower",
          iconPath: "/core/images/tool-down.png",
        }, {
          name: "删除",
          click: "delData",
          iconPath: "/core/images/bg-delete.png",
        },{
          name: "完成",
          click: "LayoutEditEnd",
          iconPath: "/core/images/tool-end.png",
        }
      ]
    },
    img: {
      title: '图片',
      comtype: 'img',
      iconPath: "/core/images/nav-img.png",
      startAnimation: "layout-animation-upward", // 开始动画
      endAnimation: "layout-animation-down",  //结束动画
      levelTool: {  // 同级工具
        boxWidth:{
          min: 0,
          max: 100,
          click: "boxWidth"
        }
      }, 
      tool: [
        {
          name: "编辑",
          click: "addData",
          iconPath: "/core/images/tool-edit.png",
        },{
          name: "上移",
          click: "LayoutLayerUpper",
          iconPath: "/core/images/tool-upward.png",
        }, {
          name: "下移",
          click: "LayoutLayerLower",
          iconPath: "/core/images/tool-down.png",
        }, {
          name: "删除",
          click: "delData",
          iconPath: "/core/images/bg-delete.png",
        }, {
          name: "完成",
          click: "LayoutEditEnd",
          iconPath: "/core/images/tool-end.png",
        }
      ]
    },
    background: {
      title: '背景',
      comtype: 'background',
      iconPath: "/core/images/nav-background.png",
      startAnimation: "layout-animation-upward", // 开始动画
      endAnimation: "layout-animation-down",  //结束动画
      click: "bgImgUpdata", // 添加图片
      selectClick: "bgImgSelect", // 选中背景图片
      tool: [
        {
          name: "编辑",
          click: "bgImgUpdata",
          iconPath: "/core/images/bg-edit.png",
        }, {
          name: "左移",
          click: "LayoutBgLeft",
          iconPath: "/core/images/bg-left.png",
        }, {
          name: "右移",
          click: "LayoutBgRight",
          iconPath: "/core/images/bg-right.png",
        }, {
          name: "删除",
          click: "delData",
          iconPath: "/core/images/bg-delete.png",
        }, {
          name: "完成",
          click: "LayoutEditEnd",
          iconPath: "/core/images/tool-end.png",
        }
      ],
    },
    form: {
      title: '表单',
      comtype: 'form',
      iconPath: "/core/images/nav-form.png",
      startAnimation: "layout-animation-upward", // 开始动画
      endAnimation: "layout-animation-down",  //结束动画
      click: "modelFrom",
      submit:"DataSubmit",
      tels: "",
      message:"微秀落地页[${pageName}],有新客来啦,来自${channel},访客信息[${user},${tel}]",
      field: {
        user: {
          type: 'text',
          placeholder: '请输入',
          name: "user",
          field: "姓名",
          inputType: "input",
          option: ['姓名', '电话', '纯文本'],
          optionIndex: 0,
          optionClick: "optionClick",
          prompt: "系统会根据类型进行自动检查，防止用户输错",
          isCheck: true,    // 是否校验
          rule: /\S/,       // 校验规则
          next: false,      // 校验失败是否允许下一步
          fail: "不能为空", // 校验失败提示文字
          click: "",
        },
        tel: {
          type: 'text',
          name: "tel",
          field: "电话",
          option: ['姓名', '电话', '纯文本'],
          optionIndex: 1,
          optionClick: "optionClick",
          isCheck: true,    // 是否校验
          rule: /\S/,       // 校验规则
          next: false,      // 校验失败是否允许下一步
          fail: "不能为空", // 校验失败提示文字
          click: "",
        },
        submit:{
          type: 'submit',
          name: "submit",
          promptName: 'prompt',
          inputType: "submit",
          field: "提交",
          optionIndex: 1,
          optionClick: "optionClick",
          prompt: "提交成功",
        },
      },
      tool: [
        {
          name: "编辑",
          click: "addData",
          iconPath: "/core/images/tool-edit.png",
        }, {
          name: "样式",
          click: "LayoutStyle",
          iconPath: "/core/images/tool-style.png",
          startAnimation: "layout-animation-max-height",//开始动画
          endAnimation: "layout-animation-min-height", //结束动画
          style: {
            TextAlign: {
              align: {
                left: {
                  title: "左对齐",
                  iconPath: "/core/images/align-left.png",
                  iconSelect: "/core/images/align-left-a.png",
                  colorSelect: "#4685F6"
                },
                center: {
                  title: "居中",
                  iconPath: "/core/images/align-center.png",
                  iconSelect: "/core/images/align-center-a.png",
                  colorSelect: "#4685F6"
                },
                right: {
                  title: "右对齐",
                  iconPath: "/core/images/align-right.png",
                  iconSelect: "/core/images/align-right-a.png",
                  colorSelect: "#4685F6"
                }
              },
              defaultValue: TextAlign,
              click: "TextAlign"
            },
            boxWidth: {
              min: 0,
              max: 100,
              click: "boxWidth"
            }
          },
          buttonStyle:{
            FontColor: {
              colorList,
              defaultValue: FontColor,
              click: "btFontColor",
              title: "文字",
              type: "color"
            },
            bgColor: {
              colorList,
              defaultValue: FontColor,
              click: "btFontColor",
              title: "背景",
              type: "background"
            },
          }
        },{
          name: "上移",
          click: "LayoutLayerUpper",
          iconPath: "/core/images/tool-upward.png",
        }, {
          name: "下移",
          click: "LayoutLayerLower",
          iconPath: "/core/images/tool-down.png",
        }, {
          name: "删除",
          click: "delData",
          iconPath: "/core/images/bg-delete.png",
        }, {
          name: "完成",
          click: "LayoutEditEnd",
          iconPath: "/core/images/tool-end.png",
        }
      ]
    },
    tel: {
      title: '电话',
      comtype: 'tel',
      iconPath: "/core/images/nav-code.png",
      startAnimation: "layout-animation-upward", // 开始动画
      endAnimation: "layout-animation-down",  //结束动画
      FormSubmit: "createField", // 表单提交到哪里
      inputType: "button",      // 通用类型
      data:{
        action: "tel",            // 触发器行为
        click: "button",          // 促发事件
        comtype:"tel",               // 类型
      },
      field: {
        value:{
          type: 'text',
          placeholder: '请输入手机号码',
          isCheck: true,    // 是否校验
          rule: /\S/,       // 校验规则
          next: false,      // 校验失败是否允许下一步
          fail: "电话号码不能为空", // 校验失败提示文字
        },
        title: {
          name: 'title',
          type: 'text',
          placeholder: '请输入按钮文字',
        },
        submit:{
          type: 'button',
          formType: "submit",
          placeholder: "确定",
          click: "",
        },
        cancel: {
          type: 'button',
          placeholder: "取消",
          click: "CloseWindows",  // 关闭窗口
        },
      },
      tool: [
        {
          name: "编辑",
          click: "addData",
          iconPath: "/core/images/tool-edit.png",
        }, {
          name: "样式",
          click: "LayoutStyle",
          iconPath: "/core/images/tool-style.png",
          startAnimation: "layout-animation-max-height",//开始动画
          endAnimation: "layout-animation-min-height", //结束动画
          style: {
            TextAlign: {
              align: {
                left: {
                  title: "左对齐",
                  iconPath: "/core/images/align-left.png",
                  iconSelect: "/core/images/align-left-a.png",
                  colorSelect: "#4685F6"
                },
                center: {
                  title: "居中",
                  iconPath: "/core/images/align-center.png",
                  iconSelect: "/core/images/align-center-a.png",
                  colorSelect: "#4685F6"
                },
                right: {
                  title: "右对齐",
                  iconPath: "/core/images/align-right.png",
                  iconSelect: "/core/images/align-right-a.png",
                  colorSelect: "#4685F6"
                }
              },
              defaultValue: TextAlign,
              click: "TextAlign"
            },
            FontColor: {
              colorList,
              defaultValue: FontColor,
              click: "FontColor",
              title: "文字",
              type: "color"
            },
            bgColor: {
              colorList,
              defaultValue: FontColor,
              click: "FontColor",
              title: "背景",
              type: "background"
            },
            FontSize: {
              min: 24,
              max: 150,
              defaultValue: FontSize,
              click: "FontSize"
            },
            boxWidth: {
              min: 0,
              max: 100,
              click: "boxWidth"
            }
          }
        },{
          name: "上移",
          click: "LayoutLayerUpper",
          iconPath: "/core/images/tool-upward.png",
        }, {
          name: "下移",
          click: "LayoutLayerLower",
          iconPath: "/core/images/tool-down.png",
        }, {
          name: "删除",
          click: "delData",
          iconPath: "/core/images/bg-delete.png",
        }, {
          name: "完成",
          click: "LayoutEditEnd",
          iconPath: "/core/images/tool-end.png",
        }
      ]
    },
    video: {
      title: '视频',
      comtype: 'video',
      iconPath: "/core/images/nav-video.png",
      startAnimation: "layout-animation-upward", // 开始动画
      endAnimation: "layout-animation-down",  //结束动画
      FormSubmit: "createField", // 表单提交到哪里
      inputType: "video",      // 通用类型
      field: {
        src: {
          type: 'text',
          placeholder: '请输入视频地址',
          isCheck: true,    // 是否校验
          rule: /\S/,       // 校验规则
          next: false,      // 校验失败是否允许下一步
          fail: "地址不能为空", // 校验失败提示文字
        },
        switch: {
          type: 'switch',
          switch: false,
        },
        submit: {
          type: 'button',
          formType: "submit",
          placeholder: "确定",
          click: "",
        },
        cancel: {
          type: 'button',
          placeholder: "取消",
          click: "CloseWindows",  // 关闭窗口
        },
      },
      levelTool: {  // 同级工具
        boxWidth: {
          min: 0,
          max: 100,
          click: "boxWidth"
        },
        boxHeight: {
          min: 100,
          max: 800,
          click: "boxHeight"
        }
      }, 
      tool: [
        {
          name: "编辑",
          click: "addData",
          iconPath: "/core/images/tool-edit.png",
        }, {
          name: "上移",
          click: "LayoutLayerUpper",
          iconPath: "/core/images/tool-upward.png",
        }, {
          name: "下移",
          click: "LayoutLayerLower",
          iconPath: "/core/images/tool-down.png",
        }, {
          name: "删除",
          click: "delData",
          iconPath: "/core/images/bg-delete.png",
        }, {
          name: "完成",
          click: "LayoutEditEnd",
          iconPath: "/core/images/tool-end.png",
        }
      ]
    }
  }
}


/**
 * 全局属性 false 预览模式 || true 编辑模式
 * this.mode
 * 组件的层级保存全局
 * this.Zindex = 100;
 * 统一处理css函数 把json转为页面css
 * function css() { };
 * 
 * css属性样式 样式属性斜杆用大写
 * 例如: 
 * TextAlign: {
 *    title: '左内边距',
 *    iconPath: "/core/images/align-center.png",
 *    iconSelect: "/core/images/align-center-a.png",
 *    colorSelect: "#4685F6",
 *    colorList: [],
 *    defaultValue: FontColor,
 *    click: "FontColor",
 *    min: 24,
 *    max: 150,
 *    child:{ // 子类
 *      left:{
 *        title: "左对齐",
 *        iconPath: "/core/images/align-left.png",
 *        iconSelect: "/core/images/align-left-a.png",
 *        colorSelect: "#4685F6"
 *      }
 *    }
 * }
 * 
 * 
 * 数据结构设置
 */


// {
//   settings: null
//   ok: null
//   isEditor: false
//   functionEditor: false
//   showPanel: false
//   properties:
//   [{
//     name: 文本内容
// type: content
// value:
//     comps: 
//     [  ]
// selected: false
// number: 1
//  } , {
//     name: 图片内容
// type: image
// value:
//     comps: 
//     [  ]
// selected: false
// number: 1
//  } , {
//     name: 颜色
// type: color
// value:
//     comps: 
//     [  ]
// selected: false
// number: 1
//  } , {
//     name: 链接内容
// type: link
// value:
//     comps: 
//     [  ]
// selected: false
// number: 1
//  } , {
//     name: 电话内容
// type: telephone
// value:
//     comps: 
//     [  ]
// selected: false
// number: 1
//  } , {
//     name: 音效内容
// type: sound
// value: {} 
// comps:
//     []
// selected: false
// number: 1
//   }, {
//     name: 计时时间
// type: time
// value:
//     comps: 
//     [  ]
// selected: false
// number: 1
//  } , {
//     name: 跳转页面
// type: internalLink
// value:
//     comps: 
//     [  ]
// selected: false
// number: 1
//  } , {
//     name: 输入框类型
// type: input
// value:
//     comps: 
//     [  ]
// selected: false
// number: 1
//  } , {
//     name: 视频内容
// type: video
// value:
//     comps: 
//     [  ]
// selected: false
// number: 1
//  } , {
//     name: 随机文字内容
// type: tRandom
// value:
//     []
// comps:
//     []
// selected: false
// number: 1
//   }, {
//     name: 随机图片内容
// type: iRandom
// value:
//     []
// comps:
//     []
// selected: false
// number: 1
//   }]
//   openPropertyPanel: null
//   verifyNumber: null
//   confirm: null
// } 


// {
//   settings: null
//   isEditor: false
//   functionEditor: false
//   deleteProperty: null
//   groupSettings:
//   [{
//     name: 新增操作
// type: addGroup
// value: 0
// comps:
//     []
//   }, {
//     name: 移动操作
// type: moveGroup
// value: 0
// comps:
//     []
//   }, {
//     name: 删除操作
// type: deleteGroup
// value: 0
// comps:
//     []
//   }, {
//     name: 编辑操作
// type: editGroup
// value:
//     comps: 
//     [  ]
//  }  ]
// } 


/**
 * pageJson 页面json
 *  id: 页面id
 *  sceneId： 场景id
 *  num： 数量
 *  name： 页面名字
 *  elements：数组元素
 *  { css }
 */



/**
 * 工具栏操作
 */

const menu = [
  {
    title: '文字',
    comtype: 'text',
    iconPath: "/core/images/nav-text.png",
    startAnimation: "layout-animation-upward", // 开始动画
    endAnimation: "layout-animation-down",     //结束动画
  },{
    title: '图片',
    comtype: 'img',
    iconPath: "/core/images/nav-img.png",

  },{
    title: '背景',
    comtype: 'background',
    iconPath: "/core/images/nav-background.png",
    startAnimation: "layout-animation-upward", // 开始动画
    endAnimation: "layout-animation-down",  //结束动画
    click: "bgImgUpdata", // 添加图片
    selectClick: "bgImgSelect", // 选中背景图片
  },{
    title: '表单',
    type: 'form',
    iconPath: "/core/images/nav-form.png",
    startAnimation: "layout-animation-upward", // 开始动画
    endAnimation: "layout-animation-down",  //结束动画
    click: "modelFrom",
    submit: "DataSubmit",
    tels: "",
    message: "微秀落地页[${pageName}],有新客来啦,来自${channel},访客信息[${user},${tel}]",
  },{
    title: '电话',
    comtype: 'tel',
    iconPath: "/core/images/nav-code.png",
    startAnimation: "layout-animation-upward", // 开始动画
    endAnimation: "layout-animation-down",  //结束动画
    FormSubmit: "createField", // 表单提交到哪里
    inputType: "button",      // 通用类型
  },{
    title: '视频',
    comtype: 'video',
    iconPath: "/core/images/nav-video.png",
    startAnimation: "layout-animation-upward", // 开始动画
    endAnimation: "layout-animation-down",  //结束动画
    FormSubmit: "createField", // 表单提交到哪里
    inputType: "video",      // 通用类型
  }
]
let Base = require("../Base/Base");
let HtmlToJson = require("../Base/HtmlToJson");

// 获取设备真实宽高
let realWindowWidth = 0;
let realWindowHeight = 0;
wx.getSystemInfo({
  success: function (res) {
    realWindowWidth = res.windowWidth;
    realWindowHeight = res.windowHeight;
  }
});

// 缓存页面列表
let cachePages = [];

// 当前页面文档
let currentDocument = null;

// 当前页面HTML代码
let currentHtml = "";

// 图像边距
let imgPadding = 0;

class HTMLView extends Base {
  constructor(page, id) {
    /// <summary>组件构造函数</summary>
    /// <param name="page" type="Object">页面对象</param>
    /// <param name="id" type="String">要绑定的元素ID</param>

    super(page, id);

    // 设置图片点击事件
    this.imageClickEventId = "HTMLViewImageClickEvent" + this._eventId;
    page[this.imageClickEventId] = e => {
      if (!!e.target.dataset.tapEvent && typeof page.data[e.target.dataset.tapEvent] === "function") {
        page.data[e.target.dataset.tapEvent].call(this, e);
      }
      if (!this.processImg) return;
      wx.previewImage({
        current: e.target.dataset.src,
        urls: currentDocument.imageUrls
      });
    };

    // 设置图片加载事件
    this.imageLoadEventId = "HTMLViewImageLoadEvent" + this._eventId;
    page[this.imageLoadEventId] = e => {
      if (!this.processImg) return;
      let idx = e.target.dataset.idx;
      calMoreImageInfo(e, idx, this);
      return;
    };

    // 设置链接点击事件
    this.linkClickEventId = "HTMLViewLinkClickEvent" + this._eventId;
    page[this.linkClickEventId] = e => {
      if (!!e.target.dataset.tapEvent && typeof page.data[e.target.dataset.tapEvent] === "function") {
        page.data[e.target.dataset.tapEvent].call(this, e);
      }
      let src = e.currentTarget.dataset.src;
      let list = src.split("://");
      if (typeof this.onLinkHandle === "function") {
        if (!!this.onLinkHandle.call(this, { src, protocol: src[0] === "#" ? "#" : list[0] })) {
          return;
        }
      }
      if (src[0] === "#") return;
      list[0] = list[0].toLowerCase();
      if (list[0] === "weapp") {
        let operating = e.currentTarget.dataset.target;
        let failFn = (e) => {
          this.onError.call(this, { errorCode: 0, errorMsg: e.errMsg });
        };
        // 根据不同的target做不同的微信导航操作
        switch (operating) {
          case "navigateTo":
          case "redirectTo":
          case "switchTab":
          case "reLaunch":
            src = "/" + list[1];
            wx[operating]({ url: src, fail: failFn })
            break;
          case "navigateToMiniProgram":
          case "navigateBackMiniProgram":
            if (!wx.navigateToMiniProgram) {
              // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
              wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
                showCancel: false
              });
              return;
            }
            src = list[1].split("/");
            let paramObj = { appId: src[0] };
            src.shift();
            paramObj.path = src.join("/");
            paramObj.extraData = getQueryString(paramObj.path);
            paramObj.fail = failFn;
            wx[operating](paramObj);
            break;
        }
      } else if (list[0] === "tel") {
        wx.makePhoneCall({
          phoneNumber: list[1]
        });
      } else {
        this.loadUrl(src);
      }
    };

    this.reset();

    this.init();
  };

  get name() {
    /// <summary>获取组件名称</summary>
    /// <returns type="String">组件名称</returns>

    return "HTMLView";
  };

  get url() {
    /// <summary>获取地址路径</summary>
    /// <returns type="String">地址路径</returns>

    return this._url;
  };

  set url(value) {
    /// <summary>设置地址路径</summary>
    /// <param name="value" type="String">地址路径</param>

    this.load(value);
  };

  set width(value) {
    /// <summary>设置宽度</summary>
    /// <param name="value" type="any">宽度</param>

    let isP = /^(100|[1-9]?\d(\.\d\d?)?)%$/.test(value);
    if (isNaN(value) && !isP) {
      this._width = "100%";
      imgPadding = 0;
      return;
    }
    if (isP) {
      this._width = value;
      imgPadding = realWindowWidth * ((100 - parseFloat(value)) / 100) / 2;
      this._padding = (100 - parseFloat(value)) / 2 + "%";
    } else {
      this._width = value + "rpx";
      imgPadding = realWindowWidth * ((750 - value) / 2) / 750;
      this._padding = ((750 - value) / 2) + "rpx";
    }
    
    this.update();
  };

  get width() {
    /// <summary>获取宽度</summary>
    /// <returns type="any">宽度</returns>

    return this._width;
  };

  get bindObj() {
    /// <summary>获取数据绑定对象</summary>
    /// <returns type="any">数据绑定对象</returns>

    return this._bindObj;
  };

  set bindObj(obj) {
    /// <summary>设置数据绑定对象</summary>
    /// <param name="value" type="any">数据绑定对象</param>

    if (obj === this._page.data) obj = null;
    this._bindObj = obj;
    this.reload();
  };

  reset() {
    /// <summary>重置</summary>

    this._url = "";

    this.nodes = [];

    this._width = "100%";

    this._padding = 0;

    this.processImg = true;

    this._bindObj = this._page.data;

    this.update();
  };

  loadUrl(url) {
    /// <summary>加载地址</summary>
    /// <param name="url" type="String">地址路径</param>

    if (url.toString().trim() === "") {
      this.reset();
      return;
    }

    if (!checkURL(url)) {
      // 进入404
      this._pageNotFoundTips();
      return;
    }

    if (url === this.url) return;

    this._url = url;

    let processObj = {};
    if (typeof this.onProcess !== "function") {
      if (typeof this.onError === "function") this.onError.call(this, { errorCode: 0, errorMsg: "not found onProcess event" });
      wx.hideNavigationBarLoading();
      return;
    } else {
      processObj = this.onProcess.call(this);
      if (typeof processObj.jsonStruct !== "string") processObj.jsonStruct = "";
    }

    if (this._tryLoadCache(processObj.url || url)) return;

    wx.showNavigationBarLoading();
    wx.request({
      url: processObj.url || url,
      success: (res) => {

        let getJson = getJsonChild(res.data, processObj.jsonStruct);
        if (!getJson) {
          this._load(res.data);

          this._addCache(processObj.url || url, res.data);
        } else {
          this._load(getJson);

          this._addCache(processObj.url || url, getJson);
        }
      },
      fail: (res) => {
        // 进入404
        this._pageNotFoundTips();

        if (typeof this.onError === "function") {
          this.onError.call(this, { errorCode: 404, errorMsg: "page not found" });
        }
      }
    });
  };

  _addCache(url, data) {
    /// <summary>添加缓存</summary>
    /// <param name="url" type="String">地址</param>
    /// <param name="data" type="String">HTML代码数据</param>

    // 缓存数据大于10MB开始清理缓存
    while (JSON.stringify(cachePages).replace(/[^\x00-\xff]/gi, "--").length / 1024 / 1024 > 10) {
      cachePages.pop();
    }
    cachePages.push({ url, data });
  };

  _tryLoadCache(url) {
    /// <summary>尝试从缓存中加载</summary>
    /// <param name="url" type="String">地址</param>
    /// <returns type="Boolean">是否加载成功</returns>

    for (let obj of cachePages) {
      if (obj.url == url) {
        this._load(obj.data);
        return true;
      }
    }
    return false;
  };

  loadHtml(html) {
    /// <summary>加载HTML代码</summary>
    /// <param name="html" type="String">HTML代码</param>

    this._url = "";
    wx.showNavigationBarLoading();
    this._load(html);
  };

  reload() {
    /// <summary>重新加载文档</summary>

    this._load(currentHtml);
  };

  _load(html, isTips) {
    /// <summary>加载文档</summary>
    /// <param name="html" type="String">HTML代码</param>

    try {
      currentHtml = html;

      currentDocument = HtmlToJson.toJson(html, this);

      this.nodes = currentDocument.nodes;
      this.update();

      if (!isTips && typeof this.onLoad === "function") {
        this.onLoad.call(this);
      }
    } catch (e) {
      this._pageErrorTips();

      if (typeof this.onError === "function") {
        this.onError.call(this, { errorCode: 0, errorMsg: e.message });
      }
    } finally {
      wx.hideNavigationBarLoading();
    }
  };

  _pageNotFoundTips() {
    /// <summary>404提示</summary>

    this._errorTips("<center style='padding-top:100px;padding-bottom:100px;'><font size='+3'>我们打不开该网页，因为找不到服务器。</font></center>");
  };

  _pageErrorTips() {
    /// <summary>数据异常提示</summary>

    this._errorTips("<center style='padding-top:100px;padding-bottom:100px;'><font size='+3'>我们无法为您打开网页，因为数据异常。</font></center>");
  };

  _errorTips(txt) {
    /// <summary>异常提示</summary>

    wx.getNetworkType({
      success: (res) => {
        if (res.networkType === "none") {
          this._load("<center style='padding-top:100px;padding-bottom:100px;'><font size='+3'>我们打不开该网页，因为您的<br/>手机尚未接入互联网。</font></center>", true);
        }
      },
      fail: () => {
        this._load(txt, true);
      }
    })
  };

}

function checkURL(url) {
  /// <summary>检查URL是否正确</summary>
  /// <param name="url" type="String">URL字符串</param>
  /// <returns type="Boolean">URL是否合法</returns>

  //判断URL地址的正则表达式为:http(s)?://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?
  //下面的代码中应用了转义字符"\"输出一个字符"/"
  return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(url);
}

function getJsonChild(json, str) {
  /// <summary>获取JSON对象子节点</summary>
  /// <param name="json" type="Object">JSON对象</param>
  /// <param name="str" type="String">子节点路径</param>
  /// <returns type="Object">子节点内容</returns>

  let list = str.split(".")
  for (let i = 0; i < list.length; i++) {
    json = json[list[i]];
    if (!json) return json;
  }
  return json;
}

function calMoreImageInfo(e, idx, that) {
  /// <summary>假循环获取计算图片视觉最佳宽高</summary>
  /// <param name="e" type="Object">属性对象</param>
  /// <param name="idx" type="Number">索引下标</param>
  /// <param name="that" type="Object">元素对象</param>

  var temData = currentDocument;
  if (!temData || temData.images.length == 0) {
    return;
  }
  var temImages = temData.images;
  //因为无法获取view宽度 需要自定义padding进行计算，稍后处理
  var recal = wxAutoImageCal(e.detail.width, e.detail.height, imgPadding);
  var index = temImages[idx].i;
  var key = `${that._id}`;
  for (var i of index.split('.')) key += `.nodes[${i}]`
  var keyW = key + '.width'
  var keyH = key + '.height'
  that._page.setData({
    [keyW]: recal.imageWidth,
    [keyH]: recal.imageheight,
  })
}

function wxAutoImageCal(originalWidth, originalHeight, padding) {
  /// <summary>计算视觉优先的图片宽高</summary>
  /// <param name="originalWidth" type="Number">原图宽度</param>
  /// <param name="originalHeight" type="Number">原图高度</param>
  /// <param name="padding" type="Number">边距</param>
  /// <returns type="Object">计算后的图像宽高</returns>

  //获取图片的原始长宽
  var windowWidth = 0, windowHeight = 0;
  var autoWidth = 0, autoHeight = 0;
  var results = {};
  windowWidth = realWindowWidth - 2 * padding;
  windowHeight = realWindowHeight;
  //判断按照那种方式进行缩放
  if (originalWidth > windowWidth) {
    //在图片width大于手机屏幕width时候
    autoWidth = windowWidth;
    autoHeight = (autoWidth * originalHeight) / originalWidth;
    results.imageWidth = (autoWidth - 30);
    results.imageheight = autoHeight;
  } else {
    //否则展示原来的数据
    results.imageWidth = originalWidth;
    results.imageheight = originalHeight;
  }
  
  return results;
}

function getQueryString(location) {
  /// <summary>
  /// 获取QueryString的对象形式
  /// </summary>
  /// <returns type="Array"></returns>

  var obj = {};
  var result = location.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
  if (!result) return obj;
  for (var i = 0; i < result.length; i++) {
    result[i] = result[i].substring(1).split("=");
    var key = decodeURIComponent(result[i][0]),
      value = decodeURIComponent(result[i][1]);
    var num = Number(value);
    obj[key] = isNaN(num) ? value : num;
  }
  return Object.freeze(obj);
}

module.exports = HTMLView;
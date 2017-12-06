
const setData = (k, v) => wx.setStorageSync(k, v)
const getData = k => wx.getStorageSync(k)
const remoData = k => wx.removeStorageSync(k);
const showModal = (obj, callback) => {
  wx.showModal({
    // 是否显示取消按钮
    showCancel: obj.showCancel || false,
    title: obj.title || '提示',
    content: obj.content || '',
    success: function (res) {
      if (res.confirm) {
        typeof callback == "function" && callback.call();
      } else if (res.cancel) {
        typeof callback == "function" && callback.call();
      }
    }
  })
}

module.exports = {
  setData,
  getData,
  remoData,
  showModal,
}

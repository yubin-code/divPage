
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

const showToast = (title, icon) => {
  wx.showToast({
    title, icon,
    duration: 2000
  })
}

// 获取指定时间
const getTime = day => {
  day = day || 0;
  let d = new Date();
  let date = new Date(d);
  date.setDate(d.getDate() + day);
  return date;
}
// 转化时间
const getDate = time => {
  if (!time || time === undefined || time === '~') return "~";
  
  return time.getFullYear() + "年"
  + (time.getMonth() + 1)
  + "月" + time.getDate() + "日";
}

module.exports = {
  setData,
  getData,
  remoData,
  showModal,
  getTime,
  getDate,
  showToast,
}

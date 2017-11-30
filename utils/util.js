
const setData = (k, v) => wx.setStorageSync(k, v)
const getData = k => wx.getStorageSync(k)

module.exports = {
  setData,
  getData
}

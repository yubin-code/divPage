import { showModal } from '../utils/util.js';
import { Post, Get, Put, downFile } from '../utils/http.js'

// 创建渠道
const createChanne = (data, callback) => {
  Post('/api/channel', data, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0) {
      showModal({ content: '添加渠道失败' });
      return false;
    }
    typeof callback == "function" && callback(res);
  });
}
// 获取默认渠道
const getDefaultChanne = callback => {
  Get('/api/channel/default', {}, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0) {
      showModal({ content: '获取默认渠道失败' });
      return false;
    }
    typeof callback == "function" && callback(res.data);
  });
}
// 获取渠道列表
const getChanneList = (data, callback) => {
  Get('/api/channel', data, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0) {
      showModal({ content: '获取渠道列表失败' });
      return false;
    }
    typeof callback == "function" && callback(res.data);
  });
}
//修改渠道
const updateChanne = (id, data, callback) => {
  Put('/api/channel/' + id, data, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0) {
      showModal({ content: '修改渠道失败' });
      return false;
    }
    typeof callback == "function" && callback(res.data);
  });
}

// 获取渠道详情
const getChanneDetails = (id, callback) => {
  Get('/api/channel/' + id, {}, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0) {
      showModal({ content: res.status.message });
      return false;
    }
    typeof callback == "function" && callback(res.data);
  });
}
// 获取二维码
const getQcode = (data, callback) => {
  Post('/api/channel/qr', data, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0) {
      showModal({ content: '获取二维码失败' });
      return false;
    }
    typeof callback == "function" && callback(res.data);
  });
}

// 下载二维码
const downCode = (url, callback) => {
  downFile(url, img => {
    wx.saveImageToPhotosAlbum({
      filePath: img,
      success(res) {
        typeof callback == "function" && callback(res);
      }
    })
  });
}

// 分享
const shareChanne = scene => {
  return {
      path: 'pages/share/index?id='
      + scene.id  + '&uid=' // 场景id
      + scene.uid + '&channelid=' // 用户id
      + scene.channelid + '&title='  // 渠道id
      + scene.title + '&cover='
      + scene.cover,
      title: scene.title, // 分享的标题
      imageUrl: scene.cover, // 分享的图片
    }
}



export {
  createChanne,
  getDefaultChanne,
  getChanneList,
  updateChanne,
  getChanneDetails,
  getQcode,
  downCode,
  shareChanne
}
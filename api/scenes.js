import { showModal } from '../utils/util.js';
import { Post, Get, Put } from '../utils/http.js'

// 添加场景
const scenesCreate = (data, callback) => {
  Post('/api/scenes', data, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0) {
      showModal({ content: '添加场景失败' });
      return false;
    }
    typeof callback == "function" && callback(res);
  });
}

// 获取用户创建的场景
const getScenesList = (data, callback) => {
  Get('/api/scenes/user',data, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0) {
      // showModal({ content: '请您先授权登录' });
      return false;
    }
    typeof callback == "function" && callback(res.data);
  });
}

// 获取内置场景
const getBuildin = (data, callback) => {
  Get('/api/scenes/buildin', data, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0) {
      // showModal({ content: res.status.message });
      return false;
    }
    typeof callback == "function" && callback(res.data);
  });
}

// 获取场景详细信息
const getScenes = (id, callback) => {
  Get('/api/scenes/' + id + '?channel=', {}, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0) {
      showModal({ content: res.status.message });
      return false;
    }
    typeof callback == "function" && callback(res.data);
  });
}

// 修改场景信息
const editScenes = (id, data, callback) => {
  Put('/api/scenes/' + id, data, res => {
    // 判断是否获取验证成功
    if (res.status.code !== 0) {
      showModal({ content: res.status.message });
      return false;
    }
    typeof callback == "function" && callback(res.data);
  });
}

// 添加线索
const addIntention = (data, callback) => {
  Post('/api/intention', data, res => {
    if (res.status.code !== 0) {
      showModal({ content: res.status.message });
      return false;
    }
    typeof callback == "function" && callback(res.data);
  });
}

// 获取线索
const getIntention = (data, callback) => {
  Post('/api/intention/list', data, res => {
    if (res.status.code !== 0) {
      showModal({ content: res.status.message });
      return false;
    }
    typeof callback == "function" && callback(res.data);
  });
}
export {
  scenesCreate,
  getScenesList,
  getScenes,
  editScenes,
  getBuildin,
  addIntention,
  getIntention
}
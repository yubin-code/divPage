import { getIntention } from "../../api/scenes"
import { getTime, getDate } from "../../utils/util.js"
import JyoComponent from "../../core/JyoComponent"
//index.js
//获取应用实例
const app = getApp();
Page({
  data:{
    start: '~',
    end: '~',
    param: {
      page: 1,
      size: 10,
      start: '',
      end: '',
      scenesIds: []
    },
    time: [
      { name: '全部' },
      { name: '今天' },
      { name: '昨天' }, 
      { name: '近七日' },
      { name: '自定义' },
    ],
    timeIndex: 0,
  },
  onLoad(p) {
    let param = this.data.param;
    param.scenesIds.push(p.id);
    this.setData({ param });
  },
  onShow (){
    this.dateTime=JyoComponent.create("DateTime", "dateTime", this);
    this.dateTime.onSelect = e => {
      let date = e.date.date.split("/").join("-");
      let index = e.date.index;
      // if (preToday(e.date) && !isToday(e.date)) return;
      let param = this.data.param;
      let start = this.data.start || '';
      let end = this.data.end || '';
      if (!param.start){
        start = new Date(date)
        param.start = new Date(date)
        start = getDate(start)
      } else if (!param.end){
        end = new Date(date);
        param.end = end
        end = getDate(end)
        this.dateTime.isVisible = false;
        this.getList();
      }

      let dateTime = this.data.dateTime;
      dateTime.days[index].style = "showDay"

      this.setData({
        param, dateTime, start, end
      })
    };
    
    this.getList({});
  },
  getList (o){
    let param = Object.assign(this.data.param, o);
    getIntention(param, (data) =>{
      this.setData({ res: data });
    });
  },
  navClick (e){
    let timeIndex = e.currentTarget.dataset.index;
    let date = {}
    let showData = false;
    switch (timeIndex){
      case 0:
        date = { start: '', end: '' }
        break;
      case 1:
        date = { start: getTime(), end: getTime() }
        break;
      case 2:
        date = { start: getTime(-1), end: getTime() }
        break;
      case 3:
        date = { start: getTime(-7), end: getTime() }
        break;
      case 4:
        let param = this.data.param;
        param.start = '';
        param.end = '';
        this.setData({ param });
        this.dateTime.isVisible = true;
        break;
    }
    
    let start = getDate(date.start);
    let end = getDate(date.end);
    let param = Object.assign(this.data.param, date);
    this.setData({ timeIndex, param, start, end, showData});
    this.getList();
  }
})

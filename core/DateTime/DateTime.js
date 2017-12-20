let Base = require("../Base/Base");

function getDaysInMonth(year, month) {
  /// <sumary>根据年月获取天数</summary>
  /// <param name="year" type="Number">年份</param>
  /// <param name="month" type="Number">月份</param>
  /// <returns type="Number">天数</returns>

  month = parseInt(month, 10);
  var d = new Date(year, month, 0);
  return d.getDate();
}

function isToday(str) {
  /// <sumary>判断是否为今天</summary>
  /// <param name="str" type="String">日期字符串</param>
  /// <returns type="String">是否为今天</returns>

  var d = new Date(str.replace(/-/g, "/"));
  var todaysDate = new Date();
  if (d.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
    return true;
  } else {
    return false;
  }
}

function preToday(day) {
  var d = new Date(day);
  var curDate = new Date();
  if (d > curDate) {
    return false;
  }
  return true;
}

class DateTime extends Base {
  constructor(page, id) {
    /// <summary>组件构造函数</summary>
    /// <param name="page" type="Object">页面对象</param>
    /// <param name="id" type="String">要绑定的元素ID</param>

    super(page, id);

    // 设置日期选择事件
    this.selectEventId = "DateTimeSelectEvent" + this._eventId;
    page[this.selectEventId] = e => {
      this.selectDate = e.target.dataset.date;
      this.fillDays(this._currentFillYear, this._currentFillMonth);
      if (typeof this.onSelect == "function") {
        this.onSelect.call(this, { date: e.target.dataset });
      }
    };

    // 设置上一个月按钮事件
    this.previousMonthEventId = "DateTimePreviousMonthEvent" + this._eventId;
    page[this.previousMonthEventId] = e => {
      if (--this._currentFillMonth == 0) {
        this._currentFillMonth = 12;
        this._currentFillYear--;
      }
      this.setDateTitle(this.language);
      this.fillDays(this._currentFillYear, this._currentFillMonth);
    };

    // 设置下一个月按钮事件
    this.nextMonthEventId = "DateTimeNextMonthEvent" + this._eventId;
    page[this.nextMonthEventId] = e => {
      if (++this._currentFillMonth == 13) {
        this._currentFillMonth = 1;
        this._currentFillYear++;
      }
      this.setDateTitle(this.language);
      this.fillDays(this._currentFillYear, this._currentFillMonth);
    };

    this.reset();

    this.init();
  };

  get name() {
    /// <summary>获取组件名称</summary>
    /// <returns type="String">组件名称</returns>

    return "DateTime";
  };

  set _language(value) {
    /// <summary>设置语言</summary>
    /// <param name="value" type="String">地区语言码</param>

    this.language = value;

    switch (value) {
      case "zh_CN":
      case "zh_TW":
      case "zh_HK":
        this.weekTitles = ["一", "二", "三", "四", "五", "六", "日"];
        break;
      case "ja":
        this.weekTitles = ["月", "火", "水", "木", "金", "土", "日"];
        break;
      case "ko":
        this.weekTitles = ["월", "화", "수", "목", "금", "토", "일"];
        break;
      default:
        this.weekTitles = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
        break;
    }

    this.setDateTitle(value);
    this.update();
  };

  reset() {
    /// <summary>重置</summary>

    this._currentDate = new Date();
    this._currentFillYear = this._currentDate.getFullYear();
    this._currentFillMonth = this._currentDate.getMonth() + 1;

    this.selectDate = `${this._currentFillYear}/${this._currentFillMonth}/${this._currentDate.getDate()}`;

    this.days = [];

    this.fillDays(this._currentFillYear, this._currentFillMonth);

    this.update();
  };

  setDateTitle(lang) {
    /// <summary>设置日期标题</summary>
    /// <param name="lang" type="String">地区语言码</param>

    let str = "";
    switch (lang) {
      case "zh_CN":
      case "zh_TW":
      case "zh_HK":
      case "ja":
        str = `${this._currentFillYear}年 ${this._currentFillMonth}月`;
        break;
      case "ko":
        str = `${this._currentFillYear}년 ${this._currentFillMonth}월`;
        break;
      default:
        let m = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec");
        str = `${m[this._currentFillMonth - 1]} ${this._currentFillYear}`;
        break;
    }
    this.selectedDateTitle = str;
  };

  fillDays(year, month) {
    /// <summary>填充日期</summary>
    /// <param name="year" type="Number">年份</param>
    /// <param name="month" type="Number">月份</param>

    this.days.length = 0;
    let currentDays = getDaysInMonth(year, month);
    let previousDays;
    if (month == 1) {
      previousDays = getDaysInMonth(year - 1, 12);
    } else {
      previousDays = getDaysInMonth(year, month - 1);
    }
    let firstDayWeek = new Date(`${year}/${month}/01`).getDay();
    if (firstDayWeek == 0) firstDayWeek = 7;

    let fillDaysCount = 0;

    // 填充上个月日期
    for (let i = firstDayWeek - 1; i--;) {
      let day = previousDays - i;
      let date = month - 1 == 0 ? `${year - 1}/12/${day}` : `${year}/${month - 1}/${day}`;
      let obj = { day: "", date };
      let style = (preToday(date) && !isToday(date) ? "" : "");
      if (style !== "") obj.style = style;
      this.days.push(obj);
      fillDaysCount++;
    }
    
    // 填充当月日期
    for (let i = 0; i < currentDays && fillDaysCount <= 42; i++) {
      let day = i + 1;
      let date = `${year}/${month}/${day}`;
      let obj = { day, date };
      let style = (preToday(date) && !isToday(date) ? "" : "");
      if (style !== "") obj.style = style;
      this.days.push(obj);
      fillDaysCount++;
    }

    this.update();
  };
}

module.exports = DateTime;
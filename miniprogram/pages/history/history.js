var util = require('../../utils/util.js');

Page({
  data: {
    year: 0,
    month: 0,
    date: ['日', '一', '二', '三', '四', '五', '六'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
  },

  selectDay: function (e) {
    console.log("enter selectDay");
    let year = e.currentTarget.dataset.year;
    let month = e.currentTarget.dataset.month;
    let day = e.currentTarget.dataset.datenum;
    let isToday = '' + year + this.formatDay(month) + this.formatDay(day);
    let date = year + '-' + this.formatDay(month) + '-' + this.formatDay(day);

    let startdate = date + " 00:00:00";
    let enddate = date + " 23:59:59";
    let sdate = new Date(startdate);
    let edate = new Date(enddate);

    this.clockinQuery(sdate, edate);

    this.setData({
      isToday: isToday
    })

  },


  clockinQuery: function (sdate, edate) {
    const db = wx.cloud.database();
    db.collection('clockin').where({
      clockin_date: db.command.gte(sdate).and(db.command.lte(edate))
    }).get({
      success: res => {
        console.log(res);
        this.setData({
          clockinList: res.data
        })
      }
    })
  },


  clockinCount: function (sdate, edate) {
    const db = wx.cloud.database();
    db.collection('clockin').where({
      clockin_date: db.command.gte(sdate).and(db.command.lte(edate))
    }).count({
      success: res => {
        console.log(res);
      }
    })
  },


  formatDay(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },



  dateInit: function (setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + '/' + (month + 1) + '/' + 1).getDay(); //目标月1号对应的星期

    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;
    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        let isToday = '' + year + this.formatDay(month + 1) + this.formatDay(num);
        obj = {
          isToday: isToday,
          dateNum: num
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;
    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },

  /**
   * 上月切换
   */
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    let isToday = '' + year + this.formatDay(month + 1) + this.formatDay(1);
    let date = year + '-' + this.formatDay(month + 1) + '-' + this.formatDay(1);

    let startdate = date + " 00:00:00";
    let enddate = date + " 23:59:59";
    let sdate = new Date(startdate);
    let edate = new Date(enddate);

    this.clockinQuery(sdate, edate);

    this.setData({
      year: year,
      month: (month + 1),
      isToday: isToday
    })
    this.dateInit(year, month);
  },

  /**
   * 下月切换
   */
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    let isToday = '' + year + this.formatDay(month + 1) + this.formatDay(1);
    let date = year + '-' + this.formatDay(month + 1) + '-' + this.formatDay(1);

    let startdate = date + " 00:00:00";
    let enddate = date + " 23:59:59";
    let sdate = new Date(startdate);
    let edate = new Date(enddate);

    this.clockinQuery(sdate, edate);

    this.setData({
      year: year,
      month: (month + 1),
      isToday: isToday
    })

    this.dateInit(year, month);
  },


  onLoad: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let date = util.formatTime(new Date());
    
    let startdate = date + " 00:00:00";
    let enddate = date + " 23:59:59";
    let sdate = new Date(startdate);
    let edate = new Date(enddate);

    this.clockinQuery(sdate, edate);

    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    this.dateInit();
    let isToday = '' + year + this.formatDay(month) + this.formatDay(day);

    this.setData({
      year: year,
      month: month,
      isToday: isToday
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 允许用户右上角分享到朋友圈
   */
  onShareTimeline: function () {
    title: '瘦身打卡'
  }


})
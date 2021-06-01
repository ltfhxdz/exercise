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
    
    muscleList: [{
      muscle: '胸肌',
      days: '20天次',
      actionList: [{
        action: '平板杠铃卧推',
        groupList: [{
          weight: '20公斤',
          start: '2020-12-1开始',
          days: '18天次'
        }, {
          weight: '30公斤',
          start: '2020-11-10开始',
          days: '18天次'
        }, {
          weight: '40公斤',
          start: '2021-12-21开始',
          days: '18天次'
        }]
      },{
        action: '史密斯上斜卧推',
        groupList: [{
          weight: '20公斤',
          start: '2020-12-1开始',
          days: '18天次'
        }, {
          weight: '30公斤',
          start: '2020-11-12开始',
          days: '18天次'
        }, {
          weight: '40公斤',
          start: '2021-12-17开始',
          days: '18天次'
        }]
      }]
    },{
      muscle: '背肌',
      days: '20天次',
      actionList: [{
        action: '高位下拉',
        groupList: [{
          weight: '20公斤',
          start: '2020-12-1开始',
          days: '18天次'
        }, {
          weight: '30公斤',
          start: '2020-11-10开始',
          days: '18天次'
        }, {
          weight: '40公斤',
          start: '2021-12-21开始',
          days: '18天次'
        }]
      },{
        action: '坐姿划船',
        groupList: [{
          weight: '20公斤',
          start: '2020-12-1开始',
          days: '18天次'
        }, {
          weight: '30公斤',
          start: '2020-11-12开始',
          days: '18天次'
        }, {
          weight: '40公斤',
          start: '2021-12-17开始',
          days: '18天次'
        }]
      }]
    }]
  },

  test: function () {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;

    wx.cloud.callFunction({
      name: 'clockinDate',
      data: {
        year: year,
        month: month
      },
      complete: res => {}
    })
  },


  aggregate1: function () {
    wx.cloud.callFunction({
      name: 'aggregate1',
      complete: res => {
        this.setData({
          aggregate1List: res.result.list
        })
      }
    })
  },

  aggregate2: function () {
    wx.cloud.callFunction({
      name: 'aggregate2',
      complete: res => {
        let resultList = res.result.data;
        for (let x in resultList) {
          let id = resultList[x]['_id'];
          let small_name = resultList[x]['small_name'];
          let small_weight = small_name + ' ' + resultList[x]['groupList'][0]['weight'] + resultList[x]['groupList'][0]['unit'];
          console.log(id);
          console.log(small_name);
          console.log(small_weight);
          this.clockinUpdateSmall_weight(id, small_weight);
        }

      }
    })
  },


  aggregate5: function () {
    wx.cloud.callFunction({
      name: 'aggregate5',
      complete: res => {
        this.setData({
          aggregate5List: res.result.list
        })
      }
    })
  },


  aggregate6: function () {
    wx.cloud.callFunction({
      name: 'aggregate6',
      complete: res => {
        let aggregate6List = [];
        let resultList = res.result.list;
        for(let x in resultList){
          let startDate = new Date(resultList[x]['startDate']);
          let year = startDate.getFullYear();
          let month = startDate.getMonth();
          let day = startDate.getDate();
          let startDate_str = year + "-" + (month + 1) + "-" + day;

          let aggregate6Map = {};
          aggregate6Map['_id'] = resultList[x]['_id'];
          aggregate6Map['startDate'] = startDate_str;
          aggregate6List.push(aggregate6Map);
        }
        this.setData({
          aggregate6List: aggregate6List
        })
      }
    })
  },


  selectDay: function (e) {
    let clockin_date = e.currentTarget.dataset.clockin_date;
    let startdate = clockin_date + " 00:00:00";
    let enddate = clockin_date + " 23:59:59";
    let sdate = new Date(startdate);
    let edate = new Date(enddate);

    this.clockinQuery(sdate, edate);

    this.setData({
      isToday: clockin_date
    })

  },


  clockinQuery: function (sdate, edate) {
    const db = wx.cloud.database();
    db.collection('clockin').where({
      clockin_date: db.command.gte(sdate).and(db.command.lte(edate))
    }).get({
      success: res => {
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
      success: res => {}
    })
  },


  formatDay(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
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

    this.clockinQueryByMonth(year, this.data.month);
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

    this.clockinQueryByMonth(year, this.data.month);
  },


  onLoad: function () {
    
    this.setData({
      muscleList: this.data.muscleList
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;

    this.setData({
      year: year,
      month: month
    })

    this.clockinQueryByMonth(year, month);

    this.aggregate1();
    this.aggregate5();
    this.aggregate6();
    
    // this.aggregate2();
  },

  clockinUpdateSmall_weight: function (id, small_weight) {
    const db = wx.cloud.database()
    db.collection('clockin').doc(id).update({
      data: {
        small_weight: small_weight
      },
      success: res => {},
      fail: err => {
        console.error('数据库更新失败：', err)
      }
    })
  },

  clockinQueryByMonth: function (year, month) {
    wx.cloud.callFunction({
      name: 'clockinDate',
      data: {
        year: year,
        month: month
      },
      complete: res => {
        if (res.result.data.length == 0) {
          this.setData({
            dayList: []
          })
          return;
        }
        let dayList = this.getDayList(res.result.data);
        let isToday = dayList[dayList.length - 1]['clockin_date'];

        this.setData({
          dayList: dayList,
          isToday: isToday
        })

        let startdate = isToday + " 00:00:00";
        let enddate = isToday + " 23:59:59";
        let sdate = new Date(startdate);
        let edate = new Date(enddate);
        this.clockinQuery(sdate, edate);
      }
    })
  },


  clockinCountByMonth: function (year, month) {
    let month1 = year + "-" + month + "-1";
    let month2 = year + "-" + (month + 1) + "-1";
    let sdate = new Date(month1);
    let edate = new Date(month2);

    const db = wx.cloud.database();
    db.collection('clockin').where({
      clockin_date: db.command.gte(sdate).and(db.command.lt(edate))
    }).count({
      success: res => {}
    })
  },


  getDayList: function (resultList) {
    let dayList = [];
    for (let x in resultList) {
      let flag = false;
      let clockin_date = new Date(resultList[x]['clockin_date']);
      let year = clockin_date.getFullYear();
      let month = clockin_date.getMonth();
      let day = clockin_date.getDate();
      let week = this.getWeek(clockin_date.getDay());
      let clockin_str = year + "-" + (month + 1) + "-" + day;

      for (let y in dayList) {
        if (dayList[y]['clockin_date'] == clockin_str) {
          flag = true;
          break;
        }
      }

      if (!flag) {
        let dayMap = {};
        dayMap['clockin_date'] = clockin_str;
        dayMap['week'] = week;
        dayList.push(dayMap);
      }
    }

    for (let x in dayList) {
      let big_name = '';
      for (let y in resultList) {
        let clockin_date = new Date(resultList[y]['clockin_date']);
        let year = clockin_date.getFullYear();
        let month = clockin_date.getMonth();
        let day = clockin_date.getDate();
        let clockin_str = year + "-" + (month + 1) + "-" + day;

        if (dayList[x]['clockin_date'] == clockin_str) {
          if (big_name.indexOf(resultList[y]['big_name']) == -1) {
            big_name = resultList[y]['big_name'] + "，" + big_name;
          }
        }
      }
      big_name = big_name.substr(0, big_name.lastIndexOf('，'));
      dayList[x]['big_name'] = big_name
    }

    return dayList;
  },

  getWeek: function (week) {
    switch (week) {
      case 1:
        return '星期一';
      case 2:
        return '星期二';
      case 3:
        return '星期三';
      case 4:
        return '星期四';
      case 5:
        return '星期五';
      case 6:
        return '星期六';
      case 0:
        return '星期日';
    }
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
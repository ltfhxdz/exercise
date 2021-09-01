var muscleJson = require('/../data/muscle.js');
const db = wx.cloud.database();
let openid = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    muscleArray: ['胸部', '背部', '肩部', '手臂', '腿部', '臀部', '腹部'],
  },



  clearMuscle: function () {
    db.collection('muscle').orderBy('sort', 'asc').get({
      success: res => {
        let resultList = res.data;
        for (let x in resultList) {
          this.muscleDeleteDB(resultList[x]['_id']);
        }
      }
    })
  },


  muscleDeleteDB: function (id) {
    db.collection('muscle').doc(id).remove({
      success: res => {
        console.warn(res);
      },
      fail: err => {
        console.error('数据库删除失败：', err)
      }
    })
  },

  initMuscle: function () {
    let muscleArray = this.data.muscleArray;
    for (let x in muscleArray) {
      this.muscleAddDB(parseInt(x) + 1, muscleArray[x]);
    }
  },

  clearAction: function () {
    db.collection('action').get({
      success: res => {
        console.warn(res.data);
        let resultList = res.data;
        for (let x in resultList) {
          this.actionDeleteDB(resultList[x]['_id']);
        }
      }
    })
  },


  actionDeleteDB: function (id) {
    db.collection('action').doc(id).remove({
      success: res => {
        console.warn(res);
      },
      fail: err => {
        console.error('数据库删除失败：', err)
      }
    })
  },



  muscleAddDB: function (sort, name) {
    db.collection('muscle').add({
      data: {
        sort: sort,
        name: name
      },
      success: res => {
        console.warn(res);
      },
      fail: err => {
        console.error('数据库新增失败：', err)
      }
    })
  },


  initAction: function () {
    db.collection('muscle').get({
      success: res => {
        let resultList = res.data;
        this.initActionSub(resultList);
      }
    })
  },


  initActionSub: function (resultList) {
    let muscleArray = muscleJson.muscleJson;

    for (let a in resultList) {
      for (let x in muscleArray) {
        if (resultList[a]['name'] == muscleArray[x]['muscle']) {
          let actionList = muscleArray[x]['actionList'];
          for (let y in actionList) {
            this.actionAddDB(resultList[a]['_id'], resultList[a]['name'], actionList[y], parseInt(y) + 1, );
          }
        }
      }
    }
  },


  actionAddDB: function (big_id, big_name, name, sort) {
    db.collection('action').add({
      data: {
        big_id: big_id,
        big_name: big_name,
        name: name,
        sort: sort
      },
      success: res => {
        console.warn(res);
      },
      fail: err => {
        console.error('数据库新增失败：', err)
      }
    })
  },

  

  deleteDetail: function () {
    wx.cloud.callFunction({
      name: 'initDetail',
      complete: res => {
        let actionList = res.result.data;
        for (let x in actionList) {
          this.detailDeleteBySmallId(actionList[x]['_id']);
        }
      }
    })
  },


  detailDeleteBySmallId: function (small_id) {
    db.collection('detail').where({
      small_id: small_id
    }).remove({
      success: res => {
        console.warn(res);
      },
      fail: err => {
        console.error('数据库删除失败：', err)
      }
    })
  },

  

  initDetail: function () {
    wx.cloud.callFunction({
      name: 'initDetail',
      complete: res => {
        let actionList = res.result.data;
        for (let x in actionList) {
          this.detailAddDB2(actionList[x]['_id'], actionList[x]['name'], 4, 20, '公斤', 20);
        }
      }
    })
  },



  detailAddDB2: function (smallId, name, group, weight, unit, number) {
    db.collection('detail').add({
      data: {
        small_id: smallId,
        name: name,
        group: group,
        weight: weight,
        unit: unit,
        number: number,
        exercise_date: db.serverDate()
      },
      success: res => {
        console.warn(res);
      },
      fail: err => {
        console.error('数据库新增失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
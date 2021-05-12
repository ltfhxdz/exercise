// miniprogram/pages/setup/setup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bigAddHidden: true,
    smallAddHidden: true,
    detailShow: false,
    groupArray: [
      [1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],

    unitArray: ['公斤', '磅'],

    weightArray: [
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],
    numberArray: [
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],
  },

  detailAdd: function () {
    this.detailAddDB(this.data.smallId, this.data.action, this.data.group, this.data.weight, this.data.unit, this.data.number);
    this.setData({
      detailShow: false
    })
  },


  detailAddDB: function (smallId, name, group, weight, unit, number) {
    const db = wx.cloud.database()
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


  groupMethod: function (e) {
    let groupArray = e.detail.value;
    let group = groupArray[0] + 1;

    this.setData({
      group: group,
    })
  },

  numberMethod: function (e) {
    let numberArray = e.detail.value;
    let number = numberArray[0] * 10 + numberArray[1];

    this.setData({
      number: number,
    })
  },

  unitMethod: function (e) {
    let unitArray = e.detail.value;
    let unit = unitArray[0];

    this.setData({
      unit: this.data.unitArray[unit],
    })
  },

  weightMethod: function (e) {
    let weightArray = e.detail.value;
    let weight = weightArray[0] * 10 + weightArray[1];

    this.setData({
      weight: weight,
    })
  },


  showGroup: function (e) {
    this.detailQuery(e);
  },


  detailQuery: function (e) {
    const db = wx.cloud.database();
    db.collection('detail').where({
      small_id: e.currentTarget.dataset.id
    }).get({
      success: res => {
        if (res.data.length == 0) {
          this.setData({
            detailShow: true,
            smallId: e.currentTarget.dataset.id,
            action: e.currentTarget.dataset.name,
            group: 4,
            weight: 20,
            unit: '公斤',
            number: 20
          })
        } else {
          this.setData({
            detailShow: true,
            smallId: e.currentTarget.dataset.id,
            action: e.currentTarget.dataset.name,
            group: res.data[0]['group'],
            weight: res.data[0]['weight'],
            unit: res.data[0]['unit'],
            number: res.data[0]['number'],
          })
        }
      }
    })
  },


  closeGroup: function (e) {
    this.setData({
      detailShow: false
    })
  },


  bigActivation: function (e) {
    if (e.detail.value) {
      this.bigUpdate(e.currentTarget.dataset.id, true);
    } else {
      this.bigUpdate(e.currentTarget.dataset.id, false);
    }
    
  },

  bigUpdate: function (id, activation) {
    const db = wx.cloud.database()
    db.collection('big').doc(id).update({
      data: {
        activation: activation
      },
      success: res => {
        this.bigQuery();
      },
      fail: err => {
        console.error('数据库更新失败：', err)
      }
    })
  },

  smallUpdate: function (id, activation) {
    const db = wx.cloud.database()
    db.collection('small').doc(id).update({
      data: {
        activation: activation
      },
      success: res => {
        this.smallQuery(this.data.big_id);
      },
      fail: err => {
        console.error('数据库更新失败：', err)
      }
    })
  },



  smallActivation: function (e) {
    if (e.detail.value) {
      this.smallUpdate(e.currentTarget.dataset.id, true);
    } else {
      this.smallUpdate(e.currentTarget.dataset.id, false);
    }
  },



  addActivity: function (e) {
    this.smallQuery(e.currentTarget.dataset.id);

    this.setData({
      big_id: e.currentTarget.dataset.id,
      activity: e.currentTarget.dataset.name,
      activityFlag: true
    })
  },

  smallDelete: function (e) {
    this.smallDeleteDB(e);
  },


  smallDeleteDB: function (e) {
    const db = wx.cloud.database();
    db.collection('small').doc(e.currentTarget.dataset.id).remove({
      success: res => {
        this.smallQuery(this.data.big_id);
      },
      fail: err => {
        console.error('数据库删除失败：', err)
      }
    })
  },


  smallAddDB: function (big_id, name) {
    const db = wx.cloud.database()
    db.collection('small').add({
      data: {
        big_id: big_id,
        name: name,
        activation: true
      },
      success: res => {
        this.smallQuery(this.data.big_id);
      },
      fail: err => {
        console.error('数据库新增失败：', err)
      }
    })
  },

  smallAdd: function () {
    this.smallAddClean();
    this.setData({
      smallAddHidden: false
    })
  },

  smallAddCancel: function () {
    this.setData({
      smallAddValue: '',
      smallAddHidden: true,
      smallAddFlag: false
    });
  },


  smallAddConfirm: function () {
    //TODO 如果存在，就更新，不存在，就添加
    this.smallAddDB(this.data.big_id, this.data.smallName);


    this.setData({
      smallAddHidden: true
    });
  },


  smallAddInput: function (e) {
    if (e.detail.value.length == 0) {
      this.smallAddClean();
    } else {
      this.setData({
        smallName: e.detail.value,
        smallAddFlag: true
      })
    }
  },

  smallAddClean: function () {
    this.setData({
      smallAddValue: '',
      smallAddFlag: false
    })
  },


  smallQuery: function (big_id) {
    const db = wx.cloud.database();
    db.collection('small').where({
      big_id: big_id
    }).get({
      success: res => {
        this.setData({
          smallList: res.data
        })
      }
    })
  },


  bigDelete: function (e) {
    const db = wx.cloud.database();
    db.collection('big').doc(e.currentTarget.dataset.id).remove({
      success: res => {
        this.bigQuery();
      },
      fail: err => {
        console.error('数据库删除失败：', err)
      }
    })
  },

  bigAddDB: function (name) {
    const db = wx.cloud.database()
    db.collection('big').add({
      data: {
        name: name,
        activation: true
      },
      success: res => {
        this.bigQuery();
      },
      fail: err => {
        console.error('数据库新增失败：', err)
      }
    })
  },

  bigAdd: function () {
    this.bigAddClean();
    this.setData({
      bigAddHidden: false
    })
  },

  bigAddCancel: function () {
    this.setData({
      bigAddValue: '',
      bigAddHidden: true,
      bigAddFlag: false
    });
  },


  bigAddConfirm: function () {
    //TODO 如果存在就更新，如果不存在，就添加
    this.bigAddDB(this.data.bigName);


    this.setData({
      bigAddHidden: true
    });

  },


  bigAddInput: function (e) {
    if (e.detail.value.length == 0) {
      this.bigAddClean();
    } else {
      this.setData({
        bigName: e.detail.value,
        bigAddFlag: true
      })
    }
  },

  bigAddClean: function () {
    this.setData({
      bigAddValue: '',
      bigAddFlag: false
    })
  },


  bigQuery: function () {
    const db = wx.cloud.database();
    db.collection('big').get({
      success: res => {
        this.setData({
          bigList: res.data
        })
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
    this.bigQuery();
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
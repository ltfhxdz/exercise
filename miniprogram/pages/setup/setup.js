// miniprogram/pages/setup/setup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bigAddHidden: true,
    smallAddHidden: true
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
    const db = wx.cloud.database();
    db.collection('small').doc(e.currentTarget.dataset.id).remove({
      success: res => {
        this.smallQuery(this.data.big_id);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '数据库删除失败'
        })
        console.error('数据库删除失败：', err)
      }
    })

  },

  smallAddDB: function (big_id, name) {
    const db = wx.cloud.database()
    db.collection('small').add({
      data: {
        big_id: big_id,
        name: name
      },
      success: res => {
        this.smallQuery(this.data.big_id);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '数据库新增失败'
        })
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
        wx.showToast({
          icon: 'none',
          title: '数据库删除失败'
        })
        console.error('数据库删除失败：', err)
      }
    })

  },

  bigAddDB: function (name) {
    const db = wx.cloud.database()
    db.collection('big').add({
      data: {
        name: name
      },
      success: res => {
        this.bigQuery();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '数据库新增失败'
        })
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
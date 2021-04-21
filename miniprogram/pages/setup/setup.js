// miniprogram/pages/setup/setup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bigAddHidden: true,
  },

  bigDelete: function (e) {
    const db = wx.cloud.database();
    db.collection('big').doc(e.currentTarget.dataset.id).remove({
      success: res => {
        this.query();
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
        this.query();
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


  query: function () {
    let resultList = [];
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
    this.query();
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
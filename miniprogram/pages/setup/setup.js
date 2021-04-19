// miniprogram/pages/setup/setup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addHidden: true,
  },

  add: function () {
    this.setData({
      addHidden: false
    })
  },

  addCancel: function () {
    this.setData({
      addValue: '',
      addHidden: true,
      addFlag: false
    });
  },


  addConfirm: function () {
    let addWord = this.data.addWord;
   
    this.setData({
      addHidden: true
    });

  },


  addInput: function (e) {
    if (e.detail.value.length == 0) {
      this.addClean();
    } else {
      this.setData({
        addWord: e.detail.value,
        addFlag: true
      })
    }
  },

  addClean: function () {
    this.setData({
      addValue: '',
      addFlag: false
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
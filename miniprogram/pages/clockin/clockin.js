// miniprogram/pages/setup/setup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  activityQuery: function () {
    let bigList2 = [];
    let smallList2 = [];
    const db = wx.cloud.database();
    db.collection('big').get({
      success: res => {
        bigList2 = res.data;

        const db = wx.cloud.database();
        db.collection('small').get({
          success: res => {
            smallList2 = res.data;

            let twoList = [];
            for (let x in bigList2) {
              let twoMap = {};
              twoMap["id"] = bigList2[x]["_id"];
              twoMap["name"] = bigList2[x]["name"];
              let twodata = [];
              for (let y in smallList2) {
                if (bigList2[x]["_id"] == smallList2[y]["big_id"]) {
                  let twoDataMap = {};
                  twoDataMap["name"] = smallList2[y]["name"];
                  twodata.push(twoDataMap);
                }
              }

              twoMap["twodata"] = twodata;
              twoList.push(twoMap);

            }
            this.setData({
              twoList: twoList
            })
          }
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.activityQuery();
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
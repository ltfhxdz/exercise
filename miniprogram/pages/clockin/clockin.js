// miniprogram/pages/setup/setup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailShow: true,
    weightArray: [
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],
    numberArray: [
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],
  },

  clockin:function(e){
    console.log(e.detail.value);
  },

  numberMethod: function (e) {
    let numberArray = e.detail.value;
    let number = numberArray[0] * 10 + numberArray[1];
    console.log(number);

    this.setData({
      number: number + '个',
    })
  },

  weightMethod: function (e) {
    let weightArray = e.detail.value;
    let weight = weightArray[0] * 10 + weightArray[1];
    console.log(weight);

    this.setData({
      weight: weight + '公斤',
    })
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
    this.setData({
      weight: 25 + '公斤',
      number: 20 + '个',
    })
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
// miniprogram/pages/setup/setup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailShow: false,
    weightArray: [
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],
    numberArray: [
      [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ],
  },



  numberMethod: function (e) {
    let numberArray = e.detail.value;
    let number = numberArray[0] * 10 + numberArray[1];
    let groupIndex = e.currentTarget.dataset.group;
    let groupList = [];
    for (let x in this.data.groupList) {
      if (groupIndex == this.data.groupList[x]["group"]) {
        let groupMap = {};
        groupMap["group"] = this.data.groupList[x]["group"];
        groupMap["weight"] = this.data.groupList[x]["weight"];
        groupMap["number"] = number;
        groupList.push(groupMap);
      } else {
        groupList.push(this.data.groupList[x]);
      }
    }
    this.setData({
      groupList: groupList
    })
  },

  weightMethod: function (e) {
    let weightArray = e.detail.value;
    let weight = weightArray[0] * 10 + weightArray[1];
    let groupIndex = e.currentTarget.dataset.group;
    let groupList = [];
    for (let x in this.data.groupList) {
      if (groupIndex == this.data.groupList[x]["group"]) {
        let groupMap = {};
        groupMap["group"] = this.data.groupList[x]["group"];
        groupMap["number"] = this.data.groupList[x]["number"];
        groupMap["weight"] = weight;
        groupList.push(groupMap);
      } else {
        groupList.push(this.data.groupList[x]);
      }
    }
    console.log(groupList);
    this.setData({
      groupList: groupList
    })
  },


  //要查询最近的一条数据，只能一条，不能多
  detailQuery: function (small_id, small_name) {
    const db = wx.cloud.database();
    db.collection('detail').where({
      small_id: small_id
    }).get({
      success: res => {
        let detailList = res.data;
        let small_id = detailList[0]["small_id"];
        let name = detailList[0]["name"];
        let group = detailList[0]["group"];
        let weight = detailList[0]["weight"];
        let unit = detailList[0]["unit"];
        let number = detailList[0]["number"];
        let exercise_date = detailList[0]["exercise_date"];


        let groupList = [];

        for (let x = 1; x <= group; x++) {
          let groupMap = {};
          groupMap["group"] = x;
          groupMap["weight"] = weight;
          groupMap["unit"] = unit;
          groupMap["number"] = number;
          groupList.push(groupMap);
        }

        console.log(groupList);
        this.setData({
          detailShow: true,
          small_name: small_name,
          groupList: groupList
        })
      }
    })
  },


  showGroup: function (e) {

    this.detailQuery(e.currentTarget.dataset.small_id, e.currentTarget.dataset.small_name);

  },

  closeGroup: function () {
    this.setData({
      detailShow: false
    })
  },

  clockin: function (e) {
    console.log(e.detail.value);
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

            let bigList = [];
            for (let x in bigList2) {
              let twoMap = {};
              twoMap["big_id"] = bigList2[x]["_id"];
              twoMap["name"] = bigList2[x]["name"];
              let smallList = [];

              for (let y in smallList2) {
                if (bigList2[x]["_id"] == smallList2[y]["big_id"]) {
                  let smallMap = {};
                  smallMap["small_id"] = smallList2[y]["_id"];
                  smallMap["name"] = smallList2[y]["name"];
                  smallList.push(smallMap);
                }
              }

              twoMap["smallList"] = smallList;
              bigList.push(twoMap);

            }
            this.setData({
              bigList: bigList
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
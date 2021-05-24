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
        groupMap["unit"] = this.data.groupList[x]["unit"];
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
        groupMap["unit"] = this.data.groupList[x]["unit"];
        groupMap["weight"] = weight;
        groupList.push(groupMap);
      } else {
        groupList.push(this.data.groupList[x]);
      }
    }
    this.setData({
      groupList: groupList
    })
  },


  detailQuery: function (e, big_name, small_id, small_name) {
    const db = wx.cloud.database();
    db.collection('detail').limit(1).orderBy('exercise_date', 'desc').where({
      small_id: small_id
    }).get({
      success: res => {
        let detailList = res.data;
        let group = detailList[0]["group"];
        let weight = detailList[0]["weight"];
        let unit = detailList[0]["unit"];
        let number = detailList[0]["number"];

        let groupList = [];

        for (let x = 1; x <= group; x++) {
          let groupMap = {};
          groupMap["group"] = x;
          groupMap["weight"] = weight;
          groupMap["unit"] = unit;
          groupMap["number"] = number;
          groupList.push(groupMap);
        }


        this.clockinQueryByToday(e, big_name, small_id, small_name, groupList);

      }
    })
  },


  showGroup: function (e) {
    this.detailQuery(e, e.currentTarget.dataset.big_name, e.currentTarget.dataset.small_id, e.currentTarget.dataset.small_name);
  },

  closeGroup: function () {
    this.setData({
      detailShow: false
    })
  },

  batchClockin: function (e) {
    this.batchClockinQueryByDate(e);

    this.setData({
      detailShow: false
    })
  },


  batchClockinAdd: function (e) {
    let groupList = [];
    let groupArray = this.data.groupList;
    for (let x in groupArray) {
      let groupMap = {};
      groupMap['group'] = groupArray[x]['group'];
      groupMap['weight'] = groupArray[x]['weight'];
      groupMap['unit'] = groupArray[x]['unit'];
      groupMap['number'] = groupArray[x]['number'];
      groupList.push(groupMap);
    }

    this.clockinAddDB(this.data.big_name, e.currentTarget.dataset.small_id, e.currentTarget.dataset.small_name, groupList);
  },


  batchClockinQueryByDate: function (e) {
    const db = wx.cloud.database();
    db.collection('clockin').where({
      clockin_date: db.command.gte(this.getStartDate()).and(db.command.lte(this.getEndDate())),
      small_id: db.command.eq(e.currentTarget.dataset.small_id)
    }).get({
      success: res => {
        let clockinList = res.data;
        if (clockinList.length == 0) {
          //clockinList 0条记录，添加
          this.batchClockinAdd(e);
        } else {
          let groupListNew = this.getGroupMapNew(e, clockinList[0]['groupList']);
          //更新数据库
          this.clockinUpdateDB(clockinList[0]['_id'], groupListNew);
        }
      }
    })
  },


  clockinQueryByToday: function (e, big_name, small_id, small_name, groupList) {
    const db = wx.cloud.database();
    db.collection('clockin').where({
      clockin_date: db.command.gte(this.getStartDate()).and(db.command.lte(this.getEndDate())),
      small_id: db.command.eq(e.currentTarget.dataset.small_id)
    }).get({
      success: res => {
        let clockinList = res.data;
        if (clockinList.length == 0) {
          for (let x in groupList) {
            groupList[x]['activation'] = false;
          }
        } else {
          let groupListNew = clockinList[0]['groupList'];
          for (let x in groupList) {
            for (let y in groupListNew) {
              if (groupList[x]['group'] == groupListNew[y]['group']) {
                groupList[x]['activation'] = true;
                groupList[x]['weight'] = groupListNew[y]['weight'];
                groupList[x]['unit'] = groupListNew[y]['unit'];
                groupList[x]['number'] = groupListNew[y]['number'];
                break;
              }
            }
          }
        }

        this.setData({
          detailShow: true,
          big_name: big_name,
          small_id: small_id,
          small_name: small_name,
          groupList: groupList
        })

      }
    })
  },


  getGroupMapNew: function (e, groupList) {
    let groupListNew = [];
    let groupArray = this.data.groupList;
    //group不相同
    for (let i in groupArray) {
      let flag = false;
      for (let x in groupList) {
        if (groupList[x]['group'] == groupArray[i]['group']) {
          //更新当前组
          let groupMap = {};
          groupMap['group'] = groupArray[i]['group'];
          groupMap['weight'] = groupArray[i]['weight'];
          groupMap['unit'] = groupArray[i]['unit'];
          groupMap['number'] = groupArray[i]['number'];

          groupListNew.push(groupMap);
          flag = true;
          break;
        }
      }

      ////保留当前组
      if (!flag) {
        let groupMap = {};
        groupMap['group'] = groupArray[i]['group'];
        groupMap['weight'] = groupArray[i]['weight'];
        groupMap['unit'] = groupArray[i]['unit'];
        groupMap['number'] = groupArray[i]['number'];

        groupListNew.push(groupMap);
      }
    }

    return groupListNew;
  },

  clockin: function (e) {
    if (e.detail.value) {
      this.clockinQueryByDate(e);
    } else {
      this.clockinDeleteByDate(e);
    }
  },

  dateToString: function () {
    let date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (day.length == 1) {
      day = "0" + day;
    }
    var dateTime = year + "-" + month + "-" + day;

    return dateTime;
  },


  getStartDate: function () {
    return new Date(this.dateToString() + " 00:00:00");
  },

  getEndDate: function () {
    return new Date(this.dateToString() + " 23:59:59");
  },


  clockinQueryByDate: function (e) {
    const db = wx.cloud.database();
    db.collection('clockin').where({
      clockin_date: db.command.gte(this.getStartDate()).and(db.command.lte(this.getEndDate())),
      small_id: db.command.eq(e.currentTarget.dataset.small_id)
    }).get({
      success: res => {
        let clockinList = res.data;
        if (clockinList.length == 0) {
          //clockinList 0条记录，添加
          this.clockinAdd(e);
        } else {
          //clockinList 1条记录，更新
          let groupList = clockinList[0]['groupList'];
          let groupListNew = [];
          let flag = false;
          for (let x in groupList) {
            if (groupList[x]['group'] == e.currentTarget.dataset.group) {
              //更新当前组
              groupListNew.push(this.getGroupMap(e));
              flag = true;
            } else {
              //保留当前组
              groupListNew.push(groupList[x]);
            }
          }

          if (!flag) {
            groupListNew.push(this.getGroupMap(e));
          }

          //更新数据库
          this.clockinUpdateDB(clockinList[0]['_id'], groupListNew);
        }

        this.showGroup(e);
      }
    })
  },


  clockinDeleteByDate: function (e) {
    const db = wx.cloud.database();
    db.collection('clockin').where({
      clockin_date: db.command.gte(this.getStartDate()).and(db.command.lte(this.getEndDate())),
      small_id: db.command.eq(e.currentTarget.dataset.small_id)
    }).get({
      success: res => {
        let clockinList = res.data;
        if (clockinList.length != 0) {
          //clockinList 1条记录，更新
          let groupList = clockinList[0]['groupList'];
          let groupListNew = [];
          for (let x in groupList) {
            //在同一个small_id下
            if (groupList[x]['group'] != e.currentTarget.dataset.group) {
              //保留当前组
              groupListNew.push(groupList[x]);
            }
          }

          if (groupListNew.length == 0) {
            //删除
            this.clockinDeleteDB(clockinList[0]['_id']);
          } else {
            //更新数据库
            this.clockinUpdateDB(clockinList[0]['_id'], groupListNew);
          }
        }
        this.setData({
          clockinList: res.data
        })
        
        this.showGroup(e);
      }
    })
  },

  getGroupMap: function (e) {
    let groupMap = {};
    groupMap['group'] = e.currentTarget.dataset.group;
    groupMap['weight'] = e.currentTarget.dataset.weight;
    groupMap['unit'] = e.currentTarget.dataset.unit;
    groupMap['number'] = e.currentTarget.dataset.number;
    return groupMap;
  },

  clockinAdd: function (e) {
    let groupList = [];
    groupList.push(this.getGroupMap(e));

    if (e.detail.value) {
      this.clockinAddDB(this.data.big_name, e.currentTarget.dataset.small_id, e.currentTarget.dataset.small_name, groupList);
    }
  },


  clockinDeleteDB: function (id) {
    const db = wx.cloud.database()
    db.collection('clockin').doc(id).remove({
      success: res => {
        console.warn(res);
      },
      fail: err => {
        console.error('数据库更新失败：', err)
      }
    })
  },


  clockinUpdateDB: function (id, groupList) {
    const db = wx.cloud.database()
    db.collection('clockin').doc(id).update({
      data: {
        groupList: groupList
      },
      success: res => {
        console.warn(res);
      },
      fail: err => {
        console.error('数据库更新失败：', err)
      }
    })
  },


  clockinAddDB: function (big_name, small_id, small_name, groupList) {
    const db = wx.cloud.database()
    db.collection('clockin').add({
      data: {
        clockin_date: db.serverDate(),
        big_name: big_name,
        small_id: small_id,
        small_name: small_name,
        groupList: groupList
      },
      success: res => {
        console.warn(res);
      },
      fail: err => {
        console.error('数据库新增失败：', err)
      }
    })
  },


  activityQuery: function () {
    let bigList2 = [];
    let smallList2 = [];
    const db = wx.cloud.database();
    db.collection('big').where({
      activation: true
    }).get({
      success: res => {
        bigList2 = res.data;

        const db = wx.cloud.database();
        db.collection('small').where({
          activation: true
        }).get({
          success: res => {
            smallList2 = res.data;

            let bigList = [];
            for (let x in bigList2) {
              let bigMap = {};
              bigMap["big_id"] = bigList2[x]["_id"];
              bigMap["name"] = bigList2[x]["name"];
              let smallList = [];

              for (let y in smallList2) {
                if (bigList2[x]["_id"] == smallList2[y]["big_id"]) {
                  let smallMap = {};
                  smallMap["small_id"] = smallList2[y]["_id"];
                  smallMap["name"] = smallList2[y]["name"];
                  smallList.push(smallMap);
                }
              }

              bigMap["smallList"] = smallList;
              bigList.push(bigMap);

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
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.activityQuery();
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
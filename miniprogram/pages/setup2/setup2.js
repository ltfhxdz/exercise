var muscleJson = require('/../data/muscle.js');
const db = wx.cloud.database();
let openid = '';

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


  detailAdd: function () {
    this.detailAddDB(this.data.smallId, this.data.action, this.data.group, this.data.weight, this.data.unit, this.data.number);
    this.setData({
      detailShow: false
    })
  },


  detailAddDB: function (smallId, name, group, weight, unit, number) {
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
        this.actionQuery(this.data.big_id);
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
    db.collection('detail').limit(1).orderBy('exercise_date', 'desc').where({
      small_id: e.currentTarget.dataset.id
    }).get({
      success: res => {
        if (res.data.length == 0) {
          this.setData({
            detailShow: true,
            smallId: e.currentTarget.dataset.id,
            action: e.currentTarget.dataset.name,
            group: 4,
            weight: 30,
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
            number: res.data[0]['number']
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
      this.activationAddDB(e.currentTarget.dataset.id, e.currentTarget.dataset.name);
    } else {
      this.activationDeleteDB(e.currentTarget.dataset.id);
    }

  },


  activationAddDB: function (business_id, business_name) {
    db.collection('activation').add({
      data: {
        business_id: business_id,
        business_name: business_name
      },
      success: res => {
        console.warn(res);
      },
      fail: err => {
        console.error('数据库新增失败：', err)
      }
    })
  },

  activationDeleteDB: function (business_id) {
    db.collection('activation').where({
      business_id: business_id
    }).remove({
      success: res => {
        console.warn(res);
      },
      fail: err => {
        console.error('数据库删除失败：', err)
      }
    })
  },

  bigUpdate: function (id, activation) {
    db.collection('big').doc(id).update({
      data: {
        activation: activation
      },
      success: res => {
        this.muscleQuery();
      },
      fail: err => {
        console.error('数据库更新失败：', err)
      }
    })
  },

  smallUpdate: function (id, activation) {

    db.collection('small').doc(id).update({
      data: {
        activation: activation
      },
      success: res => {
        this.actionQuery(this.data.big_id);
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
    this.actionQuery(e.currentTarget.dataset.id);

    this.setData({
      big_id: e.currentTarget.dataset.id,
      activity: e.currentTarget.dataset.name,
      activityFlag: true
    })
  },


  actionQuery: function (big_id) {
    db.collection('action').orderBy('sort', 'asc').where({
      big_id: big_id
    }).get({
      success: res => {
        let smallList = res.data;
        //增加默认值
        for (let x in smallList) {
          smallList[x]['group'] = 4;
          smallList[x]['unit'] = '公斤';
          smallList[x]['weight'] = 30;
          smallList[x]['number'] = 20;
        }

        //如果有设置，取出最新的数据，更新默认值
        this.aggregate9(smallList);
      }
    })
  },


  aggregate9: function (smallList) {
    //得到所有的small_id，然后查询detail表，查出对应的数据，最后整合到list中
    let smallIdList = [];
    for (let x in smallList) {
      smallIdList.push(smallList[x]['_id']);
    }

    //在smallList中，添加组信息
    wx.cloud.callFunction({
      name: 'aggregate9',
      data: {
        inArray: smallIdList,
        openid: openid
      },
      complete: res => {
        let resultList = res.result.list;
        for (let x in resultList) {
          let row = resultList[x]['row'];
          for (let y in smallList) {
            if (row['small_id'] == smallList[y]['_id']) {
              smallList[y]['group'] = row['group'];
              smallList[y]['unit'] = row['unit'];
              smallList[y]['weight'] = row['weight'];
              smallList[y]['number'] = row['number'];
            }
          }
        }

        //在smallList中，添加激活信息

        wx.cloud.callFunction({
          name: 'qureyActivationBybid',
          data: {
            inArray: smallIdList,
            openid: openid
          },
          complete: res => {
            let queryList = res.result.data;
            for (let x in queryList) {
              for (let y in smallList) {
                if (queryList[x]['business_id'] == smallList[y]['_id']) {
                  smallList[y]['activation'] = true;
                }
              }
            }
      
            this.setData({
              smallList: smallList
            })
          }
        })
      }
    })
  },


  smallDelete: function (e) {
    this.smallDeleteDB(e);
  },


  smallDeleteDB: function (e) {
    db.collection('small').doc(e.currentTarget.dataset.id).remove({
      success: res => {
        this.actionQuery(this.data.big_id);
      },
      fail: err => {
        console.error('数据库删除失败：', err)
      }
    })
  },


  smallAddDB: function (big_id, name) {
    db.collection('small').add({
      data: {
        big_id: big_id,
        name: name,
        activation: true
      },
      success: res => {
        this.detailAddDB(res._id, name, 4, 20, '公斤', 20);
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


  detailQueryBySmallId: function (smallIdList, smallList) {

    db.collection('detail').where({
      small_id: db.command.in(smallIdList)
    }).get({
      success: res => {
        let resultList = [];
        let detailList = res.data;
        for (let x = 0; x < detailList.length; x++) {
          let max = detailList[x];
          let flag = false;
          for (let y = 1; y < detailList.length; y++) {
            if (max['name'] == detailList[y]['name']) {
              flag = true;
              if (max['exercise_date'] < detailList[y]['exercise_date']) {
                max = detailList[y];
              }
            }
          }
          if (flag) {
            resultList.push(max);
          } else {
            resultList.push(detailList[x]);
          }
        }

        for (let x in smallList) {
          for (let y in resultList) {
            if (smallList[x]['name'] == resultList[y]['name']) {
              smallList[x]['group'] = resultList[y]['group'];
              smallList[x]['unit'] = resultList[y]['unit'];
              smallList[x]['weight'] = resultList[y]['weight'];
              smallList[x]['number'] = resultList[y]['number'];
              smallList[x]['exercise_date'] = resultList[y]['exercise_date'];
              break;
            }
          }
        }
        this.setData({
          smallList: smallList
        })
      }
    })
  },


  bigDelete: function (e) {
    this.actionQueryBybig_id(e.currentTarget.dataset.id);


  },

  actionQueryBybig_id: function (big_id) {

    db.collection('small').where({
      big_id: big_id
    }).get({
      success: res => {
        if (res.data.length > 0) {
          wx.showToast({
            title: '还有动作，不能删除',
            icon: 'none',
            duration: 2000,
            mask: true
          })
        } else {
          db.collection('big').doc(big_id).remove({
            success: res => {
              this.muscleQuery();
            },
            fail: err => {
              console.error('数据库删除失败：', err)
            }
          })
        }
      }
    })
  },



  bigAddDB: function (name) {
    db.collection('big').add({
      data: {
        name: name,
        activation: true
      },
      success: res => {
        this.muscleQuery();
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
    db.collection('big').get({
      success: res => {
        this.setData({
          bigList: res.data
        })
      }
    })
  },

  muscleQuery: function () {
    db.collection('muscle').orderBy('sort', 'asc').get({
      success: res => {
        let bigList = res.data;
        this.qureyActivationBybid(bigList);
      }
    })
  },

  qureyActivationBybid: function (bigList) {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      complete: res => {
        //放到全局变量中
        openid = res.result.openid;

        let smallIdList = [];
        for (let x in bigList) {
          smallIdList.push(bigList[x]['_id']);
        }

        wx.cloud.callFunction({
          name: 'qureyActivationBybid',
          data: {
            inArray: smallIdList,
            openid: openid
          },
          complete: res => {
            let queryList = res.result.data;
            for (let x in queryList) {
              for (let y in bigList) {
                if (queryList[x]['business_id'] == bigList[y]['_id']) {
                  bigList[y]['activation'] = true;
                }
              }
            }

            this.setData({
              bigList: bigList
            })
          }
        })
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


  setUserInfo() {
    wx.cloud.callFunction({
      name: 'getUserInfo',
      complete: res => {
        openid = res.result.openid;

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
    this.muscleQuery();
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
   * 允许用户点击右上角分享给朋友
   */
  onShareAppMessage: function () {
    title: '强身打卡：记录每一次健身，给增肌提供数据。'
  },
  /**
   * 允许用户右上角分享到朋友圈
   */
  onShareTimeline: function () {
    title: '强身打卡：记录每一次健身，给增肌提供数据。'
  }

})
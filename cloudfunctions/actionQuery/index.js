// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: 'dev-8gw7ruk57390fef9'
});
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

//根据small_name，进行分组，得到第一个big_name
exports.main = async (event, context) => {
  //查询动作表
  let actionList = await getActionList(event);
  //增加默认值
  for (let x in actionList) {
    actionList[x]['group'] = 4;
    actionList[x]['unit'] = '公斤';
    actionList[x]['weight'] = 30;
    actionList[x]['number'] = 20;
    actionList[x]['isDelete'] = false;
  }

  //得到动作ID的list
  let smallIdList = [];
  for (let x in actionList) {
    smallIdList.push(actionList[x]['_id']);
  }

  //查询动作的锻炼数据表
  let detailList = await getDetailList(event, smallIdList);

  //更新actionList中的：用户设置的组信息
  for (let x in detailList) {
    let row = detailList[x]['row'];
    for (let y in actionList) {
      if (row['small_id'] == actionList[y]['_id']) {
        actionList[y]['group'] = row['group'];
        actionList[y]['unit'] = row['unit'];
        actionList[y]['weight'] = row['weight'];
        actionList[y]['number'] = row['number'];
        break;
      }
    }
  }

  //查询激活的数据
  let activationList = await getActivationList(event, smallIdList);

  //往actionList中增加激活的数据
  for (let x in activationList) {
    for (let y in actionList) {
      if (activationList[x]['business_id'] == actionList[y]['_id']) {
        actionList[y]['activation'] = true;
      }
    }
  }

  return actionList;
}

async function getActivationList(event, smallIdList) {
  try {
    let activationList =  await db.collection('activation').where({
      business_id: _.in(smallIdList),
      _openid: event.openid
    }).get();
    return activationList.data;
  } catch (e) {
    console.error(e);
  }
}

async function getActionList(event) {
  try {
    let actionList = await db.collection('action').orderBy('sort', 'asc').where({
      big_id: event.big_id
    }).get();

    return actionList.data;
  } catch (e) {
    console.error(e);
  }
}


async function getDetailList(event, smallIdList) {
  try {
    let detailList = await db.collection('detail').aggregate()
      .match({
        small_id: _.in(smallIdList),
        _openid: event.openid
      })
      .sort({
        exercise_date: -1
      })
      .group({
        _id: '$small_id',
        row: $.first('$$ROOT')
      })
      .end();


    return detailList.list;

  } catch (e) {
    console.error(e);
  }
}
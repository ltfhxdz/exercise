// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: 'dev-8gw7ruk57390fef9'
});
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  //查询small表
  let muscleList = await getMuscleList();
  for (let x in muscleList) {
    muscleList[x]['isDelete'] = false;
  }

  let smallIdList = [];
  for (let x in muscleList) {
    smallIdList.push(muscleList[x]['_id']);
  }

  
  //查询激活的数据
  let activationList = await getActivationList(event, smallIdList);

  for (let x in activationList) {
    for (let y in muscleList) {
      if (activationList[x]['business_id'] == muscleList[y]['_id']) {
        muscleList[y]['activation'] = true;
        break;
      }
    }
  }
  
  //得到自定义的肌肉群
  let bigList = await getBigList(event);
  for (let x = bigList.length - 1; x >= 0; x--) {
    bigList[x]['isDelete'] = true;
    muscleList.unshift(bigList[x]);
  }


  return muscleList;
}


async function getActivationList(event, smallIdList) {
  try {
    let activationList = await db.collection('activation').where({
      business_id: _.in(smallIdList),
      _openid: event.openid
    }).get();
    return activationList.data;
  } catch (e) {
    console.error(e);
  }
}


async function getMuscleList() {
  try {
    let muscleList = await db.collection('muscle').orderBy('sort', 'asc').get();

    return muscleList.data;
  } catch (e) {
    console.error(e);
  }
}


async function getBigList(event) {
  try {
    let bigList = await db.collection('big').where({
      _openid: event.openid
    }).get();

    return bigList.data;
  } catch (e) {
    console.error(e);
  }
}

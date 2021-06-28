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
  //查询肌肉表
  let bigQueryList = await getBigList(event);

  //查询动作表
  let smallQueryList = await getSmallList(event);


  let bigList = [];
  for (let x in bigQueryList) {
    let bigMap = {};
    bigMap["big_id"] = bigQueryList[x]["_id"];
    bigMap["name"] = bigQueryList[x]["name"];
    let smallList = [];

    for (let y in smallQueryList) {
      if (bigQueryList[x]["_id"] == smallQueryList[y]["big_id"]) {
        let smallMap = {};
        smallMap["small_id"] = smallQueryList[y]["_id"];
        smallMap["name"] = smallQueryList[y]["name"];
        smallList.push(smallMap);
      }
    }

    bigMap["smallList"] = smallList;
    bigList.push(bigMap);

  }

  return bigList;
}

async function getSmallList(event) {
  try {
    let smallList = await db.collection('small').where({
      _openid: event.openid,
      activation: true
    }).get();
    return smallList.data;
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
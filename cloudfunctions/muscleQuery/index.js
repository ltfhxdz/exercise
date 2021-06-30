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

  //得到自定义的肌肉群
  let bigList = await getBigList(event);

  return bigList;
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

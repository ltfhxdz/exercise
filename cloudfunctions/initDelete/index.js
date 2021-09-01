// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: 'dev-8gw7ruk57390fef9'
});
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

//根据client_date，进行分组，计算总数
exports.main = async (event, context) => {

  let user = await deleteUser(event);

  let big = await deleteBig(event);

  let small = await deleteSmall(event);

  let detail = await deleteDetail(event);


  return user;
}


async function deleteUser(event) {
  try {
    let bigList = await db.collection('user').where({
      _openid: _.eq(event.openid)
    }).remove();

    return bigList.data;
  } catch (e) {
    console.error(e);
  }
}


async function deleteBig(event) {
  try {
    let bigList = await db.collection('big').where({
      muscle_id: _.exists(true),
      _openid: _.eq(event.openid)
    }).remove();

    return bigList.data;
  } catch (e) {
    console.error(e);
  }
}


async function deleteSmall(event) {
  try {
    let smallList = await db.collection('small').where({
      action_id: _.exists(true),
      _openid: _.eq(event.openid)
    }).remove();

    return smallList.data;
  } catch (e) {
    console.error(e);
  }
}

async function deleteDetail(event) {
  try {
    let detailList = await db.collection('detail').where({
      init_id: _.exists(true),
      _openid: _.eq(event.openid)
    }).remove();

    return detailList.data;
  } catch (e) {
    console.error(e);
  }
  
}

// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: 'dev-8gw7ruk57390fef9'
});
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

//根据small_name，进行分组，得到第一个groupList
exports.main = async (event, context) => {
  try {
    return await db.collection('clockin').aggregate()
      .group({
        _id: '$small_name',
        num: $.first('$groupList')
      })
      .end();
  } catch (e) {
    console.error(e);
  }
}
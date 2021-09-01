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
  //查询small表
  let smallList = await getSmallList(event);

  //得到动作ID的list
  let smallIdList = [];
  for (let x in smallList) {
    smallIdList.push(smallList[x]['_id']);
  }

  //查询动作的锻炼数据表
  let detailList = await getDetailList(event, smallIdList);

  for (let x in smallList) {
    //添加删除标记
    smallList[x]['isDelete'] = true;

    for (let y in detailList) {
      if (smallList[x]['_id'] == detailList[y]['_id']) {
        let row = detailList[y]['row'];
        smallList[x]['group'] = row['group'];
        smallList[x]['weight'] = row['weight'];
        smallList[x]['unit'] = row['unit'];
        smallList[x]['number'] = row['number'];
        break;
      }
    }
  }

  return smallList;
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

async function getSmallList(event) {
  try {
    let actionList = await db.collection('small').where({
      big_id: event.big_id,
      _openid: event.openid
    }).get();

    return actionList.data;
  } catch (e) {
    console.error(e);
  }
}
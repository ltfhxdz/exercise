// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: 'dev-8gw7ruk57390fef9'
});
const db = cloud.database();
const _ = db.command;
const $ = db.command.aggregate;

//根据big_name，进行分组，得到所有的日期
exports.main = async (event, context) => {

  return await getMuscleList();
}


async function getMuscleList() {
  try {
    let queryList = await db.collection('clockin').aggregate().sort({
        big_name: 1,
        clockin_date: 1
      })
      .group({
        _id: '$big_name',
        dates: $.push({
          clockin_date: '$clockin_date'
        })
      })
      .end();

    let resultList = [];
    let list = queryList.list;
    for (let x in list) {
      let resultMap = {};
      resultMap['big_name'] = list[x]['_id'];

      let dateList = [];
      let dates = list[x]['dates'];
      for (let y in dates) {
        let flag = false;
        let dateTemp = new Date(dates[y]['clockin_date']);
        let year = dateTemp.getFullYear();
        let month = dateTemp.getMonth();
        let day = dateTemp.getDate();
        let date_str = year + "-" + (month + 1) + "-" + day;
        for (let z in dateList) {
          if (dateList[z] == date_str) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          dateList.push(date_str);
        }
      }


      resultMap['dates'] = dateList.length;
      resultList.push(resultMap);
    }

    return resultList;

  } catch (e) {
    console.error(e);
  }
}
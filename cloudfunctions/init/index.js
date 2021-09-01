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
  //查询user表
  let userList = await getUserList(event);
  if (userList.length == 0) {
    //添加用户表
    await addUser(event);
    let muscleList = await getMuscleList();
    for (let x in muscleList) {
      //插入big表
      let big_id = await addBig(muscleList[x]['_id'], muscleList[x]['name'], event.openid);

      let actionList = await actionQuery(muscleList[x]['_id']);
      for (let y in actionList) {
        //插入small表
        let small_id = await addSmall(big_id, actionList[y]['_id'], actionList[y]['name'], event.openid);
      }
    }
  }

  return 'ok';
}


async function addSmall(big_id, action_id, name, openid) {
  try {
    return await db.collection('small').add({
      data: {
        big_id: big_id,
        action_id: action_id,
        name: name,
        _openid: openid,
        activation: true
      }
    });
  } catch (e) {
    console.error(e);
  }
}

async function actionQuery(big_id) {
  try {
    let actionList = await db.collection('action').orderBy('sort', 'asc').where({
      big_id: big_id
    }).get();

    return actionList.data;
  } catch (e) {
    console.error(e);
  }
}


async function addUser(event) {
  try {
    return await db.collection('user').add({
      data: {
        create_date: db.serverDate(),
        _openid: event.openid
      }
    });
  } catch (e) {
    console.error(e);
  }
}

async function addBig(muscle_id, name, openid) {
  try {
    let result = await db.collection('big').add({
      data: {
        muscle_id: muscle_id,
        name: name,
        _openid: openid,
        activation: true
      }
    });

    return result['_id'];

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


async function getUserList(event) {
  try {
    let userList = await db.collection('user').where({
      _openid: event.openid
    }).get();

    return userList.data;
  } catch (e) {
    console.error(e);
  }
}
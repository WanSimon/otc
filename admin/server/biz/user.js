/**
 * Created by obel on 2019/12/17.
 */
const userDao = require('../dao/user');
const merchantDao = require('../dao/merchant');
const roleDao = require('../dao/role');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
  post: {
    '/user/login':login,
  },
  get: {
    '/user':getUserByToken,
    '/user/login/record':loginRecord,
  },
  put:{
  },
  delete:{
  }

};

/**
 * 用户登录
 * */
async function login(ctx) {
  let name = ctx.request.body.name;
  let pwd = ctx.request.body.pwd;
  if(!name || !pwd)
    throw app.err.missParameter;

  let dbRes = await userDao.userLogin(name,pwd);
  if(dbRes && dbRes.length>0){
    let user = dbRes[0];
    if(!user.isvalid)  throw app.err.invalidUser;
    //获取子商户
    let dbData = await merchantDao.getChildList(user.merchant_id);
    let merchantArr = dbData.merchantList.split(',');
    merchantArr = merchantArr.map(item=>`'${item}'`);
    let merchantStr = merchantArr.join(',');
    //子商户
    user.merchant_list = merchantStr;

    let roleIdStr = user.account_role.split(',').map(item=>`'${item}'`).join(',');
    let menuData = await roleDao.getMenuByRoles(roleIdStr);
    user.menuKeyStr = menuData.map((menu)=>menu.menu_key).join(',');
    //是否为A端账户
    user.isAAdmin = (user.parent_id == 0);
    await app.session.setUser(user);
    delete user.parent_id;
    return user;
  }
  else
    throw app.err.invalidPassword;
}

/**
 * 根据token获取用户数据
 * */
async function getUserByToken(ctx){
  return  ctx.user;
}

/**
 * 用户登录记录
 * */
async function loginRecord(ctx){
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let merchant_id = body.merchant_id;
  let equipment_id = body.equipment_id;
  let merchant_list = ctx.user.merchant_list;
  return userDao.loginRecord(limit,page,merchant_id,equipment_id,merchant_list);
}

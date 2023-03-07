const dao = require('../dao/merchantWarning');
const taskDao = require('../dao/task');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
  post: {
    '/warning': addWarning,
  },
  get: {
    '/warning': getWarningList,
    '/warning/:innerid': getWarningId,
  },
  put: {
    '/warning/:innerid': updateWarning,
  },
  delete:{
    '/warning/:innerid': delWarning,
  }

};

/**
 * 获取商户预警规则列表
 * */
async function getWarningList(ctx) {
  let body = ctx.request.query;
  let limit = body.limit;
  let page = body.page;
  let merchant_id = body.merchant_id;
  let merchant_list = ctx.user.merchant_list;
  return dao.getWarningList(limit,page,merchant_id,merchant_list);
}

/**
 * 根据ID获取商户预警规则
 * */
async function getWarningId(ctx) {
  let innerid = ctx.params.innerid;
  return dao.getWarningId(innerid);
}

/**
 * 删除预警规则
 * */
async function delWarning(ctx) {
  let innerid = ctx.params.innerid;
  return dao.delWarning(innerid)
}

/**
 * 更改预警规则
 * */
async function updateWarning(ctx) {
  let body = ctx.request.body;
  let obj = {};
  let innerid = ctx.params.innerid;
  obj.merchant_id = body.merchant_id;
  obj.name = body.name;
  obj.type = body.type;
  obj.status = body.status;
  obj.creater_id = ctx.user.innerid;
  obj.created_time = new Date();
  obj.config = body.conf
  await dao.updateWarning(innerid,obj);
   //修改 task 表
  let cnf = JSON.parse(obj.config||"{}");
  let taskType = "";
  obj.type = obj.type.toString();
  //报警类型 1:有效期;2:网络;3:打印;4: 库存;5:温度;6:湿度
  switch (obj.type) {
    case "1":
      taskType= "jobExpireWarning";
      break;
    case "2":
      taskType= "jobNetWarning";
      break;
    case "3":
      taskType= "jobPrintWarning";
      break;
    case "4":
      taskType= "jobStockWarning";
      break;
    case "5":
      taskType= "jobTemperatureWarning";
      break;
    case "6":
      taskType= "jobHumidityWarning";
      break;
  }

  let oldTask = await taskDao.getBySourceId(innerid);

  let task = {
    id:oldTask.innerid,
    source:{
      source_id:innerid,
      source_type:'admin',
    },
    parameter:[{
      key:'warning_rule',
      value:innerid
    }],
    name:taskType,
    is_active:true,
    type:taskType,
  };
  let taskCnf = {};
  taskCnf.cycle = {};
  taskCnf.cycle.align = true;
  //执行周期 1：分钟；2：小时；3：天
  if(cnf.executeType){
    let executeType = cnf.executeType.toString();
    switch (executeType) {
      case "1":
        taskCnf.cycle.minute = cnf.executeNum;
        break;
      case "2":
        taskCnf.cycle.hour = cnf.executeNum;
        break;
      case "3":
        taskCnf.cycle.day = cnf.executeNum;
        break;
    }
  }
  task.plan = taskCnf;
  await app.mqInterface.updateTask(task);
  return {};
}

/**
 * 新增预警规则
 * */
async function addWarning(ctx) {
  let body = ctx.request.body;
  let obj = {};
  obj.innerid =  sc.guid();
  obj.merchant_id = body.merchant_id;
  obj.name = body.name;
  obj.type = body.type;
  obj.status = body.status;
  obj.creater_id = ctx.user.innerid;
  obj.created_time = new Date();
  obj.config = body.conf
  await dao.addWarning(obj);
  //修改 task 表
  let cnf = JSON.parse(obj.config||"{}");
  let taskType = "";
  obj.type = obj.type.toString();
  //报警类型 1:有效期;2:网络;3:打印;4: 库存;5:温度;6:湿度
  switch (obj.type) {
    case "1":
      taskType= "jobExpireWarning";
      break;
    case "2":
      taskType= "jobNetWarning";
      break;
    case "3":
      taskType= "jobPrintWarning";
      break;
    case "4":
      taskType= "jobStockWarning";
      break;
    case "5":
      taskType= "jobTemperatureWarning";
      break;
    case "6":
      taskType= "jobHumidityWarning";
      break;
  }

  let task = {
    id:sc.guid(),
    source:{
      source_id:obj.innerid,
      source_type:'admin',
    },
    parameter:[{
      key:'warning_rule',
      value:obj.innerid
    }],
    name:taskType,
    is_active:true,
    type:taskType,
  };
  let taskCnf = {};
  taskCnf.cycle = {};
  taskCnf.cycle.align = true;
  //执行周期 1：分钟；2：小时；3：天
  if(cnf.executeType){
    let executeType = cnf.executeType.toString();
    switch (executeType) {
      case "1":
        taskCnf.cycle.minute = cnf.executeNum;
        break;
      case "2":
        taskCnf.cycle.hour = cnf.executeNum;
        break;
      case "3":
        taskCnf.cycle.day = cnf.executeNum;
        break;
    }
  }
  task.plan = taskCnf;
  await app.mqInterface.addTask(task);
  return {};
}

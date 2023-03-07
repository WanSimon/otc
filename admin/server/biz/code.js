const dao = require('../dao/code');
const sc = require("smartacjs");
const app = sc.app();

exports.routers = {
  post: {
    '/code/tree': getCodeTree
  },
  get: { 
  },
  put:{
  },
  delete:{
  }   
};

/**
 * 获取代码表键值对
 * @param code string | array
 * @return Object
 * */
async function getCodeTree(ctx){
  console.info(ctx.request.body)
  let code = ctx.request.body.code;
  if(Array.isArray(code)){
    code = `'${code.join("','")}'`;
  }
  if(!code) throw app.err.missParameter;
  const data = await dao.getCodeTree(code); 
  const ret = {};
  data.map(item => {
    if(!ret.hasOwnProperty(item.code)) ret[item.code] = {};
    ret[item.code][item.item_key] = item.item_value;
  });
  return ret;
}
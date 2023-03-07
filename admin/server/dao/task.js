/**
 * Created by obel on 2019/12/17.
 */
const sc = require('smartacjs');
const app=sc.app();
const db = app.db;

exports.add = (options)=>{
  return db.insert('xy_task',options);
};

exports.update = (source_id,plan)=>{
  return db.update('xy_task',{plan},{source_id});
};

exports.getBySourceId = (source_id)=>{
  return db.getOne(`SELECT innerid FROM xy_task WHERE source_id = @source_id@ `,{source_id});
};




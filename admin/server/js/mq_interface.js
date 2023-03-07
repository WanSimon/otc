
const sc = require('smartacjs');
const app = sc.app();
const path = require('path');


class mq_interface {
    constructor(mq,sender,senderType) {
        // 声明
        this.mq = mq;
        this.sender = sender;
        this.senderType = senderType;
        this.log = sc.createNamedLog('mq_interface', 'manager');
    }
    init(){
        try {
            // 初始化编解码器
            let protoFile = path.normalize(sc.formatString("$(CurrentDirectory)../../protocol/sc_system.proto.js"));
            this.system_encoder = sc.createPBEncoder(protoFile, "system", "Message");
            protoFile = path.normalize(sc.formatString("$(CurrentDirectory)../../protocol/xy_cloudserver.proto.js"));
            this.cloudserver_encoder = sc.createPBEncoder(protoFile, "xy_cloudserver", "Message");
            // 声明交换器
            this.mq.declareExchange("sc.system","fanout",true,false);
            // 声明RPCClient
            this.rpc=sc.RabbitMQ().createRPCClient(this.mq,"xy.server.rpc");

        }
        catch (e) {
            this.log('init mq interface fail,e=%s',e);
        }

    }
    sendNotify(msg_id,body){
        if (body===undefined)body={};
        let req={
            header:{
                sender:this.sender,
                sender_type:this.senderType
            }
        };
        req[msg_id]=body;
        // 编码
        let buff=this.system_encoder.encode(req);
        if (buff) {
            this.log.log('publish mq msg:%s',req);
            this.mq.publishMessage("sc.system","",buff);
        }
    }

    sendRequest(encoder,rpc,msg_id,body){
        if (body===undefined)body={};
        let req={
            header:{
                sender:this.sender,
                sender_type:this.senderType
            }
        };
        req[msg_id]=body;
        this.log.log("sending request:%s",req);
        // 编码
        let buff= encoder.encode(req);
        if (buff)return rpc.sendRequest(buff);
        else {
            this.log.error("encode request fail!");
            return Promise.reject(new Error("encode fail!"));
        }
    }

    /**
     * 退款
     * @param op_account_id
     * @param trade_no
     * @param refund_fee  单位分
     * @param comment
     * */
    async refund(op_account_id,trade_no,refund_fee,comment){
        let data = await this.sendRequest(this.cloudserver_encoder,this.rpc,"req_refund_pay",{op_account_id,trade_no,refund_fee,comment});
        let content = this.cloudserver_encoder.decode(data.content);
        if(content.res_error){
            throw new Error(content.res_error.errmsg);
        }
    }
}

module.exports = mq_interface;

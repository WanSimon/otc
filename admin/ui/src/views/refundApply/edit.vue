<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="130px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="订单流水号">
            <el-input v-model="form.serial_no" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="支付金额">
            <el-input v-model="form.pay_amount" disabled></el-input>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="8">-->
        <!--          <el-form-item label="退款金额">-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="8">
          <el-form-item label="支付状态">
            <el-input v-model="$conf.PayStatus[form.pay_status]" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="订单明细">
              <el-table
                v-loading="listLoading"
                :data="orderDetailList"
                element-loading-text="Loading"
                border>
                <el-table-column type="index" align="center" label="#" width="50"></el-table-column>
                <el-table-column label="商品名" align="center" prop="name"></el-table-column>
                <el-table-column label="商品规格" align="center" prop="specification"></el-table-column>
                <el-table-column label="生产厂家" align="center" prop="manufacturer"></el-table-column>
                <el-table-column label="数量" align="center" prop="product_count"></el-table-column>
                <el-table-column label="商品编号" align="center" prop="product_no"></el-table-column>
                <el-table-column label="国际条码" align="center" prop="bar_code"></el-table-column>
              </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="客户姓名">
            <el-input v-model="form.nickname" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户电话">
            <el-input v-model="form.phone" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="凭证">
            <div class="img-list" v-if="form.image_list" v-for="img in image_list">
              <el-image :preview-src-list="image_list"
                        :src="img"
                        style="width:100px;height:100px;"></el-image>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注">
            <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.remark" disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="处理说明" prop="">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="form.desc">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary"
                   v-if="form.status===refundApplyStatus.RAS_Unsettled"
                   :loading="submitLoading"
                   @click="onSubmit">处理
        </el-button>
        <el-button @click="onCancel">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getRefundDetail, updateRefundApply} from '@/api/refundApply'
import {getOrderDetail} from "@/api/order";
import {parseMoney} from "@/utils";
import {RefundApplyStatus} from "@/js/common";

export default {
  name: "edit",
  data() {
    return {
      refundApplyStatus: RefundApplyStatus,
      form: {},
      submitLoading: false,
      listLoading: false,
      image_list: [],
      orderDetailList: [],
    }
  },
  methods: {
    //退款申请详情
    getInfo() {
      this.innerid = this.$route.params.id;
      getRefundDetail(this.innerid).then(res => {
        this.form = res;
        this.form.pay_amount = parseMoney(this.form.pay_amount)
        let image_list = this.form.image_list.split(',')
        this.image_list = image_list.map(img => `${this.$conf.resource.baseUrl}${img}`)
        this.getOrderDetailList(res)
      }).catch(err => {
        this.$message.warning('获取详情失败')
      })
    },
    //退款订单详情
    getOrderDetailList(form) {
      this.listLoading = true;
      getOrderDetail({order_id: form.order_id}).then(res => {
        this.orderDetailList = res;
      }).catch(err => {
        this.$message({message: err.message || '获取列表数据失败, 请点击搜索重新加载列表数据'});
      }).finally(() => {
        this.listLoading = false;
      })
    },
    onSubmit() {
      let params = {
        desc: this.form.desc,
        status: this.refundApplyStatus.RAS_Settled
      }
      updateRefundApply(this.innerid, params).then(res => {
        this.$message.success('操作成功')
        this.onCancel()
      }).catch(err => {
        this.$message.success('操作失败')
      })
    },
    onCancel() {
      this.$router.push('/report/refund/apply');
    }
  },
  created() {
    this.getInfo()
  }
}
</script>

<style scoped>
.img-list {
  width: 105px;
  height: 105px;
  display: inline-block;
  border: 1px dotted #c4c2c2;
  margin-right: 15px;
  text-align: center;
}
</style>

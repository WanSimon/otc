<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="10">
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <SelectTree
            placeholder="请选择商户"
            style="width: 100%"
            :props="props"
            :options="merchantTree"
            :value="searchData.merchant_id"
            @getValue="getValue($event)"/>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-date-picker style="width:100%;" v-model="searchData.summary_date" type="monthrange" range-separator="至"
                          start-placeholder="开始月份" end-placeholder="结束月份"></el-date-picker>
        </el-col>
        <el-col :xs="6" :sm="4" :md="4" :lg="4">
          <el-select v-model="searchData.status" placeholder="状态" clearable style="width:100%;">
            <el-option v-for="(val, idx) in $conf.OrderMonthSummaryStatus" :key="idx" :label="val" :value="idx"></el-option>
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="6" :md="4" :lg="4">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="handleExcel">导出
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="55">
        <template slot-scope="scope">
          {{(pageData.page-1)*pageData.limit + scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column label="月份" align="center" min-width="100px">
        <template slot-scope="scope">
          {{ parseTime(scope.row.summary_date,'{y}-{m}') }}
        </template>
      </el-table-column>
      <el-table-column label="商户" align="center" prop="short_name" min-width="150px"></el-table-column>
      <el-table-column label="销售订单数" align="center" prop="order_count"></el-table-column>
      <el-table-column label="支付宝收款" align="center">
        <template slot-scope="scope">
          {{ parseMoney(scope.row.ali_pay_amount) }}
        </template>
      </el-table-column>
      <el-table-column label="支付宝退款" align="center">
        <template slot-scope="scope">
          {{ parseMoney(scope.row.ali_refund_amount) }}
        </template>
      </el-table-column>
      <el-table-column label="微信收款" align="center">
        <template slot-scope="scope">
          {{ parseMoney(scope.row.wechat_pay_amount) }}
        </template>
      </el-table-column>
      <el-table-column label="微信退款" align="center">
        <template slot-scope="scope">
          {{ parseMoney(scope.row.wechat_refund_amount) }}
        </template>
      </el-table-column>
      <el-table-column label="合计应收" align="center" prop="pay_amount"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          {{ $conf.OrderMonthSummaryStatus[scope.row.status]}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100px" fixed="right">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleSettle(row)"
                     :disabled="row.status===sumStatus.OM_Settled">
            结算
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageData.page" :limit.sync="pageData.limit"
                @pagination="getList"/>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index';
import SelectTree from "@/components/treeSelect";
import {getList, updateStatus} from '@/api/report';
import {parseTime, parseTree, parseMoney} from '@/utils/index';
import {getMerchantTree} from "@/api/merchant";
import {OrderMonthSummaryStatus} from "@/js/common";

export default {
  components: {Pagination,SelectTree},
  name: "index",
  data() {
    return {
      props:{                // 配置项（必选）
        value: 'value',
        label: 'label',
        children: 'children',
        // disabled:true
      },
      total: 0,
      pageData: {
        page: 1,//第几页
        limit: 10,//每页数量，
      },
      //搜索
      searchData: {
        merchant_id: '',//商户
        summary_date: '',//月份
        status:'',//结算状态
      },
      listLoading: false,//loading
      downloadLoading: false,//按钮loading
      merchantTree: [],//商户树
      list: [],
      sumStatus: OrderMonthSummaryStatus,//结算状态
    }
  },
  methods: {
    parseTime: parseTime,
    parseMoney: parseMoney,
    // 获取商户
    initMerchantTree() {
      this.listLoading = true;
      getMerchantTree().then(response => {
        let merchantList = response;
        this.merchantTree = parseTree(merchantList);
        this.listLoading = false;
      })
    },
    //获取商户id
    getValue(value) {
      this.searchData.merchant_id = value;
    },
    // 获取列表
    getList() {
      let summaryDate = '';
      if (this.searchData.summary_date) summaryDate = `${this.parseTime(this.searchData.summary_date[0], '{y}-{m}')},${this.parseTime(this.searchData.summary_date[1], '{y}-{m}')}`;
      let req = {...this.pageData, ...this.searchData,summary_date:summaryDate};
      this.listLoading = true;
      getList(req).then(res => {
        const data = res.list;
        data.forEach(item => {
          item.pay_amount = this.parseMoney((item.ali_pay_amount + item.wechat_pay_amount) - (item.ali_refund_amount + item.wechat_refund_amount));
        })
        this.total = res.count;
        this.list = data;
      }).catch(err => {
        this.$message.warning(err.message || '获取列表数据失败, 请点击搜索重新加载列表数据');
      }).finally(() => {
        this.listLoading = false;
      })
    },
    // 搜索
    handleSearch() {
      this.$set(this.pageData, 'page', 1);
      this.getList();
    },
    //导出
    async handleExcel() {
      try {
      this.downloadLoading = true;
      let summaryDate = '';
      if (this.searchData.summary_date) summaryDate = `${this.parseTime(this.searchData.summary_date[0], '{y}-{m}')},${this.parseTime(this.searchData.summary_date[1], '{y}-{m}')}`;
      const res = await getList({...this.searchData,summary_date:summaryDate, page: 1, limit: 1000000});
      let dataList = res.list;
      dataList.forEach(item => {
        item.pay_amount = this.parseMoney((item.ali_pay_amount + item.wechat_pay_amount) - (item.ali_refund_amount + item.wechat_refund_amount));
      })
      await import('@/utils/Export2Excel').then(excel => {
        const tHeader = ['月份', '商户', '销售订单数', '支付宝收款', '支付宝退款', '微信收款', '微信退款', '合计应收','状态'];
        const filterVal = ['summary_date', 'short_name', 'order_count', 'ali_pay_amount', 'ali_refund_amount', 'wechat_pay_amount', 'wechat_refund_amount', 'pay_amount','status'];
        const list = dataList;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: `销售报表`,
          autoWidth: true,
          bookType: 'xlsx'
        });
        this.downloadLoading = false;
      });
      } catch (err) {
        this.downloadLoading = false;
        this.$message.warning(err.message || '操作失败');
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
          if (j === 'ali_pay_amount' || j === 'ali_refund_amount' || j === 'wechat_pay_amount' || j === 'wechat_refund_amount') {
            return parseMoney(v[j]);
          } else if (j === 'status') {
            return this.$conf.OrderMonthSummaryStatus[v[j]];
          } else {
            return v[j];
          }
        })
      );
    },
    //结算
    handleSettle(row) {
      this.$confirm('确定结算吗? 此操作不可逆, 请谨慎操作!', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        let parmas = {
          innerid: row.innerid,
          status: this.sumStatus.OM_Settled,
        };
        updateStatus(parmas).then(res => {
          this.$message.success('操作成功');
          this.listLoading = false;
          this.getList();
        }).catch(err => {
          this.$message.warning(err.message || '结算失败');
          this.listLoading = false;
        })
      }).catch(() => {
      });
    },
  },
  created() {
    this.initMerchantTree();
    this.getList();
  }
}
</script>

<style scoped>

</style>

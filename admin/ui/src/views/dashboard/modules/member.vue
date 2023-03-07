<template>
  <div class="chart-card-container">
    <el-row style="height: 302px">
      <div class="total">
        <span>总会员：</span>
        <count-to :start-val="0" :end-val="customerCount" :duration="3200" class="card-panel-num"/>
        <span>人</span>
      </div>
      <el-col :span="24">
        <div class="title">
          <div class="text pb_05 font_bold">新增趋势</div>
        </div>
        <line-chart :chart-data="chartData" :height="'220px'"></line-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {customer} from '@/api/dashboard'
  import LineChart from '../components/LineChart'
  import CountTo from "vue-count-to";

  export default {
    name: "member",
    components: {CountTo, LineChart},
    data() {
      return {
        customerCount: null,
        chartData: {
          series: {
            data: [],
            lineStyle: {color: '#46B3FB'},
            areaStyle: {color: '#CCEAFE'},
          },
          xAxis: {
            data: ['前日', '昨日', '今日'],
            axisLabel: true,
          },
          tooltip: {formatter: "{b}: 新增 {c} 人"},
        },
      }
    },
    methods: {
      getCustomer() {
        customer().then(res => {
          const data = res;
          this.customerCount = data.customer_count || 0;
          data.customer_trend.forEach(item => {
            this.chartData['series'].data.push(item.num);
          })
        }).catch(err => {
          this.$message.warning('获取会员相关数据失败' || err.message);
        })
      }
    },
    created() {
      this.getCustomer();
    }
  }
</script>

<style scoped lang="scss">
  .total {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    padding: 5px 0px 5px 0px;
  }

  .title {
    text-align: center;
    margin-top: 20px;

    .text {
      font-size: 16px;
      color: #333333;
    }
  }
</style>

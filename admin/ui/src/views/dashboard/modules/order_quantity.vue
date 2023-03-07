<template>
  <div class="chart-card-container">
    <el-row>
      <div class="header">
        <div class="header_title">订单量/笔</div>
        <div>
          <el-radio-group class="header_date" v-model="dateRadio" @change="handleRadio">
            <el-radio-button label="year">年</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="date">日</el-radio-button>
          </el-radio-group>
        </div>
        <div>
          <el-date-picker
            style="width:100%"
            v-model="orderDate"
            :type="pickerType"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
            :key="dateRadio"
            :default-time="['00:00:00', '23:59:59']"
            @change="handleChange">
          </el-date-picker>
        </div>
      </div>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <div style="padding-right: 20px">
          <el-card style="height: 230px">
            <div slot="header">
              <span>订单量</span>
              <span
                v-if="Array.isArray(dateRange) && dateRange.length>1"
                style="padding-left: 10px;font-size: 12px;color: #8c939d">
                {{dateRange[0]|parseTime('{y}-{m}-{d}')}} - {{dateRange[1]|parseTime('{y}-{m}-{d}')}}
              </span>
            </div>
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-order">
                <svg-icon icon-class="order-count" class-name="card-panel-icon"/>
              </div>
              <div class="card-panel-description">
                <count-to :start-val="0" :end-val="order_count" :duration="1200" class="card-panel-num"/>
                <span>笔订单</span>
              </div>
            </div>
          </el-card>
        </div>

      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <div class="font_14 pb_05 font_bold">订单来源分布</div>
        <pie-chart :chartData="pieChartData" height="220px"></pie-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {orderCount} from '@/api/dashboard'
  import {parseTime} from '@/utils/index'
  import {OrderSource, ThirdPlatform} from '@/js/common'
  import CountTo from 'vue-count-to'
  import LineChart from '../components/LineChart'
  import PieChart from '../components/PieChart'

  export default {
    name: "order_quantity",
    components: {CountTo, LineChart, PieChart},
    filters: {parseTime},
    data() {
      return {
        dateRadio: 'month',
        pickerType: "monthrange",
        orderDate: null,
        dateRange: [],
        order_source: [],
        monthData: {
          series: {
            data: [582, 932, 568, 840, 734, 452, 780],
            lineStyle: {color: '#808BC6'},
            areaStyle: {color: '#E6E8F4'},
          },
          xAxis: {
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

          },
        },
        pieChartData: {
          data: [
            {
              value: 0,
              name: '平台',
              source: OrderSource.OSRC_Platform,
              source_id: ''
            },
            {
              value: 0,
              name: '其他',
              source: OrderSource.OSRC_Third,
              source_id: ThirdPlatform.TP_Other
            },
            {
              value: 0,
              name: '美团',
              source: OrderSource.OSRC_Third,
              source_id: ThirdPlatform.TP_Meituan
            },
            {
              value: 0,
              name: '药机',
              source: OrderSource.OSRC_Equipment,
              source_id: ''
            }],
          color: ['#2DB7F5', '#808BC6', '#7DC856', '#5D6977'],
          series: {radius: '85%', center: ["65%", "50%"],},
        },
        order_count: null
      }
    },
    methods: {
      getBeginMonth(cFormat = '{y}-{m}-{d} {h}:{i}:{s}') {
        let data = new Date();
        data.setDate(1);
        data.setHours(0);
        data.setSeconds(0);
        data.setMinutes(0);
        return parseTime(data, cFormat);
      },
      handleRadio(e) {
        switch (e) {
          case 'year':
            this.pickerType = 'year';
            break;
          case 'month':
            this.pickerType = 'monthrange';
            break;
          default:
            this.pickerType = 'daterange';
        }
        this.orderDate = null;
        this.dateRange = null;
      },
      handleChange() {
        let date = [];
        switch (this.dateRadio) {
          case 'year':
            date = `${this.$moment(this.orderDate).startOf("year").format("YYYY-MM-DD HH:mm:ss")},${this.$moment(this.orderDate).endOf("year").format("YYYY-MM-DD HH:mm:ss")}`;

            break;
          case 'month':
            date = `${this.$moment(this.orderDate[0]).startOf("month").format("YYYY-MM-DD HH:mm:ss")},${this.$moment(this.orderDate[1]).endOf("month").format("YYYY-MM-DD HH:mm:ss")}`;
            break;
          default:
            date = `${parseTime(this.orderDate[0])},${parseTime(this.orderDate[1])}`;
        }
        this.dateRange = date.split(',');
        this.getOrderCount(date);
      },
      async getOrderCount(date = '') {
        return orderCount({date}).then(res => {
          const data = res;
          this.order_count = data.order_count;
          this.order_source = data.order_source;
          this.pieChartData['data'].forEach(n => {
            n.value = 0;
            this.order_source.forEach(m => {
              if (m.source == OrderSource.OSRC_Third && n.source == OrderSource.OSRC_Third) {
                if (m.source_id == n.source_id) {
                  n.value = m.num;
                }
              } else {
                if (m.source == n.source) {
                  n.value = m.num;
                }
              }
            })
          })
        }).catch(err => {
          this.$message.warning('获取总成交额数据失败');
        })
      }
    },
    async created() {
      let date = this.getBeginMonth();
      this.orderDate = [date, date];
      this.handleChange();
    }
  }
</script>

<style scoped lang="scss">
  .header {
    width: 100%;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    padding: 5px 0px 10px 0px;
    display: flex;
    align-items: center;

    &_title {
      width: 90px;
    }

    &_date {
      width: 150px;
    }
  }

  .title {
    margin-bottom: 5px;
    height: 50px;

    .text {
      font-size: 14px;
      color: #333333;

    }

    .desc {
      display: inline-flex;
      align-items: center;
    }

    .card-panel-num {
      margin-right: 10px;
      font-size: 20px;
    }
  }

  .pb_05 {
    padding-bottom: 5px;
  }

  .font_bold {
    font-weight: bold;
  }

  .font_12 {
    font-size: 12px;
  }

  .font_14 {
    font-size: 14px;
  }

  .up {
    margin: 0 5px;
    position: relative;
    top: 1px;
    border: 4px solid #FF0137;
    border-right-color: transparent;
    border-bottom-color: transparent;
    transform: rotate(45deg);
  }

  .down {
    margin: 0 5px;
    position: relative;
    top: -3px;
    border: 4px solid #2EBA07;
    border-left-color: transparent;
    border-top-color: transparent;
    transform: rotate(45deg);
  }

  .card-panel {
    cursor: pointer;
    font-size: 12px;
    color: #666;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      /*.card-panel-icon-wrapper {*/
      /*  color: #fff;*/
      /*}*/

      /*.icon-order {*/
      /*  background: #53A8FF;*/
      /*}*/

    }

    .icon-order {
      /*color: #53A8FF;*/
      color: #8eaeff;
    }

    .card-panel-icon-wrapper {
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      font-size: 88px;
    }

    .card-panel-description {
      font-weight: bold;
      margin: 26px;

      .card-panel-num {
        color: rgba(0, 0, 0, 0.45);
        font-size: 28px;
        margin-bottom: 12px;
      }
    }
  }

</style>

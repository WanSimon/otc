<template>
  <div class="chart-card-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="16" :lg="16">
        <div class="header">
          <div class="header_title">成交额分布</div>
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
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="24" :md="16" :lg="16">
        <bar-chart :chart-data="barChartData" height="270px"></bar-chart>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8">
        <div class="font_bold">成交额占比</div>
        <pie-chart :chartData="pieChartData" height="255px"></pie-chart>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {distribution} from '@/api/dashboard'
  import BarChart from '@/views/dashboard/components/BarChart'
  import PieChart from "@/views/dashboard/components/PieChart";
  import {OrderSource, ThirdPlatform} from "@/js/common";
  import {parseTime} from "@/utils";

  export default {
    name: "distribution",
    components: {BarChart, PieChart},
    data() {
      return {
        dateRadio: 'month',
        pickerType: "monthrange",
        orderDate: null,
        barChartData: {
          series: {
            data: []
          },
          xAxis: {
            data: []
          }
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
          color: ['#36CBCB', '#975FE5', '#FBD437', '#F04864'],
          series: {radius: '75%', center: ["65%", "50%"],},
        },
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
        this.getTurnoverCount(date);
      },
      async getTurnoverCount(date = '') {
        let params = {
          date: date,
          type: this.dateRadio
        }
        return distribution(params).then(res => {
          const data = res;
          this.barChartData['xAxis'].data = [];
          this.barChartData['series'].data = [];
          //成交分布
          data.distribution.forEach(item => {
            this.barChartData['xAxis'].data.push(item.date_str);
            this.barChartData['series'].data.push(item.amount / 100);
          })
          //成交占比
          this.pieChartData['data'].forEach(n => {
            n.value = 0;
            data.proportion.forEach(m => {
              if (m.source == OrderSource.OSRC_Third && n.source == OrderSource.OSRC_Third) {
                if (m.source_id == n.source_id) {
                  n.value = m.amount / 100;
                }
              } else {
                if (m.source == n.source) {
                  n.value = m.amount / 100;
                }
              }
            })
          })
        }).catch(err => {
          this.$message.warning('获取成交额分布数据失败');
        })
      }
    },
    created() {
      let date = this.getBeginMonth();
      this.orderDate = [date, date];
      this.handleChange();
    }
  }
</script>

<style scoped lang="scss">
  .header {
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    padding: 5px 10px 10px 0px;
    display: flex;
    align-items: center;

    &_title {
      width: 90px;
    }

    &_date {
      width: 150px;
    }
  }

  .font_bold {
    font-weight: bold;
  }
</style>

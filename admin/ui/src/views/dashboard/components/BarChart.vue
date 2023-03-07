<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

  const animationDuration = 6000

  export default {
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '240px'
      },
      chartData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        chart: null
      }
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart()
      })
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose()
      this.chart = null
    },
    methods: {
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      },
      setOptions({series = {}, xAxis = {}}) {
        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter(params) {
              let relVal = params[0].name;
              for (let i = 0, l = params.length; i < l; i++) {
                relVal += '<br/>' + params[i].marker + params[i].seriesName + ':' + params[i].value + "(元)";
              }
              return relVal;
            }
          },
          grid: {
            top: 10,
            left: '0%',
            right: 15,
            bottom: '5%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: [0, 0.01],
            data: xAxis.data,
          }],
          yAxis: [{
            type: 'value',
            inverse: false,//倒叙
          }],
          series: [{
            name: '金额',
            type: 'bar',
            barWidth: '35',
            data: series.data,
            animationDuration,
            itemStyle: {
              normal: {
                color:'#3BA1FF'
                // color(params) {
                //   let colorList = ['#ed6974', '#efa832', "#3398dc"];
                //   return colorList[params.dataIndex]
                // }
              }
            },
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}'
            },
          }]
        })
      }
    }
  }
</script>

<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

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
        default: '280px'
      },
      autoResize: {
        type: Boolean,
        default: true
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
      setOptions({series = {}, xAxis = {}, tooltip = {}}) {
        this.chart.setOption({
          xAxis: {
            data: xAxis.data,
            boundaryGap: false,
            axisTick: {
              show: false //不显示坐标轴刻度线
            },
            axisLine: {
              show: true,//不显示坐标轴线
            },
            axisLabel: {
              show: xAxis.axisLabel,//不显示坐标轴上的文字
            }
          },
          grid: {
            left: 15,
            bottom: 10,
            top: 10,
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            padding: [5, 10],
            formatter: tooltip.formatter,
          },
          yAxis: {
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,//不显示坐标轴线
            },
            axisLabel: {
              show: false,//不显示坐标轴上的文字
            },
            splitLine: {
              show: false//不显示网格线
            }
          },
          legend: {
            // data: ['金额']
          },
          series: [{
            showSymbol: false,
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: series.lineStyle.color,
                },
                areaStyle: {
                  color: series.areaStyle.color
                },
                label: {show: true}
              }
            },
            data: series.data,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }]
        })
      }
    }
  }
</script>

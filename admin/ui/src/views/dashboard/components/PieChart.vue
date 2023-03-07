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
      setOptions({data = [], color = null, series = {}, legend = {}, title = {}}) {
        let self = this
        this.chart.setOption({
          title: title,
          color: color,
          // tooltip: {
          //   enterable: true,
          //   formatter: function (e) {
          //     let data = e.data
          //     self.$router.push({
          //       path: '/report/order',
          //       query: {
          //         source: data.source,
          //         source_id: data.source_id,
          //       }
          //     })
          //   },
          //   triggerOn: 'click'
          // },
          tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)",
            position: ['50%', '50%']
          },
          legend: {
            orient: 'vertical',//水平布局 'horizontal' ¦ 'vertical'
            // x: 'left',
            y: '30px',
            icon: "circle",//圆形图标 默认长方形
            right: legend.right,
            left: legend.left,
            formatter: function (name) {
              // 获取legend显示内容
              let total = 0;
              let tarValue = 0;
              for (let i = 0, l = data.length; i < l; i++) {
                total += Number(data[i].value);
                if (data[i].name == name) {
                  tarValue = Number(data[i].value);
                }
              }
              let p = (tarValue / total * 100) ? (tarValue / total * 100).toFixed(2) : '-';
              return name + ' ' + ' ' + p + '%';
            }
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: series.radius,
              center: series.center,
              data: data,
              animationEasing: 'cubicInOut',
              animationDuration: 2600,
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,//引导线
                  // position:'inner',
                  formatter: '{b}{d}%',
                  textStyle: {
                    fontWeight: 900,
                    fontSize: 14
                  },
                }
              }
            },
          ]
        })
      }
    }
  }
</script>

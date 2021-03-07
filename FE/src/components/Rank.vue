<!-- 地区销售排行 -->
<template>
  <div class='com-container'>
    <div class='com-chart' ref='rank_ref'></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0, // 区域缩放的起点值
      endValue: 4, // 区域缩放的终点值
      timerId: null, // 定时器的标识
      halfSales: 0 // top20销量的一半
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, this.theme)
      const initOption = {
        title: {
          text: '商品销量 Top20'
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true,
          // formatter: function (arg) {
          //   const color = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#009efd;"></span>'
          //   return arg[0].name + '<br>' + color + arg[0].value + '万';
          // }
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: 45,
            verticalAlign: 'top'
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    async getData () {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await this.$http.get('productData')
      const retArr = [];
      // 返回的是对象，需要将对象转为数组
      for (let [key, val] of Object.entries(ret)) {
        val = val / 10000;
        retArr.push({
          name: key,
          value: val,
        });
      }
      this.allData = retArr
      // 对allData里面的每一个元素进行排序, 从大到小进行
      retArr.sort((a, b) => {
        return b.value - a.value
      })
      this.allData = retArr.slice(0, 20);
      this.halfSales = (this.allData[9].value + this.allData[10].value) / 2;
      console.log(this.halfSales);
      console.log(this.allData);
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const colorArr = [
        ['#f9d423', '#ff4e50'],
        ['#009efd', '#89f7fe']
      ]
      // 处理图表需要的数据
      // 所有省份所形成的数组
      const nameArr = this.allData.map(item => {
        return item.name
      })
      // 所有省份对应的销售金额
      const valueArr = this.allData.map(item => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: nameArr
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: arg => {
                let targetColorArr = null;
                if (arg.value > this.halfSales) {
                  targetColorArr = colorArr[0];
                } else {
                  targetColorArr = colorArr[1];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0]
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1]
                  }
                ])
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.rank_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize * 1.2
          },
          left: titleFontSize * 1.2,
          top: 20
        },
        grid: {
          top: '20%',
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 4
        }
        this.updateChart()
      }, 2000)
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      console.log('主题切换了')
      this.chartInstance.dispose() // 销毁当前的图表
      this.initChart() // 重新以最新的主题名称初始化图表对象
      this.screenAdapter() // 完成屏幕的适配
      this.updateChart() // 更新图表的展示
    }
  }
}
</script>

<style lang='less' scoped>
</style>

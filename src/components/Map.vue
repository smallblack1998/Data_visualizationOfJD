
<template>
  <div class="com-container" @lclick="revertMap">
        <div class='com-chart' ref='map_ref'></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
  name: 'Map',
  data() { 
    return {
        chartInstance: null,
        allData: null
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
    },
    methods: { 
        async initChart () { 
            this.chartInstance = this.$echarts.init(this.$refs.map_ref,this.theme) 
            const { data: mapData } = await axios.get('http://localhost:8889/static/map/china.json')
            this.$echarts.registerMap('china',mapData)
            const initOption = {
                geo: {
                    type: 'map',
                    map: 'china',
                    top:'5%',
                    bottom: '5%',
                    itemStyle: { 
                        areaColor: '#2E72BF', 
                        borderColor: '#333' 
                    }
                },
                //标题设置
                title: {
                    text: '▎ 商家分布',
                    left: 20,
                    top: 20
                },
                //图例设置
                legend: { 
                    left: '5%', 
                    bottom: '5%', 
                    orient: 'vertical' 
                }
                
            } 
            this.chartInstance.setOption(initOption) 
            this.chartInstance.on('click', async arg => {
                // arg.name 就是所点击的省份名称, 是中文
                const provinceInfo = getProvinceMapInfo(arg.name)
                const { data: ret } = await axios.get('http://localhost:8889' + provinceInfo.path) 
                this.$echarts.registerMap(provinceInfo.key, ret) 
                this.chartInstance.setOption({ 
                    geo: { 
                        map: provinceInfo.key 
                    } 
                })
            })
            this.getData()
        },
        async getData () { 
            // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表 this.updateChart() 
            const {  data: ret } = await this.$http.get('map')
            this.allData = ret
            console.log(ret)
            this.updateChart()
        },
        updateChart () {
             // 处理图表需要的数据 
             //图例数据
             const legendData = this.allData.map(item => {
                 return item.name
             })
             //散点数据
             const seriesArr = this.allData.map(item => {
                 return {
                     type: 'effectScatter', 
                     rippleEffect: {
                         scale: 5,
                         brushType: 'stroke'
                     },
                     coordinateSystem: 'geo', 
                     name: item.name, 
                     data: item.children
                 }
             })

             const dataOption = {
                 legend: {
                     data: legendData
                 },
                 series: seriesArr
             } 
             this.chartInstance.setOption(dataOption)

        },
        screenAdapter () {
            const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
            const adapterOption = {
                title: { 
                    textStyle: { 
                        fontSize: titleFontSize 
                    } 
                },
                legend: { 
                    itemWidth: titleFontSize / 2, 
                    itemHeight: titleFontSize / 2, 
                    itemGap: titleFontSize / 2, 
                    textStyle: {
                        fontSize: titleFontSize / 2 
                    } 
                }
            } 
            this.chartInstance.setOption(adapterOption) 
            this.chartInstance.resize() 
        },
        //回到中国
        revertMap () { 
            this.chartInstance.setOption({ 
                geo: { 
                    map: 'china' 
                } 
            }) 
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

<style lang="less" >
  .com-container{

  }
</style>
<!-- 热销商品图表 -->
<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      chartInstance: null,
      allData: null,
      // currentIndex: 0, // 当前所展示出的一级分类数据
      titleFontSize: 0,
    };
  },
  computed: {
    ...mapState(["theme"]),
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, this.theme);
      const initOption = {
        title: {
          text: "热销商品Top20",
          left: 20,
          top: 20,
        },
        tooltip: {
          show: true,
          formatter: arg => {
            // console.log(arg)
            const str = `${arg.marker} ${arg.name} &nbsp&nbsp <span style="font-weight: 900">${arg.value}万</span>`;
            return str;
          }
        },
        legend: {
          orient: "vertical",
          left: "3%",
          top: "12%"
        },
        series: [
          {
            type: "pie",
            label: {
              show: false, //将显示数据隐藏，
              position: "center",
            },
            itemStyle: {
              borderColor: "#222733",
              borderWidth: 7,
            },
            emphasis: {
              // 当饼图高亮后，显示数据
              label: {
                show: true,
              },
              itemStyle: {
                shadowBlur: 20,
                shadowColor: "rgb(34, 39, 51, 0.5)",
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      // 获取服务器的数据, 对this.allData进行赋值之后, 调用updateChart方法更新图表
      const { data: ret } = await this.$http.get("productData");
      const retArr = [];
      // 返回的是对象，需要将对象转为数组
      for (let [key, val] of Object.entries(ret)) {
        val = val / 10000;
        retArr.push({
          name: key,
          value: val,
        });
      }
      this.allData = retArr;
      // 对allData里面的每一个元素进行排序, 从大到小进行
      retArr.sort((a, b) => {
        return b.value - a.value;
      });
      this.allData = retArr.slice(0, 20);
      // console.log(this.allData)
      this.updateChart();
    },
    updateChart() {
      const dataOption = {
        series: [
          {
            data: this.allData,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        series: [
          {
            radius: [this.titleFontSize * 4, this.titleFontSize * 8],
            center: ["65%", "55%"],
            label: {
              fontSize: this.titleFontSize * 0.7,
              fontWeight: 'bold'
            }
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
  watch: {
    theme() {
      console.log("主题切换了");
      this.chartInstance.dispose(); // 销毁当前的图表
      this.initChart(); // 重新以最新的主题名称初始化图表对象
      this.screenAdapter(); // 完成屏幕的适配
      this.updateChart(); // 更新图表的展示
    },
  },
};
</script>

<style lang='less' scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: white;
}
</style>

<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <!-- <div>
        <img class="top" :src="headerSrc" alt="">
      </div> -->
      <!-- <span class="logo">
        <img :src="logoSrc" alt="" />
      </span> -->
      <span class="title">京东手机实时销售状况</span>
      <div class="title-right">
        <span class="datetime">{{ time }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="middle-bottom" :class="[fullScreenStatus.rank ? 'fullscreen' : '']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <!-- <div class="resize">
            <span @click="changeSize('rank')"  :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div> -->
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller ? 'fullscreen' : '']">
          <!-- 商家销量排行 -->
          <Merchant ref="seller"></Merchant>
          <!-- <div class="resize">
            <span @click="changeSize('seller')"  :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div> -->
        </div>
      </section>
      <section class="screen-middle">
        <div class="money">1111000元</div>
        <div id="middle-top" :class="[fullScreenStatus.Product ? 'fullscreen' : '']">
          <!-- 热销商品Top20 -->
          <!-- <Map ref="map"></Map> -->
          <Product ref="product"></Product>
          <!-- <div class="resize">
            <span @click="changeSize('product')"  :class="['iconfont', fullScreenStatus.product ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div> -->
        </div>
        <!-- <div id="left-top" :class="[fullScreenStatus.trend ? 'fullscreen' : '']"> -->
          <!-- 销量趋势图表 -->
          <!-- <Trend ref="trend"></Trend> -->
          <!-- <div class="resize">
            <span @click="changeSize('trend')" :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div> -->
        <!-- </div> -->
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <!-- <div class="resize">
            <span @click="changeSize('hot')"  :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div> -->
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock ? 'fullscreen' : '']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <!-- <div class="resize">
            <span @click="changeSize('stock')"  :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div> -->
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Merchant from '@/components/Merchant.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'
import Product from '@/components/Product.vue'
import { mapState } from 'vuex'
import { getThemeValue } from '@/utils/theme_utils'
export default {
  data () {
    return {
      time: '',
      timer: null,
      // 定义每一个图表的全屏状态
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false,
        product: false
      }
    }
  },
  methods: {
    changeSize (chartName) {
      // 1.改变fullScreenStatus的数据
      this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // 2.需要调用每一个图表组件的screenAdapter的方法
      this.$refs[chartName].screenAdapter()
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })

    },
    handleChangeTheme () {
      // 修改VueX中数据
      this.$store.commit('changeTheme')
    },
    // 获取时间
    createTime () {
      const time = new Date();
      const year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let h = time.getHours();
      let m = time.getMinutes();
      let s = time.getSeconds();
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
      h = h < 10 ? '0' + h : h;
      m = m < 10 ? '0' + m : m;
      s = s < 10 ? '0' + s : s;
      this.time = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.createTime();
      }, 1000);
    }
  },

  created() {
    this.createTime();
  },

  components: {
    Hot,
    Map,
    Rank,
    Merchant,
    Stock,
    Trend,
    Product
  },
  computed: {
    logoSrc () {
      return '/static/img/' + getThemeValue(this.theme).logoSrc
    },
    headerSrc () {
      return '/static/img/' + getThemeValue(this.theme).headerBorderSrc
    },
    themeSrc () {
      return '/static/img/' + getThemeValue(this.theme).themeSrc
    },
    containerStyle () {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      }
    },
    ...mapState(['theme'])
  }
}
</script>
<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
      img {
        width: 100%;
        margin-top: -8px
      }
    }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 24px;
    font-weight: bold;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position:absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .datetime {
    font-size: 18px;
    margin-left: 10px;
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #middle-bottom {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 78.5%;
    }
    .money {
      text-align: center;
      background: linear-gradient(to right, #fa709a, #fee140);
      background-clip: text;
      color: transparent;
      font-weight: 900;
      // color: #fda085;
      font-size: 40px;
      margin-top: -10px;
      margin-bottom: 20px;
    }
    
    // #left-top {
    //   margin-top: 25px;
    //   width: 100%;
    //   height: 28%;
    //   position: relative;
    // }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>

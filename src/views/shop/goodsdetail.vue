<template>
  <div class="page">
    <m-header title="商品详情" :canback="Boolean(1)"></m-header>
    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" >
      <van-swipe-item>1</van-swipe-item>
     
    </van-swipe>

  </div>
</template>
<script>
import Vue from "vue";
import { Swipe, SwipeItem } from "vant";

Vue.use(Swipe);
Vue.use(SwipeItem);
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  padding: @margin-primary;
  background-color: @bg-color;
}
/deep/.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
</style>

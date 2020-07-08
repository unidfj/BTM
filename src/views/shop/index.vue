<template>
  <div class="page">
    <m-header title="全部商品" :canback="Boolean(0)"></m-header>
    <div class="body">
      <ul class="cardbox" :style="'height:'+(screenHeight-90)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
        <li class="goods-list" v-for="item in goodsList" :key="item.goods_id" @click="goDetail(item.id)">
          <img :src="item.image" class="goods-img">
          <div class="goods-info">
            <div class="goods-name">
              {{item.goods_name}}
            </div>
            <div class="goods-bot">
              <span class="price">￥{{item.goods_min_price}}</span>
              <img src="../../assets/images/btm/sc_ico_gwc.png" class="cart-img">
            </div>
          </div>
        </li>
        <next ref="next" :nomore="noMore"></next>
      </ul>
    </div>
    <m-Footer></m-Footer>
  </div>
</template>
<script>
import { Index } from "@/server/server.js";
import { Util,Load } from "@/assets/commonjs/utils.js";

export default {
  data() {
    return {
      formData:{
        id: -1,
        sel_type:"normal",
        name:'',
        page: 1,
      },
      goodsList:[],
      screenHeight: 667,
      noMore: false,
    };
  },
  created() {
    sessionStorage.setItem('btmNav',1);
    this.screenHeight = window.screen.height || window.screen.availHeight;
  },
  mounted () {
    this.categoryList();
  },
  methods: {
    goDetail(id) {
      this.$router.push({name:'GoodsDetail',query:{id}})
    },
    categoryList() {
      Load.loadNext(this);
      Index.categoryList(this.formData).then(res => {
        if(res.code === 1) {
          this.goodsList = this.goodsList.concat(res.data.listdata || []);
          if(res.data.pagedata.current_page >= res.data.pagedata.last_page) {
            this.noMore = true;
          }
        }else {
          mui.toast(res.msg);
        }
      })
    },
    lazyLoad() {
      this.formData.page = this.formData.page + 1;
      if (!this.noMore) {
        this.categoryList();
      }
    }
  },

};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  // padding: @margin-primary;
  background-color: @bg-color;
  .cardbox {
    font-size: 0;
    .goods-list {
      margin-top: 20px;
      width: 46%;
      display: inline-block;
      font-size: 28px;
      border-radius: 16px;
      background: #fff;
      &:nth-child(odd) {
        margin-left: 3%;
        margin-right: 3%;
      }
      .goods-img {
        width: 100%;
        // height: 240px;
        display: block;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
      }
      .goods-info {
        padding: 15px;
        .goods-name {
          padding-bottom: 5px;
          color: #333;
          font-weight: 500px;
        }
        .goods-bot {
          .display-flex();
          justify-content: space-between;
          .price {
            font-size: 36px;
            color: #FF3B30;
          }
          .cart-img {
            width: 38px;
            height: 38px;
          }
        }
      }
    }
  }
}
</style>
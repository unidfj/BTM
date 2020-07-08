<template>
  <div class="page">
    <m-header title="0元商品" :canback="Boolean(1)"></m-header>
    <div class="body">
      <ul class="cardbox" :style="'height:'+(screenHeight-40)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
        <li class="goods-list" v-for="item in goodsList" :key="item.goods_id" @click="goDetail(item.goods_id)">
          <img :src="item.images" class="goods-img">
          <div class="goods-info">
            <div class="goods-name">
              {{item.goods_name}}
            </div>
            <div class="goods-bot">
              <span class="price">￥{{item.spec[0].goods_price}}</span>
              <img src="../../assets/images/btm/sc_ico_gwc.png" class="cart-img">
            </div>
          </div>
        </li>
        <next ref="next" :nomore="noMore"></next>
      </ul>
    </div>
  </div>
</template>
<script>
import { Index } from "@/server/server.js";
import { Util,Load } from "@/assets/commonjs/utils.js";

export default {
  data() {
    return {
      goodsList:[],
      page:1,
      screenHeight: 667,
      noMore: false,
    };
  },
  created() {
    this.screenHeight = window.screen.height || window.screen.availHeight;
  },
  mounted () {
    this.getZeroGoods();
  },
  methods: {
    goDetail(id) {
      this.$router.push({name:'GoodsDetail',query:{id}})
    },
    onSearch() {
      [this.goodsList,this.formData.page,this.isSearch,this.noMore] = [[],1,false];
      this.categoryList();
    },
    getZeroGoods() {
      Load.loadNext(this);
      Index.getZeroGoods({page:this.page,page_rows: 10}).then(res => {
        if(res.code === 1) {
          this.goodsList = this.goodsList.concat(res.data || []);
          if(res.page >= res.totalpage) {
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
  .search {
    padding: 24px 0;
    .display-flex();
    align-items: center;
    background: #FFF;
    .left {
      margin-left: 20px;
      flex: 1;
      position: relative;
      .search-img {
        width: 34px;
        position: absolute;
        left: 25px;
        top: 13px;
      }
      .sea-inp {
        height: 60px;
        margin: 0;
        padding: 0;
        color: #999;
        padding-left: 74px;
        background: #f4f4f4;
        border-radius: 100px;
        font-size: 26px;
        border: none;
        &::placeholder {
          color: #999;
        }
      }
    }
    .sea-btn {
      padding: 0 20px;
      color: #00a2ea;
    }
  }
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
        height: 240px;
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
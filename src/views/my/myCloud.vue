<template>
  <div class="page">
    <m-header title="我的云仓" :canback="Boolean(1)">
      <span class="log" @click="$router.push('/cloudLog')">云仓记录</span>
    </m-header>
    <div class="body">
      <div
        class="card-root-c"
        :style="'height:'+(screenHeight-40)+'px;overflow:auto;'"
        v-lazy-load="lazyLoad"
      >
        <div class="goods-info" v-for="(item, idx) in goodsList" :key="idx">
          <img :src="item.goods_images" class="goods-img" />
          <div class="goods-right">
            <div class="name">{{item.goods_name}}</div>
            <div class="desc">{{item.goods_attr ? item.goods_attr :'默认规格'}}</div>
            <div class="desc">库存：{{item.cloud_num}}</div>
            <div class="bot">
              <div>
                <i class="iconfont iconjianhao2" @click="handle(idx,'jian')" ></i>
                  <span>{{arr[idx]}}</span>
                <i class="iconfont iconjiahao2"  @click="handle(idx,'jia')"></i>
              </div>
              <button class="btn" @click="goDetail(item,idx)">自提</button>
            </div>
            <!-- <div class="goods-price">￥{{item.goods_price}}</div> -->
          </div>
        </div>
        <next ref="next" :nomore="noMore"></next>
      </div>
    </div>
  </div>
</template>
<script>
import { Owner } from "@/server/server.js";
import { Load } from "@/assets/commonjs/utils.js";

export default {
  data() {
    return {
      page: 1,
      goodsList: [],
      screenHeight: 667,
      noMore: false,
      totalNum:1,
      arr: [],
    };
  },
  created() {
    this.screenHeight = window.screen.height || window.screen.availHeight;
  },
  mounted() {
    this.stockCloud();
  },
  methods: {
    handle(idx,type) {
      if(type == 'jia') {
        this.totalNum=++this.arr[idx];
        this.$set(this.arr,idx,this.totalNum)
      }else {
        if(this.arr[idx] <2) return
        this.totalNum=--this.arr[idx];
        this.$set(this.arr,idx,this.totalNum)
      }
    },
    goDetail(item,idx) {
      // this.$router.push({name:'GoodsDetail',query:{id,isCloud:'cloud'}})
      // console.log(item)
      // return
      this.$router.push({path: '/index/subOrder', query: {
          type: 'buyNow',
          goods_id: item.goods_id,
          goods_num: this.arr[idx],
          goods_sku_id: item.spec_sku_id,
          goods_type: 4,//1 为 0元区商品 2 为升级类商品 4 为云仓商品 这几类不加入购物车；3 为实体类商品 需要加入购物车
          isCloud: 'cloud',
      }})
    },
    stockCloud() {
      Load.loadNext(this);
      Owner.stockCloud({ page: this.page, page_rows: 10 }).then(res => {
        if (res.code === 1) {
          this.goodsList = this.goodsList.concat(res.data);
          for (let index = 0; index < this.goodsList.length; index++) {
              this.arr[index] = 1;
          }
          if (res.page >= res.totalpage) {
            this.noMore = true;
          }
        } else {
          mui.toast(res.msg);
        }
      });
    },
    lazyLoad() {
      this.page = this.page + 1;
      if (!this.noMore) {
        this.stockCloud();
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.log {
  color: #00a2ea;
}
.body {
  //   padding: @margin-primary;
  background-color: @bg-color;
  .card-root-c {
    .goods-info {
      padding: 10px;
      .display-flex();
      align-items: center;
      background: #fff;
      border-bottom: 1px solid #eee;
      .goods-img {
        width: 200px;
        height: 200px;
        margin-right: 27px;
      }
      .goods-right {
        flex: 1;
        .name {
          color: #333;
          font-size: 34px;
        }
        .desc {
          color: #999;
          font-size: 24px;
        }
        .bot {
          .display-flex();
          justify-content: space-between;
          align-items: center;
          .btn {
            height: 60px;
            line-height: 60px;
          }
          i {
            font-size: 38px;
            color: #666;
          }
        }
        .goods-price {
          color: #fa3844;
          font-size: 40px;
          text-align: right;
        }
      }
    }
  }
}
</style>
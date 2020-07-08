<template>
  <div class="page">
    <m-header title="选择服务类型" :canback="Boolean(1)"></m-header>
    <div class="body">
        <div class="card-root-c">
          <div class="goods-info" v-if="detail.goods">
            <img :src="detail.goods[key].spec.spec_image==''? detail.goods[key].image:detail.goods[key].sku_image" class="goods-img">
            <div class="goods-right">
              <div class="name">{{detail.goods[key].goods_name}}</div>
              <div class="desc">{{detail.goods[key].goods_attr ? detail.goods[key].goods_attr :'默认规格'}}</div>
              <div class="desc">数量：{{detail.goods[key].total_num}}</div>
              <div class="goods-price">￥{{detail.pay_price}}</div>
            </div>
          </div>
        </div>
        <ul class="wrap">
            <li class="list" @click="goTo('1')">
                <div class="text">
                    <div>
                        我要换货
                    </div>
                    <div class="tips">换货</div>
                </div>
				<i class="iconfont iconright"></i>
            </li>
            <li class="list" @click="goTo('2')">
                <div class="text">
                    <div>
                        我要退货退款
                    </div>
                    <div class="tips">已收到货，需要退还已收到的货物</div>
                </div>
				<i class="iconfont iconright"></i>
            </li>
        </ul>
    </div>
  </div>
</template>
<script>
import { Owner } from "@/server/server.js";
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
        detail:{},
        id:this.$route.query.id, 
        key: this.$route.query.key,//商品数组下标
    };
  },
  computed: {
    ...mapGetters(['api'])  
  },
  created() {
    this.orderDetail();
  },
  methods: {
    goTo(type) {
        this.$router.push({name:'ApplyRefund',query:{type,id:this.id,key:this.key}})
    },
    
    orderDetail() {
        Owner.orderDetail({id:this.id}).then(res => {
            if(res.code === 1) {
                this.detail = res.data.order;
            }else {
            mui.toast(res.msg);
            }
        })
    },
  }};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
//   padding: @margin-primary;
    background-color: @bg-color;
    .card-root-c {
        margin-top: 20px;
        background: #FFF;
        .goods-info {
        padding: 20px;
        .display-flex();
        align-items: center;
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
            .goods-price {
            color: #FA3844;
            font-size: 40px;
            text-align: right;
            }
        }
     }
    }
    .wrap {
        margin-top: 10px;
        padding: 10px;
        background: #fff;
        .list {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            .text {
                font-size: 30px;
                .tips {
                    color: #999;
                    font-size: 24px;
                }
            }
            &:last-child{
                border-top: 1px solid #edeff4;
            }
        }
    }
}
</style>
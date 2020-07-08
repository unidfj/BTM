<template>
  <div class="page">
    <m-header title="订单详情" :canback="Boolean(1)"></m-header>
    <div class="body">
        <div class="card-root-c" v-for="(item, idx) in detail.goods" :key="idx">
            <div v-if="item.show_error != 0" class="goods_err_div">{{item.show_error_text}}</div>
            <div class="goods-info">
              <img :src="item.spec&&item.spec.spec_image==''? item.image:item.sku_image" class="goods-img">
              <div class="goods-right">
                <div class="name">{{item.goods_name}}</div>
                <div class="desc">{{item.goods_attr ? item.goods_attr :'默认规格'}}</div>
                <div class="desc">数量：{{item.total_num}}</div>
                <div class="goods-price">￥{{item.goods_price}}</div>
              </div>
            </div>
            <!-- <van-card :price="item.goods_price"
            :title="item.goods_name" :num="item.total_num"
            :desc="item.goods_attr ? item.goods_attr :'默认规格'"
            :centered="true"  :thumb="item.spec&&item.spec.spec_image==''? item.image:item.sku_image">
            </van-card> -->
		    </div>
    <ul class="info-wrap">
      <li class="info-list">
        <span>商品价格总计：</span>
        <span class="price">￥{{detail.total_price}}</span>
      </li>
      <li class="info-list">
        <span>快递费用：</span>
        <span class="express-price">{{detail.express_price==0 ? '免邮费或未查询到运费' : '＋ ￥' + detail.express_price}}</span>
      </li>
      <li class="info-list">
        <span>使用优惠券：</span>
        <span class="price">￥{{score?score:0}}</span>
      </li>
      <li class="info-list" v-if='active!=0'>
        <span>实际支付：</span>
        <span class="price">￥{{detail.pay_price}}</span>
      </li>
    </ul>
    <div class="title">
      订单信息
    </div>
    <ul class="info-wrap">
      <li class="info-list">
        <span>订单号：</span>
        <span class="express-price">{{detail.order_no}}</span>
      </li>
      <li class="info-list">
        <span>订单时间：</span>
        <span class="express-price">{{detail.creattime_text}}</span>
      </li>
      <li class="info-list" v-if="detail.freight_time!=0&&detail.address">
        <span>发货时间：</span>
        <span class="express-price">{{detail.freight_time_text}}</span>
      </li>
      <li class="info-list" v-if="detail.freight_time!=0&&detail.address">
        <span>快递公司：</span>
        <span class="express-price">{{detail.express_company}}</span>
      </li>
      <li class="info-list" v-if="detail.freight_time!=0&&detail.address">
        <span>快递单号：</span>
        <span class="express-price">{{detail.express_no}}</span>
      </li>
    </ul>
    <div class="courier-list" v-if="courierList&&detail.freight_time!=0&&detail.address">物流信息</div>
    <ul class="courier" v-if="courierList&&detail.freight_time!=0&&detail.address">
        <li  class="courier-list" v-for="(item,index) in courierList" :key="index">
            <div>{{item.context}}</div>
            <div>{{item.time}}</div>
        </li>
    </ul>
    <div class="courier-list" v-if="!courierList&&detail.freight_time!=0&&detail.address">暂无物流信息或查询失败</div>

        <!-- 这里是总计 和 邮费 -->
        <!-- <van-cell-group class="vcg-c">
          <van-cell title="订单号：" :value="detail.order_no" />
          <van-cell title="订单提交时间：" :value="detail.creattime_text" />
          <van-cell v-if="detail.pay_status==20" title="订单支付时间：" :value="detail.pay_time_text" />
          <van-cell title="商品价格总计：" class="pric-cell" :value="'￥'+detail.total_price" />
          <van-cell title="快递费用：" class="pric-cell" :value="detail.express_price==0 ? '免邮费或未查询到运费' : '＋ ￥' + detail.express_price" />
        <van-cell title="优惠折扣：" class="pric-cell" :value="'- ￥'+discount_price"/>

        在已发货后 可以看到 发货时间，发货单号 运送公司
        <div v-if="detail.freight_time!=0&&detail.address">
            <van-cell title="发货时间：" :value="detail.freight_time_text" />
            <van-cell title="快递公司：" :value="detail.express_company" />
            <van-cell title="快递单号：" :value="detail.express_no" />
            <div class="courier-list" v-if="courierList">物流信息</div>
            <ul class="courier" v-if="courierList">
                <li  class="courier-list" v-for="(item,index) in courierList" :key="index">
                    <div>{{item.context}}</div>
                    <div>{{item.time}}</div>
                </li>
            </ul>
            <div class="courier-list" v-else>暂无物流信息或查询失败</div>
        </div>
        </van-cell-group> -->


    </div>
    <van-submit-bar
    class="submit"
    label='实际支付'
    :price="detail.pay_price*100"
    :button-text="detail.BTText" :button-type="detail.BTtype"
    @submit="onSubmit" :loading="disabled" :disabled="active==1 || active==3||active==4||active==5" >
    <!-- <van-tag size="large" v-if="active==0" class="tagadress" :color="gcfg.BackgroundColor" @click="TapCancel">取消订单</van-tag> -->
    <!-- <span slot="tip">
      <van-icon class='ico-ad' name="logistics"/><span class='ab_mt'>{{detail.address&&detail.address.Area.province}}{{detail.address&&detail.address.Area.city}}{{detail.address&&detail.address.Area.region}} - {{detail.address&&detail.address.detail}}</span><br>
      <van-icon class='lianxirentip ico-ad' name="phone"/><span class='lianxirentip ab_mt'>{{detail.address&&detail.address.name}} : {{detail.address&&detail.address.phone}}</span>
    </span> -->
    </van-submit-bar>
  </div>
</template>
<script>
import { Owner } from "@/server/server.js";
import Vue from 'vue';
import { Card,Cell, CellGroup,SubmitBar,Icon } from 'vant';

Vue.use(Card).use(Cell).use(CellGroup).use(SubmitBar).use(Icon);
export default {
  data() {
    return {
        active:0,
        id:this.$route.query.id,
        detail: {address:{Area:{}},},
        disabled: false,
        gcfg:[],
        orderid: null,
        ordersn: null,
        pay_price: null,
        score: null,
        courierList:null,//物流信息
    };
  },
  created() {
    this.orderDetail();
    this.demandCourier();
  },
  mounted () {
    Share._initShare();
  },
  methods: {
      orderDetail() {
          Owner.orderDetail({id:this.id}).then(res => {
              if(res.code === 1) {
                  this.handleDetail(res);
              }else {
                  mui.toast(res.msg);
              }
          })
      },
      handleDetail(result) {
        console.log(result)
        let active = 0;
        //格式化商品状态
        var item = result.data.order;
        this.orderid = item.id;
        this.ordersn = item.order_no;
        this.pay_price = item.pay_price;
        this.score = item.score;
        if (item.pay_status == "20" && item.freight_status == "10" && item.order_status == "10" && item.receipt_status == "10") {
          item.showText = "待发货";
          item.BTText = "已付款";
          item.BTtype = 'primary';
          active = 1;
        }
        if (item.pay_status == "20" && item.freight_status == "20" && item.order_status == "10" && item.receipt_status == "10") {
          item.showText = "待收货";
          item.BTText = "确认收货";
          item.BTtype = 'warning';
          active = 2;
        }
        if (item.pay_status == "10" && item.freight_status == "10" && item.order_status == "10" && item.receipt_status == "10") {
          item.showText = "待付款";
          item.BTText = "付款";
          item.BTtype = 'danger';
          active = 0;
        }
        if (item.pay_status == "20" && item.freight_status == "20" && item.order_status == "30" && item.receipt_status == "20") {
          item.showText = "已完成";
          item.BTText = "订单已完成";
          item.BTtype = 'default';
          active = 3;
        }
        if (item.order_status == "20") {
            item.showText = "已取消";
            item.BTText = "订单已取消";
            item.BTtype = 'default';
            active = 4;

        }
        if (item.is_cancel == "1" || item.is_cancel == "2") {
            item.showText = "退换货";
            item.BTText = "维权中";
            item.BTtype = 'default';
            active = 5;

        }
        this.detail=item
        this.active=active
      },
      onSubmit() {
        //提交订单
				if (this.disabled) {
				     return false;
				}
				this.disabled = true;
				//如果是确认收货
			    if (this.active == 2 ){
            Owner.orderFinish({'id': this.id}).then(res => {
              if(res.code === 1) {
                this.disabled = false;
                mui.toast("确认收货成功");
                this.$router.go(-1);
              }else {
                this.disabled = false;
                mui.toast("确认收货失败");
              }
            })
			      return;
				}
				this.$router.push({
					name: "Pay",
					query: {
            orderid: this.orderid,
            ordersn: this.ordersn,
            pay_price: this.pay_price,
					// id: that.id
					}
				});
      },
      demandCourier(){//物流信息
        Owner.demandCourier({order_id: this.id}).then(res => {
          if(res.code === 1) {
						this.courierList = res.data.data;
          }else {
            // mui.toast(res.msg)
          }
        })
			},
  }};
</script>
<style lang="less" scoped>
@import "~link-less";
.page {
    margin-top: -80px;
    padding-bottom: 100px;
    background-color: #F4F4F4;
    .body {
      .card-root-c {
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
      .info-wrap {
        margin-top: 20px;
        font-size: 30px;
        .info-list {
          .display-flex();
          justify-content: space-between;
          padding: 0 32px;
          height: 95px;
          line-height: 95px;
          border-bottom: 1px solid #F4F4F4;
          background: #fff;
          &:last-child {
            border: none;
          }
          .express-price {
            color: #999;
            font-size: 26px;
          }
          .price {
            font-size: 26px;
            color: #FF3B30;
          }
        }
      }
      .title {
        padding: 30px 32px 10px 32px;
        font-size: 34px;
        color: #333;
        font-weight: 600;
      }
      .courier-list {
        padding: 15px 32px;
        font-size: 26px;
        color: #FF3B30;
      }

    }
    .submit {
      /deep/  .van-submit-bar__bar {
        justify-content: center;
      }
      /deep/  .van-submit-bar__text {
        flex: none;
      }
      /deep/  .van-button--default {
        color: #fff;
      }
      /deep/  .van-button{
        margin-left: 30px;
        height: 68px;
        line-height: 68px;
        width: 300px;
        background: #00A2EA;
        border: none;
        border-radius:44px;
      }
    }
}
</style>

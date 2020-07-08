<template>
  <div class="page">
    <m-header title="商品订单" :canback="Boolean(1)" :setback="Boolean(1)" @back=back></m-header>
    <div class="body">
		<van-tabs v-model="active " class="tab-margin"  @change="OnChange">
            <van-tab title="全部订单" class="wrap">
            <div class="list" v-for="(item, idx) in OrderList" :key="idx">
                <div class="list-title">
                    <span class="order-no">订单编号：{{item.order_no}}</span>
                    <span  class="showText">{{item.showText}}</span>
                </div>
                <div class="middle" v-for="(goodsitem, key) in item.goods" :key="key">
                    <img :src="api+goodsitem.images.split(',')[0]" class="list-img" />
                    <div class="middle-right">
                        <div class="list-name">
                            {{goodsitem.goods_name}}
                        </div>
                        <div class="list-name">
                            {{goodsitem.goods_attr}}
                        </div>
                        <div class="list-title"><span class="price">￥{{goodsitem.goods_price}}</span><span class="total-num">x{{goodsitem.total_num}}</span></div>
                        <button type="button" class="list-btn" @click="goTo2('ReceivingRefund',item.id,key)" 
                        v-if="item.pay_status == '20' && (item.freight_status == '10'||item.freight_status == '20') && item.order_status == '10' && item.receipt_status == '10'&&goodsitem.status == 0">申请退款</button>
                        <!-- <button type="button" class="list-btn" @click="goTo2('AfterSale',item.id,key)"  -->
                        <!-- v-if="item.pay_status == '20' && item.freight_status == '20' && item.order_status == '10' && item.receipt_status == '10'&&goodsitem.status !=0">售后</button> -->
                    </div>
                </div>
                <div class="talPrice">
                    <span>合计：<span style="color:#FA3844">￥{{item.total_price}}</span></span>
                    <span style="color:#666"> 数量：{{item.goods.length}}</span>
                    <span v-if="item.showactive !=1">实际支付：<span style="color:#FA3844">￥{{item.pay_price}}</span></span>
                </div>
                <div class="talPrice" 
                v-if="item.reject_reason&&item.pay_status == '20' && item.freight_status == '10' && item.order_status == '10' && item.receipt_status == '10'">
                    拒绝退款理由：{{item.reject_reason}}
                </div>
                <div class="btn-wrap">
                    <button type="button" class="list-btn list-btn-cancel" v-if="item.pay_status == '10' && item.freight_status == '10' && item.order_status == '10' && item.receipt_status == '10'" @click="TapCancel(item.id,'danger')">取消订单</button>
                    <!-- <button type="button" class="list-btn" v-if="(item.pay_status == '20' && item.freight_status == '10' && item.order_status == '10' && item.receipt_status == '10')" @click="goTo('AdressList',item.id)">更换地址</button> -->

                    <button type="button" class="list-btn list-btn-cancel" v-if="(item.pay_status == '20' && item.freight_status == '10' && item.order_status == '10' && item.receipt_status == '10')&&item.order_type!=4" @click="TapCancel(item.id,'success')">申请退款</button>
                    <button type="button" class="list-btn list-btn-cancel" v-if="item.order_status == '20'">已取消</button>
                    <button type="button" class="list-btn" @click="goTo('OrderDetail',item.id)">查看详情</button>
                </div>
                </div>
            </van-tab>

            <van-tab title="未付款" class="wrap">
            <div class="list" v-for="(item, idx) in OrderList" :key="idx" v-show="item.showType=='danger'">
                <div class="list-title">
                    <span class="order-no">订单编号：{{item.order_no}}</span>
                    <span class="showText">{{item.showText}}</span>
                </div>
                <div class="middle" v-for="(goodsitem, key) in item.goods" :key="key">
                    <img :src="api+goodsitem.images.split(',')[0]" class="list-img" />
                    <div class="middle-right">
                    <div class="list-name">
                        {{goodsitem.goods_name}}
                    </div>
                    <div class="list-name">
                        {{goodsitem.goods_attr}}
                    </div>
                    <div class="list-title"><span class="price">￥{{goodsitem.goods_price}}</span><span class="total-num">x{{goodsitem.total_num}}</span></div>
                    </div>
                </div>
                <div class="talPrice reject">
                    <span>合计：<span style="color:#FA3844">￥{{item.total_price}}</span></span>
                    <span style="color:#666"> 数量：{{item.goods.length}}</span>
                    <!-- <span>实际支付：<span style="color:#FA3844">￥{{item.pay_price}}</span></span> -->
                </div>
                <div class="btn-wrap">
                    <button type="button" class="list-btn list-btn-cancel" @click="TapCancel(item.id,'danger')">取消订单</button>
                    <button type="button" class="list-btn" @click="goTo('OrderDetail',item.id)">查看详情</button>
                </div>
            </div>
            </van-tab>

            <van-tab title="待发货" class="wrap">
            <div class="list" v-for="(item, idx) in OrderList" :key="idx" v-show="item.showType=='success'">
                <div class="list-title">
                    <span class="order-no">订单编号：{{item.order_no}}</span>
                    <span class="showText">{{item.showText}}</span>
                </div>
                <div class="middle" v-for="(goodsitem, key) in item.goods" :key="key">
                    <img :src="api+goodsitem.images.split(',')[0]" class="list-img" />
                    <div class="middle-right">
                    <div class="list-name">
                        {{goodsitem.goods_name}}
                    </div>
                    <div class="list-name">
                        {{goodsitem.goods_attr}}
                    </div>
                    <div class="list-title"><span class="price">￥{{goodsitem.goods_price}}</span><span class="total-num">x{{goodsitem.total_num}}</span></div>
                    </div>
                </div>
                <div class="talPrice">
                    <span>合计：<span style="color:#FA3844">￥{{item.total_price}}</span></span>
                    <span style="color:#666"> 数量：{{item.goods.length}}</span>
                    <span>实际支付：<span style="color:#FA3844">￥{{item.pay_price}}</span></span>
                </div>
                <div class="talPrice reject" v-if="item.reject_reason">
                    拒绝退款理由：{{item.reject_reason}}
                </div>
                <div class="btn-wrap">
                    <!-- <button type="button" class="list-btn" @click="goTo('AdressList',item.id)">更换地址</button> -->
                    <button type="button" class="list-btn list-btn-cancel" v-if="item.order_type!=4" @click="TapCancel(item.id,'success')">申请退款</button>
                    <button type="button" class="list-btn" @click="goTo('OrderDetail',item.id)">查看详情</button>
                </div>
            </div>
            </van-tab>

            <van-tab title="待收货" class="wrap">
            <div class="list" v-for="(item, idx) in OrderList" :key="idx" v-show="item.showType=='primary'">
                <div class="list-title">
                    <span class="order-no">订单编号：{{item.order_no}}</span>
                    <span class="showText">{{item.showText}}</span>
                </div>
                <div class="middle" v-for="(goodsitem, key) in item.goods" :key="key">
                    <img :src="api+goodsitem.images.split(',')[0]" class="list-img" />
                    <div class="middle-right">
                        <div class="list-name">
                            {{goodsitem.goods_name}}
                        </div>
                        <div class="list-name">
                            {{goodsitem.goods_attr}}
                        </div>
                        <div class="list-title"><span class="price">￥{{goodsitem.goods_price}}</span><span class="total-num">x{{goodsitem.total_num}}</span></div>
                        <button type="button" class="list-btn" @click="goTo2('ReceivingRefund',item.id,key)" v-if="goodsitem.status == 0">申请退款</button>
                        <!-- <button type="button" class="list-btn" @click="goTo2('AfterSale',item.id,key)" v-if="goodsitem.status !=0">售后</button> -->
                    </div>
                </div>
                <div class="talPrice">
                    <span>合计：<span style="color:#FA3844">￥{{item.total_price}}</span></span>
                    <span style="color:#666"> 数量：{{item.goods.length}}</span>
                    <span>实际支付：<span style="color:#FA3844">￥{{item.pay_price}}</span></span>
                </div>
                <div class="talPrice reject" v-if="item.reject_reason">
                    拒绝退款理由：{{item.reject_reason}}
                </div>
                <div class="btn-wrap">
                    <button type="button" class="list-btn" @click="goTo('OrderDetail',item.id)">查看详情</button>
                </div>
            </div>

            </van-tab>
            <van-tab title="已完成" class="wrap">
                <div class="list" v-for="(item, idx) in OrderList" :key="idx" v-show="item.showType=='end'">
                    <div class="list-title">
                        <span class="order-no">订单编号：{{item.order_no}}</span>
                        <span class="showText">{{item.showText}}</span>
                    </div>
                    <div class="middle" v-for="(goodsitem, key) in item.goods" :key="key">
                        <img :src="api+goodsitem.images.split(',')[0]" class="list-img" />
                        <div class="middle-right">
                        <div class="list-name">
                            {{goodsitem.goods_name}}
                        </div>
                        <div class="list-name">
                            {{goodsitem.goods_attr}}
                        </div>
                        <div class="list-title"><span class="price">￥{{goodsitem.goods_price}}</span><span class="total-num">x{{goodsitem.total_num}}</span></div>
                        </div>
                    </div>
                    <div class="talPrice">
                        <span>合计：<span style="color:#FA3844">￥{{item.total_price}}</span></span>
                        <span style="color:#666"> 数量：{{item.goods.length}}</span>
                        <span>实际支付：<span style="color:#FA3844">￥{{item.pay_price}}</span></span>
                    </div>
                    <div class="btn-wrap">
                        <button type="button" class="list-btn" @click="goTo('OrderDetail',item.id)">查看详情</button>
                    </div>
                </div>
            </van-tab>
            <van-tab title="已取消" class="wrap">
                <div class="list" v-for="(item, idx) in OrderList" :key="idx" v-show="item.showType=='cancel'">
                    <div class="list-title">
                        <span class="order-no">订单编号：{{item.order_no}}</span>
                        <span class="showText">{{item.showText}}</span>
                    </div>
                    <div class="middle" v-for="(goodsitem, key) in item.goods" :key="key">
                        <img :src="api+goodsitem.images.split(',')[0]" class="list-img" />
                        <div class="middle-right">
                        <div class="list-name">
                            {{goodsitem.goods_name}}
                        </div>
                        <div class="list-name">
                            {{goodsitem.goods_attr}}
                        </div>
                        <div class="list-title"><span class="price">￥{{goodsitem.goods_price}}</span><span class="total-num">x{{goodsitem.total_num}}</span></div>
                        </div>
                    </div>
                    <div class="talPrice">
                        <span >合计：<span style="color:#FA3844">￥{{item.total_price}}</span></span>
                        <span style="color:#666"> 数量：{{item.goods.length}}</span>
                        <span >实际支付：<span style="color:#FA3844">￥{{item.pay_price}}</span></span>
                    </div>
                    <div class="btn-wrap">
                        <button type="button" class="list-btn" @click="goTo('OrderDetail',item.id)">查看详情</button>
                    </div>
                </div>
            </van-tab>
            <van-tab title="退换货" class="wrap">
                <div class="list" v-for="(item, idx) in OrderList" :key="idx" v-show="item.showType=='reAndEx'">
                    <div class="list-title">
                        <span class="order-no">订单编号：{{item.order_no}}</span>
                        <span class="showText">{{item.showText}}</span>
                    </div>
                    <div class="middle" v-for="(goodsitem, key) in item.goods" :key="key">
                        <img :src="api+goodsitem.images.split(',')[0]" class="list-img" />
                        <div class="middle-right">
                        <div class="list-name">
                            {{goodsitem.goods_name}}
                        </div>
                        <div class="list-name">
                            {{goodsitem.goods_attr}}
                        </div>
                        <div class="list-title"><span class="price">￥{{goodsitem.goods_price}}</span><span class="total-num">x{{goodsitem.total_num}}</span></div>
                        </div>
                    </div>
                    <div class="talPrice">
                        <span >合计：<span style="color:#FA3844">￥{{item.total_price}}</span></span>
                        <span style="color:#666"> 数量：{{item.goods.length}}</span>
                        <span >实际支付：<span style="color:#FA3844">￥{{item.pay_price}}</span></span>
                    </div>
                    <div class="btn-wrap">
                        <button type="button" class="list-btn list-btn-cancel" @click="cancelEx(item.order_no,item.is_cancel)">{{item.is_cancel == 1?'取消换货':'取消退款'}}</button>
                        <button type="button" class="list-btn" @click="goTo('OrderDetail',item.id)">查看详情</button>
                    </div>
                </div>
            </van-tab>
        </van-tabs>
        <div v-if="isNoData" class="liteshop-notcont">
            <span class="cont">订单空空如也</span>
        </div>
    </div>
    <transition name="page-move">
        <router-view class="cube-view"></router-view>
    </transition>
  </div>
</template>
<script>
import Vue from 'vue';
import { Tab, Tabs, Dialog } from 'vant';
Vue.use(Tabs).use(Tab).use(Dialog)
import { Owner } from "@/server/server.js";
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
        OrderList:[],
        active:this.$route.query.showType,
        isNoData:true,
        gcfg:[],
        order_type: 1,//商品分开 普通和升级1 拼团2 秒杀3 
    };
  },
  computed: {
    ...mapGetters(["api"])  
  },
  watch: {
    $route(to,from) {
    if(to.path=='/myorder' && from.path=='/myOrder/orderDetail'){
        this.get_my_order();
    }
  },  
  },
  created() {
    if(this.$route.query.order_type) {
        // console.log(this.$route.query.order_type,"qqq")
        this.order_type = this.$route.query.order_type;
    }
    this.get_my_order();
  },
  methods: {
    back() {
        this.$router.push({name:"My"});
    },
    goTo(name,id) {
        this.$router.push({name,query:{id}});
    },
    goTo2(name,id,key) {
        this.$router.push({name,query:{id,key}});
    },
    get_my_order(){
        Owner.myOrder({order_type:this.order_type}).then(res => {
            if(res.code === 1) {
                this.handleOrder(res.data)
            }else {
                mui.toast(res.msg)
            }
        })
    },
    handleOrder(result) {
        //这里对状态 进行分类
        result.forEach(function(item, index, arr){
            if (item.pay_status == "20" && item.freight_status == "10" && item.order_status == "10" && item.receipt_status == "10" ){
                arr[index].showText="待发货";
                arr[index].showType ="success";
                arr[index].showactive = 2;
            }
            if (item.pay_status == "20" && item.freight_status == "20" && item.order_status == "10" && item.receipt_status == "10"){
                arr[index].showText = "待收货";
                arr[index].showType = "primary";
                arr[index].showactive = 3;
                
            }
            if (item.pay_status == "10" && item.freight_status == "10" && item.order_status == "10" && item.receipt_status == "10") {
                arr[index].showText = "待付款";
                arr[index].showType = "danger";
                arr[index].showactive = 1;
                
            }
            if (item.pay_status == "20" && item.freight_status == "20" && item.order_status == "30" && item.receipt_status == "20") {
                arr[index].showText = "已完成";
                arr[index].showType = "end";
                arr[index].showactive = 4;
            }
            if (item.order_status == "20") {
                arr[index].showText = "已取消";
                arr[index].showType = "cancel";
                arr[index].showactive = 5;
            }
            if (item.is_cancel == "1" || item.is_cancel == "2") {
                arr[index].showText = "退换货";
                arr[index].showType = "reAndEx";
                arr[index].showactive = 6;
            }
        });
        
        this.OrderList = result;
        this.check_is_noData();
    },
    TapCancel(id,type) {//取消订单
        Dialog.confirm({
            title: '提示',
            message: type == 'danger'?'确认取消订单？':'确定申请退款和取消订单？',
            confirmButtonColor: "#00A2EA"
        }).then(() => {
            Owner.orderCancel({id}).then(res => {
                mui.toast(res.msg);
                this.get_my_order();
            })
        })
    },
    cancelEx(order_no,type) {//取消换货或退款
        Dialog.confirm({
            title: '提示',
            message: type == 1?'确认取消换货？':'确认取消退款？',
            confirmButtonColor: "#00A2EA"
        }).then(() => {
            Owner.cancelSale({order_no}).then(res => {
                mui.toast(res.msg);
                this.get_my_order();
            })
        })
    },
    check_is_noData(){
        let that = this;
        var isnodata = true;
        that.OrderList.forEach(function (item, index, arr) {
            if (that.active == 0) {
            isnodata = false
            } else {
            if (item.showactive == that.active ) {
                isnodata = false
            }
            }
        });
        that.isNoData = isnodata
    },
    OnChange(){
        let that = this;
        that.check_is_noData();
    }
  }};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
//   padding: @margin-primary;
  background-color: #F4F4F4;
    /deep/  .van-tab{
        color: #666;
    }
  .tab-margin {
    /deep/  .van-tabs__line {
        background: #00A2EA;
    }
    /deep/  .van-tab--active {
        color: #00A2EA;
    }
    .wrap {
    // margin: 20px;
    padding: 0 20px;
    font-size: 24px;

    .list {
        margin-top: 28px;
        padding: 15px;
        background: #fff;
        border-radius: 10px;
        // border-bottom: 2px solid #ebedf0;
        .list-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .order-no {
                color: #999;
            }
            .showText {
                color: #FF3B30;
            }
        }
        .middle {
            margin: 8px 0;
            padding: 8px 0;
            display: flex;
            border-top: 1px solid #ebedf0;
            border-bottom: 1px solid #ebedf0;
            .list-img {
                width: 140px;
                height: 140px;
                margin-right: 8px;
            }
            .middle-right {
                flex: 1;
                text-align: right;
                .list-name {
                    padding: 3px 0;
                    text-align: left;
                    color: #000;
                    font-size: 28px;
                }
                .list-title {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    .total-num {
                        color: #999;
                    }
                }
                .talPrice {
                    margin-top: 8px;
                }
                .list-btn {
                    height: 58px;
                    margin: 0 5px;
                    padding: 0 30px;
                    background: #fff;
                    border: 1px solid #999;
                    border-radius: 50px;
                    color: #999;
                    font-size: 28px;
                }
            }
        }
        .talPrice {
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
            font-size: 26px;
            color: #666;
        }
        .reject {
            font-size: 30px;
            color: red;
        }
        .btn-wrap {
            padding: 10px 0 ;
            text-align: right;
            .list-btn {
                height: 58px;
                margin: 0 5px;
                padding: 0 30px;
                border-radius: 50px;
                border: 1px solid #00A2EA;
                color: #00A2EA;
                font-size: 28px;
            }
            .list-btn-cancel {
                background: #fff;
                border: 1px solid #999;
                color: #999;
            }
        }
    }
    }
  }
  .liteshop-notcont {
      margin-top: 50%;
      color: #00A2EA;
      text-align: center;
  }
}
  .page-move-enter, .page-move-leave-active {
    transform: translateX(5px);
    opacity: 0;
  }
  .page-move-enter-active, .page-move-leave-active {
    transition: all .3s ease;
  }
</style>
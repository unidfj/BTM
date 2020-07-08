<template>
  <div class="page">
    <m-header title="订单确认" :canback="Boolean(1)"></m-header>
    <div class="body">
      <ul class="info-wrap">
        <li class="info-list">
          <span>订单编号：</span>
          <span class="price">{{ordersn}}</span>
        </li>
        <li class="info-list">
          <span>订单金额：</span>
          <span class="express-price">￥{{pay_price}}</span>
        </li>
      </ul>
      <ul class="pay-wrap">
          <li class="pay-list" @click="yuepay">
              <div class="left">
                  <img src="../../assets/images/btm/ico_ye.png" class="pay-img">
                  <div>
                      <div>余额</div>
                      <div class="current">当前余额：<span class="current-money">￥{{user.credit1}}</span></div>
                  </div>
              </div>
              <i class="iconfont iconright"></i>
          </li>
          <li class="pay-list"  @click="appPay('alipay')" v-if="isApp&&!isWx">
              <div class="left">
                  <img src="../../assets/images/btm/ico_zfb.png" class="pay-img">
                  <div>
                      <div>支付宝</div>
                  </div>
              </div>
              <i class="iconfont iconright"></i>
          </li>
          <li class="pay-list" @click="appPay('wxpay')" v-if="isApp">
              <div class="left">
                  <img src="../../assets/images/btm/ico_wx.png" class="pay-img">
                  <div>
                      <div>微信</div>
                  </div>
              </div>
              <i class="iconfont iconright"></i>
          </li>
          <li class="pay-list" @click="wxGzhPay" v-if="isWx">
              <div class="left">
                  <img src="../../assets/images/btm/ico_wx.png" class="pay-img">
                  <div>
                      <div>微信</div>
                  </div>
              </div>
              <i class="iconfont iconright"></i>
          </li>
      </ul>
    </div>
    <m-pwd ref="pwd" @pay="pay"></m-pwd>

  </div>
</template>
<script>
import { Owner,Index } from "@/server/server.js";
import mPwd from "@/components/pwd-alert";
import {AppPay} from "@/assets/commonjs/utils.js";

export default {
  data() {
    return {
        formData: {
          order_no: null,
          paypwd: null
          // id: null,
          // paypwd: null,
          // type: null,
        },
        orderid: null,
        ordersn: null,
        pay_price: null,
        user:{},
        isApp: false,
        isWx: false,
        aliPayLink: null,
    };
  },
  components: {
    mPwd
  },

  created() {
    try{
      if(plus){
        AppPay.init();
        this.isApp = true;
        console.log('has plus')
      }
    }catch(e){
      console.log('no plus')
    }
    this.orderid = this.$route.query.orderid;//订单id
    this.ordersn = this.$route.query.ordersn;//订单好
    this.pay_price = this.$route.query.pay_price;//订单金额
    this.formData.order_no = this.ordersn;
    this.getmy();
    if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) =='micromessenger') {
			//检测是否是微信环境
			this.isWx = true
		}
  },
  methods: {
    getmy() {//获取余额
      Owner.getmy().then(res => {
        console.log(res);
        this.user = res.data.data;
      });
    },
    wxGzhPay() {
      Index.wechatPay2({order_no:this.ordersn}).then(res => {
        // if(res.code == 1) {
            console.log(res)
            var vm = this;
            if (typeof WeixinJSBridge == "undefined") {
              //微信浏览器内置对象。参考微信官方文档
              vm.$toast("请使用微信打开");
              if (document.addEventListener) {
                document.addEventListener(
                  "WeixinJSBridgeReady",
                  vm.onBridgeReady(res),
                  false
                );
              } else if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", vm.onBridgeReady(res));
                document.attachEvent("onWeixinJSBridgeReady", vm.onBridgeReady(res));
              }
            } else {
              vm.onBridgeReady(res);
            }
        // }else {
        //   mui.toast(res.msg)
        // } 
      })
    },
    onBridgeReady(data) {
      var vm = this;
      console.log(data,'data')
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: data.appId,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          timeStamp: data.timeStamp
        },
        function(res) {
          console.log(res,111111);
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            mui.toast('支付成功！');
            vm.$router.push({name:"MyOrder"});
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            mui.toast('您取消了支付');
          } else if (res.err_msg == "get_brand_wcpay_request:fail") {
            mui.toast('支付失败');
          }
          // if (res.err_msg == "get_brand_wcpay_request:ok") {
          //   vm.$toast("恭喜，支付成功");
          //   vm.$router.push({ name: "ServicePackage" });
          // } else {
          //   vm.$toast("未支付或支付失败");
          // }
          // vm.$router.go(0);
        }
      );
    },
    /**
     * 支付宝网页支付
     */
    aliWebPay() {
      this.aliPayLink = this.api+"/addons/litestore/api.order/alipay_pay2?order_no="+this.formData.order_no+'&token='+localStorage.getItem('cookie');
      // this.aliPayLink = 'https://www.baidu.com'
    },
    /**
     * app支付
    */
    appPay(id){
      let that = this;
      // console.log('id',id)
      try{
        if(plus) AppPay.pay(id,that.formData.order_no,()=> {
          that.$router.push({name:"MyOrder"});
        })
      }catch(e){}
    },
    /**
     * 余额支付
     */
    yuepay() {
      this.$refs.pwd.open();
    },
    pay(pwd) {
      this.formData.paypwd = pwd;
      Index.yuepay(this.formData).then(res => {
        mui.toast(res.msg)
        if(res.code === 1) {
          this.$router.push({name:"MyOrder"});
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  //   padding: @margin-primary;
  background-color: #F4F4F4;
  font-size: 30px;
  color: #333;

  .info-wrap {
    .info-list {
      .display-flex();
      justify-content: space-between;
      padding: 0 32px;
      height: 95px;
      line-height: 95px;
      border-bottom: 1px solid #f4f4f4;
      background: #fff;
      &:last-child {
        border: none;
      }
      .express-price {
        color: #ff3b30;
        font-size: 26px;
      }
      .price {
        font-size: 26px;
        color: #999;
      }
    }
  }
  .pay-wrap {
      margin-top: 25px;
      .pay-list {
        .display-flex();
        justify-content: space-between;
        align-items: center;
        height: 100px;
        padding: 0 32px;
        border-bottom: 1px solid #f4f4f4;
        background: #fff;
        font-size: 28px;
        .left {
            .display-flex();
            align-items: center;
            .pay-img {
                width: 48px;
                height: 48px;
                margin-right: 20px;
            }
            .current {
                font-size: 22px;
                color: #999;
                .current-money {
                    color: #FF3B30;
                }
            }
        }
      }
  }
}
</style>
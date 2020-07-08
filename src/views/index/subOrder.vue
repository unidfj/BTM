<template>
  <div class="page">
    <m-header title="订单确认" :canback="Boolean(1)"></m-header>
    <div class="body">
      <ul class="adderss-wrap" >
        <li class="list" v-if="address">
          <div>
            <span>{{address.name}}</span>
            <span class="mobile">{{address.phone}}</span>
          </div>
          <div>{{address?Object.values(address.Area).join('')+address.detail:''}}</div>
        </li>
        <li :class="{'list':true,'list2':!address}" >
          <button class="btn" @click="goTo('Address')">{{address?'更换收货地址':'添加收货地址'}}</button>
        </li>
      </ul>
      <div class="card-root-c" v-for="(item, idx) in goods_list" :key="idx">
          <div v-if="item.show_error != 0" class="goods_err_div">{{item.show_error_text}}</div>
          <div class="goods-info">
            <img :src="api+item.images.split(',')[0]" class="goods-img">
            <div class="goods-right">
              <div class="name">{{item.goods_name}}</div>
              <div class="desc">{{item.goods_sku.goods_attr ? item.goods_sku.goods_attr :'默认规格'}}</div>
              <div class="desc">数量：{{item.total_num}}</div>
              <div class="goods-price">￥{{item.goods_price}}</div>
            </div>
          </div>
      </div>
      <ul class="info-wrap">
        <li class="info-list">
          <span>商品数总计：</span>
          <span class="express-price">x{{order_total_num}}</span>
        </li>
        <li class="info-list">
          <span>商品价格总计：</span>
          <span class="express-price price">￥{{order_total_price}}</span>
        </li>
        <li class="info-list">
          <span>快递费用：</span>
          <span class="express-price">{{express_price==0 ? '免邮费或未查询到运费' : '＋￥' + express_price}}</span>
        </li>
        <li class="info-list" v-if="goods_type ==1||goods_type ==6">
          <span>商家优惠：</span>
          <span class="express-price price">-￥{{infoData.reduce_price}}</span>
        </li>
        <li class="info-list">
          <span>备注：</span>
          <input type="text" class="note-inp" placeholder="备注信息" v-model="note">
        </li>
        <!-- 只有goods_type为3或goods_type为4且isCloud不存在时显示 -->
        <li class="info-list" v-if="goods_type == 3 || (goods_type ==4&& !$route.query.isCloud)">
          <span>优惠券抵扣：</span>
          <input type="number" class="note-inp" placeholder="请输入抵扣数量" @input="changeScore($event)" v-model="score">
        </li>
      </ul>
      <!-- goods_type == 2且isfirst为false时可使用优惠 -->
      <div class="other" v-if="!infoData.isfirst">
        <div class="other-list" v-if="goods_type == 2" @click="channgeDiscount()">
          <i class="iconfont iconradio-checked" v-if="useDiscount==1" ></i>
          <i class="iconfont icondanxuanweixuanzhong" v-else></i>
          <span>使用折扣</span>
        </div>
      </div>
      <div class="tips" v-if="goods_type == 3 || (goods_type ==4&& !$route.query.isCloud)">提示：本月还可以使用的最大优惠券金额：{{max_score}}</div>
      <div class="other" v-if="infoData.has_share_change||infoData.has_week_change">
        <div class="title">其他：</div>
        <div class="other-list" v-if="infoData.has_share_change" @click="channgeType(1)">
          <i class="iconfont iconradio-checked" v-if="lingType==1" ></i>
          <i class="iconfont icondanxuanweixuanzhong" v-else></i>
          <span>使用免费领取机会</span>
        </div>
        <div class="other-list" v-if="infoData.has_week_change" @click="channgeType(2)">
          <i class="iconfont iconradio-checked" v-if="lingType==2" ></i>
          <i class="iconfont icondanxuanweixuanzhong" v-else></i>
          <span>付运费领取</span>
        </div>
      </div>
      <div class="bot">
        <span class="pay">实际支付：<span class="pay-price">￥{{order_pay_price}}</span></span>
        <button class="btn" @click="getBuyNowdata('buySub')" :disabled='canClick'>提交订单</button>
      </div>
    </div>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Index,Cart } from "@/server/server.js";
import {Util,Load,Secret} from '@/assets/commonjs/utils.js';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      forpagedata:{},
      type: null,
      infoData:{},//全部信息
      goods_list: [], // 商品列表
      goods_type: null,//商品类型 //1 为 0元区商品 2 为升级类商品 4 为云仓商品 6为vip兑换商品 这几类不加入购物车；3 为实体类商品 需要加入购物车
      order_total_num: 0,
      order_total_price: 0,

      express_price:0,
      order_pay_price:0,
      max_score:0,//本月可使用优惠劵的最大金额
      score: null,//输入的优惠劵金额

      address:null,
      disabled: false,

      has_error:false,
      error_msg:"",
    
      information: null,//购物车进来生成订单传的数据
      note: null,//备注
      // otherIndex: 1,
      lingType: 3,//0元商品选择的邮费方式 免费领取1 每周付费领取2
      time: null,
      canClick: false,
      // discount: 0,//升级类商品是否使用折扣 0 不使用打折 1 使用打折
      useDiscount: 0 //升级类商品是否使用折扣 0 不使用打折 1 使用打折

    };
  },
  computed: {
    ...mapGetters(['api'])
  },
  watch: {
    'score'(nval) {
      
      if(this.time) {
        clearTimeout(this.time)
      }
      this.time = setTimeout(() => {
        if(nval>this.max_score) {
          this.score=this.max_score;
          // mui.toast('本月还可使用最大优惠券金额为'+this.max_score);
        }else if(nval < 0) {
          this.score=0;
        }
        this.canClick = true;
        this.getBuyNowdata('buyNow');
        }, 500);
      }
  },
  mounted() {
    this.initData();
    if(this.type == 'cart') {
      this.getcartLists();//购物车进来
    }else {// 商品列表进来
      this.getBuyNowdata('buyNow');
    }
  },
  methods: {
    initData() {
      this.type = this.$route.query.type
			this.forpagedata.goods_id = this.$route.query.goods_id
			this.forpagedata.goods_num = this.$route.query.goods_num
			this.forpagedata.goods_sku_id = this.$route.query.goods_sku_id || ""
			this.goods_type = this.$route.query.goods_type
    },
    channgeDiscount() {//折扣选择
      if(this.useDiscount == 1) {
        this.useDiscount = 0;
      }else {
        this.useDiscount =1;
      }
      this.buyNow2();
    },
    goTo(name) {
      this.$router.push({name})
    },
    changeScore(e) {
      // console.log(e.target.value>this.max_score)
      return 
    },
    channgeType(num) {//运费选择
      this.lingType = num;
      this.forpagedata.type = num;  
      this.buyNow();
      // if(num == 1) {
      //   if(!this.infoData.has_week_change) {
          
      //   }
      // }
      // if(!this.infoData.has_share_change&&this.infoData.has_week_change) {
      //   this.lingType = 2;
      // }
    },
    /**
     * 计算立即购买后的有邮费等信息 1 为 0元区商品 2 为升级类商品 3 为实体类商品 4 为云仓商品 
     */
    getBuyNowdata(type) {
      switch (Number(this.goods_type)) {
        case 1:
          if(type === 'buyNow') {
            this.forpagedata.type = 0;
            this.buyNow();
          }else {
            if((this.infoData.has_share_change||this.infoData.has_week_change)&& this.forpagedata.type == 0) {
              return mui.toast('请选择领取方式')
            }
            this.buyPay();
          }
          break;
        case 2:
          if(type === 'buyNow') {
            this.buyNow2();
          }else {
            this.buyPay2();
          }
          break;
        case 3:
          if(type === 'buyNow') {
            this.buyNow3();
          }else {
            if(this.type == 'cart') {//购物车进来的调用cartPay生成订单
              this.cartPay();
            }else {
              this.buyPay3();
            }
          }
          break;
        case 4:
          if(!this.$route.query.isCloud) {//云仓商品订单
            if(type === 'buyNow') {
              this.buyNow4();
            }else {
              this.buyPay4();
            }
          }else {
            if(type === 'buyNow') {//云仓自提商品订单, 自提订单全部为云仓商品
              this.buyNow5();
            }else {
              this.buyPay5();
            }
          }
          break;
        case 6:
          if(type === 'buyNow') {
            this.buyNow6();
          }else {
            this.buyPay6();
          }
          break;
        break;
      }
    },
    // 购物车列表
    getcartLists(){
      Cart.getlists().then(res=>{
        if(res.code==1){
          this.handleData(res);
        }else{
          mui.toast(res.msg)
        }
      })
    },
    buyPay() {
      Load.loadStart(this);
      this.forpagedata.note = this.note;
      this.forpagedata.type = this.lingType;
      console.log(this.forpagedata)
      Index.buyNowPay(this.forpagedata).then(res => {
        Load.loadEnd(this);
        this.handlePayData(res)
      })
    },
    buyPay2() {
      Load.loadStart(this);
      this.forpagedata.note = this.note;
      this.forpagedata.discount = this.useDiscount;
      console.log(this.forpagedata)
      Index.buyNowPay2(this.forpagedata).then(res => {
        Load.loadEnd(this);
        this.handlePayData(res)
      })
    },
    buyPay3() {
       if(this.order_pay_price < 0) {
          return  mui.toast('请输入正确的优惠券金额');
       }
      Load.loadStart(this);
      //实体或云仓商品需要传score
      this.forpagedata.score = this.score || 0;
      this.forpagedata.note = this.note;
      console.log(this.forpagedata)
      Index.buyNowPay3(this.forpagedata).then(res => {
        Load.loadEnd(this);
        this.handlePayData(res)
      })
    },
    buyPay4() {
       if(this.order_pay_price < 0) {
          return  mui.toast('请输入正确的优惠券金额');
       }
      Load.loadStart(this);
      //实体或云仓商品需要传score
      this.forpagedata.score = this.score || 0;
      this.forpagedata.note = this.note;
      Index.buyNowPay4(this.forpagedata).then(res => {
        Load.loadEnd(this);
        this.handlePayData(res)
      })
    },
    buyPay5() {
      console.log(this.forpagedata)
      Load.loadStart(this);
      this.forpagedata.note = this.note;
      Index.buyNowPay5(this.forpagedata).then(res => {
        Load.loadEnd(this);
        this.handlePayData(res)
      })
    },
    buyPay6() {
      console.log(this.forpagedata)
      Load.loadStart(this);
      this.forpagedata.note = this.note;
      Index.buyNowPay6(this.forpagedata).then(res => {
        Load.loadEnd(this);
        this.handlePayData(res)
      })
    },
    cartPay() {//购物车进来提交订单时调用
      console.log(this.information)
      this.information.score = this.score;
      this.information.note = this.note;
      Index.cartPay(this.information).then(res => {
        if(res.code == 1) {
          this.handlePayData(res)
        }else {
          mui.toast(res.msg)
        }
      })
    },
    handlePayData(res) {
      if(res.code === 1) {
        // if(this.type != 'cart') {//购物车进来获取到的数据不需要解密
          res.data = JSON.parse(Secret.decrypt(res.data));
        // }
        if(res.data.pay_price == 0) {//返回的支付金额为0的话 直接跳订单列表页 不用去支付了
          this.$router.push({name:'MyOrder'});
          return
        }
        this.$router.push({
          name: "Pay",
          query: {
            orderid: res.data.order_id,
            ordersn: res.data.order_no,
            pay_price: res.data.pay_price
          }
        });
      }else {
        mui.toast(res.msg);
      }
    },
    handleData(res) {
        if(this.type != 'cart') {//购物车进来获取到的数据不需要解密
          res.data = JSON.parse(Secret.decrypt(res.data));
        }
        console.log(res.data)
        this.infoData = res.data
        this.goods_list = res.data.goods_list
        this.order_total_num = res.data.order_total_num
        this.order_total_price = res.data.order_total_price
        this.max_score = res.data.max_score
        this.address = res.data.address
        this.express_price = res.data.express_price
        this.order_pay_price = res.data.order_pay_price


        this.has_error = res.data.has_error
        if(res.data.error_msg) {
          mui.toast(res.data.error_msg)
        }
        this.error_msg = res.data.error_msg

        this.information = res.data.info

        /**
         * 0元商品选择的邮费方式 免费领取1 每周付费领取2 has_share_change为false时将lingType置为2
         *  has_share_change和has_week_change都为false则不能购买商品
         * */ 
        // if(!this.infoData.has_share_change&&this.infoData.has_week_change) {
        //   this.lingType = 2;
        // }


        //提示下架的商品
        // if (res.data.error_msg) {
        //   mui.toast(res.data.error_msg);
        // }
    },

    buyNow() {
      Load.loadStart(this);
      console.log(this.forpagedata)
      Index.buyNow(this.forpagedata).then(res => {
        Load.loadEnd(this);
        if(res.code === 1) {
          this.handleData(res);
        }else {
          mui.toast(res.msg)
        }
      })
    },
    buyNow2() {
      Load.loadStart(this);
      this.forpagedata.discount = this.useDiscount;
      // console.log(this.forpagedata)
      Index.buyNow2(this.forpagedata).then(res => {
        Load.loadEnd(this);
        if(res.code === 1) {
          this.handleData(res);
        }else {
          mui.toast(res.msg)
        }
      })
    },
    buyNow3() {
      this.forpagedata.score = this.score || 0;
      console.log(this.forpagedata)
      Index.buyNow3(this.forpagedata).then(res => {
        this.canClick = false;
        if(res.code === 1) {
          this.handleData(res);
        }else {
          mui.toast(res.msg)
        }
      })
    },
    buyNow4() {
      this.forpagedata.score = this.score || 0;
      console.log(this.forpagedata)
      Index.buyNow4(this.forpagedata).then(res => {
        this.canClick = false;
        if(res.code === 1) {
          this.handleData(res);
        }else {
          mui.toast(res.msg)
        }
      })
    },
    buyNow5() {
      Index.buyNow5(this.forpagedata).then(res => {
        if(res.code === 1) {
          this.handleData(res);
        }else {
          mui.toast(res.msg)
        }
      })
    },
    buyNow6() {
      Index.buyNow6(this.forpagedata).then(res => {
        if(res.code === 1) {
          this.handleData(res);
        }else {
          mui.toast(res.msg)
        }
      })
    },
  }};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  // padding: @margin-primary;
  background-color: @bg-color;
  .adderss-wrap {
    padding: 30px;
    .display-flex();
    justify-content: space-between;
    align-items: center;
    background: #fff;
    font-size: 28px;
    color: #333;
    .list {
      &:last-child {
        // width: 228px;
        margin-left: 15px;
        text-align: center;
        .btn {
          width: 228px;
          height: 60px;
          line-height: 60px;
          background: #00A2EA;
          border-radius: 100px;
          font-size: 28px;
        }

      }
      .mobile {
        margin-left: 20px;
        font-size: 24px;
        color: #999;
      }
      .addrss {
        word-break: break-all;
      }
    }
    .list2 {
      flex: 1;
    }
  }
  .card-root-c {
    margin-top: 20px;
    background: #FFF;
    .goods_err_div {
      padding-top: 20px;
      font-size: 35px;
      text-align: center;
      color: red;
    }
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
        color: #FF3B30;
      }
      .note-inp {
        flex: 1;
        height: 100%;
        padding: 0;
        margin: 0;
        text-align: right;
        border: none;
        &::placeholder {
          color: #999;
          font-size: 26px;
        }
      }
    }
  }
  .tips {
    padding: 15px 32px;
    font-size: 26px;
    color: #FF3B30;
  }
  .other {
    padding: 20px 30px;
    .title {
      color: #333;
      font-weight: 600;
    }
    .other-list {
      margin-top: 15px;
      .iconradio-checked{
          margin-right: 10px;
          font-size: 38px;
          color: #00A2EA;
          background: #fff;
          border-radius: 100px;
      }
      .icondanxuanweixuanzhong {
          margin-right: 10px;
          font-size: 38px;
          color: #aaa;
          background: #fff;
          border-radius: 100px;
      }
    }
  }
  .bot {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    height: 88px;
    .display-flex();
    justify-content: space-around;
    align-items: center;
    background: #fff;
    font-size: 28px;
    .pay {
      color: #333;
      .pay-price {
        font-size: 32px;
        color: #FF3B30;
      }
    }
    .btn {
      width: 46%;
      height: 68px;
      line-height: 68px;
      color: #fff;
    }
  }
}
</style>
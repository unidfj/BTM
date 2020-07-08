<template>
  <div class="page">
    <m-header :title="type == '1'?'申请换货':'申请退款退货'" :canback="Boolean(1)"></m-header>
    <div class="body">
      <div class="card-root-c">
        <div class="goods-info" v-if="detail.goods">
          <img
            :src="detail.goods[key].spec.spec_image==''? detail.goods[key].image:detail.goods[key].sku_image"
            class="goods-img"
          />
          <div class="goods-right">
            <div class="name">{{detail.goods[key].goods_name}}</div>
            <div
              class="desc"
            >{{detail.goods[key].goods_attr ? detail.goods[key].goods_attr :'默认规格'}}</div>
            <div class="desc">数量：{{detail.goods[key].total_num}}</div>
            <div class="goods-price">￥{{detail.pay_price}}</div>
          </div>
        </div>
      </div>
      <ul class="wrap">
        <li class="list" @click="sel('status')">
          <span>货物状态</span>
          <div class="list-right">
            <span class="sel">{{refundstatusText}}</span>
            <i class="iconfont iconright"></i>
          </div>
        </li>
        <li class="list" @click="sel('reason')">
          <span>原因</span>
          <div class="list-right">
            <span class="sel">{{refundreasonText}}</span>
            <i class="iconfont iconright"></i>
          </div>
        </li>
      </ul>
      <div class="info-wrap">
        <div class="goods-num-wrap" v-if="type == '1'">
          <div>
            <div>商品件数</div>
            <div class="max" v-if="detail.goods">最多可换{{detail.goods[key].total_num}}件</div>
          </div>
          <div class="tmall-types" style="display: inline-flex;">
            <van-stepper
              disable-input
              integer
              v-model="formData.goodscount"
              :min="1"
              :max="detail.goods[key].total_num"
              v-if="detail.goods"
            />
          </div>
        </div>

        <div class="goods-num-wrap" v-if="type == '2'">
          <span>退款金额</span>
          <input
            type="number"
            placeholder="请输入退款金额"
            class="money-inp money-inp2"
            v-model="formData.goodsamount"
          />
        </div>
        <!-- <div class="list" @click="sel('refundtype')" v-if="type == '2'">
          <span>退款方式</span>
          <div class="list-right">
            <span class="sel">{{refundtypeText}}</span>
            <i class="iconfont iconright"></i>
          </div>
        </div> -->
        <!-- <div class="tips" v-if="type == '1'">
          <div
            class="tips-text"
            v-if="detail.goods"
          >最多￥{{detail.goods[key].goods_price}}，含发货邮费￥{{detail.goods[key].reduce_price}}</div>
          <div class="tips-text">仅在使用同一品类券的所有订单关闭后，方可退回该券</div>
        </div> -->
        <div class="goods-num-wrap" v-if="type == '2'">
          <span>退款说明</span>
          <input type="text" placeholder="选填" class="money-inp  money-inp2"  v-model="reason" />
        </div>
      </div>
      <div class="upload-img">
        <div class="title">上传凭证：</div>
        <div class="upload-item">

          <div class="upload">
            <div class="upload-text" v-show="!formData.image">
              <img src='../../assets/images/btm/ico_scico.png'/>
              <div>点击上传</div>
            </div>
            <input class="file" type="file" @change="upload($event)" />
            <img class="img" :src="api+formData.image" alt />
          </div>
        </div>
      </div>
    <button @click="sub" class="btn">确定</button>
    </div>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Owner,Base } from "@/server/server.js";
import { mapGetters } from 'vuex';
import {Util,Load} from '@/assets/commonjs/utils.js';
import Vue from 'vue';
import { Stepper } from 'vant';
Vue.use(Stepper);
export default {
  data() {
    return {
      type: this.$route.query.type, //退款类型 1只退款 2退货退款
      id: this.$route.query.id, //订单id
      key: this.$route.query.key, //商品数组下标
      detail: {},
      cityPicker: new mui.PopPicker(),
      formData: {
        type: this.$route.query.type,
        refundstatus: null, //货物状态id
        refundreason: null, //退款原因id
        // refundtype: null,//退款方式id
        goodscount: 1,
        image: null,
        order_no: null,
        goodsid: null,
        // reason: null,
        // goodsamount: null//退款金额
      },
      rufundList: null,
      refundstatusText: "请选择",
      refundreasonText: "请选择",
      refundtypeText: "请选择",
      refundtype: null, //退款方式id
      reason: null //退款说明(选填)
    };
  },
  computed: {
    ...mapGetters(["api"])
  },
  created() {
    this.orderDetail();
    this.rufund_info();
  },
  methods: {
    sub() {
      Load.loadStart(this);
      if(this.type == '2') {
        // this.formData.refundtype = this.refundtype;
        this.formData.reason = this.reason;
        delete this.formData.goodscount
        delete this.formData.goodsid
      }
      // if(Number(this.formData.goodsamount)>Number(this.detail.goods[this.key].goods_price)) {
      //   return Toast("最多可退"+this.detail.goods[this.key].goods_price)
      // }
      // let msg = otherUtil.isValidate(this.formData);
      // if(msg) {
      //   Toast(msg);
      //   return
      // }
      // console.log(this.formData)
      // return
      Owner.afterSale(this.formData).then(res => {
        Load.loadEnd(this);
        mui.toast(res.msg)
        if(res.code === 1) {
          this.$router.go(-2);
        }
      })
        // let that = this;
        // var url = "/addons/litestore/api.Orderrefund/after_sale";
        // that.$refs.load.open();
        // util.post(url,this.formData, 
        //     function (result) {  
        //       Toast(result.msg);
        //       that.$router.go(-2);
        //       that.$refs.load.close();

        //     },
        //     function (err) {  
        //       Toast(err.msg);
        //       that.$refs.load.close();
        //       delete that.formData.reason;
        //     },
        // );
    },
    sel(type) {
      let _This = this;
      if (type == "status") {
        this.cityPicker.setData(this.rufundList.refundstatuslist);
        this.cityPicker.show(function(e) {
          _This.formData.refundstatus = e[0].value;
          _This.refundstatusText = e[0].text;
        });
      } else if (type == "reason") {
        this.cityPicker.setData(this.rufundList.refundreasonlist);
        this.cityPicker.show(function(e) {
          _This.formData.refundreason = e[0].value;
          _This.refundreasonText = e[0].text;
        });
      } else if (type == "refundtype") {
        this.cityPicker.setData(this.rufundList.refundtypelist);
        this.cityPicker.show(function(e) {
          // _This.formData.refundtype = e[0].value;
          _This.refundtype = e[0].value;
          _This.refundtypeText = e[0].text;
        });
      }
    },
    upload(event) {
      let _This = this;
      if(event.target.value == '')return
      let formData = new FormData();
      Load.loadStart(_This);
      Util.uploadImgLimit(event.target.files[0], url => {
        formData.append("image", url);
        Base.upload(formData).then(res => {
          Load.loadEnd(_This);
          if (res.code == 1) {
            this.formData.image = res.data;
            this.src = res.data;
          } else {
            mui.toast(res.msg);
            return;
          }
        });
      });
    },
    rufund_info() {
      Owner.rufundInfo().then(res => {
        if (res.code === 1) {
          this.rufundList = res.data;
        } else {
          mui.toast(res.msg);
        }
      });
    },
    orderDetail() {
      Owner.orderDetail({ id: this.id }).then(res => {
        if (res.code === 1) {
          this.detail = res.data.order;
          this.formData.order_no = this.detail.order_no;
          this.formData.goodsid = this.detail.goods[this.key].goods_id;
        } else {
          mui.toast(res.msg);
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  // padding: @margin-primary;
  background-color: @bg-color;
  .card-root-c {
    margin-top: 20px;
    background: #fff;
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
          color: #fa3844;
          font-size: 40px;
          text-align: right;
        }
      }
    }
  }
  .wrap {
    margin-top: 25px;
    .list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      background: #fff;
      .list-right {
        flex: 1;
        text-align: right;
        .sel {
          margin-right: 5px;
          color: #ccc;
          text-align: left;
        }
        .iconfont {
          color: #999;
        }
      }
      &:last-child {
        border-top: 1px solid #edeff4;
      }
    }
  }
  .info-wrap {
    border-top: 1px solid #edeff4;
    // margin-top: 15px;
    background: #fff;
    .goods-num-wrap {
      padding: 10px 20px;
      border-top: 1px solid #edeff4;
      display: flex;
      justify-content: space-between;
      align-items: center;
      // margin-bottom: 15px;
      .tmall-types {
        /deep/ .van-stepper__input{
          width: 40px;
          height: 20px;
          margin: 0;
          border: none;
        }
      }
      .max {
        font-size: 13px;
        color: #ffc107;
      }
      .money-inp {
        flex: 1;
        height: 58px;
        border: none;
        border-bottom: 1px solid #edeff4;
        color: #999;
        margin: 0;
        padding: 0;
        &::placeholder {
          color: #999;
          font-size: 26px;
          text-align: center;
        }
      }
      .money-inp2 {
        flex: .4;
        height: 58px;
        border-radius:8px;
        border:1px solid rgba(153,153,153,1);
      }
    }
    .list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      background: #fff;
      .list-right {
        flex: 1;
        text-align: right;
        .sel {
          margin-right: 5px;
          color: #ccc;
          text-align: left;
        }
      }
      &:last-child {
        border-top: 1px solid #edeff4;
      }
    }
    .tips {
      margin-bottom: 15px;
      .tips-text {
        color: #999;
        font-size: 13px;
      }
    }
  }

  .upload-img {
    padding: 15px 20px;
    margin-top: 15px;
    // background: #fff;
    .title {
      font-size: 34px;
      color: #333;
      font-weight: 600;
    }
    .upload-item {
      margin-top: 20px;
      .upload {
        position: relative;
        width: 203px;
        height:203px;
        // border: 1px dotted #666;
        background: #fff;
        .upload-text {
          position: absolute;
          top: 0;
          width: 203px;
          height:203px;
          padding-top: 18%;
          text-align: center;
          > img {
            width: 60px;
          }
        }
        .file {
          width: 203px;
          height:203px;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          opacity: 0;
        }
        .img {
          width: 203px;
          height:203px;
          position: relative;
          z-index: 1;
        }
        // &:after {
        //   content: "点击上传";
        //   position: absolute;
        //   top: 50%;
        //   left: 50%;
        //   color: #333;
        //   font-size: 25px;
        //   transform: translate(-50%, -50%);
        // }
      }

    }
  }
  .btn {
    display: block;
    width: 80%;
    margin: 80px auto 10px auto;
    letter-spacing: 2px;
    background: #00A2EA;
    border: none;
    color: #fff;
  }
}
</style>
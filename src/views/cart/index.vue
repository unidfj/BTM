<template>
  <div class="page">
    <m-header title="购物车" :canback="Boolean(0)">
      <span class="rule" @click="Administration = !Administration">{{Administration?'管理':'取消'}}</span>
    </m-header>
    <section class="body">
      <div class="toast" v-show="Administration">共{{list.length}}件宝贝</div>
      <ul class="list" v-show="Administration">
          <li v-for="(v,i) in list" :key="i">
            <img :src="v.image" alt="">
            <div>
              <p>{{v.goods_name}}</p>
              <p>{{v.goods_sku.goods_attr||'默认规格'}}</p>
              <p>
                <span class="price">￥{{v.goods_price}}</span> 
                <span class="bot">  
                  <i class="iconfont iconjianhao2" @click="sub(v.goods_id,v.goods_sku_id,i,v.goods_price)"></i>
                    <span>{{v.total_num}}</span>
                  <i class="iconfont iconjiahao2" @click="add(v.goods_id,v.goods_sku_id,i,v.goods_price)" ></i>
                </span>
              </p>
            </div>
            
            <!-- <p class="bot">
              <i class="iconfont iconjianhao" @click="sub(v.goods_id,v.goods_sku_id,i,v.goods_price)"></i>
              <span>{{v.total_num}}</span>
              <i class="iconfont iconjiahao" @click="add(v.goods_id,v.goods_sku_id,i,v.goods_price)"></i>
            </p> -->
          </li>
      </ul>
      
      <ul class="list2" v-show="!Administration">
        <li v-for="(v,i) in list" :key="i" @click="changeArr(v.goods_id,v.goods_sku_id)">
          <i :class="{'iconfont':true,'iconyk_yuanquan_fill':arr.indexOf(v.goods_id)==-1||arr2.indexOf(v.goods_sku_id)==-1,'icon2xuanzhong se':arr.indexOf(v.goods_id)!=-1&&arr2.indexOf(v.goods_sku_id)!=-1}"></i>
          <div>
            <img :src="v.image" alt="">
            <div>
              <p>{{v.goods_name}}</p>
              <p>{{v.goods_sku.goods_attr||'默认规格'}}</p>
              <p>
                <span class="price">￥{{v.goods_price}}</span> 
                <span class="bot">              
                  <i class="iconfont iconjiahao2" @click="add(v.goods_id,v.goods_sku_id,i,v.goods_price)" ></i>
                  <span>{{v.total_num}}</span>
                  <i class="iconfont iconjianhao2" @click="sub(v.goods_id,v.goods_sku_id,i,v.goods_price)"></i></span>
              </p>
            </div>
            
            <!-- <p class="bot">

            </p> -->
          </div>
        </li>
        <!-- <div class="bot">
          <button @click="deleteCart">删除</button>
        </div> -->
      </ul>
      <div class="bot">
        <span v-show="!Administration"></span>
        <p v-show="Administration">
          合计：
          <span class="order-price">￥{{order_pay_price||0}}</span>
        </p>
        <button class="sub-btn" @click="goTo" v-show="Administration">结算</button>
        <button class="sub-btn" @click="deleteCart" v-show="!Administration">删除</button>
      </div>
    </section>
    <m-Footer></m-Footer>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import {Cart} from '@/server/server.js';
import {Util,Load,Secret} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
export default {
  data(){
      return {
        img:require('@/assets/images/gzlz/banner.png'),
        page:1,
        id:null,
        list:[],
        order_pay_price:null,
        bl:true,
        Administration:true,
        arr:[],
        arr2:[],
      }
  },
  created () {
    sessionStorage.setItem('btmNav',2);
  },
  mounted() {
      this.getlists();
      
  },
  computed: {
    ...mapGetters(['uid','api','bannerSrc','coinTxt','proData'])
  },
  methods: {
    goTo(){
      if (this.list.length==0){
        mui.toast('请添置您的购物车');
        return;
      }    
      this.$router.push({name:'SubOrder',query:{type:'cart',goods_type:3}})

    },
    // 选中与取消
    changeArr(v,goods_sku_id){
      let i = this.arr.indexOf(v);
      let i2 = this.arr2.indexOf(goods_sku_id);
      if(i==-1||i2==-1){
        this.arr.push(v)
        this.arr2.push(goods_sku_id)
      }else{
        this.arr.splice(i,1)
        this.arr2.splice(i,1)
      }
    },
    // 删除购物车
    deleteCart(){
      if(!this.arr){
        this.Administration = true;
        return;
      }
      // Array(...this.arr).forEach((v,i)=>{
      this.arr.forEach((v,i)=>{
        Cart.deleteCart({goods_id:v,goods_sku_id:this.arr2[i]}).then(res=>{
          mui.toast(res.msg)
          if(res.code==1){
            if(i==this.arr.length-1) this.getlists();
            this.Administration = true;
          }
        })
      })
      
    },
    // 加入购物车
    add(goods_id,goods_sku_id,i,v){
      if(!this.bl) return;
      Load.loadStart(this);
      this.bl = false;
      Cart.add({goods_num:1,goods_id,goods_sku_id}).then(res=>{
        Load.loadEnd(this);
        this.bl = true;
        if(res.code==1){
          this.list[i].total_num++;
          this.order_pay_price = Number(+this.order_pay_price + +v).toFixed(2);
        }
      })
    },
    // 购物车数量-1
    sub(goods_id,goods_sku_id,i,v){
      if(!this.bl||this.list[i].total_num<2) return;
      Load.loadStart(this);
      this.bl = false;
      // this.goods_num<2?'':this.goods_num--
      Cart.sub({goods_id,goods_sku_id}).then(res=>{
        Load.loadEnd(this);
        this.bl = true;
        if(res.code==1){
          this.list[i].total_num--;
          this.order_pay_price = Number(+this.order_pay_price - +v).toFixed(2);
        }else{
          mui.toast(res.msg)
        }
      })
    },
    
    // 购物车列表
    getlists(){
      Cart.getlists().then(res=>{
        if(res.code==1){
          this.list = res.data.goods_list;
          this.order_pay_price = res.data.order_total_price;
        }else{
          mui.toast(res.msg)
        }
      })
    },
    ...mapMutations(['saveBanner','saveCoinTxt']),
    
    formatTime(time){
      return Util.formatTime(time).substr(0,5);
    },
  },
  beforeRouteLeave (to, from, next) {
      clearInterval(this.mineInt);
      next();
    }
};
</script>
<style lang="less" scoped>
@import "~link-less";
.rule {
  color: #00A2EA;
}
.body {
  line-height: 36px;
  background-color: @bg-color;
  // margin: 30px 0;
  .toast {
    padding: 20px;
  }
    .list{
      // width: 690px;
      li{
        display: flex;
        justify-content: space-between;
        // margin-bottom: 30px;
        position: relative;
        background-color: #fff;
        // padding-right: 30px;
        padding: 20px 30px;
        border-bottom: 1px solid #eee;
        img{
          width: 140px;
          height: 140px;
          margin-right: 30px;
          border-radius: 16px;
        }
        >div{
          flex: 1;
          p{
            font-size: 24px;
            &:nth-child(1){
              color: #333;
              font-weight: 600;
            }
            &:nth-child(2){
              font-size: 20px;
              color: #999;
            }
            &:nth-child(3){
              margin-top: 15px;
              .display-flex();
              justify-content: space-between;
              align-items: center;
              .price {
                font-size: 36px;
                color: #FF3B30;
              }
            }
          }
        }
        .bot{
          // position: absolute;
          // right: 30px;
          // bottom: 20px;
            i{
              font-size: 38px;
              color: #999;
            }
            span{
              display: inline-block;
              // border: 1px solid #999;
              padding: 2px 30px;
              border-radius: 4px;
              background: #eee;
              color: #999;
              vertical-align: text-bottom;
            }
        }
      }
    }
    .list2{
      width: 690px;
      margin: 30px 30px;
      li{
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        height: 180px;
        >i{
          color: #fff;
          line-height: 180px;
          font-size: 40px;
          margin: 0 30px 0 10px;
        }
        .se{
          color: #3CFCAC;
        }
        >div{
          flex: 1;
          height: 180px;
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          position: relative;
          background-color: #fff;
          // padding-right: 30px;
          padding: 20px 30px;
          border-radius: 10px;
          img{
            width: 140px;
            height: 140px;
            margin-right: 30px;
          }
          >div{
            flex: 1;
            p{
              font-size: 24px;
              color: #333;
              &:nth-child(2){
                font-size: 20px;
                color: #999;
              }
              &:nth-child(3){
                margin-top: 15px;
                .display-flex();
                justify-content: space-between;
                align-items: center;
                .price {
                  font-size: 36px;
                  color: #FF3B30;
                }
              }
            }
          }
          .bot{
            // position: absolute;
            // right: 30px;
            // bottom: 20px;
            i{
              font-size: 38px;
              color: #999;
            }
            span{
              display: inline-block;
              // border: 1px solid #999;
              padding: 2px 30px;
              border-radius: 4px;
              background: #eee;
              color: #999;
              vertical-align: text-bottom;
            }
          }
        }
      }
      >.bot{
        width: 100%;
        display: flex;
        justify-content: space-between;
        button{
          flex: 1;
          height: 88px;
          background-color: #00A2EA;
          border-radius: 100px;
          color: #fff;
        }
      }
    }
    >.bot{
      position: fixed;
      bottom: 100px;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      line-height: 80px;
      background-color: #fff;
      button{
        margin-right: 25px;
        height: 60px;
        line-height: 60px;
        padding:  0px 48px;
        background-color: #00A2EA;
        border-radius: 100px;
        font-size: 32px;
        color: #fff;
      }
      >p{
        flex: 1;
        text-align: right;
        margin-right: 30px;
        font-size: 32px;
        color: #999;
        .order-price {
          color: #FF3B30;
        }
      }
    }
  
}
.page{
  .cart{
    color: #3CFCAC;
    font-size: 48px !important;
    // color: red;
  }
}
</style>


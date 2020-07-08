<template>
  <div class="page">
    <m-header title="商品详情" :canback="Boolean(1)">
      <img src="../../assets/images/btm/sc_ico_gwc.png" class="cart-img" @click="$router.push({name:'Cart'})">
      <!-- <i class="iconfont iconcart cart" @click="$router.push({name:'Cart'})"></i> -->
    </m-header>
    <span class="cartNum">{{cartNum}}</span>
    <section class="body">
      <div class="top">
        <!-- <img :src="img" alt=""> -->

        <div class="swiper">
          <swiper :options="swiperOption" class="swiper-wrap" ref="mySwiper" v-if="Array(data.imgs_url).length!=0">
            <swiper-slide v-for="(item, index) in data.imgs_url" :key="index">
              <img :src="item" class="title-img" />
            </swiper-slide>
            <!-- 常见的小圆点 -->
            <div
              class="swiper-pagination"
              v-for="(item,index) in data.imgs_url"
              :key="index"
              slot="pagination"
            ></div>
          </swiper>
        </div>
        <p>
          <span class="goods-name">{{data.goods_name}}</span>
          <span>
            <!-- <i :class="{'iconfont iconshoucang':true,'se':data.collection_bonus==1}" @click="collectionBonus"></i> -->
            <i class="iconfont iconfenxiang" @click="showShare()" v-show="isApp"></i>
          </span>
        </p>
        <div class="bot">
          <p><span class="goods-price">会员价：</span> <span class="goods-price">￥{{data.spec[0].goods_price}}</span> </p>
          <p class="line-price">原价：￥{{data.spec[0].line_price}}</p>
        </div>

      </div>
      <div class="stock">
        <span>销量：{{Number(data.sales_actual)+Number(data.sales_initial)}}</span>
        <span>运费：{{data.freight&&data.freight.name}}</span>
        <span>库存：{{data.spec[0].stock_num}} </span>
      </div>
      <div class="content">
        <p class="title">
          商品详情
        </p>
        <!-- <ul>
          <li v-for="(v,i) in [1]" :key="i">
            <img :src="img" alt="">
          </li>
        </ul> -->
        <div v-html="data.content" class="img_box"></div>
      </div>
      <div class="btn_box">
        <!-- <div @click="add" v-if="data.goods_type === 3">加入购物车</div> -->
        <div @click="addCart" v-if="data.goods_type === 3" :class="{'add-cart':data.goods_type === 3}">加入购物车</div>
        <div @click="show = !show" :class="{'buy-btn':data.goods_type === 3}">立即购买</div>
        <!-- <div @click="$router.push({name:'pOrder',query:{type:'buyNow',goods_id:id,goods_num,goods_sku_id,goods_sku_id}})">立即购买</div> -->
      </div>
      <div class="ale" v-show="show">
        <div class="box">
          <div class="close" @click="close">
            <i class="iconfont iconclose"></i>
          </div>
          <!-- <ul v-for="(v,i) in spec_attr" :key="i">
            <p class="title">{{v.group_name}}</p>
            <li v-for="(v2,i2) in v.spec_items" :key="i2" :class="{'se':se.indexOf(v2.item_id)!=-1}" @click="change(i,v2.item_id)">
              {{v2.spec_value}}
            </li>
          </ul> -->
          <div  class="spec-wrap">
            <div class="list">
              <div class="goods-info">
                <div class="info-left">
                  <img :src="data.image" class="list-img">
                  <div class="info-left-num">
                    <div class="price">￥{{goods_price}}</div>
                    <div class="stock2">库存{{stock_num}}件</div>
                    <!-- <div class="sel-color" v-if="specData!=null">选择规格</div> -->
                  </div>
                </div>
              </div>
            </div>
            <div v-if="specData!=null">
              <div class="tmall-types"  v-for="(attr, attr_idx) in specData.spec_attr" :key="attr_idx">
                <div class="tipstxt">{{attr.group_name}}：</div>
                <van-radio-group v-model="goods_spec_arr[attr_idx]" class="radio_c" :data-id="attr.group_id" @change="RonChange($event,attr_idx)">
                  <van-radio v-for="(item, item_idx) in attr.spec_items" :key="item_idx" :disabled="item.hidden" shape='square' checked-color="red"
                  class="radio_cc" :name="item.item_id">{{item.spec_value}}</van-radio>
                </van-radio-group>
            </div>
            </div>
						</div>
          <div class="bot">
            <p>购买数量</p>
            <p>
              <i class="iconfont iconjianhao2" @click="goods_num<2?'':goods_num--"></i>
              <span class="goods-num">{{goods_num}}</span>
              <!-- goods_type为1或6时限购一件 -->
              <i class="iconfont iconjiahao2" @click="data.goods_type == 1||data.goods_type == 6?goods_num = 1:goods_num++"></i>
            </p>
          </div>
          <div class="btn_box" v-if='iscart'>
            <div @click="add()"  class="add-cart">加入购物车</div>
            <div @click="ByNow" class="buy-btn">立即购买</div>
          </div>
          <button class="sub" @click="ByNow" v-else>确定</button>

          <!-- <div class="btn_box">
            <button @click="changeShow(false)">取消</button><button @click="changeShow(true)">确定</button>
          </div> -->
        </div>
      </div>
    </section>
    
    <!-- <div class="share_box" @click="share_show = false" v-show="share_show">
        <ul class="share_btn" >
            <li v-for="(v,i) in share_list" :key="i" @click="getShare(i)">
                <img :src="v.img" alt="">
                <p>{{v.title}}</p>
            </li>
            <vue-native-share :shareMenu="shareMenu" :config="config" />
        </ul>
    </div> -->
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import {Cart,Index,Base} from '@/server/server.js';
import {Util,Load,Secret,Share} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations} from 'vuex';
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Vue from 'vue';
import { RadioGroup, Radio } from 'vant';
Vue.use(Radio);
Vue.use(RadioGroup);
require("swiper/dist/css/swiper.css"); //引入swiper.css
// import { ShareSheet } from 'vant';
// Vue.use(ShareSheet)
export default {
  components: {
    swiper,
    swiperSlide,
    // vueNativeShare
  },
  data(){
      return {
        img:require('@/assets/images/gzlz/banner.png'),
        id:null,
        swiperOption: {
          loop: true,
            autoplay: {
              delay: 2500,
              stopOnLastSlide: false,
              /* 触摸滑动后是否继续轮播 */
              disableOnInteraction: false
            },
            // 分页器设置
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
              type: "bullets"
            }
        },
        data:{
          imgs_url:[],
          content:null,
          collection_bonus:null,
          goods_id:null,
          sales_actual:null,
          is_cancel:null,
          spec:[
            {
              goods_price:null,
              line_price:null,
            }
          ]
        },
        spec_attr:[],
        se:[],
        goods_num:1,
        show:false,
        type:null,

        goods_sku_id: null, // 规格id
        goods_price:0,
        stock_num:0,
        line_price:0,
			  goods_spec_arr: [], // 记录规格的数组
				sku_hidden_arr:[],	// 记录不显示的sku

        cartNum: 0,
        specData: [],

        iscart: false,
        share_list:[
            {
                title:'QQ',
                img:require('@/assets/images/btm/102.png'),
            },
            {
                title:'微信',
                img:require('@/assets/images/btm/101.png'),
            },
            {
                title:'朋友圈',
                img:require('@/assets/images/btm/103.png'),
            },
        ],
        share_show:false,
        shareMenu: [4],
        config: {
            title: '领地共燚',
            desc:'不可描述',
            img:require('@/assets/images/gzlz/banner.png'),
            img_title:'图片标题',
            link: 'http://www.baidu.com',
            // success: () => {console.log('success')}, //成功回调
            // cancel: () => {console.log('cancel')}, //取消回调
        },
        isWx: false,
        isApp: false,
      }
  },
  mounted() {
    this.initData();
    this.goodsDetail()
    this.getTotalNum()
    if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) =='micromessenger') {
			//检测是否是微信环境
      this.isWx = true;
    }else {
      try {
        if(plus) {
          Share._initShare();
          this.isApp = true;
        }
      } catch (error) {
      }
    }
  },
  computed: {
    ...mapGetters(['uid','api','bannerSrc','coinTxt','proData'])
  },
  methods: {
    initData(){
      this.id = this.$route.query.id;
    },
    close() {
      this.show = false;
      this.iscart = false;
    },
    ByNow:function(){
      // if(this.iscart) {
      //   this.add();
      // }else {
      this.$router.push({path: '/index/subOrder', query: {
          type: 'buyNow',
          goods_id: this.id,
          goods_num: this.goods_num,
          goods_sku_id: this.goods_sku_id,
          goods_type: this.data.goods_type,//1 为 0元区商品 2 为升级类商品 4 为云仓商品 6为vip兑换商品 这几类不加入购物车；3 为实体类商品 需要加入购物车
          isCloud: this.$route.query.isCloud || null,
      }})
      // }
			},
    // 选择分享
    showShare(){
      Share.actionSheet(this.data.goods_name,this.api+'/dist/index.html#'+this.$route.fullPath);
        // this.share_show = true;
        // document.querySelector('.label').innerHTML = '';
    },
    // 分享
    getShare(i){
        switch(+i){
            case 0:
                Share._initShare();
                setTimeout(()=>{
                    Share.sendShare(i+1,'WXSceneSession',this.api+'/dist/index.html#'+this.$route.fullPath,false,this.data.goods_name);
                },200)
                break;
            case 1:
                Share._initShare();
                setTimeout(()=>{
                    // Share.sendShare(i,'WXSceneSession',this.api+'/dist/index.html#'+this.$route.fullPath);
                    Share.sendShare(0,'WXSceneSession',this.api+'/dist/index.html#'+this.$route.fullPath,false,this.data.goods_name);
                },200)
                break;
            case 2:
                Share._initShare();
                setTimeout(()=>{
                    // Share.sendShare(2,'WXSceneTimeline',this.api+'/dist/index.html#'+this.$route.fullPath);
                    Share.sendShare(0,'WXSceneTimeline',this.api+'/dist/index.html#'+this.$route.fullPath,false,this.data.goods_name);
                },200)
                break;
            case 3:
                this.subinfo()
                break;
        }
    },   
    // 规格弹窗
    changeShow(bl){
      if(bl){
        this.add();
      }else{
        this.se = [];
      }
      this.show = false;
    },
    addCart(){
      // console.log(this.specData.length)
      this.iscart = true;
      this.show=true;
      // if(this.specData != null){
      //   this.show=true;
      //   this.iscart = true;
      // }else{
      //   this.add();
      // }
    },
    // 加入购物车
    add(){
      // this.goods_sku_id = this.se.join('-')
      this.iscart = false;
      Load.loadStart(this);
      Cart.add({goods_num:this.goods_num,goods_id:this.data.goods_id,goods_sku_id:this.goods_sku_id}).then(res=>{
        Load.loadEnd(this);
        mui.toast(res.msg)
        this.cartNum=res.data.cart_total_num
        this.show = false;
        // if(res.code==1){
          
        // }
      })
    },
    // 选择规格
    change(item_idx,item_id,attr_idx){
      console.log(555)
      this.se[item_idx] = item_id;
      // this.goods_sku_id = this.se.join('-')
      this.$forceUpdate()
      	let goods_spec_arr = this.goods_spec_arr

		    //这里如果发现目前选项是不可选的，那么通过分配其余可选的选项  
		    this.make_good_sel_sku(goods_spec_arr, attr_idx);

		    // this.updateSpecGoods();
		    // this.make_sku_showData(this.specData,attr_idx);
    },
    // 商品详情
    goodsDetail(){
      Index.goodsDetail({goods_id:this.id}).then(res=>{
        if(res.code==1){
          this.data = res.data.detail;
          this.specData = res.data.specData
          if (res.data.detail.spec_type === '20') {
            this.initManySpecData(res.data);
          }else{
            this.goods_sku_id=res.data.detail.spec[0].spec_sku_id
            this.goods_price=res.data.detail.spec[0].goods_price
            this.line_price=res.data.detail.spec[0].line_price
            this.stock_num=res.data.detail.spec[0].stock_num
          }

          //根据选择后的情况 分配sku的可选情况
          if (res.data.detail.spec_type === '20') {
            this.make_sku_showData(res.data.specData,0);
          }
          if(this.isWx) {
            this.shareWx()
          }
          // this.config.title = this.data.goods_name;
          // this.config.img_title = this.data.goods_name;
          // this.config.link = this.api+'/dist/index.html#'+this.$route.fullPath;
          // this.config.img = "https://ftp.bmp.ovh/imgs/2020/04/e329dae80731cd46.png";

          // if(!res.data.specData) return;
          // this.spec_attr = res.data.specData.spec_attr;
          // if(!this.spec_attr) return;
          // this.spec_attr.forEach((v,i)=>{
          //   this.se[i] = v.spec_items[0].item_id
          // })
          // this.goods_sku_id = this.se.join('-')
          // console.log('se',this.se)
          // console.log(this.goods_sku_id)
        }else{
          mui.toast(res.msg)
        }
      })
    },
    getTotalNum() {
      Index.getTotalNum().then(res => {
        if(res.code ==1) {
          this.cartNum = res.data.cart_total_num;
        }
      })
    },
    formatTime(time){
      return Util.formatTime(time).substr(0,5);
    },
    initManySpecData: function (data) {
      var that = this;
      for (let i in data.specData.spec_list) {
        if (data.specData.spec_list[i].form.stock_num >= 0){
          var sku_id = data.specData.spec_list[i].spec_sku_id.split('_');
          //初始化 sku 显示
          //商品价格/划线价/库存
          that.goods_sku_id=data.detail.spec[i].spec_sku_id
          that.goods_price=data.detail.spec[i].goods_price
          that.line_price=data.detail.spec[i].line_price
          that.stock_num=data.detail.spec[i].stock_num

          for (let j in sku_id) {
            that.goods_spec_arr[j] = parseInt(sku_id[j]);
          }
          break;
        }
      }
      //初始化 影藏sku数组
      that.sku_hidden_arr = [];
      for (let i in data.specData.spec_list) {
        if (data.specData.spec_list[i].form.stock_num < 0) {
          that.sku_hidden_arr.push(data.specData.spec_list[i].spec_sku_id.split('_'));
        }
      }
    },
    RonChange: function (e,attr_idx) {
      let goods_spec_arr = this.goods_spec_arr

      //这里如果发现目前选项是不可选的，那么通过分配其余可选的选项  
      this.make_good_sel_sku(goods_spec_arr, attr_idx);

      this.updateSpecGoods();
      this.make_sku_showData(this.specData,attr_idx);
    },
    make_good_sel_sku: function (goods_spec_arr, attr_idx) {
		    var that = this;
		    //首先判断此选项是否合法
		    if (that.check_good_sel_sku(goods_spec_arr)){

		    }else{
		      //循环sku列表 找到当前选择的第一匹配sku项目
          var spec_list = this.specData.spec_list;
          console.log(this.specData.spec_list)
		      spec_list.forEach(function (value, index, array) {
		        if (value.form.stock_num >= 0) {
		          var sku_id_arr = value.spec_sku_id.split('_');
		          sku_id_arr.forEach(function (sku_id_arrvalue, sku_id_arrindex, sku_id_arrarray) {
		            if (sku_id_arrindex == attr_idx && goods_spec_arr[sku_id_arrindex] == sku_id_arrvalue){
		              //找到目前的匹配项 可使用的sku
		              goods_spec_arr = sku_id_arr;
		            }
		          });
		        }
		      });
		    }
		    //格式化
		    goods_spec_arr.forEach(function (value, index, array) {
		      goods_spec_arr[index] = parseInt(value);
		    });

		    that.goods_spec_arr=goods_spec_arr
		  },
		  check_good_sel_sku: function (goods_spec_arr) {
		    var re_r = true;
		    //影藏sku组合情况：
		    var Sku_hidden = this.sku_hidden_arr;
		    Sku_hidden.forEach(function (Sku_hiddenvalue, Sku_hiddenindex, Sku_hiddenarray) {
		      //针对每个影藏sku 匹配
		      var peiduiNum = 0;
		      Sku_hiddenvalue.forEach(function (value, index, array) {
		        if (value == goods_spec_arr[index]) {
		          peiduiNum++;
		        }
		      });
		      if (peiduiNum == Sku_hiddenvalue.length) {
		        //发现了不合法
		        re_r = false;
		      }
		    });
		    return re_r;
		  },
    /** 更新商品规格信息  */
    updateSpecGoods: function () {
      let spec_sku_id = this.goods_spec_arr.join('_');

      // 查找skuItem
      let spec_list = this.specData.spec_list,
        skuItem = spec_list.find((val) => {
          return val.spec_sku_id == spec_sku_id;
        });

      // 记录goods_sku_id
      // 更新商品价格、划线价、库存
      if (typeof skuItem === 'object') {
      // console.log(skuItem,9999)
        this.goods_sku_id=skuItem.spec_sku_id
        this.goods_price=skuItem.form.goods_price
        this.line_price=skuItem.form.line_price
      this.stock_num=skuItem.form.stock_num
      // console.log(this.stock_num)
      
      }
    },
    make_sku_showData: function (data,break_num) {
      var that = this;
      //显示的sku数据为：
      var Showskuiteam = data.spec_attr;
      //初始化显示数据hidden为false
      Showskuiteam.forEach(function (value, index, array) {
        value.spec_items.forEach(function (value1, index1, array1) { value1.hidden = false; });
      });

      //循环 行规格 可选格式化，根据后面所有不变的sku规格
      Showskuiteam.forEach(function (value, index, array) {
        //这里 那一个选项
        //if (index != break_num) {
          that.for_eachsku_showData(Showskuiteam, index);
        //}
      });
    },
    for_eachsku_showData: function (Showskuiteam, ForNum) {
      //影藏sku组合情况：
      var Sku_hidden = this.sku_hidden_arr;
      //现在选择的情况是：
      var Nowselect = this.goods_spec_arr;

      //循环 每行规格 可选格式化，根据后面所有不变的sku规格
      Sku_hidden.forEach(function (Sku_hiddenvalue, Sku_hiddenindex, Sku_hiddenarray) {
        //针对每个影藏sku 匹配
        var peiduiNum = 0;
        Sku_hiddenvalue.forEach(function (value, index, array) {
          if (index != ForNum) {
            if (value == Nowselect[index]) {
              peiduiNum++;
            }
          }
        });
        if (peiduiNum == (Nowselect.length - 1)) {
          //此时 此sku为影藏项目
          Showskuiteam.forEach(function (Showskuiteamvalue, Showskuiteamindex, Showskuiteamarray) {
            Showskuiteamvalue.spec_items.forEach(function (value1, index1, array1) {
              if (value1.item_id == Sku_hiddenvalue[ForNum]) {
                value1.hidden = true;
              }
            });
          });
        }
      });
    },
    shareWx() {
      Index.wxgzh().then(res => {
          this.shareConfig(res.data)
        })
    },
      shareConfig(data) {
        let jssdkconfig = data || { jsApiList: [] };
        jssdkconfig.debug = false;
        jssdkconfig.jsApiList = [
          "checkJsApi",
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
          "onMenuShareQQ",
          "onMenuShareWeibo",
          "showOptionMenu",
          "hideMenuItems",
          "onMenuShareQZone",
          "scanQRCode",
          "openLocation",
          "updateAppMessageShareData",
          "updateTimelineShareData"
        ];
        wx.config(jssdkconfig);
        this.share();
      },
      share() {//分享
        let that = this;
        // let commodityCon = that.repalceHtml(that.detail.content)//商品描述
        wx.ready(function() {
          var shareData = {
            title: '蓓汀美',
            desc: that.data.goods_name,
            link: that.api+'/dist/index.html#'+that.$route.fullPath,
            // link: 'https://www.baidu.com',
            imgUrl: that.data.imgs_url[0],
            success: function (errMsg) {
            	// 设置成功
            	console.log("success",errMsg)
            },
            fail: function (errMsg) {
            	console.log("fail",errMsg)
            }
          };
          // wx.onMenuShareAppMessage(shareData)
          wx.updateAppMessageShareData(shareData); // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
          wx.updateTimelineShareData(shareData); // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
          // wx.onMenuShareTimeline(shareData); // 分享到朋友圈
          //  wx.onMenuShareQQ(shareData);  // 分享到QQ
          //  wx.onMenuShareWeibo(shareData); // 分享到腾讯微博
          //  wx.onMenuShareQZone(shareData); // 分享到QQ空间
          // });
        },
        wx.error(function(res){
          console.log("error",res);
        }));
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
.cart-img {
  width: 38px;
  height: 38px;
  margin-top: 20px;
}
.cartNum {
  display: inline-block;
  position: absolute;
  color: #FF3B30;
  top: 5px;
  right: 20px;
  width: 29px;
  height: 29px;
  line-height: 29px;
  text-align: center;
  border: 1px solid #FF3B30;
  border-radius: 100px;
  z-index: 1000;
  font-size: 16px;
}
.body {
  line-height: 36px;
  background-color: @bg-color;
  position: relative;
  >.top{
    background-color: #FFF;
    >img{
      width: 100%;
      margin-bottom: 24px;
    }
    >p{
      font-size:32px;
      font-weight:500;
      color:#333;
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
      span{
        &:nth-child(2){
          display: inline-block;
          width: 124px;
        }
        >i{
          margin-left: 20px;
        }
        .se{
          color: rgb(245, 248, 58);
        }
      }
    }
    >div{
      // display: flex;
      // justify-content: space-between;
      // padding: 0 30px;
      // margin-bottom: 30px;
      // height: 64px;
      line-height: 54px;
      p{
        &:first-child{
          font-size:44px;
          font-weight:500;
          color:rgba(60,252,172,1);
        }
        &:nth-child(2){
          font-size:32px;
          color:rgba(170,170,170,1);
          flex: 1;
          // margin-left: 16px;
          // text-decoration:line-through;
        }
        &:last-child{
          font-size:28px;
          color:rgba(170,170,170,1);
        }
      }
    }
    .bot{
      padding: 0 30px;
      .goods-price {
        font-size: 28px;
        color: #000;
        font-weight: 600;
        &:last-child {
          color: #FF3B30;
          font-size: 34px;
        }
      }
      .line-price {
        color: #666;
      }
    }
  }
  .stock {
    margin: 20px 0;
    .display-flex();
    justify-content: space-between;
    height: 80px;
    line-height: 80px;
    padding: 0 25px;
    color: #666;
    background: #fff;
  }
  >.content{
    background-color: #fff;
    padding-top: 22px;
    margin-bottom: 108px;
    .title{
      padding-left: 10px;
      border-left: 1px solid #333;
      font-size:32px;
      font-weight:500;
      color:#333;
      margin: 0 30px 30px;
    }
    .img_box{
      padding-bottom: 100px;
      /deep/ p{
        padding: 20px;
        color: #333;
        img{
          // width: 710px !important;
          width: 100% !important;
          height: auto;
          // margin-left: 20px;
        }
      }
    }
    >ul{
      li{
        img{
          width: 710px;
          margin-left: 20px;
        }
      }
    }
  }
  >.btn_box{
    display: flex;
    justify-content: space-between;
    // width: 94%;
    padding: 10px 30px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    background: #fff;
    border-radius: 0;
    font-size: 0;
    >div{
      flex: 1;
      color: #00A2EA;
      font-size:28px;
      font-weight: 500;
      height: 88px;
      line-height: 88px;
      text-align: center;
      background:rgba(0,162,234,0.2);
      border-radius:100px;
      display: inline-block;
      &:last-child{
        color: #fff;
        background:rgba(0,162,234,1);
      }
    }
    .add-cart {
      border-bottom-right-radius: 0;
    }
    .buy-btn {
      margin-left: -30px;
      border-top-left-radius: 0;
    }
  }
  .swiper{
    margin-bottom: 0;
    .title-img{
      width: 100%;
    }
  }
  .goods-name {
    color: #333;
    font-weight: 600;
  }
  >.ale{
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .6);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    .box{
      background-color: #fff;
      width: 100%;
      // width: 690px;
      // margin: 100px 30px;
      // border-radius: 10px;
      padding: 20px 30px 0 30px;
      position: absolute;
      bottom: 0px;
      .close {
        text-align: right;
        > i {
          font-size: 45px;
        }
      }
      .spec-wrap {
        .list {
          margin-top: -90px;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
          .goods-info {
            display: flex;
            .info-left {
              display: flex;
              align-items: center;
              .list-img {
                width: 180px;
                height: 180px;
                border-radius: 8px;
              }
              .info-left-num {
                margin-left: 10px;
                height: auto;
                .price {
                  margin-top: 35px;
                  color: #FF3B30;
                  font-size: 36px;
                }
                .stock2 {
                  margin-top: 15px;
                  color: #999;
                  font-size: 24px;
                }
                .sel-color {
                  color: #fff;
                  font-size: 14px;
                }
              }
            }
          }
        }
        .tipstxt {
          margin: 20px 0;
          font-weight: 600;
          color: #333;
        }
        .radio_cc {
          display: inline-block;
          /deep/.van-icon {
            display: none;
          }
          /deep/.van-radio__label {
            width: 200px;
            height: 68px;
            line-height: 68px;
            text-align: center;
            border: 1px solid #999;
            border-radius: 10px;
            color: #999;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          /deep/.van-radio__icon--checked+.van-radio__label {
            border: 1px solid #00A2EA;
            color: #00A2EA;
          }
          
        }
      }
      >ul{
        border-bottom: 1px solid #eee;
        margin-bottom: 20px;
        padding-bottom: 10px;
        .title{
          font-weight: 600;
          color: #000;
          font-size: 32px;
          margin-bottom: 10px;
        }
        li{
          margin-top: 10px;
          padding: 12px 60px;
          display: inline-block;
          color: #000;
          border: 1px solid #999;
          border-radius: 8px;
          margin-right: 20px;
          margin-bottom: 10px;
        }
        .se{
          border: 1px solid #00A2EA;
          background-color:#fff;
          color: #00A2EA;
        }
      }
      .bot{
        display: flex;
        justify-content: space-between;
        margin-bottom: 35px;
        padding: 20px 0;
        p{
          color: #333;
          font-weight: 600;
          font-size: 32px;
          i{
            font-size: 38px;
            color: #999;
            font-weight: 200 !important;
          }
          .goods-num {
            font-size: 35px;
            font-weight: 400;
          }
        }
      }
      .sub {
          width: 100%;
          height: 88px;
          border-radius: 100px;
          display: block;
          margin: 10px auto;
          color: #fff;
          background: #00A2EA;
      }
      >.btn_box{
        display: flex;
        justify-content: space-between;
        // width: 94%;
        padding: 10px 0;
        background: #fff;
        border-radius: 0;
        font-size: 0;
        >div{
          flex: 1;
          color: #00A2EA;
          font-size:28px;
          font-weight: 500;
          height: 88px;
          line-height: 88px;
          text-align: center;
          background:rgba(0,162,234,0.2);
          border-radius:100px;
          display: inline-block;
          &:last-child{
            color: #fff;
            background:rgba(0,162,234,1);
          }
        }
        .add-cart {
          border-bottom-right-radius: 0;
        }
        .buy-btn {
          margin-left: -30px;
          border-top-left-radius: 0;
        }
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

.share_box{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    z-index: 998;
    .share_btn{
        width: 100%;
        position: fixed;
        // bottom: 88px;
        bottom: 0;
        left: 0;
        background-color: #fff;
        padding: 50px 30px 20px;
        display: flex;
        z-index: 999;
        // border-top: 1px solid rgba(55,142,213,1);
        // border-bottom: 1px solid rgba(55,142,213,1);
        li{
            flex: 1;
            text-align: center;
            img{
                width: 68px;
            }
            p{
                color: #333;
            }
        }
        /deep/ #nativeShare{
            flex:1;
            padding: 0;
            .list{
                .list-item{
                    margin: 0;
                    display: inline-block;
                    width: 100%;
                }
            }
        }
    }
}
</style>


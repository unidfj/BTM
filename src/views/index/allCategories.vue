<template>
  <div class="page">
    <m-header title="全部分类" :canback="Boolean(1)"></m-header>
    <div class="body">
		<div style="bottom: 0px;display: flex;position: absolute;top: 40px;flex-direction: row;width: 100%;z-index:11">
			<div style="background-color: #F4F4F4;width: 8em; overflow: scroll;">
				<van-badge-group class="badge" :active-key="activeKey" @change="onChange">
					<van-badge v-for="(item, index) in categoryNav" :key="index" :title="item.name" />
				</van-badge-group>
			</div>
			<div style="width: 100%; overflow: scroll;">
        <ul class="cardbox" :style="'height:'+(screenHeight-40)+'px;overflow:auto;'" v-lazy-load="lazyLoad">
          <li class="goods-list" v-for="item in goodsList" :key="item.goods_id" @click="goDetail(item.id)">
            <img :src="item.image" class="goods-img">
            <div class="goods-info">
              <div class="goods-name">
                {{item.goods_name}}
              </div>
              <div class="goods-bot">
                <span class="price">￥{{item.goods_min_price}}</span>
                <img src="../../assets/images/btm/sc_ico_gwc.png" class="cart-img">
              </div>
            </div>
          </li>
          <next ref="next" :nomore="noMore"></next>
        </ul>
				<!-- <van-row gutter="3">
					<van-col span="8" v-for="(rd, index) in recommendData[activeKey].childlist" :key="index">
						<router-link :to="'./pageList/relist?cid='+rd.id+'&name='+rd.name" >
							<div class="cate-img" :id="rd.id">
								<div style="width: 100%;height: 0;padding-bottom: 100%;position: relative;">
		                      		<img style="width: 100%;height: 100%;position: absolute;" :src="rd.ImageFrist"/>
								</div>
		                      <div style="color:#333;font-size: 0.8em;margin: 0px 0 2px;text-align: center;">{{rd.name}}</div>
		                    </div>
						</router-link>
					</van-col>
				</van-row> -->
			</div>
		</div>
    </div>
  </div>
</template>
<script>
import { Index } from "@/server/server.js";
import { Util,Load } from "@/assets/commonjs/utils.js";
import Vue from 'vue';
import { Badge, BadgeGroup,Col, Row} from 'vant';

Vue.use(Badge);
Vue.use(BadgeGroup);
Vue.use(Col);
Vue.use(Row);
export default {
  data() {
    return {
        activeKey: 0,
        categoryNav:[],
        formData:{
          id: -1,
          sel_type:"normal",
          name:'',
          page: 1,
        },
        goodsList:[],
        screenHeight: 667,
        noMore: false,
    };
  },
  created() {
    this.screenHeight = window.screen.height || window.screen.availHeight;
  },
  mounted () {
    this.getCategory();
  },
  methods: {
    goDetail(id) {
      this.$router.push({name:'GoodsDetail',query:{id}})
    },
    getCategory() {
      Index.getCategory({}).then(res => {
        if(res.code === 1) {
          this.categoryNav = res.data.data;
          [this.formData.id,this.formData.name] = [this.categoryNav[0].id,this.categoryNav[0].name];
          this.categoryList();
        }else {
          mui.toast(res.msg)
        }
      })
    },
    categoryList() {
      Load.loadNext(this);
      Index.categoryList(this.formData).then(res => {
        if(res.code === 1) {
          this.goodsList = this.goodsList.concat(res.data.listdata || []);
          if(res.data.pagedata.current_page >= res.data.pagedata.last_page) {
            this.noMore = true;
          }
        }else {
          mui.toast(res.msg);
        }
      })
    },
    onChange(key) {
      this.activeKey = key;
      [this.goodsList, this.formData.id,this.formData.name,this.formData.page,this.noMore] = [[],this.categoryNav[key].id,this.categoryNav[key].name,1,false];
      this.categoryList();
    },
    lazyLoad() {
      this.formData.page = this.formData.page + 1;
      if (!this.noMore) {
        this.categoryList();
      }
    }
  }};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
//   padding: @margin-primary;
  background-color: @bg-color;
  .badge {
    /deep/ .van-badge--select{
      border: none;
    }
    /deep/ .van-hairline{
      background: none;
    }
    /deep/ .van-badge--select{
      background: #fff !important;
      color: #00A2EA;
      font-size: 30px;
    }
  }
  .cardbox {
    background: #fff;
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
        // height: 240px;
        display: block;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
      }
      .goods-info {
        padding: 15px;
        border: 1px solid #eee;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
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
<template>
	<div class="page">
		<div class="body">
			<header class="head">
				<!-- <img :src="user.avatar" class="img" /> -->
				<img src="../../assets/images/btm/logo.png" class="img" />
				<div>
					<div class="name">{{ user.nickname }}</div>
					<div>用户编号：{{ user.username }}</div>
					<div>等级：{{ user.level }}</div>
				</div>
			</header>
			<ul class="assets-wrap">
				<li class="assets-list" @click="()=>{ this.$router.push({ name: 'Detail', query: { type:'credit1'}})}">
					<div class="number">{{ user.credit1 }}</div>
					<div>商城余额</div>
				</li>
				<li class="assets-list" @click="()=>{ this.$router.push({ name: 'Detail', query: { type:'credit6'}})}">
					<div class="number">{{ user.credit6 }}</div>
					<div>云仓货款</div>
				</li>
				<li class="assets-list" @click="()=>{ this.$router.push({ name: 'Detail', query: { type:'credit5'}})}">
					<div class="number">{{ user.credit5 }}</div>
					<div>待结算</div>
				</li>
				<li class="assets-list" @click="()=>{ this.$router.push({ name: 'Detail', query: { type:'credit4'}})}">
					<div class="number">{{ user.credit4 }}</div>
					<div>优惠券</div>
				</li>
				<li class="assets-list" @click="()=>{ this.$router.push({ name: 'Detail', query: { type:'credit2'}})}">
					<div class="number">{{ user.credit2 }}</div>
					<div>消费金</div>
				</li>
				<li class="assets-list" @click="()=>{ this.$router.push({ name: 'Detail', query: { type:'credit3'}})}">
					<div class="number">{{ user.credit3 }}</div>
					<div>股权</div>
				</li>
			</ul>
			<div class="goods-wrap">
				<router-link class="goods-top" to="/myorder?showType=0">
					<span class="title-name">我的商品订单</span>
					<span class="goods-top-right">
						查看更多
						<i class="iconfont iconright"></i>
						<!-- <img src="@/assets/jt.png" class="allGoods-img" /> -->
					</span>
				</router-link>
				<ul class="goods-list-wrap">
					<li class="goods-list">
						<router-link class="list-link" to="/myorder?showType=1">
							<img :src="icon[0]" class="goods-img" />
							<div>待付款</div>
						</router-link>
					</li>
					<li class="goods-list">
						<router-link class="list-link" to="/myorder?showType=2">
							<img :src="icon[1]" class="goods-img" />
							<div>待发货</div>
						</router-link>
					</li>
					<li class="goods-list">
						<router-link class="list-link" to="/myorder?showType=3">
							<img :src="icon[2]" class="goods-img" />
							<div>待收货</div>
						</router-link>
					</li>
					<li class="goods-list">
						<router-link class="list-link" to="/myorder?showType=4">
							<img :src="icon[3]" class="goods-img" />
							<div>已完成</div>
						</router-link>
					</li>
					<li class="goods-list">
						<router-link class="list-link" to="/myorder?showType=6">
							<img :src="icon[4]" class="goods-img" />
							<div>退换货</div>
						</router-link>
					</li>
				</ul>
			</div>

      <div class="goods-wrap">
        <div class="goods-top">
          <span class="title-name">账户操作</span>
        </div>
        <ul class="goods-list-wrap">
          <li class="goods-list">
            <router-link class="list-link" :to="{ name: 'tixian' }">
              <img :src="icon[5]" class="goods-img" />
              <div>提现</div>
            </router-link>
          </li>
          <li class="goods-list">
            <router-link class="list-link" :to="{ name: 'chongzhi' }">
              <img :src="icon[6]" class="goods-img" />
              <div>充值</div>
            </router-link>
          </li>
          <li class="goods-list">
            <router-link class="list-link" :to="{ name: 'zhuanzhang' }">
              <img :src="icon[7]" class="goods-img" />
              <div>转账</div>
            </router-link>
          </li>
          <li class="goods-list" @click="goTo('bonus')">
            <div class="list-link">
              <img :src="icon[8]" class="goods-img" />
              <div>奖金明细</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="goods-wrap">
        <div class="goods-top" to="./my/myorder?showType=0">
          <span class="title-name">基础信息</span>
        </div>
        <ul class="goods-list-wrap basics">
          <li class="goods-list" @click="goTo('invite')">
            <div class="list-link">
              <img :src="icon[9]" class="goods-img" />
              <div>邀请好友</div>
            </div>
          </li>
          <li class="goods-list">
            <router-link class="list-link" :to="{ name: 'myteam' }">
              <img :src="icon[10]" class="goods-img" />
              <div>我的团队</div>
            </router-link>
          </li>
          <li class="goods-list">
            <router-link class="list-link" :to="{ name: 'poster' }">
              <img :src="icon[11]" class="goods-img" />
              <div>分享海报</div>
            </router-link>
          </li>
          <li class="goods-list">
            <router-link class="list-link" :to="{ name: 'benefits' }">
              <img :src="icon[12]" class="goods-img" />
              <div>会员福利</div>
            </router-link>
          </li>
          <li class="goods-list">
            <router-link class="list-link" to="/myCloud">
              <img :src="icon[13]" class="goods-img" />
              <div>我的云仓</div>
            </router-link>
          </li>
          <li class="goods-list">
            <router-link class="list-link" to="./address">
              <img :src="icon[14]" class="goods-img" />
              <div>地址管理</div>
            </router-link>
          </li>
          <li class="goods-list">
            <router-link class="list-link" :to="{ name: 'authentication' }">
              <img :src="icon[15]" class="goods-img" />
              <div>实名认证</div>
            </router-link>
          </li>
          <li class="goods-list">
            <router-link class="list-link" to="./set">
              <img :src="icon[16]" class="goods-img" />
              <div>设置</div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <m-Footer></m-Footer>
  </div>
</template>
<script>
import { Owner } from '@/server/server.js'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      user: {},
      icon: [
        require("@/assets/images/my/1.png"),
        require("@/assets/images/my/2.png"),
        require("@/assets/images/my/3.png"),
        require("@/assets/images/my/4.png"),
        require("@/assets/images/my/5.png"),
        require("@/assets/images/my/6.png"),
        require("@/assets/images/my/7.png"),
        require("@/assets/images/my/8.png"),
        require("@/assets/images/my/9.png"),
        require("@/assets/images/my/21.png"),
        require("@/assets/images/my/22.png"),
        require("@/assets/images/my/23.png"),
        require("@/assets/images/my/24.png"),
        require("@/assets/images/my/25.png"),
        require("@/assets/images/my/26.png"),
        require("@/assets/images/my/27.png"),
        require("@/assets/images/my/28.png")
      ]
    };
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
	sessionStorage.setItem('btmNav',3);
  },
  mounted() {
    this.getdata();
  },
  methods: {
    goTo(name) {
      if(this.user.level == '普通会员') return mui.toast('无权限查看')
      this.$router.push({name});
    },
    getdata() {
      Owner.getmy().then(res => {
        console.log(res.data);
        this.user = res.data.data;
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
	//   padding: @margin-primary;
	background-color: #f4f4f4;
	font-size: 24px;
	.head {
		padding: 50px 30px 0 30px;
		height: 300px;
		.display-flex();
		background: #00a2ea;
		color: #fff;
		font-family: PingFangSC-Regular, PingFang SC;
		.img {
			width: 120px;
			height: 120px;
			margin-right: 20px;
			border-radius: 100px;
		}
		.name {
			font-size: 32px;
		}
	}
	.assets-wrap {
		margin: 30px;
		margin-top: -100px;
		background: #fff;
		border-radius: 10px;
		font-size: 0;
		.assets-list {
			display: inline-block;
			margin: 15px 0;
			width: 33.3%;
			text-align: center;
			font-size: 24px;
			color: #333;
			.number {
				color: #00a2ea;
				font-size: 32px;
			}
		}
	}
	.goods-wrap {
		margin: 30px;
		border-radius: 10px;
		background: #fff;
		.goods-top {
			margin: 0 23px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 15px;
			border-bottom: 1px solid #ececec;
			color: #000;
			font-weight: 600;
			.title-name {
				font-size: 34px;
				color: #333;
			}
			.goods-top-right {
				font-size: 24px;
				color: #00a2ea;
				.iconfont {
					font-size: 20px;
				}
			}
		}
		.goods-list-wrap {
			display: flex;
			justify-content: space-around;
			margin-top: 20px;
			padding-bottom: 20px;
			&:last-child {
				margin-top: 0;
			}
			.goods-list {
				margin-top: 25px;
				flex: 1;
				text-align: center;
				font-size: 24px;
				.list-link {
					color: #000;
					.goods-img {
						width: 42px;
						margin-bottom: 7px;
					}
				}
			}
		}
		.basics {
			display: flex;
			justify-content: flex-start;
			flex-wrap: wrap;
			.goods-list {
				margin-top: 25px;
				width: 25%;
				flex: none;
			}
		}
	}
}
</style>

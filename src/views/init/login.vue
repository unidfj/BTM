<template>
	<div class="page">
		<m-header title="登录" :canback="Boolean(0)"></m-header>
		<div class="body">
			<div class="info">
				<img src="../../assets/images/btm/logo2.png" class="logo" />
				<!-- <div>蓓汀美</div> -->
			</div>
			<ul class="wrap">
				<li class="list">
					<span class="label">账号</span>
					<input type="number" class="inp" placeholder="请输入已注册手机号" v-model="formData.account" />
				</li>
				<li class="list">
					<span class="label">密码</span>
					<input type="password" class="inp inp-last" placeholder="请输入密码" v-model="formData.password" />
				</li>
			</ul>
			<div class="func-wrap">
				<span class="name" @click="goTo('Register')">立即注册</span>
				<span class="name" @click="goTo('BackPwd')">忘记密码？</span>
			</div>
			<div class="bot-wrap">
				<button class="btn" @click="login">登录</button>
				<button class="btn" @click="goTo('Download')">下载APP</button>
				<van-checkbox class="agreement-wrap" v-model="checked">
					<span class="text">注册蓓汀美即代表您已阅读并同意</span>
					<div>
						<span class="agreement" @click="goTo('Agreement','注册协议')">《用户授权协议》</span>及
						<span class="agreement" @click="goTo('Agreement','隐私保护政策')">《隐私保护政策》</span>
					</div>
				</van-checkbox>
			</div>
		</div>
		<m-load ref="load"></m-load>
	</div>
</template>
<script>
import { Init } from "@/server/server.js";
import { Util, Load, HB, Secret } from '@/assets/commonjs/utils.js';
import { mapMutations, mapGetters } from 'vuex';
import Vue from "vue";
import { Checkbox, CheckboxGroup } from "vant";
Vue.use(Checkbox).use(CheckboxGroup);
export default {
	data () {
		return {
			checked: true,
			formData: {
				account: null,
				password: null
				// is_test: 1
			},
			code: null
		};
	},
	created () {
		//检测是否是微信环境
		this.code = this.GetQueryString(location.href, 'code');
		if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
			if (!this.code) {
				location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+this.app_id+'&response_type=code&scope=snsapi_base&redirect_uri=http://fabtm.a6shop.net/dist/index.html#/login&state=1#wechat_redirect';
				// location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9d28a6b1ecc19161&response_type=code&scope=snsapi_base&redirect_uri=http://www.gzbtme.com/dist/index.html#/login&state=1#wechat_redirect';
			} else this.formData.code = this.code;
		}
	},
	computed: {
		...mapGetters(["api"])
	},
	methods: {
		...mapMutations(['saveUserInfo']),
		goTo (name, type) {
			this.$router.push({ name, query: { type } })
		},
		GetQueryString (result, name) {
			var res = result.split("?")[1];
			if (!res) {
				return null;
			}
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = res.match(reg);
			if (r != null) return unescape(r[2]);
			return null;
		},
		/**
		 * 登录
		 */
		login () {
			let params = this.formData;
			// console.log(params);
			// return ;
			let msg = Util.isValidate(params);
			if (msg) {
				mui.toast(msg);
				return;
			}
			console.log(this.formData)
			Load.loadStart(this);
			Init.login(params).then(res => {
				// console.log(res)
				mui.toast(res.msg);
				if (res.code == 1) {
					let InfoData = JSON.parse(Secret.decrypt(res.data));
					console.log(InfoData);
					// localStorage.setItem('user_id',res.data.id);
					this.saveUserInfo(InfoData);
					localStorage.setItem("userInfo", res.data);
					localStorage.setItem("cookie", InfoData.token);
					setTimeout(() => {
						Load.loadEnd(this);
						this.$router.replace({ name: 'Index' })
					}, 500);
				} else {
					setTimeout(() => {
						Load.loadEnd(this);
						return;
					}, 500);
				}
			});
		}
	}
};
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
	//   padding: @margin-primary;
	background-color: #fff;
	font-size: 34px;
	color: #333;
	.info {
		margin: 100px 0;
		text-align: center;
		color: #00a2ea;
		font-size: 32px;
		.logo {
			width: 230px;
		}
	}
	.wrap {
		border-top: 1px solid #eee;
		border-bottom: 1px solid #eee;
		.list {
			margin: 5px 50px;
			.display-flex();
			align-items: center;
			&:last-child {
				border-top: 1px solid #eee;
			}
			.label {
				margin-right: 40px;
				color: #333;
			}
			.inp {
				flex: 1;
				margin: 0;
				padding: 0;
				border: none;
				background: none;
				font-size: 34px;
				&::placeholder {
					color: #ccc;
				}
			}
		}
	}
	.func-wrap {
		margin: 20px 50px;
		.display-flex();
		justify-content: space-between;
		font-size: 28px;
		.name {
			color: #00a2ea;
			&:last-child {
				color: #666;
			}
		}
	}
	.bot-wrap {
		position: relative;
		.btn {
			display: block;
			margin: 60px auto;
			width: 85%;
			color: #fff;
			&:last-child {
				margin-top: -20px;
				background: #fff;
				color: #00a2ea;
				border: 1px solid #00a2ea;
			}
		}
		.agreement-wrap {
			position: absolute;
			bottom: -125%;
			left: 0;
			right: 0;
			margin: auto;
			// margin-top: 400px;
			.display-flex();
			justify-content: center;
			align-items: flex-start;
			font-size: 24px;
			color: #333;
			.text {
				font-size: 26.8px;
				// letter-spacing: 1px;
			}
			.agreement {
				color: #00a2ea;
			}
		}
	}
}
</style>
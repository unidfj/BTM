<template>
	<div class="page">
		<m-header :title="setTitle(type)" :canback="Boolean(1)"></m-header>
		<section class="body">
			<form class="tj-form">
				<div class="box">
					<span>手机号</span>
					<input type="number" v-model="formData.mobile" />
				</div>

				<div class="box">
					<span>{{ type == "login" ? "登录密码" : "交易密码" }}</span>
					<input type="password" :placeholder="`请输入新的${type == 'login' ? '登陆' : '支付'}密码`" v-model="formData.newpassword" />
				</div>

				<div class="box">
					<span for="name">确认密码</span>
					<input type="password" :placeholder="`请确认新的${type == 'login' ? '登陆' : '支付'}密码`" v-model="formData.password" />
				</div>

				<div class="box" style="padding-right:20px;">
					<span for="name">验证码</span>
					<input style="width:40%" type="text" placeholder="请输入短信验证码" v-model="formData.captcha" oninput="if(value.length>4)value=value.slice(0,4)" />
					<div class="btn" :disabled="seconds > 0" @click="getCode">{{ seconds == 0 ? "点击发送" : "已发送(" + seconds + "s)" }}</div>
				</div>
				<div class="submit" @click="confirm">确定修改</div>
			</form>
			<m-load ref="load"></m-load>
		</section>
	</div>
</template>
<script>
import { Init, Base } from "@/server/server.js";
import { mapGetters } from "vuex";
import { Util, Load } from "@/assets/commonjs/utils.js";
export default {
	components: {},
	data () {
		return {
			seconds: 0,
			type: null,
			formData: {
				mobile: null,
				newpassword: null,
				password: null,
				captcha: null,
			},
		};
	},
	mounted () {
		this.initData();
	},
	computed: {
		...mapGetters(["uid", "userInfo"]),
	},
	methods: {
		initData () {
			this.type = this.$route.query.type;
			this.formData.mobile = this.userInfo.mobile;
		},
		// 倒计时
		getCode () {
			this.seconds = 60;
			let get = setInterval(() => {
				this.$nextTick(() => {
					this.seconds--;
					if (this.seconds <= 0) clearInterval(get);
				});
			}, 1000);
			// return ;
			// 发送验证码
			Base.sendCode({ mobile: this.userInfo.mobile }).then((res) => {
				console.log(res);
				mui.toast(res.msg);
			});
		},
		// isMobile(mobile,callback){
		//     if(!mobile|| mobile.length<13){
		//         mui.toast('请添加区(地域)号，如：(86)中国');
		//         return false
		//     }else {
		//         callback();
		//     }
		// },
		confirm () {
			let _This = this;
			let params = {
				perfix: 86,
				mobile: this.formData.mobile,
				newpassword: this.formData.newpassword,
				renewpassword: this.formData.password,
				captcha: this.formData.captcha,
			};
			let msg = Util.isValidate(params);
			if (msg) {
				mui.toast(msg);
				return;
			}
			Load.loadStart(this);
			if (this.type == "login") {
				Init.uppass(params).then((res) => {
					Load.loadEnd(this);
					mui.toast(res.msg);
					if (res.code == 1) {
						setTimeout(() => {
							this.$router.push({ name: 'Set' });
						}, 500);
					}
				});
			} else {
				console.log(555)
				Init.backTrade(params).then((res) => {
					Load.loadEnd(this);
					mui.toast(res.msg);
					if (res.code == 1) {
						setTimeout(() => {
							this.$router.push({ name: 'Set' });
						}, 500);
					}
				});
			}
		},
		setTitle (type) {
			switch (type) {
				case "login":
					return "修改登录密码";
					break;
				case "trade":
					return "修改交易密码";
					break;
			}
		},
		clearLocal () {
			localStorage.clear();
			this.$store.commit("saveUserInfo", null);
			this.$store.commit("saveUserID", null);
			sessionStorage.setItem("btmNav", 1);
			Util.clearAllCookie();
		},
	},
};
</script>

<style scoped lang="less">
@import '~link-less';
.body {
	background-color: #fff;
	.box {
		border-bottom: 1px solid #ccc;
		white-space: nowrap;
		.display-flex();
		align-items: center;
		span {
			min-width: 200px;
			font-size: 32px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 500;
			color: rgba(51, 51, 51, 1);
		}
		input {
			padding: 0;
			margin: 0;
			width: auto;
			border: 0;
			height: 94px;
			font-size: 28px;
			color: #cccccc;
			font-family: PingFangSC-Regular, PingFang SC;
		}
		.btn {
			width: 160px;
			height: 58px;
			line-height: 58px;
			border-radius: 34px;
			border: 1px solid rgba(0, 162, 234, 1);
			background: #fff;
			color: #00a2ea;
			font-size: 28px;
			text-align: center;
		}
	}
}
.submit {
	text-align: center;
	color: #fff;
	line-height: 88px;
	width: 600px;
	height: 88px;
	background: rgba(0, 162, 234, 1);
	border-radius: 44px;
	margin: 60px auto;
	font-size: 32px;
}
</style>

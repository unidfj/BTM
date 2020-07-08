<template>
	<!-- 充值 -->
	<div class="page">
		<section class="body">
			<div class="header">
				<m-header title="我的充值" :canback="Boolean(1)"></m-header>
				<span @click="() => {this.$router.push({ name: 'chongzhijilu' })}">充值记录</span>
			</div>
			<!-- 充值类型 -->
			<div class="box">
				<div class="boxtype">充值类型</div>
				<div class="boxvalue">商城余额</div>
			</div>
			<!-- 充值金额 -->
			<div class="box">
				<div class="boxtype">充值金额</div>
				<input type="number" class="boxvalue"  placeholder="请输入充值金额" v-model="form.money" />
			</div>
			<!-- 充值方式 -->
			<div class="box">
				<div class="boxtype">充值方式</div>
				<div class="boxvalue" @click=" () => {this.picker2.show = true;}">
					{{ picker2.columnsPicker }}
					<img class="arrowicon" src="../../../assets/images/btm/ico_xl.png" />
				</div>
				<van-popup v-model="picker2.show" position="bottom" :close-on-click-overlay="false">
					<van-picker show-toolbar :columns="picker2.columns" title="充值方式" @cancel="onCancel" @confirm="onConfirm" />
				</van-popup>
			</div>

			<div v-if="first_img1" class="first_img1">
				<div>收款信息</div>
				<img :src="api+first_img1" alt />
			</div>

			<!-- 图片上传 -->
			<div class="print" v-if="picker2.columnsPicker == '线下充值'">
				<div class="printtop">打款凭证:</div>
				<div class="upload-item">

				<div class="upload">
					<div class="upload-text" v-show="!imgsrc">
						<img src='../../../assets/images/btm/ico_scico.png'/>
						<div>点击上传</div>
					</div>
					<input class="file" type="file" @change="upload($event)" />
					<img class="img" :src="api+imgsrc" alt />
				</div>
				</div>
				<div class="printbottom">线下充值时需上传打款凭证，方便后台审核</div>
				<!-- <van-uploader :after-read="onRead">
					<div class="printimg" v-if="!imgsrc">
						<img src="../../../assets/images/btm/ico_scico.png" style="margin-bottom: 15px;width:35px" />
						点击上传
					</div>
					<div v-else>
						<img :src="imgsrc" class="imgsrc" />
					</div>
				</van-uploader> -->
			</div>
			<!-- 确认按钮 -->
			<button class="surebtn" @click="surebtn">确认充值</button>
		</section>
		<m-load ref="load"></m-load>
	</div>
</template>

<script>
import Vue from 'vue'
import { Picker, Popup, Uploader } from 'vant'
import { Util, Load } from '@/assets/commonjs/utils.js'
import { Base, Owner, Init } from '@/server/server.js'
import { mapGetters } from 'vuex'
Vue.use(Uploader)
	.use(Picker)
	.use(Popup)
export default {
	data() {
		return {
			disabled: false,
			picker2: {
				show: false,
				columns: ['支付宝', '微信', '线下充值'],
				columnsPicker: '请选择'
			},
			imgsrc: '',
			form: {
				money: null, //充值金额
				type: null, //充值类型 0=微信充值,1=支付宝充值,2=线下充值
				paytype: 2 //充值方式 1=app充值,2=非app充值
				// img: null //凭证 只有线下充值才需上传图片
			},
			first_img1: null,
			img: null,
			channel: null, //当前支付方式
			channels: null, //所有支持的支付方式 支付宝和微信
			isWx: false
		}
	},
	mounted() {
		Owner.getOpenid().then(res => {
			if (res.code == 1) {
				// this.first_img1 = res.data.first_img1
			}
		})
		Init.getconfig().then(r => {
			this.first_img1 = r.data.data.first_img1
		})

		if (
			navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
			'micromessenger'
		) {
			//检测是否是微信环境
			this.isWx = true
		}
		try {
			if (plus) {
				this.form.paytype = 1
				this.plusReady()
			}
		} catch (error) {}
	},
	methods: {
		/**
		 * 加载支付方式
		 */
		plusReady() {
			console.log('获取支付通道')
			// 获取支付通道
			let that = this
			plus.payment.getChannels(
				function(channels) {
					that.channels = channels
					if (that.channels[0].id != 'alipay')
						that.channels = that.channels.reverse()
				},
				function(e) {
					alert('获取支付通道失败：' + e.message)
				}
			)
		},
		onCancel(e) {
			this.picker2.show = false
		},
		onConfirm(e) {
			this.picker2.columnsPicker = e
			if (e == '微信') this.form.type = 0
			if (e == '支付宝') this.form.type = 1
			if (e == '线下充值') this.form.type = 2
			this.picker2.show = false
		},
		// 图片上传
		onRead(e) {
			let formData = { image: e.content }
			Base.upload(formData).then(res => {
				if (res.code == 1) {
					this.imgsrc = this.api + res.data
					this.img = res.data
				} else mui.toast(res.msg)
			})
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
					_This.imgsrc = res.data;
					// this.src = res.data;
				} else {
					mui.toast(res.msg);
					return;
				}
				});
			});
		},
		// 确定充值
		surebtn() {
			if (!this.form.money) {
				return mui.toast('请输入充值金额')
			}
			let that = this
			switch (this.form.type) {
				case 0: //微信充值
					try {
						if (plus) {
							that.channel = that.channels[1]
						}
					} catch (error) {}

					break
				case 1: //支付宝充值
					that.channel = that.channels[0]
					break
				case 2:
					that.form.img = that.imgsrc
					break
				default:
					return mui.toast('请选择充值方式')
					break
			}
			Load.loadStart(this)
			Owner.getrecharge(this.form).then(res => {
				Load.loadEnd(this)
				switch (this.form.type) {
					case 0:
						if (this.isWx) {
							//公众号支付
							this.gzhRecharge()
						} else {
							//微信app支付
							plus.payment.request(
								that.channel,
								res.data,
								function(result) {
									plus.nativeUI.alert(
										'支付成功！',
										function() {
											that.$router.go(-1)
										}
									)
								},
								function(error) {
									plus.nativeUI.alert(error.message)
								}
							)
						}
						break
					case 1: //调用支付宝
						plus.payment.request(
							that.channel,
							res.data,
							function(result) {
								plus.nativeUI.alert('支付成功！', function() {
									that.$router.go(-1)
								})
							},
							function(error) {
								plus.nativeUI.alert(error.message)
							}
						)
						break

					case 2: //线下充值
						mui.toast(res.data.msg)
						if (res.data.code == 1) {
							setTimeout(() => {
								this.$router.go(-1)
							}, 500)
						}
						break
				}
			})
		},
		gzhRecharge() {
			Owner.recharge(this.form).then(res => {
				// Load.loadEnd(this);
				console.log(res.code)
				if (res.code == 1) {
					console.log(res.data)
					// alert(1)
					var vm = this
					if (typeof WeixinJSBridge == 'undefined') {
						// alert(2)
						//微信浏览器内置对象。参考微信官方文档
						vm.$toast('请使用微信打开')
						if (document.addEventListener) {
							document.addEventListener(
								'WeixinJSBridgeReady',
								vm.onBridgeReady(res.data),
								false
							)
						} else if (document.attachEvent) {
							document.attachEvent(
								'WeixinJSBridgeReady',
								vm.onBridgeReady(res.data)
							)
							document.attachEvent(
								'onWeixinJSBridgeReady',
								vm.onBridgeReady(res.data)
							)
						}
					} else {
						// alert(3)
						vm.onBridgeReady(res.data)
					}
				} else {
					mui.toast(res.msg)
				}
			})
		},
		onBridgeReady(data) {
			// alert(4)
			var vm = this
			console.log(data, 'data')
			WeixinJSBridge.invoke(
				'getBrandWCPayRequest',
				{
					appId: data.appId,
					nonceStr: data.nonceStr,
					package: data.package,
					signType: data.signType,
					paySign: data.paySign,
					timeStamp: data.timeStamp
				},
				function(res) {
					console.log(res, 111111)
					if (res.err_msg == 'get_brand_wcpay_request:ok') {
						console.log(222)
						mui.toast('支付成功！')
					} else if (
						res.err_msg == 'get_brand_wcpay_request:cancel'
					) {
						console.log(333)
						mui.toast('您取消了支付')
					} else if (res.err_msg == 'get_brand_wcpay_request:fail') {
						console.log(555)
						mui.toast('支付失败')
					}
					// if (res.err_msg == "get_brand_wcpay_request:ok") {
					//   vm.$toast("恭喜，支付成功");
					//   vm.$router.push({ name: "ServicePackage" });
					// } else {
					//   vm.$toast("未支付或支付失败");
					// }
					// vm.$router.go(0);
				}
			)
		}
	},

	computed: {
		...mapGetters(['api', 'uid'])
	}
}
</script>

<style lang="less" scoped>
@import '~link-less';
.page {
	box-sizing: border-box;
	input {
		margin: 0;
		padding: 0;
	}
}
.header {
	position: relative;
	span {
		z-index: 99;
		position: absolute;
		right: 30px;
		top: 20px;
		font-size: 26px;
		color: rgba(0, 162, 234, 1);
	}
}
.box {
	width: 100%;
	height: 96px;
	line-height: 96px;
	padding: 0 30px;
	font-size: 28px;
	display: flex;
	align-items: center;
	color: #666666;
	border-bottom: 1px solid #f4f4f4;
	background: #fff;
	.boxtype {
		width: 130px;
		flex-shrink: 0;
		font-size: 32px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		margin-right: 20px;
		white-space: nowrap;
	}
	.boxvalue {
		position: relative;
		flex: 1;
		border: none;
	}
	.arrowicon {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translate(0, -50%);
		width: 28px;
		// height: 30px;
	}
}
.print {
	margin: 20px 0 0 32px;
	.printtop {
		font-size: 34px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);
		line-height: 48px;
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
	.printimg {
		margin: 20px 0 20px 20px;
		width: 203px;
		height: 203px;
		background: rgba(255, 255, 255, 1);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.imgsrc {
		width: 203px;
		height: 203px;
	}
	.printbottom {
		font-size: 26px;
		font-weight: 400;
		color: rgba(255, 59, 48, 1);
	}
}
.surebtn {
	margin: 20% 75px;
	width: 600px;
	height: 88px;
	background: rgba(0, 162, 234, 1);
	line-height: 88px;
	text-align: center;
	color: #fff;
	font-size: 34px;
	border-radius: 44px;
}
.first_img1 {
	padding: 30px;
	background: #fff;
	// margin: 20px;
	text-align: center;
	div {
		text-align: left;
		font-size: 32px;
		margin-bottom: 2%;
	}
	img {
		width: 80%;
		margin: 0 auto;
	}
}
</style>

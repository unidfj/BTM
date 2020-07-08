<template>
	<div class="page">
		<div class="body">
			<div class="header">
				<m-header title="我的提现" :canback="Boolean(1)"></m-header>
				<span @click="() => {this.$router.push({ name: 'tixianjilu' })} ">提现记录</span>
			</div>
			<!-- 内容 -->
			<!-- 提现类型 picker-->
			<div class="box">
				<div class="boxtype">提现类型</div>
				<div class="boxvalue" @click="() => {this.picker1.show = true}">
					{{ picker1.columnsPicker }}
					<img class="arrowicon" src="../../../assets/images/btm/ico_xl.png" />
				</div>
				<van-popup v-model="picker1.show" position="bottom" :close-on-click-overlay="false">
					<van-picker show-toolbar :columns="picker1.columns" title="提现类型" @cancel="onCancel($event, 1)" @confirm="onConfirm($event, 1)" />
				</van-popup>
			</div>
			<!-- 提现金额 -->
			<div class="box">
				<div class="boxtype">提现金额</div>
				<input class="boxvalue" type="number" placeholder="请输入提现金额" v-model="form.amount" />
			</div>
			<!-- 可提金额 -->
			<div class="box">
				<div class="boxtype">可提金额</div>
				<div class="boxvalue" style="color: #00a2ea;">{{ desc.money }}</div>
			</div>
			<!-- 实际到账 -->
			<div class="box">
				<div class="boxtype">实际到账</div>
				<div class="boxvalue" style="color: #ff3b30;">{{ desc.real }}</div>
			</div>
			<!-- 提现到 picker2 -->
			<div class="box">
				<div class="boxtype">提现到</div>
				<div class="boxvalue" @click="() => { this.picker2.show = true } ">
					{{ picker2.columnsPicker }}
					<img class="arrowicon" src="../../../assets/images/btm/ico_xl.png" />
				</div>
				<van-popup v-model="picker2.show" position="bottom" :close-on-click-overlay="false">
					<van-picker show-toolbar :columns="picker2.columns" title="提现类型" @cancel="onCancel($event, 2)" @confirm="onConfirm($event, 2)" />
				</van-popup>
			</div>
			<!-- 姓名 -->
			<div class="box">
				<div class="boxtype">姓名</div>
				<input class="boxvalue" type="text" placeholder="请填写姓名" v-model="form.name" />
			</div>
			<!-- 银行卡 -->
			<div v-if="picker2.columnsPicker == '银行卡'">
				<div class="box">
					<div class="boxtype">选择银行</div>
					<div class="boxvalue" @click="() => {this.picker3.show = true;}">
						{{ picker3.columnsPicker }}
						<img class="arrowicon" src="../../../assets/images/btm/ico_xl.png" />
					</div>
					<van-popup v-model="picker3.show" position="bottom" :close-on-click-overlay="false">
						<van-picker show-toolbar :columns="picker3.columns" title="选择银行" @cancel="onCancel($event, 3)" @confirm="onConfirm($event, 3)" />
					</van-popup>
				</div>
				<div class="box">
					<div class="boxtype">开户行</div>
					<input class="boxvalue" type="text" placeholder="请填写开户行" v-model="form.zh_name" />
				</div>
			</div>

			<!-- 微信的上传凭证 -->
			<div class="wrap" v-if="picker2.columnsPicker=='微信'">
				<div class="upload-text" v-show="!image">
					<img src="../../../assets/images/btm/ico_scico.png" />
					<div>请上传微信收款码</div>
				</div>
				<img :src="api+image" class="img" v-show="image" />
				<input type="file" class="inp" @change="upload($event)" />
			</div>

			<!-- 提现账号 -->
			<div class="box" v-if="picker2.columnsPicker !=='微信'">
				<div class="boxtype">提现账号</div>
				<input class="boxvalue" type="number" :placeholder="shuru" v-model="form.account" />
			</div>

			<!-- 确认账号 -->
			<div class="box" v-if="picker2.columnsPicker !=='微信'">
				<div class="boxtype">确认账号</div>
				<input class="boxvalue" type="number" :placeholder="queren" v-model="form.reaccount" />
			</div>

			<div class="tip">{{ desc.desc }}</div>
			<button class="btn" @click="btn" :disabled="disabled">确认提现{{ getdesc }}</button>
			<p class="redtip" v-html="desc.tx_content"></p>
		</div>
		<m-load ref="load"></m-load>
	</div>
</template>

<script>
import Vue from 'vue'
import { Util, Load } from '@/assets/commonjs/utils.js'
import { Owner, Base } from '@/server/server.js'
import { Picker, Popup, Field } from 'vant'
import Pwdalert from '@/components/pwd-alert'
import { mapGetters } from 'vuex'
Vue.use(Field).use(Popup).use(Picker)
export default {
	components: { Pwdalert },
	data () {
		return {
			descTimeout: null,
			disabled: false,
			image: null,
			desc: {}, //提现提示
			picker1: {
				show: false,
				columns: ['商城余额', '云仓货款'],
				columnsPicker: ''
			},
			picker2: {
				show: false,
				columns: ['支付宝', '微信', '银行卡'],
				columnsPicker: ''
			},
			picker3: {
				show: false,
				columns: [],
				columnsPicker: ''
			},
			form: {
				amount: null, //金额
				money_type: null, //提现类型:1=余额,6=云仓
				name: null, //姓名
				type: null, //支付宝1微信3银行卡4
				account: null, //账号
				reaccount: null, //确认账号
				zh_name: null, //开户行
				bank: null, //bank
				img: null,
			}
		}
	},
	mounted () {
		this.getBank() //获取银行信息
		this.getwithdrawDesc(Number(0), Number(1))
	},
	methods: {
		getBank () {
			// 获取银行信息
			Base.getBank().then(res => {
				this.picker3.columns = res.data.map(v => {
					return v.bankName
				})
			})
		},
		onCancel (e, i) {
			if (i == 1) this.picker1.show = false
			if (i == 2) this.picker2.show = false
			if (i == 3) this.picker3.show = false
		},
		onConfirm (e, i) {
			if (i == 1) {
				this.picker1.columnsPicker = e
				this.form.money_type = e === '商城余额' ? 1 : 6
				this.picker1.show = false
			}
			if (i == 2) {
				this.picker2.columnsPicker = e
				if (e == '支付宝') this.form.type = 1
				if (e == '微信') this.form.type = 3
				if (e == '银行卡') this.form.type = 4
				this.picker2.show = false
			}
			if (i == 3) {
				this.picker3.columnsPicker = e
				this.form.bank = e
				this.picker3.show = false
			}
		},
		upload (event) {
			console.log(123123)
			let _This = this
			if (event.target.value == '') return
			let formData = new FormData()
			Load.loadStart(_This)
			Util.uploadImgLimit(event.target.files[0], url => {
				formData.append('image', url)
				Base.upload(formData).then(res => {
					Load.loadEnd(_This)
					if (res.code == 1) {
						this.image = res.data
						this.form.img = res.data
						// this.src = res.data;
					} else {
						mui.toast(res.msg)
						return
					}
				})
			})
		},
		btn () {
			this.disabled = true
			Owner.getwithdraw(this.form).then(res => {
				console.log(res)
				if (res.data.code == 1) {
					mui.toast(res.data.msg)
					// this.form={}
					setTimeout(() => {
						this.$router.push({ name: 'tixianjilu' })
					}, 1500)
				} else {
					mui.toast(res.data.msg)
				}
			})
			setTimeout(() => {
				this.disabled = false
			}, 2000)
		},
		getwithdrawDesc (money, money_type) {
			Owner.getwithdrawDesc({ money, money_type }).then(res => {
				this.desc = res.data.data
				console.log(this.desc)
			})
		},
	},
	computed: {
		...mapGetters(['api']),
		shuru () {
			return '请输入' + this.picker2.columnsPicker + '账号'
		},
		queren () {
			return '请确认' + this.picker2.columnsPicker + '账号'
		},

		// 获取描述信息
		getdesc () {
			let { amount, money_type } = this.form
			if (!amount || !money_type) return
			clearTimeout(this.descTimeout)
			this.descTimeout = setTimeout(() => {
				this.getwithdrawDesc(amount, money_type)
			}, 400);
			return ''
		}
	}
}
</script>

<style lang="less" scoped>
@import '~link-less';
.body {
	box-sizing: border-box;
	//   background-color: @bg-color;
	background: #f4f4f4;
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
		flex: 1;
		position: relative;
	}
	.arrowicon {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translate(0, -50%);
		width: 30px;
		height: 30px;
	}
}
.tip {
	padding: 0 8%;
	line-height: 80px;
}
.btn {
	width: 600px;
	height: 88px;
	background: rgba(0, 162, 234, 1);
	border-radius: 44px;
	line-height: 88px;
	text-align: center;
	font-size: 34px;
	font-weight: 500;
	color: rgba(255, 255, 255, 1);
	margin: 40px 75px;
}
.redtip {
	padding: 0 8%;
	font-size: 24px;
	color: #ff3b30;
	text-align: left;
}
.wrap {
	width: 280px;
	height: 280px;
	background: #fff;
	position: relative;
	margin: 40px auto;
	text-align: center;
	.upload-text {
		width: 280px;
		height: 280px;
		padding-top: 18%;
	}
	.img {
		width: 280px;
		height: 280px;
	}
	.inp {
		position: absolute;
		top: 0;
		left: 0;
		width: 280px;
		height: 280px;
		opacity: 0;
	}
}
</style>

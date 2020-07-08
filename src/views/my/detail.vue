<template>
	<div class="page">
		<m-header :title="gettype" :canback="Boolean(1)"></m-header>
		<section class="body">
			<div :class="['blue',type=='credit1'?'iscredit1':'']">
				{{credit}}
				<div class="pa" v-if="type=='credit2'||type=='credit3'" @click="$router.replace({name:'zhuanzhang'})">转账</div>
				<div class="pa" v-if="type=='credit6'" @click="$router.replace({name:'tixian'})">提现</div>
				<div class="credit1" v-if="type=='credit1'">
					<span class="credit1_item" @click="$router.replace({name:'zhuanzhang'})">转账</span>
					<span class="credit1_item" @click="$router.replace({name:'chongzhi'})">充值</span>
					<span class="credit1_item" @click="$router.replace({name:'tixian'})">提现</span>
				</div>
			</div>
			<section class="title">
				<span v-for="e of ['说明', '数量', '时间']" :key="e">{{ e }}</span>
			</section>

			<section class="listbox">
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset="100">
					<div class="listitem" v-for="(item, index) of list" :key="index">
						<div>{{item.remark}}</div>
						<div>{{item.num}}</div>
						<div>{{item.createtime}}</div>
					</div>
				</van-list>
			</section>
		</section>
	</div>
</template>

<script>
import { Owner } from '@/server/server.js'
import Vue from 'vue'
import { List } from 'vant'
import { mapGetters } from 'vuex'
Vue.use(List)
export default {
	data() {
		return {
			isshow: true,
			loading: false,
			finished: false,
			list: [],
			curren: 0,
			page: 1, //
			page_rows: 20, //
			type: '', //
			title: null,
			credit: null
		}
	},
	methods: {
		getdata() {
			this.loading = true
			let { page, page_rows } = this
			let { type } = this.$route.query
			Owner.getAccountLog({ page, page_rows, type }).then(res => {
				console.log(res)
				// 判断还有更多;
				res.data.length < this.page_rows
					? (this.finished = true)
					: this.page++
				this.credit = res.credit
				this.list = [
					...this.list,
					...res.data.map(v => {
						return {
							...v,
							createtime: v.createtime.split(' ')[0]
						}
					})
				]
				this.loading = false
			})
		},
		onLoad() {
			this.getdata()
		}
	},
	mouted() {
		this.getdata()
	},

	computed: {
		gettype() {
			let fn = type =>
				({
					credit1: '商城余额明细',
					credit2: '消费金明细',
					credit3: '股权明细',
					credit4: '优惠券明细',
					credit5: '冻结奖金明细',
					credit6: '云仓货款明细'
				}[type] || '')
			this.type=this.$route.query.type
			return fn(this.$route.query.type)
		}
	}
}
</script>

<style lang="less" scoped>
@import '~link-less';
.page {
	box-sizing: border-box;
	.body {
		background-color: @bg-color;
	}

	.blue {
		color: #fff;
		width: 690px;
		height: 178px;
		background: rgba(0, 162, 234, 1);
		border-radius: 8px;
		margin: 30px;
		padding: 20px;
		.display-flex();
		justify-content: center;
		align-items: center;
		font-size: 54px;
		position: relative;

		.pa {
			position: absolute;
			right: 20px;
			top: 20px;
			width: 160px;
			height: 58px;
			border-radius: 34px;
			border: 1px solid rgba(255, 255, 255, 1);
			font-size: 28px;
			line-height: 58px;
			text-align: center;
		}
		.credit1 {
			margin-top: 20px;
			width: 80%;
			.display-flex();
			justify-content: space-between;
			align-items: center;
			.credit1_item {
				font-size: 28px;
				width: 160px;
				height: 58px;
				border-radius: 34px;
				text-align: center;
				line-height: 58px;
				border: 1px solid rgba(255, 255, 255, 1);
			}
		}
	}
	.title {
		.display-flex();
		justify-content: space-between;
		align-items: center;
		height: 84px;
		background: #fff;
		font-size: 28px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		// padding: 0 40px 0 70px;
		border-bottom: 1px solid #f4f4f4;
		span {
			flex: 1;
			text-align: center;
		}
		span:nth-child(1) {
			flex: 1.5;
		}
	}
}
.listbox {
	overflow: auto;
	height: 100%;
}
.listitem {
	background: #fff;
	padding: 5px 20px;
	border-bottom: 1px solid #f4f4f4;
	overflow: auto;
	line-height: 40px;
	font-size: 24px;
	color: rgba(102, 102, 102, 1);
	.display-flex();
	align-items: center;
	justify-content: space-between;
	text-align: center;
	div {
		flex: 1;
	}
	div:nth-child(1) {
		flex: 1.5;
		max-height: 80px;
		overflow: auto;
	}
}
.iscredit1 {
	.display-flex();
	flex-direction: column;
	justify-content: space-between;
}
</style>

<template>
	<!-- 余额明细 -->
	<div class="page">
		<m-header title="奖金收益明细" :canback="Boolean(1)"></m-header>
		<section class="body" v-if="isshow">
			<section class="tab">
				<div :class="['tabitem', curren == i ? 'active' : '']" v-for="(e, i) of tab" :key="e.id" @click="handleCurren(i)">{{ e.title }}</div>
			</section>

			<div class="titlebox">
				<div class="title" v-for="(e, i) of ['说明', '数量', '时间']" :key="i">{{ e }}</div>
			</div>
			<div class="listbox">
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :offset="100">
					<div class="listitem" v-for="(item, index) of list" :key="index">
						<span>{{ item.source }}</span>
						<span>{{ item.netincome }}</span>
						<span>{{ item.granttime }}</span>
					</div>
				</van-list>
			</div>
		</section>
	</div>
</template>

<script>
import { Owner } from '@/server/server.js'
import Vue from 'vue'
import { List } from 'vant'
import { mapGetters } from 'vuex'
Vue.use(List)
// Vue.use(Loading);
export default {
	data () {
		return {
			isshow: true,
			loading: false,
			finished: false,
			list: [],
			curren: 0,
			tab: [
				{ title: '推荐奖', id: 'f1' },
				{ title: '复购差额奖', id: 'f2' },
				// { title: '平级奖', id: 'f4' },
				{ title: '0元区奖', id: 'f5' },
				{ title: '团队奖', id: 'f7' },
				{ title: '超越奖', id: 'f4' }
			],
			page: 1,
			limit: 20
		}
	},
	methods: {
		handleCurren (index) {
			if (index !== this.curren) {
				this.curren = index
				this.page = 1
				this.list = []
				this.getdata()
			}
		},
		getdata () {
			this.loading = true
			Owner.getbonus({
				page: this.page,
				limit: this.limit,
				type: this.tab[this.curren].id
			}).then(res => {
				console.log(res)
				// 判断还有更多;
				res.data.data.length < this.limit
					? (this.finished = true)
					: this.page++

				this.list = [
					...this.list,
					...res.data.data.map(v => {
						return { ...v, granttime: v.granttime.split(' ')[0] }
					})
				]
				this.loading = false
			})
		},
		onLoad () {
			this.getdata()
		}
	},
	created () {
		this.getdata()
	},
	computed: {
		...mapGetters(['userInfo'])
	}
}
</script>

<style lang="less" scoped>
@import '~link-less';
.page {
	box-sizing: border-box;
	background-color: @bg-color;
}
.tab {
	background: #fff;
	padding: 25px 0;
	text-align: center;
	display: flex;
	display: -webkit-box;
	// justify-content: space-around;
	align-items: center;
	border-bottom: 20px solid #f4f4f4;
	overflow: auto;
}
.tabitem {
	white-space: nowrap;
	width: 22%;
	// width: 158px;
	background: rgba(245, 245, 245, 1);
	border-radius: 40px;
	height: 70px;
	line-height: 70px;
	font-size: 26px;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 500;
	color: rgba(51, 51, 51, 1);
}
.active {
	background: rgba(0, 162, 234, 1);
	color: #fff;
}
.titlebox {
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 22px 80px 22px 60px;
	background: #fff;
	.title {
		flex-shrink: 0;
	}
	.title:nth-child(1) {
		min-width: 160px;
	}
}
.isloading {
	box-sizing: content-box;
	border-radius: 20px;
	padding: 40px;
	background: #79797a;
	position: absolute;
	top: 200px;
	left: 50%;
	transform: translate(-50%);
}
.listbox {
	background: #fff;
	height: 100%;
	overflow: auto;
}
.listitem {
	margin: 10px 30px 10px 40px;
	border-bottom: 1px solid #f4f4f4;
	display: flex;
	justify-content: space-between;
	align-items: center;
	span:nth-child(1) {
		max-width: 45%;
	}
	border-bottom: 1px solid #eee;
}
.cannot {
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translate(-50%);
	font-size: 40px;
	color: #999;
}
</style>

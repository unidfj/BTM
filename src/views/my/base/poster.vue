<template>
	<div class="page">
		<m-header title="分享海报" :canback="Boolean(1)"></m-header>
		<section class="body">
			<img v-if="plus" class="img" @touchstart="touchstart" @touchend="touchend" @touchmove="touchend" :src="api+src" />
			<img v-else class="img imgelse" :src="api+src" />

			<div class="main">
				分享到朋友圈,在
				<span style="color: #ff3b30;">【会员福利】</span>
				朋友圈转发截图,可获得一次0元商品免费领取机会，每个普通会员仅限一次哦！！
			</div>
		</section>
	</div>
</template>
<script>
import { Init } from '@/server/server.js'
import { mapGetters } from 'vuex'

export default {
	computed: {
		...mapGetters(['api'])
	},
	data () {
		return {
			src: '',
			plus: false
		}
	},
	methods: {
		getdata () {
			Init.getconfig().then(r => {
				this.src = r.data.data.share_img
			})
		},
		touchstart () {
			try {
				if (plus) {
					this.touchTime = setTimeout(() => {
						var dtask = plus.downloader.createDownload(this.api + this.src, { method: "GET" }, function (d, status) {
							if (status == 200) {
								plus.gallery.save(d.filename, function () {
									return mui.toast("保存成功")
								})
							} else mui.toast("保存失败")
						})
						dtask.start()
					}, 600)
				}
			} catch (error) {
				console.log("no");
			}
		},
		touchend () {
			this.touchTime && clearTimeout(this.touchTime)
		}
	},
	created () {
		this.getdata()
		try {
			this.plus = plus ? true : false
		} catch (error) {

		}
	}
}
</script>
<style lang="less" scoped>
@import '~link-less';
.page {
	box-sizing: border-box;
	background: #fff;
	position: relative;
	text-align: center;
}

.img {
	margin: 80px auto;
	width: 500px;
	height: 700px;
	background: #fff;
	border-radius: 10px;
	overflow: hidden;
}

.main {
	margin: auto;
	width: 500px;
	font-size: 24px;
	font-weight: 400;
	color: rgba(102, 102, 102, 1);
	line-height: 33px;
}
</style>

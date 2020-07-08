<template>
	<div class="page">
		<m-header title="邀请好友" :canback="Boolean(1)"></m-header>
		<img v-if="plus" class="body" @touchstart="touchstart" @touchend="touchend" @touchmove="touchend" :src="api+bg" />
		<img v-else class="body bodyelse" :src="api+bg" />
	</div>
</template>
<script>
import QRCode from "qrcode";
import { mapGetters } from "vuex";
import Clipboard from "clipboard";
import { Owner } from "@/server/server.js";
export default {
	name: "invite",
	data () {
		return {
			plus: false,
			touchTime: "",
			inviteSrc: null,
			inviteUrl: null,
			myClipboard: null,
			code: null,
			bg: null,
		};
	},
	mounted () {
		this.getActivityImg();
		try {
			this.plus = plus ? true : false
		} catch (error) {
		}
	},
	computed: {
		...mapGetters(["uid", "userInfo", "api"]),
	},
	methods: {
		getActivityImg () {
			Owner.getActivityImg().then((res) => {
				if (res.code === 1) {
					this.bg = res.data;
				}
			});
		},
		setCode (url) {
			QRCode.toDataURL(url)
				.then((url) => {
					this.inviteSrc = url;
				})
				.catch((err) => {
					console.error(err);
				});
		},

		touchstart (e) {
			clearTimeout(this.touchTime);
			let src = this.api + this.bg;
			try {
				if (plus) {
					this.touchTime = setTimeout(() => {
						var dtask = plus.downloader.createDownload(src, { method: "GET" }, function (d, status) {
							if (status == 200) {
								plus.gallery.save(d.filename, function () {
									return mui.toast("保存成功");
								});
							} else mui.toast("保存失败");
						});
						dtask.start();
					}, 600);
				}
			} catch (error) {
				console.log("no");
			}
		},
		touchend (e) {
			this.touchTime && clearTimeout(this.touchTime);
		},
	}
};
</script>
<style lang="less" scoped>
@import '~link-less';

.body {
	background: #fff;
	text-align: center;
	.img {
		width: 100%;
		// height: 100%;
	}
	.img-box {
		position: absolute;

		top: 12%;
		left: 50%;
		width: 75%;
		border-radius: 10px;
		padding: 50px 0;
		transform: translate(-50%);
		.btn {
			width: 100%;
			height: 88px;
			background: rgba(0, 162, 234, 1);
			border-radius: 44px;
			line-height: 88px;
			text-align: center;
		}
		.tip {
			color: #000;
			margin-bottom: 80px;
			font-size: 38px;
		}
		#url {
			opacity: 0;
		}
	}
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

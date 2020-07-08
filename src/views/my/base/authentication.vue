<template>
	<div class="page">
		<m-header title="实名认证" :canback="Boolean(1)"></m-header>
		<section class="body">
			<m-load ref="load"></m-load>
			<section class="imgbox">
				<!-- 1正面+预览 -->
				<van-uploader v-if="!form.himage1" :after-read="onRead1" class="zm" :style="`background:url(${icon[1]}) center center;background-size: contain`">
					<img class="small" :src="icon[0]" />
					上传身份证正面
				</van-uploader>
				<div class="pr" v-show="form.himage1" @click="delImg(1)">
					<img :src="api + form.himage1" class="img" />
					<i class="mui-icon mui-icon-closeempty pa" v-if="!(successdata.status==1||successdata.status==0)"></i>
				</div>

				<!-- 2反面+预览 -->
				<van-uploader v-if="!form.himage2" :after-read="onRead2" class="zm" :style="`background:url(${icon[2]}) center center;background-size: contain`">
					<img class="small" :src="icon[0]" />
					上传身份证反面
				</van-uploader>
				<!-- 预览 -->
				<div class="pr" v-if="form.himage2" @click="delImg(2)">
					<img :src="api + form.himage2" class="img" />
					<i class="mui-icon mui-icon-closeempty pa" v-if="!(successdata.status==1||successdata.status==0)"></i>
				</div>
			</section>
			<div class="inpbox">
				真实名字:
				<input class="inp" type="text" v-model="form.realname" readonly />
			</div>

			<div class="inpbox">
				身份证号:
				<input class="inp" type="text" v-model="form.creditid" readonly />
			</div>

			<div class="inpbox red" v-if="successdata.status">
				实名状态:
				<span>{{successdata.status==1?'已实名':successdata.status==2?'认证失败':'待审核'}}</span>
			</div>

			<div class="red" v-if="successdata.status==2">
				失败理由:
				<span>{{successdata.reason}}</span>
			</div>

			<div style="margin-left: 40px;" v-if="!(successdata.status==1||successdata.status==0)">
				<p>请确认身份信息，如有误请修改</p>
				<button @click="btn" class="btn" :disabled="disabled">{{successdata.status==2?'重新':''}}提交</button>
			</div>
		</section>
	</div>
</template>

<script>
import Vue from 'vue'
import { Uploader, Dialog } from 'vant'
import { Owner } from '@/server/server.js'
import { mapGetters } from 'vuex'
import { Util, Load } from '@/assets/commonjs/utils.js'
Vue.use(Uploader).use(Dialog)
export default {
	computed: {
		...mapGetters(['api', 'userInfo'])
	},
	data() {
		return {
			disabled: false,
			icon: [
				//   小图标 正面 反面
				require('@/assets/images/btm/ico_scico.png'),
				require('@/assets/images/btm/ico_zm.png'),
				require('@/assets/images/btm/ico_fm.png')
			],
			form: {
				//   图片预览路径
				himage1: null,
				himage2: null,
				realname: null,
				creditid: null
			},
			successdata: {}
		}
	},
	methods: {
		delImg(i) {
			if (this.successdata.status == 1 || this.successdata.status == 0) {
				return
			}
			Dialog.confirm({
				title: '提示',
				message: `确定删除身份证${i == 1 ? '正面' : '反面'}照片`
			}).then(() => {
				if (i == 1) {
					this.form.himage1 = ''
					this.form.realname = ''
					this.form.creditid = ''
				} else this.form.himage2 = ''
			})
		},
		onRead1(file) {
			this.upload(file.content, 'front')
		},
		onRead2(file) {
			this.upload(file.content, 'back')
		},
		upload(image, side) {
			Load.loadStart(this)
			Owner.getuploadIDcard({ image, side }).then(res => {
				const { data } = res.data
				Load.loadEnd(this)
				if (res.data.code !== 1) {
					mui.toast(res.data.msg)
					return
				}
				if (side == 'front') {
					this.form.himage1 = data.imgpath
					this.form.realname = data.result.realname
					this.form.creditid = data.result.idcard
				}
				if (side == 'back') this.form.himage2 = data.imgpath
			})
		},
		btn() {
			this.disabled = true
			let result = true
			Object.keys(this.form).forEach(v => {
				if (!this.form[v]) result = false
			})
			if (result) {
				Owner.getidentity(this.form).then(res => {
					if (res.data.code == 1) {
						mui.toast(res.data.msg)
						setTimeout(() => {
							this.$router.go(-1)
						}, 1500)
					} else mui.toast(res.data.msg)
				})
			} else mui.toast('请上传身份证并保证能识别成功')
			setTimeout(() => {
				this.disabled = false
			}, 2000)
		}
	},
	created() {
		Owner.getidentitylist({ page: 1 }).then(res => {
			console.log('creat', res)
			if (res.data.code == 1) {
				const { successdata } = res.data
				if (successdata) {
					this.successdata = successdata
					this.form.creditid = successdata.idcard
					this.form.realname = successdata.name
					this.form.himage1 = successdata.himage1
					this.form.himage2 = successdata.himage2
				}
			}
		})
	}
}
</script>

<style lang="less" scoped>
@import '~link-less';
.page {
	background-color: #fff;
}
.small {
	width: 60px;
	height: 60px;
}
.imgbox {
	margin: 40px 57px;
	height: 206px;
	//   background: pink;
	.display-flex();
	justify-content: space-between;
	align-items: center;
}
.zm {
	width: 300px;
	height: 206px;
	padding: 40px;
	font-size: 28px;
	color: #6c747a;
	.display-flex();
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
}
// .yulan {
// 	width: 100%;
// 	height: 100%;
// 	position: relative;
// }

.inpbox {
	padding: 0 40px;
	.display-flex();
	justify-content: center;
	align-items: center;
	white-space: nowrap;
	height: 96px;
	line-height: 96px;
	background: rgba(255, 255, 255, 1);
	border-bottom: 1px solid #f4f4f4;
	font-size: 34px;
	color: #333;
	.inp {
		margin: 0;
		border: 0;
		font-size: 28px;
		font-family: PingFangSC-Regular, PingFang SC;
		// color: rgba(204, 204, 204, 1);
	}
}
.red {
	justify-content: start !important;
	padding: 20px 40px;
	font-size: 32px;
	span {
		padding-left: 20px;
		font-size: 28px;
		color: #ff3b30;
	}
}

p {
	margin: 50px 30px;
	font-size: 24px;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: rgba(204, 204, 204, 1);
	line-height: 33px;
}
.btn {
	margin: auto;
	width: 600px;
	height: 88px;
	background: rgba(0, 162, 234, 1);
	border-radius: 44px;
	color: #fff;
	font-size: 34px;
}
.pr {
	// width: 48%;
	width: 300px;
	height: 206px;
	height: 100%;
	position: relative;
	img {
		width: 100%;
		height: 100%;
	}
}
.pa {
	position: absolute;
	top: 0;
	right: 0;
	font-size: 50px;
	font-weight: 600;
}
</style>

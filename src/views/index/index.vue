<template>
	<div class="page">
		<!-- <m-header title="蓓汀美" :canback="Boolean(0)"></m-header> -->
		<div class="body">
			<div class="top-wrap">
				<section class="search">
					<div class="left">
						<img src="../../assets/images/btm/sc_ico_ss.png" class="search-img" />
						<input type="text" class="sea-inp" placeholder="请输入商品名称" v-model="re_value" />
					</div>
					<span class="sea-btn" @click="onSearch">搜索</span>
				</section>
				<div class="shop-nav">
					<ul class="nav-wrap">
						<li class="nav-list active-list">精选</li>
						<li class="nav-list" v-for="item in categoryNav" :key="item.id" @click="goNav(item.id,item.name)">{{item.name}}</li>
					</ul>
					<img src="../../assets/images/btm/sc_ico_gd.png" class="category-img" @click="goTo('AllCategories')" />
				</div>
			</div>
			<swiper :options="swiperOption" class="swiper-wrap" ref="mySwiper" v-if="banner.length!=0">
				<swiper-slide v-for="(item, index) in banner" :key="index">
					<img :src="item.image" class="title-img" style="width: 100%;" @click="bannerDetail(item.content)" />
				</swiper-slide>
				<!-- 常见的小圆点 -->
				<div class="swiper-pagination" slot="pagination" v-for="(item,index) in banner" :key="index"></div>
			</swiper>
			<div class="notice" :style="'height:'+setHeight+'px;line-height:'+setHeight+'px'" @click="goTo('Notice')">
				<img src="../../assets/images/btm/sc_ico_voice.png" alt class="notice-img" />
				<ul class="notice-list" :style="'-webkit-transform:translateY('+move+');transition:all '+moveTime+'s;'">
					<li class="notice-item" v-for="(item,index) in noticeList" :key="index">{{item.title}}</li>
				</ul>
			</div>
			<!-- 分类 -->
			<div class="block" v-for="item in categoryNav" :key="item.id">
				<div class="title">
					<div class="left">{{item.name}}</div>
					<div class="right" @click="goNav(item.id,item.name)">查看更多></div>
				</div>
				<img class="blockimg" :src="item.image" alt />
				<ul class="cardbox">
					<li class="goods-list" v-for="item in item.goods" :key="item.goods_id" @click="goDetail(item.goods_id)">
						<img :src="api+item.images.split(',')[0]" class="goods-img" />
						<div class="goods-info">
							<div class="goods-name">{{item.goods_name}}</div>
							<div class="goods-bot">
								<span class="price">￥{{item.spec[0].goods_price}}</span>
								<img src="../../assets/images/btm/sc_ico_gwc.png" class="cart-img" />
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<m-Footer></m-Footer>
	</div>
</template>
<script>
import { Owner, Index } from '@/server/server.js'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { mapGetters } from 'vuex'
require('swiper/dist/css/swiper.css') //引入swiper.css
export default {
	data() {
		return {
			swiperOption: {
				loop: true,
				autoplay: {
					delay: 2500,
					stopOnLastSlide: false,
					/* 触摸滑动后是否继续轮播 */
					disableOnInteraction: false
				},
				// 分页器设置
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
					type: 'bullets'
				}
			},
			categoryNav: [], //商品导航分类
			categoryList: {}, //商品分类
			re_value: null,
			move: 0,
			moveTime: 3,
			setHeight: 37.5,
			noticeList: [], //公告
			banner: [], //轮播
			// navImgs: [] //nav的图片
		}
	},
	components: {
		swiper,
		swiperSlide
	},
	computed: {
		...mapGetters(['api'])
	},
	created() {
        sessionStorage.setItem('btmNav',0);
		this.getTitle()
		this.getBanner()
		this.getCategory()
	},
	methods: {
		onSearch() {
			//搜索跳转
			this.$router.push({
				name: 'Partition',
				query: { name: this.re_value }
			})
		},
		goNav(id, name) {
			// if (id == 3) {
			// 	this.$router.push({ name: 'ZeroGoods' })
			// 	return
			// }
			this.$router.push({ name: 'Partition', query: { id, name } })
		},
		goTo(name) {
			this.$router.push({ name })
		},
		goDetail(id) {
			this.$router.push({ name: 'GoodsDetail', query: { id } })
		},
		getCategory() {
			Index.getCategory({}).then(res => {
				if (res.code === 1) {
					this.categoryNav = res.data.data.reverse()
					// this.navImgs = this.categoryNav.map(v => v.image)
				} else {
					mui.toast(res.msg)
				}
			})
		},
		getBanner() {
			Index.getBanner().then(res => {
				if (res.code === 1) {
					this.banner = res.data.bannerlist
					// this.categoryList = res.data
				}
			})
		},
		getTitle() {
			Index.getTitle({}).then(res => {
				if (res.code === 1) {
					this.noticeList = res.data
					this.noticeMove()
				}
			})
		},
		noticeMove() {
			let [i, _This] = [1, this]
			setInterval(() => {
				;(() => {
					if (i < _This.noticeList.length) {
						_This.moveTime = 1
						_This.move = '-' + _This.setHeight * i + 'px'
						i++
					} else {
						i = 1
						_This.moveTime = 0
						_This.move = 0
					}
				})()
			}, 2000)
			// }
		}
	}
}
</script>

<style lang="less" scoped>
@import '~link-less';
.body {
	background-color: @bg-color;
	font-family: PingFangSC-Medium, PingFang SC;
	.top-wrap {
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 100;
		.search {
			padding: 24px 0;
			.display-flex();
			align-items: center;
			background: #fff;
			.left {
				margin-left: 20px;
				flex: 1;
				position: relative;
				.search-img {
					width: 34px;
					position: absolute;
					left: 25px;
					top: 13px;
				}
				.sea-inp {
					height: 60px;
					margin: 0;
					padding: 0;
					color: #999;
					padding-left: 74px;
					background: #f4f4f4;
					border-radius: 100px;
					font-size: 26px;
					border: none;
					&::placeholder {
						color: #999;
					}
				}
			}
			.sea-btn {
				padding: 0 20px;
				color: #00a2ea;
			}
		}
		.shop-nav {
			padding: 0 24px 24px 24px;
			background: #fff;
			overflow-x: auto;
			position: relative;
			.nav-wrap {
				.display-flex();
				width: 90%;
				overflow-x: auto;
				.nav-list {
					margin-right: 24px;
					width: 200px;
					flex-shrink: 0;
					flex: none;
					text-align: center;
					padding: 12px 45px;
					color: #333;
					background: #f5f5f5;
					border-radius: 8px;
					font-size: 24px;
					&:last-child {
						margin-right: 0px;
					}
				}
				.active-list {
					background: rgba(0, 175, 255, 0.1);
					color: #00afff;
				}
			}
			.category-img {
				position: absolute;
				top: 8px;
				right: 20px;
				width: 50px;
			}
		}
	}
	.swiper-wrap {
		margin-top: 198px;
		.title-img {
			display: block;
			width: 100%;
		}
	}

	.notice {
		position: relative;
		padding: 0 30px;
		display: flex;
		background: #e5f7ff;
		color: #00a2ea;
		font-size: 24px;
		overflow: hidden;
		.notice-img {
			width: 50px;
			height: 28px;
			margin-top: 24px;
			padding-right: 20px;
		}
		.notice-list {
			flex: 1;
			margin-left: 20px;
		}
		.notice-item {
			height: 100%;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}
}

//分区
.block {
	padding: 20px 0;
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px;
		font-size: 38px;
		color: #333333;
		font-weight: 600;
		background: #fff;
		.right {
			font-weight: 400;
			font-size: 24px;
			color: #00a2ea;
		}
	}
	.blockimg {
		width: 96%;
		height: 200px;
		display: block;
		margin: 20px auto 0 auto;
		border-radius: 10px;
		overflow: hidden;
	}
	.cardbox {
		font-size: 0;
		.goods-list {
			margin-top: 20px;
			width: 47%;
			display: inline-block;
			font-size: 28px;
			border-radius: 16px;
			background: #fff;
			&:nth-child(odd) {
				margin-left: 2%;
				margin-right: 2%;
			}
			.goods-img {
				width: 100%;
				// height: 240px;
				display: block;
				border-top-left-radius: 16px;
				border-top-right-radius: 16px;
			}
			.goods-info {
				padding: 15px;
				.goods-name {
					padding-bottom: 5px;
					color: #333;
					font-weight: 500px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.goods-bot {
					.display-flex();
					justify-content: space-between;
					.price {
						font-size: 36px;
						color: #ff3b30;
					}
					.cart-img {
						width: 38px;
						height: 38px;
					}
				}
			}
		}
	}
}
// 卡片
</style>

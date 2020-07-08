import Vue from "vue";
import Router from "vue-router";
import { Util } from "@/assets/commonjs/utils.js";
// import store from '../store/index';
// import { resolve } from 'url';

const notFoundPage = (resolve) => require(["@/views/404Page"], resolve);
const Welcome = (resolve) => require(["@/views/welcome"], resolve);
const UploadWgt = (resolve) => require(["@/views/uploadWgt"], resolve);

// 首页  --start

const Index = (resolve) => require(["@/views/index/index.vue"], resolve);
const NoticeDetail = (res) => require(["@/views/index/noticeDetail.vue"], res);
const Notice = (resolve) => require(["@/views/index/notice.vue"], resolve);
const Partition = (res) => require(["@/views/index/partition.vue"], res);
const GoodsDetail = (res) => require(["@/views/index/goodsDetail.vue"], res);
const SubOrder = (res) => require(["@/views/index/subOrder.vue"], res);
const AllCategories = (res) => require(["@/views/index/allCategories.vue"], res);
const ZeroGoods = (res) => require(["@/views/index/zeroGoods.vue"], res);

// const GoodsDetail = resolve => require(['@/views/index/goodsDetail.vue'], resolve);

// 首页  --end

// 全部商品 --start

const Shop = (resolve) => require(["@/views/shop/index.vue"], resolve);
// const Shop = (res) => require(["@/views/shop/goodsdetail.vue"], res);
// 全部商品 --end

// 购物车 --start

const Cart = (resolve) => require(["@/views/cart/index.vue"], resolve);

// 购物车 --end

//个人中心 --start

const My = (resolve) => require(["@/views/my/index.vue"], resolve);
const MyOrder = (resolve) => require(["@/views/my/myOrder.vue"], resolve);
const OrderDetail = (resolve) =>require(["@/views/my/orderDetail.vue"], resolve);
// const Invite = (resolve) => require(["@/views/my/invite.vue"], resolve);
const Certify = (resolve) => require(["@/views/my/certify.vue"], resolve);
const TeamList = (resolve) => require(["@/views/my/team-list.vue"], resolve);
const Pay = (resolve) => require(["@/views/my/pay.vue"], resolve);
const Address = (resolve) => require(["@/views/my/address.vue"], resolve);
const EditAddress = (resolve) =>
  require(["@/views/my/editAddress.vue"], resolve);
const MyCloud = (resolve) => require(["@/views/my/myCloud.vue"], resolve);
const CloudLog = (resolve) => require(["@/views/my/cloudLog.vue"], resolve);
const ReceivingRefund = (resolve) =>
  require(["@/views/my/receivingRefund.vue"], resolve);
const ApplyRefund = (resolve) =>
  require(["@/views/my/applyRefund.vue"], resolve);
const Detail = (resolve) => require(["@/views/my/detail.vue"], resolve);

// 账户操作 提现 充值
const Tixian = (resolve) => require(["@/views/my/account/tixian.vue"], resolve);
const Tixianjilu = (resolve) =>
  require(["@/views/my/account/tixianjilu.vue"], resolve);
const Chongzhi = (resolve) =>
  require(["@/views/my/account/chongzhi.vue"], resolve);
const Chongzhijilu = (resolve) =>
  require(["@/views/my/account/chongzhijilu.vue"], resolve);
const Zhuanzhang = (resolve) =>
  require(["@/views/my/account/zhuanzhang.vue"], resolve);
const Zhuanzhangjilu = (resolve) =>
  require(["@/views/my/account/zhuanzhangjilu.vue"], resolve);
const Bonus = (resolve) => require(["@/views/my/account/bonus.vue"], resolve);

// 基本信息 邀请好友 我的团队 分享海报 会员福利  实名认证
const Invite = (resolve) => require(["@/views/my/base/invite.vue"], resolve);
const Myteam = (resolve) => require(["@/views/my/base/myteam.vue"], resolve);
const Poster = (resolve) => require(["@/views/my/base/poster.vue"], resolve);
const Benefits = (resolve) =>
  require(["@/views/my/base/benefits.vue"], resolve);
const Authentication = (resolve) =>
  require(["@/views/my/base/authentication.vue"], resolve);
const Set = (resolve) => require(["@/views/my/set.vue"], resolve);
//个人中心 --end

// 用户相关  -start
const SetPwd = (resolve) => require(["@/views/init/set-pwd.vue"], resolve);
const Login = (resolve) => require(["@/views/init/login.vue"], resolve);
const BackPwd = (resolve) => require(["@/views/init/back-pwd.vue"], resolve);
const Register = (resolve) => require(["@/views/init/register.vue"], resolve);
const Agreement = (resolve) => require(["@/views/init/agreement.vue"], resolve);

// 用户相关  -end

// 下载
const Download = (resolve) => require(["@/views/download.vue"], resolve);

Vue.use(Router);
let routes = [
  {
    path: "/",
    redirect: { name: "Index" },
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: Welcome,
  },
  {
    path: "/uploadwgt",
    name: "UploadWgt",
    component: UploadWgt,
  },
  {
    path: "/download",
    name: "Download",
    component: Download,
  },
  {
    path: "/setpwd",
    name: "SetPwd",
    component: SetPwd,
  },

  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/backpwd",
    name: "BackPwd",
    component: BackPwd,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/agreement",
    name: "Agreement",
    component: Agreement,
  },

  //首页
  {
    path: "/index",
    name: "Index",
    component: Index,
  },
  {
    path: "/index/notice",
    name: "Notice",
    component: Notice,
  },
  {
    path: "/index/noticeDetail/:id",
    name: "NoticeDetail",
    component: NoticeDetail,
  },
  {
    path: "/index/partition",
    name: "Partition",
    component: Partition,
  },
  {
    path: "/index/goodsDetail",
    name: "GoodsDetail",
    component: GoodsDetail,
  },
  {
    path: "/index/subOrder",
    name: "SubOrder",
    component: SubOrder,
  },
  {
    path: "/index/allCategories",
    name: "AllCategories",
    component: AllCategories,
  },
  {
    path: "/index/zeroGoods",
    name: "ZeroGoods",
    component: ZeroGoods,
  },

  //购物车
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },

  //全部商品
  {
    path: "/shop",
    name: "Shop",
    component: Shop,
  },
  // {
  //   path: "/shop/goodsdetail",
  //   name: "goodsdetail",
  //   component: goodsdetail,
  // },

  //个人中心
  {
    path: "/myOrder",
    name: "MyOrder",
    component: MyOrder,
    children: [
      {
        path: "/myOrder/orderDetail",
        name: "OrderDetail",
        component: OrderDetail,
      },
    ],
  },
  {
    path: "/my",
    name: "My",
    component: My,
  },
  {
    path: "/my/detail",
    name: "Detail",
    component: Detail,
  },

  // 提现// 提现记录
  { path: "/my/account/tixian", name: "tixian", component: Tixian },

  { path: "/my/account/tixianjilu", name: "tixianjilu", component: Tixianjilu },
  //充值//充值记录
  { path: "/my/account/chongzhi", name: "chongzhi", component: Chongzhi },
  {
    path: "/my/account/chongzhijilu",
    name: "chongzhijilu",
    component: Chongzhijilu,
  },
  //转账//转账记录
  { path: "/my/account/zhuanzhang", name: "zhuanzhang", component: Zhuanzhang },
  {
    path: "/my/account/zhuanzhangjilu",
    name: "zhuanzhangjilu",
    component: Zhuanzhangjilu,
  },
  // 明细
  {
    path: "/my/account/bonus",
    name: "bonus",
    component: Bonus,
  },
  // 邀请
  {
    path: "/my/base/invite",
    name: "invite",
    component: Invite,
  },
  // 我的团队
  { path: "/my/base/myteam", name: "myteam", component: Myteam },
  // 分享海报
  { path: "/my/base/poster", name: "poster", component: Poster },
  // 会员福利
  { path: "/my/base/benefits", name: "benefits", component: Benefits },
  // 实名认证
  {
    path: "/my/base/authentication",
    name: "authentication",
    component: Authentication,
  },

  {
    path: "/certify",
    name: "Certify",
    component: Certify,
  },

  {
    path: "/teamlist",
    name: "TeamList",
    component: TeamList,
  },
  {
    path: "/pay",
    name: "Pay",
    component: Pay,
  },
  {
    path: "/address",
    name: "Address",
    component: Address,
  },
  {
    path: "/editAddress",
    name: "EditAddress",
    component: EditAddress,
  },
  {
    path: "/myCloud",
    name: "MyCloud",
    component: MyCloud,
  },
  {
    path: "/cloudLog",
    name: "CloudLog",
    component: CloudLog,
  },
  {
    path: "/receivingRefund",
    name: "ReceivingRefund",
    component: ReceivingRefund,
  },
  {
    path: "/applyRefund",
    name: "ApplyRefund",
    component: ApplyRefund,
  },

  {
    path: "/set",
    name: "Set",
    component: Set,
  },

  {
    path: "*",
    name: "404Page",
    component: notFoundPage,
  },
];
// routes = routes.concat(myCenterRouter);

let router = new Router({
  mode: "hash",
  routes: routes,
});
router.beforeEach((to, from, next) => {
  if (localStorage.getItem("cookie")) {
    if (Util.isWhite(to.name)) {
      if (to.name == "Login") {
        next({ name: "Index" });
      } else {
        next({ name: from.name });
      }
    } else {
      next();
    }
  } else {
    if (Util.isWhite(to.name)) {
      next();
    } else {
      next({ name: "Login" });
      // next({name:'Welcome'});
    }
  }
});

// router.beforeEach((to,from,next)=>{
//     if(localStorage.getItem('vip') ||to.name =='Login'){
//         next()
//     }else {
//         next({name:'Login'});
//     }
// });
export default router;

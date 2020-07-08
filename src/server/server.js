import axios from "axios";
import qs from "qs";
import { Secret } from "@/assets/commonjs/utils.js";

/**
 * 基础模块
 */
export const Base = new (class {
  constructor() {
    this.uploadApi = "/api/user/upload"; //上传
    this.sendcodeApi = "/api/sms/send"; //验证码
    this.imgcodeApi = "/api/Captcha/get"; //图形验证码
    this.bankApi = "/api/user/getbank"; //银行
    this.download = "/api/app/info"; //下载
    this.uploadWgtApi = "/api/upload/upFile"; //上传wgt
    this.downloadWgtAPi = "/api/upload/downfile"; //下载资源更新
    this.getVersionAPi = "/api/upload/getVersion"; //获取服务器版本号
    this.getTextApi = "/api/app/gettext"; //币与按钮名称
    this.dataApi = "/api/index/getImg"; //基础数据
    this.textSeAPi = "/api/demo/test1"; //测试加解密
    // this.sendMobile = "/api/sms/send"; //验证码
  }
  sendMobile (params) {
    return axios.post(this.sendcodeApi, qs.stringify(params)).then((res) => res.data);
  }
  getBank () {
    return axios.post(this.bankApi).then((res) => res.data);
  }
  upload (params) {
    return axios.post(this.uploadApi, params).then((res) => res.data);
  }
  sendCode (params) {
    return axios.post(this.sendcodeApi, qs.stringify(params)).then((res) => res.data);
  }
  getImgCode (params) {
    return axios.get(this.imgcodeApi, { params }).then((res) => res.data);
  }
  getDownload () {
    return axios.get(this.download).then((res) => res.data);
  }
  uploadWgt (params) {
    return axios.post(this.uploadWgtApi, params).then((res) => res.data);
  }
  getVersion () {
    return axios.get(this.getVersionAPi).then((res) => res.data);
  }
  getText () {
    return axios.get(this.getTextApi).then((res) => res.data);
  }
  getData () {
    return axios.post(this.dataApi).then((res) => res.data);
  }
  getTest (params) {
    return axios.get(this.textSeAPi, { params }).then((res) => res.data);
  }
})();

/**
 * 用户模块
 */
export const Init = new (class {
  constructor() {
    this.registerApi = "/api/user/register"; //注册
    this.getUsernameApi = "/api/btm/user/get_username"; //注册时获取用户编号
    this.changepwdApi = "/api/user/getbackpass"; //修改密码
    this.backpwdApi = "/api/user/getbackpass"; //忘记密码
    this.userApi = "/api/user/getinfo"; //用户信息
    this.getConfigApi = "/api/btm/user/get_config"; //注册协议等配置信息
    this.capitalApi = ""; //用户资产
    this.realApi = "/api/user/changeisreal"; //实名认证
    this.loginApi = "/api/user/login"; //登录
    this.backTradeApi = "/api/user/uppaypsw"; //修改交易密码
    this.quitApi = "/api/user/logout"; //退出登录
    this.uppassApi = "/api/user/uppass"; //修改密码 2020-05-23
    this.configApi = "/api/btm/user/get_config"; //配置信息 可提现银行 注册页服务协议  登录页logo 注册页隐私政策
  }
  getconfig (params) {
    return axios.post(this.configApi, qs.stringify(params)).then((q) => q);
  }
  uppass (params) {
    return axios.post(this.uppassApi, qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })).then((res) => res.data);
  }
  register (params) {
    return axios
      .post(
        this.registerApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  changePwd (params) {
    return axios
      .post(
        this.changepwdApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  backpwd (params) {
    return axios
      .post(
        this.backpwdApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  getUser (params) {
    return axios
      .post(this.userApi, qs.stringify(params))
      .then((res) => res.data);
  }
  getCapital (params) {
    return axios
      .post(this.capitalApi, qs.stringify(params))
      .then((res) => res.data);
  }
  toReal (params) {
    return axios
      .post(
        this.realApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  login (params) {
    return axios
      .post(
        this.loginApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  backTrade (params) {
    return axios
      .post(
        this.backTradeApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  getConfig () {
    return axios.get(this.getConfigApi).then((res) => res.data);
  }
  getUsername () {
    return axios.get(this.getUsernameApi).then((res) => res.data);
  }
  quit () {
    return axios.get(this.quitApi).then((res) => res.data);
  }
})();

/**
 * 个人中心
 */
export const Owner = new (class {
  constructor() {
    this.bespeakListApi = ""; //预约列表
    this.teamApi = "/api/user/team"; //团队
    this.kjfeeApi = "/api/user/getkjfee"; //充值矿机费率
    this.payInfoApi = "/api/user/payinfo"; //支付信息
    this.bindaliApi = "/api/user/uppay"; //支付宝绑定
    this.bindwechatApi = "/api/user/upwechar"; //微信绑定
    this.userCoinApi = "/api/user/getUserCoin"; //资产模块
    this.coinOrderApi = "/api/user/getCoinOrder"; //明细
    this.coinApi = "/api/user/getCoin"; //矿机与推广收益
    this.transferApi = "/api/user/transfer"; //转出
    this.shaituApi = "/api/usershow/add"; //晒图
    this.rechargeInfoApi = "/api/user/getRechargeInfo"; //矿机充值信息
    // this.rechargeApi = "/api/user/addRechargeLog"; //充值信息
    this.booklistApi = "/api/booking/booking/getlog"; //预约记录
    this.sellInfoApi = "/api/order/order/getSellPay"; //预约记录
    this.bindbankApi = "/api/user/upbank"; //银行卡绑定
    this.payApi = "/api/order/order/payment"; //支付
    this.diallistApi = "/api/turntable/getlist"; //转盘奖品
    this.rewardApi = "/api/turntable/getreward"; //奖品

    // 矿机记录
    this.buystutasApi = "/api/order/order/buyStutas"; //抢矿中列表
    this.buystutas2Api = "/api/order/order/buyStutas2"; //抢矿收益中列表
    this.buyappealApi = "/api/order/order/buyAppeal"; //抢矿申诉列表

    // 转让记录
    this.sellstatusApi = "/api/order/order/sellStatus"; //待转让列表
    this.sellstatus2Api = "/api/order/order/sellStatus2"; //转让中列表
    this.sellstatus4Api = "/api/order/order/sellStatus4"; //转让完成列表
    this.sellappealApi = "/api/order/order/sellAppeal"; //转让申诉列表
    // 申诉记录
    this.setappealApi = "/api/order/order/setAppeal"; //申诉
    this.buyerApi = "/api/order/order/payment"; //买家信息

    this.contractApi = "/api/order/order/renewContract"; //续约

    this.sellLogApi = "/api/order/sell/getselllog"; //收益出售记录   !!!!暂时不用！！！
    this.setSellApi = "/api/order/sell/setselllog"; //收益出售

    this.applyApi = "/api/wallet/apply"; //提取
    this.applyLogApi = "/api/wallet/lists"; //提取记录
    this.rateApi = "/api/wallet/getRate"; //兑换比例
    this.titleApi = "/api/notice/gettitles"; //公告
    this.noticeDetailApi = "/api/notice/details"; //公告详情
    this.demandCourierApi = "/addons/litestore/api.order/demand_Courier"; //物流查询
    this.orderFinishApi = "/addons/litestore/api.order/finish"; //确认收货
    this.listsApi = "/addons/litestore/api.adress/lists"; //收货地址列表
    this.setdefaultApi = "/addons/litestore/api.adress/setdefault"; //更改默认地址
    this.editApi = "/addons/litestore/api.adress/edit"; //修改收货地址接口
    this.delApi = "/addons/litestore/api.adress/del"; //删除收货地址接口
    this.adressDetailApi = "/addons/litestore/api.adress/detail"; //收货地址列表
    this.adressApi = "/addons/litestore/api.adress/add"; //添加地址
    this.stockCloudApi = "/api/btm/user/get_stock_cloud"; //云库存列表
    this.stockLogApi = "/api/btm/user/get_stock_log"; //云库列表

    this.myOrderApi = "/addons/litestore/api.order/my"; //我的全部订单
    this.orderDetailApi = "/addons/litestore/api.order/detail"; //订单详情
    this.orderCancelApi = "/addons/litestore/api.order/cancel"; //取消订单
    this.rufundInfoApi = "/addons/litestore/api.Orderrefund/rufund_info"; //获取退款原因列表
    this.afterSaleApi = "/addons/litestore/api.Orderrefund/after_sale"; //退货或换货
    this.cancelSaleApi = "/addons/litestore/api.Orderrefund/cancel_sale"; //取消退货或换货

    this.withdrawDesc = "/api/withdraw/get_desc"; //提现描述
    this.withdraw = "/api/withdraw/apply"; //提现
    this.withdrawHistory = "/api/withdraw/get_history"; //提现记录
    this.rechargeApi = "/api/btm/recharge/recharge"; //充值
    this.rechargeHistory = "/api/btm/recharge/getlists"; //充值记录
    this.transfermoney = "/api/user/transfermoney"; //转账
    this.transferlist = "/api/user/transferlist"; //转账记录
    this.bonus = "/addons/litestore/api.my/get_bonus"; //奖金明细
    this.uploadIDcard = "/api/user/uploadidcard"; //上传身份证图片
    this.identity = "/api/user/identity"; //实名认证提交接口
    this.identitylist = "/api/user/identitylist"; //实名认证列表及认证成功数据
    this.my = "/addons/litestore/api.my/index"; //我的  个人信息
    this.shareApplyApi = "/api/btm/user/share_apply"; //上传朋友圈
    this.shareLogApi = "/api/btm/user/get_share_log"; //上传朋友圈申请结果 返回最近一次的结果
    this.getAccountLogApi = '/api/user/getAccountLog';

    this.getOpenidApi = '/api/btm/wechat/getcode';//获取openid
    this.getActivityImgApi = '/api/user/getActivityImg';//获取邀请背景
  }
  getActivityImg (params) {
    return axios.get(this.getActivityImgApi, { params }).then((q) => q.data);
  }
  getOpenid (params) {
    return axios.get(this.getOpenidApi, { params }).then((q) => q.data);
  }
  getAccountLog (params) {
    return axios.post(this.getAccountLogApi, qs.stringify(params)).then((q) => q.data);
  }
  shareApply (params) {
    return axios.post(this.shareApplyApi, qs.stringify(params)).then((q) => q.data);
  }
  getmy (params) {
    return axios.post(this.my, qs.stringify(params)).then((q) => q);
  }
  getidentitylist (params) {
    return axios.post(this.identitylist, qs.stringify(params)).then((q) => q);
  }
  getidentity (params) {
    return axios.post(this.identity, qs.stringify(params)).then((q) => q);
  }
  getuploadIDcard (params) {
    return axios.post(this.uploadIDcard, qs.stringify(params)).then((q) => q);
  }
  cancelSale (params) {
    return axios.post(this.cancelSaleApi, qs.stringify(params)).then((res) => res.data)
  }

  afterSale (params) {
    return axios.post(this.afterSaleApi, qs.stringify(params)).then((res) => res.data)
  }
  orderCancel (params) {
    return axios.post(this.orderCancelApi, qs.stringify(params)).then((res) => res.data);
  }
  cancelSale (params) {
    return axios.post(this.cancelSaleApi, qs.stringify(params)).then((res) => res.data);
  }
  afterSale (params) {
    return axios.post(this.afterSaleApi, qs.stringify(params)).then((res) => res.data);
  }
  rufundInfo (params) {
    return axios.post(this.rufundInfoApi, qs.stringify(params)).then((res) => res.data);
  }
  stockLog (params) {
    return axios.post(this.stockLogApi, qs.stringify(params)).then((res) => res.data);
  }
  stockCloud (params) {
    return axios.post(this.stockCloudApi, qs.stringify(params)).then((res) => res.data);
  }
  getTeam (params) {
    return axios.post(this.teamApi, qs.stringify(params)).then((q) => q);
  }
  shareLog (params) {
    return axios.get(this.shareLogApi, { params }).then((res) => res.data);
  }
  getPayInfo (params) {
    return axios.get(this.payInfoApi, { params }).then((res) => res.data);
  }
  myOrder (params) {
    return axios.get(this.myOrderApi, { params }).then((res) => res.data);
  }
  orderDetail (params) {
    return axios.get(this.orderDetailApi, { params }).then((res) => res.data);
  }
  getUserCoin (params) {
    return axios.get(this.userCoinApi, { params }).then((res) => res.data);
  }
  getCoinOrder (params) {
    return axios.get(this.coinOrderApi, { params }).then((res) => res.data);
  }
  getCoin (params) {
    return axios.post(this.coinApi, qs.stringify(params)).then((res) => res.data);
  }
  getTransfer (params) {
    return axios.post(this.transferApi, qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })).then((res) => res.data);
  }
  shaitu (params) {
    return axios
      .post(this.shaituApi, qs.stringify(params))
      .then((res) => res.data);
  }
  getRechargeInfo (params) {
    return axios
      .post(this.rechargeInfoApi, qs.stringify(params))
      .then((res) => res.data);
  }
  recharge (params) {
    return axios
      .post(
        this.rechargeApi,
        qs.stringify(params)
      )
      .then((res) => res.data);
  }
  getBooklist (params) {
    return axios.get(this.booklistApi, { params }).then((res) => res.data);
  }
  getSellInfo (params) {
    return axios.get(this.sellInfoApi, { params }).then((res) => res.data);
  }
  bindAli (params) {
    return axios
      .post(
        this.bindaliApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  bindwechat (params) {
    return axios
      .post(
        this.bindwechatApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  getOrder (params) {
    return axios.get(this.orderListApi, { params }).then((res) => res.data);
  }
  addBank (params) {
    return axios
      .post(
        this.bindbankApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyStutas (params) {
    return axios.get(this.buystutasApi, { params }).then((res) => res.data);
  }
  buyStutas2 (params) {
    return axios.get(this.buystutas2Api, { params }).then((res) => res.data);
  }
  buyAppeal (params) {
    return axios.get(this.buyappealApi, { params }).then((res) => res.data);
  }
  sellStatus (params) {
    return axios.get(this.sellstatusApi, { params }).then((res) => res.data);
  }
  sellStatus2 (params) {
    return axios.get(this.sellstatus2Api, { params }).then((res) => res.data);
  }
  sellStatus4 (params) {
    return axios.get(this.sellstatus4Api, { params }).then((res) => res.data);
  }
  sellAppeal (params) {
    return axios.get(this.sellappealApi, { params }).then((res) => res.data);
  }
  setAppeal (params) {
    return axios.post(this.setappealApi, params).then((res) => res.data);
  }
  minePay (params) {
    return axios
      .post(
        this.payApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyer (params) {
    return axios.get(this.buyerApi, { params }).then((res) => res.data);
  }
  getDialList (params) {
    return axios.get(this.diallistApi, { params }).then((res) => res.data);
  }
  getReward (params) {
    return axios.get(this.rewardApi, { params }).then((res) => res.data);
  }
  contract (params) {
    return axios
      .post(this.contractApi, qs.stringify(params))
      .then((res) => res.data);
  }
  sellLog () {
    return axios.get(this.sellLogApi).then((res) => res.data);
  }
  setSell (params) {
    return axios
      .post(
        this.setSellApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  apply (params) {
    return axios
      .post(this.applyApi, qs.stringify(params))
      .then((res) => res.data);
  }
  getapplyList (params) {
    return axios.get(this.applyLogApi, { params }).then((res) => res.data);
  }
  getrate () {
    return axios.get(this.rateApi).then((res) => res.data);
  }
  getKjfee () {
    return axios.get(this.kjfeeApi).then((res) => res.data);
  }
  getTitle (params) {
    return axios.get(this.titleApi, { params }).then((res) => res.data);
  }
  getNoticeDetail (params) {
    return axios.get(this.noticeDetailApi, { params }).then((res) => res.data);
  }
  getwithdrawDesc (params) {
    return axios
      .post(this.withdrawDesc, qs.stringify(params))
      .then((res) => res);
  }
  getwithdraw (params) {
    return axios.post(this.withdraw, qs.stringify(params)).then((res) => res);
  }
  getwithdrawHistory (params) {
    return axios
      .post(this.withdrawHistory, qs.stringify(params))
      .then((res) => res);
  }
  getrecharge (params) {
    return axios.post(this.rechargeApi, qs.stringify(params)).then((r) => r);
  }
  getrechargeHistory (params) {
    return axios
      .post(this.rechargeHistory, qs.stringify(params))
      .then((r) => r);
  }
  gettransfermoney (params) {
    return axios.post(this.transfermoney, qs.stringify(params)).then((r) => r);
  }
  gettransferlist (params) {
    return axios.post(this.transferlist, qs.stringify(params)).then((r) => r);
  }
  getbonus (params) {
    return axios.post(this.bonus, qs.stringify(params)).then((r) => r);
  }
  adress (params) {
    return axios
      .post(this.adressApi, qs.stringify(params))
      .then((res) => res.data);
  }
  adressDetail (params) {
    return axios.get(this.adressDetailApi, { params }).then((res) => res.data);
  }
  del (params) {
    return axios.get(this.delApi, { params }).then((res) => res.data);
  }
  edit (params) {
    return axios
      .post(this.editApi, qs.stringify(params))
      .then((res) => res.data);
  }
  lists (params) {
    return axios.get(this.listsApi, { params }).then((res) => res.data);
  }
  setdefault (params) {
    return axios
      .post(this.setdefaultApi, qs.stringify(params))
      .then((res) => res.data);
  }
  orderFinish (params) {
    return axios
      .post(this.orderFinishApi, qs.stringify(params))
      .then((res) => res.data);
  }
  demandCourier (params) {
    return axios
      .post(this.demandCourierApi, qs.stringify(params))
      .then((res) => res.data);
  }
})();
/**
 *  帮助中心
 */
export const Help = new class {
  constructor() {
    this.getCategoryListApi = "/api/question/getCategoryList"; //全部问题
    this.getAllListApi = "/api/question/getAllList";
    this.getDetailApi = "/api/question/getDetail"; //问题详情
    this.getCenterApi = "/api/question/getCenter";
    this.feedbackApi = "/api/question/addFeedback"; //提交问题
  }
  getCategoryList (params) {
    return axios
      .get(this.getCategoryListApi, { params })
      .then((res) => res.data);
  }
  getAllList (params) {
    return axios
      .post(this.getAllListApi, qs.stringify(params))
      .then((res) => res.data);
  }

  getDetail (params) {
    return axios
      .post(this.getDetailApi, qs.stringify(params))
      .then((res) => res.data);
  }
  getCenter (params) {
    return axios.get(this.getCenterApi, { params }).then((res) => res.data);
  }
  addFeedback (params) {
    return axios
      .post(this.feedbackApi, qs.stringify(params))
      .then((res) => res.data);
  }
};

export const Cart = new class {
  constructor() {
    this.deleteApi = "/addons/litestore/api.cart/delete"; //购物车删除接口
    this.subApi = "/addons/litestore/api.cart/sub"; //购物车减少
    this.getlistsApi = "/addons/litestore/api.cart/getlists"; //购物车列表
    this.addApi = "/addons/litestore/api.cart/add"; //加入购物车
  }
  deleteCart (params) {
    return axios.post(this.deleteApi, qs.stringify(params)).then((res) => res.data);
  }
  sub (params) {
    return axios.get(this.subApi, { params }).then((res) => res.data);
  }
  getlists (params) {
    return axios.get(this.getlistsApi, { params }).then((res) => res.data);
  }
  add (params) {
    return axios
      .post(this.addApi, qs.stringify(params))
      .then((res) => res.data);
  }
};

/**
 * 主页
 */
export const Index = new class {
  constructor() {
    // this.fa_blockApi = '/api/user/fa_block';  //矿机这也列表
    this.fa_blockApi = "/api/ore/ore/getorelevel"; //矿机这也列表
    this.miningApi = "/api/mining/mining/index"; //抢矿
    this.oreResultApi = "/api/mining/mining/getOreResult"; //抢矿结果
    this.bookingApi = "/api/booking/booking/setBooking"; //预约
    this.countDownApi = "/api/ore/ore/countDown"; //抢矿倒计时
    this.titleApi = "/api/notice/gettitles"; //公告
    // this.bannerAPi = '/api/question/getTopImg';   //banner
    this.bannerApi = "/addons/litestore/api.index/index"; //banner
    this.getCategoryApi = "/addons/litestore/api.index/getCategory"; //商品分类
    this.categoryListApi = "/addons/litestore/api.goods/category_list"; //商品分类下的商品列表
    this.goodsDetailApi = "/addons/litestore/api.goods/detail"; //商品详情
    this.buyNowApi = "/addons/litestore/api.order/buyNow"; //0元订单立即购买查询信息
    this.buyNowPayApi = "/addons/litestore/api.order/buyNow_pay"; //0元订单下单

    this.buyNow2Api = "/addons/litestore/api.order/buyNow2"; //升级订单立即购买查询信息
    this.buyNowPay2Api = "/addons/litestore/api.order/buyNow_pay2"; //升级订单下单

    this.buyNow3Api = "/addons/litestore/api.order/buyNow3"; //实体订单立即购买查询信息
    this.buyNowPay3Api = "/addons/litestore/api.order/buyNow_pay3"; //实体订单下单

    this.buyNow4Api = "/addons/litestore/api.order/buyNow4"; //云仓订单立即购买查询信息
    this.buyNowPay4Api = "/addons/litestore/api.order/buyNow_pay4"; //云仓订单下单

    this.buyNow5Api = "/addons/litestore/api.order/buyNow5"; //自提订单立即购买查询信息
    this.buyNowPay5Api = "/addons/litestore/api.order/buyNow_pay5"; //自提订单下单

    this.buyNow6Api = "/addons/litestore/api.order/buyNow6"; //vip兑换订单立即购买查询信息
    this.buyNowPay6Api = "/addons/litestore/api.order/buyNow_pay6"; //vip兑换订单下单

    this.cartPayApi = "/addons/litestore/api.order/cart_pay"; //购物车商品——生成订单

    this.yuepayApi = "/addons/litestore/api.order/yuepay"; //余额支付

    this.wechat_pay2Api = "/addons/litestore/api.order/wechat_pay2"; //微信公众号支付

    this.getZeroGoodsApi = "/addons/litestore/api.index/getZeroGoods"; //0元商品列表

    this.getTotalNumApi = "/addons/litestore/api.cart/getTotalNum"; //获取购物车数量

    this.wxgzhApi = "/api/user/wxgzh"; //
  }

  wxgzh (params) {
    return axios
      .get(this.wxgzhApi, (params))
      .then((res) => res.data);
  }
  getTotalNum (params) {
    return axios
      .get(this.getTotalNumApi, { params })
      .then((res) => res.data);
  }
  getZeroGoods (params) {
    return axios
      .post(this.getZeroGoodsApi, qs.stringify(params))
      .then((res) => res.data);
  }
  buyNow (params) {
    return axios
      .post(
        this.buyNowApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyNow2 (params) {
    return axios
      .post(
        this.buyNow2Api,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyNow3 (params) {
    return axios
      .post(
        this.buyNow3Api,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyNow4 (params) {
    return axios
      .post(
        this.buyNow4Api,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyNow5 (params) {
    return axios
      .post(
        this.buyNow5Api,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyNow6 (params) {
    return axios
      .post(
        this.buyNow6Api,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }

  buyNowPay (params) {
    return axios
      .post(
        this.buyNowPayApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyNowPay2 (params) {
    return axios
      .post(
        this.buyNowPay2Api,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyNowPay3 (params) {
    return axios
      .post(
        this.buyNowPay3Api,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyNowPay4 (params) {
    return axios
      .post(
        this.buyNowPay4Api,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyNowPay5 (params) {
    return axios
      .post(
        this.buyNowPay5Api,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }
  buyNowPay6 (params) {
    return axios
      .post(
        this.buyNowPay6Api,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }

  cartPay (params) {
    return axios
      .post(
        this.cartPayApi,
        qs.stringify({ data: Secret.encrypt(JSON.stringify(params)) })
      )
      .then((res) => res.data);
  }


  categoryList (params) {
    return axios.get(this.categoryListApi, { params }).then((res) => res.data);
  }
  getCategory () {
    return axios.get(this.getCategoryApi).then((res) => res.data);
  }
  goodsDetail (params) {
    return axios.get(this.goodsDetailApi, { params }).then((res) => res.data);
  }
  getMine () {
    return axios.get(this.fa_blockApi).then((res) => res.data);
  }
  mining (params) {
    return axios.get(this.miningApi, { params }).then((res) => res.data);
  }
  booking (params) {
    return axios.get(this.bookingApi, { params }).then((res) => res.data);
  }
  getcountDown (params) {
    return axios
      .post(this.countDownApi, qs.stringify(params))
      .then((res) => res.data);
  }
  getoreResult (params) {
    return axios
      .post(this.oreResultApi, qs.stringify(params))
      .then((res) => res.data);
  }
  getTitle (params) {
    return axios.get(this.titleApi, { params }).then((res) => res.data);
  }
  getBanner () {
    return axios.post(this.bannerApi).then((res) => res.data);
  }
  wechatPay2 (params) {
    return axios.get(this.wechat_pay2Api, { params }).then((res) => res.data);
  }
  yuepay (params) {
    return axios
      .post(this.yuepayApi, qs.stringify(params))
      .then((res) => res.data);
  }
};

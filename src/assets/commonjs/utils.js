import { Base } from "@/server/server.js";
// import axios from 'axios';
import store from "../../store";
const crypto = require("crypto");
const CryptoJS = require("crypto-js");
export const Util = new (class {
  constructor() {
    this.lanList = ["zh-cn", "en"];
  }
  /**
   *
   * @param {文字数组['中文','英文']} strArr
   */
  setLanTxt(strArr) {
    for (let i = 0; i < this.lanList.length; i++) {
      if (store.state.language == this.lanList[i]) {
        return strArr[i];
      }
    }
  }
  /**
   * 图片上传 base64 格式
   * @param {图片上传的file} file
   * @param {回调} callback
   * @param {错误} error
   */
  uploadImg(_vue, file, callback) {
    if (
      file.type == "image/gif" ||
      file.type == "image/jpeg" ||
      file.type == "image/jpg" ||
      file.type == "image/bmp" ||
      file.type == "image/png"
    ) {
    } else {
      mui.alert("请上传正确的图片类型");
      return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  }

  /**
   * 网页file限制大小的上传图片
   * @param {vue} _vue
   * @param {图片} file
   * @param {回调} callback
   */
  uploadImgLimit(file, callback) {
    if (
      file.type == "image/gif" ||
      file.type == "image/jpeg" ||
      file.type == "image/jpg" ||
      file.type == "image/bmp" ||
      file.type == "image/png"
    ) {
    } else {
      mui.toast("请上传正确的图片类型");
      return;
    }
    let reader = new FileReader();
    reader.onload = function () {
      let image = new Image();
      image.src = reader.result;
      let url = reader.result;
      // console.log(url)
      image.onload = function () {
        var cvs = document.createElement("canvas");
        var scale = 1;
        if (this.width > 1000 || this.height > 1000) {
          //1000只是示例，可以根据具体的要求去设定
          if (this.width > this.height) {
            scale = 1000 / this.width;
          } else {
            scale = 1000 / this.height;
          }
        }
        cvs.width = this.width * scale;
        cvs.height = this.height * scale;
        var ctx = cvs.getContext("2d");
        ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
        var urlScale = 1;
        if (url.length > 204800) {
          urlScale = url.length / 204800;
          if (urlScale > 0 && urlScale <= 10) {
            urlScale = urlScale / 10;
            var a = urlScale - 1;
            urlScale = urlScale - a;
          }
          if (urlScale > 10 && urlScale <= 20) {
            urlScale = urlScale / 20;
            urlScale = urlScale / 10;
            var a = urlScale - 1;
            urlScale = urlScale - a;
          }
        }
        let newImageData = cvs.toDataURL("image/jpeg", urlScale);
        callback(newImageData);
      };
    };
    reader.readAsDataURL(file);
  }

  /**
   *  时间戳转换日期
   * @param {时间戳} datetime
   */
  formatDate(datetime) {
    let date = new Date(datetime * 1000);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if (Number(seconds) < 10) {
      seconds = "0" + seconds;
    }
    if (Number(minutes) < 10) {
      minutes = "0" + minutes;
    }
    if (Number(hours) < 10) {
      hours = "0" + hours;
    }
    return (
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  }
  /**
   *  时间戳转换时间
   * @param {时间戳} datetime
   */
  formatTime(datetime) {
    let date = new Date(datetime * 1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if (Number(seconds) < 10) {
      seconds = "0" + seconds;
    }
    if (Number(minutes) < 10) {
      minutes = "0" + minutes;
    }
    if (Number(hours) < 10) {
      hours = "0" + hours;
    }
    return hours + ":" + minutes + ":" + seconds;
  }

  /**
   * 路由白名单
   * @param {*} route
   */
  isWhite(route) {
    let whiteRoutes = [
      "Login",
      "Register",
      "BackPwd",
      "Download",
      "Welcome",
      "UploadWgt",
      "Agreement",
    ];
    // routes.some(value=>value.indexOf(whiteRoutes)>=0)
    return whiteRoutes.indexOf(route) >= 0;
  }

  /**
   * 获取分秒
   * @param {创建时间} ctime
   * @param {当前时间} ntime
   */
  getSecond(ctime, ntime) {
    let [minute, second] = [0, 0];
    // console.log(ctime,parseInt(ntime/1000))
    // console.log(parseInt(ntime/1000) - ctime -1800)
    if (ctime + 1800 - parseInt(ntime / 1000) > 0) {
      minute = parseInt((ctime + 1800 - parseInt(ntime / 1000)) / 60);
      second = (ctime + 1800 - parseInt(ntime / 1000)) % 60;
      return [minute, second];
    } else {
      return false;
    }
  }

  /**
   * 上传接口 by url
   * @param {文件} file
   */
  async uploadByUrl(file) {
    let [formData, url] = [new FormData(), null];
    formData.append("image", file);
    await Base.upload(formData).then((res) => {
      if (res.code == 1) {
        url = res.data;
      } else {
        mui.toast(res.msg);
        return;
      }
    });
    return url;
  }
  /**  ！！！！弃用！！！！
   * 判断对象空值存在
   * @param {对象} obj
   */
  filterData(obj) {
    if (!obj) return null;
    let [arr, flag] = [Object.values(obj), true];
    arr.forEach((item, index) => {
      if (item == null) {
        flag = false;
        return;
      }
    });
    return flag;
  }
  /**
   * 判断对象空值存在并返回key
   * @param {对象} obj
   */
  checkEmpry(obj) {
    if (!obj) return null;
    let [arr, flag, arrKey, msg] = [
      Object.values(obj),
      true,
      Object.keys(obj),
      null,
    ];
    arr.forEach((item, index) => {
      if (flag)
        if (item == null || item == "" || item == " ") {
          flag = false;
          switch (arrKey[index]) {
            case "name":
              msg = "请输入收货人姓名！";
              break;
            case "phone":
              msg = "请输入收货人联系方式！";
              break;
            case "region":
              msg = "请选择地址！";
              break;
            case "detail":
              msg = "请输入详细地址信息！";
              break;
            case "username":
              msg = "请输入手机号！";
              break;
            case "account":
              msg = "请输入手机号！";
              break;
            case "mobile":
              msg = "请输入手机号！";
              break;
            case "captcha":
              msg = "请输入手机验证码！";
              break;
            case "paypwd":
              msg = "请输入交易密码！";
              break;
            case "imgcaptcha":
              msg = "请输入图形验证码！";
              break;
            case "password":
              msg = "请输入登录密码！";
              break;
            case "repassword":
              msg = "请确认登录密码！";
              break;
            case "newpassword":
              msg = "请输入密码！";
              break;
            case "num":
              msg = "请输入数量！";
              break;
            case "number":
              msg = "请输入数量！";
              break;
            case "money":
              msg = "请输入数量！";
              break;
            case "address":
              msg = "请输入钱包地址！";
              break;
            case "realname":
              msg = "请输入用户姓名！";
              break;
            case "alipayname":
              msg = "请输入支付宝昵称！";
              break;
            case "wechaname":
              msg = "请输入微信昵称！";
              break;
            case "wechatact":
              msg = "请输入微信账户！";
              break;
            case "wechaturl":
              msg = "请上传微信二维码！";
              break;
            case "alipayact":
              msg = "请输入支付宝账户！";
              break;
            case "alipayurl":
              msg = "请上传支付宝二维码！";
              break;
            case "bank":
              msg = "请选择银行名称！";
              break;
            case "bankname":
              msg = "请输入只行名称！";
              break;
            case "bankuname":
              msg = "请输入账户姓名！";
              break;
            case "bankact":
              msg = "请输入银行卡账号！";
              break;
            case "paypwd":
              msg = "请输入交易密码！";
              break;
            case "repaypwd":
              msg = "请确认交易密码！";
              break;
            case "hkmoney":
              msg = "请输入汇款数量！";
              break;
            case "hkimg":
              msg = "请上传支付凭证！";
              break;
            case "img":
              msg = "请上传图片！";
              break;
            case "image":
              msg = "请上传图片！";
              break;
          }
        }
    });
    return msg;
  }

  /**
   * 表单验证 未完善
   * @param {规则对象} rule
   */
  formValidate(rule) {
    if (!rule) return null;
    let msg = null;
    for (let item of Object.values(rule)) {
      if (item.validate == false) {
        msg = item.msg;
        break;
      }
    }
    return msg;
  }

  /**
   * 请求校验
   * @param {提交数据} formData
   * @param {规则} rule
   */
  isValidate(formData, rule) {
    return this.checkEmpry(formData || null) || this.formValidate(rule || null);
  }
  /**
   * 清楚cookie
   */
  clearAllCookie() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie =
        name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
    if (cookies.length > 0) {
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        var domain = location.host.substr(location.host.indexOf("."));
        document.cookie =
          name +
          "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" +
          domain;
      }
    }
  }

  /**
   * 获取cookie
   * @param {key} name
   */
  getCookie(name) {
    var arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
  }
  /**
   * 检测是否为微信端
   */
  isWechat() {
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
    } else {
      return false;
    }
  }
})();
/**
 * 加载/底部加载 框
 */
export const Load = new (class {
  loadStart(vm) {
    vm.$refs["load"].open();
  }
  loadEnd(vm) {
    vm.$refs["load"].close();
  }
  loadNext(vm) {
    vm.$refs["next"].open();
  }
  loadNextEnd(vm) {
    vm.$refs["next"].close();
  }
})();

/**
 * 正则验证
 */
export const Validates = new (class {
  constructor(exp) {
    this.exp = exp;
  }
  _isValidate(ruleName, value) {
    switch (ruleName) {
      case "required": //必填
        this.exp = new RegExp(/\S/);
        return this.exp.test(value);
      case "int": //整数
        this.exp = new RegExp(/^[0-9]*[1-9][0-9]*$/);
        return this.exp.test(value);
      case "bank": //银行卡
        this.exp = new RegExp(/^([1-9]{1})(\d{14}|\d{18})$/);
        return this.exp.test(value);
    }
  }
  /**
   * 表单验证提交
   * @param {表单的rules} rules
   */
  formValidate(rules) {
    if (!rules) return null;
    let msg = null;
    for (let item of Object.values(rules)) {
      if (item.msg) {
        msg = item.msg;
        break;
      }
    }
    return msg;
  }
})();

export const HB = new (class {
  constructor() {
    this.wgtVer = null;
    this.wgtUrl = store.state.API + "/api/upload/downfile"; //
  }

  /**
   * hbuilder 拍照转base64
   * @param {图片路径} path
   * @param {回调} callback
   */
  HBUploadImgLimit(_vue, path, callback) {
    Load.loadStart(_vue);
    let image = new Image();
    image.src = path;
    let url = path;
    image.onload = function () {
      var cvs = document.createElement("canvas");
      var scale = 1;
      if (this.width > 1000 || this.height > 1000) {
        //1000只是示例，可以根据具体的要求去设定
        if (this.width > this.height) {
          scale = 1000 / this.width;
        } else {
          scale = 1000 / this.height;
        }
      }
      cvs.width = this.width * scale;
      cvs.height = this.height * scale;
      var ctx = cvs.getContext("2d");
      ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
      var urlScale = 1;
      if (url.length > 204800) {
        urlScale = url.length / 204800;
        if (urlScale > 0 && urlScale <= 10) {
          urlScale = urlScale / 10;
          var a = urlScale - 1;
          urlScale = urlScale - a;
        }
        if (urlScale > 10 && urlScale <= 20) {
          urlScale = urlScale / 20;
          urlScale = urlScale / 10;
          var a = urlScale - 1;
          urlScale = urlScale - a;
        }
      }
      let newImageData = cvs.toDataURL("image/jpeg", urlScale);
      Load.loadEnd(_vue);
      callback(newImageData);
    };
  }
  /**
   * 拍照上传
   * @param {vue实例} _vue
   */
  HBCapture(_vue, callback) {
    let [_this, formData, that] = [_vue, new FormData(), this];
    // document.addEventListener( "plusready", this.upload(), false );
    try {
      let camera = plus.camera.getCamera();
      camera.captureImage(function (e) {
        plus.io.resolveLocalFileSystemURL(
          e,
          function (entry) {
            let path = entry.toLocalURL() + "?version=" + new Date().getTime(); //图片本地路径
            // var name=entry.name//图片名称
            Load.loadStart(_this);
            that.HBUploadImgLimit(_this, path, (url) => {
              formData.append("image", url);
              Base.upload(formData).then((res) => {
                Load.loadEnd(_this);
                if (res.code == 1) {
                  callback(res.data);
                } else {
                  mui.toast(res.msg);
                  return;
                }
              });
            });
          },
          function (e) {
            mui.toast("读取拍照文件错误：" + e.message);
          },
          {
            resolution: "320*240",
          }
        );
      });
    } catch (e) {}
  }
  /**
   * 选择相册
   * @param {vue实例} _vue
   * @param {回调} callback
   */
  picForGallery(_vue, callback) {
    let [_this, formData, that] = [_vue, new FormData(), this];
    // document.addEventListener( "plusready", this.upload(), false );
    try {
      plus.gallery.pick(function (path) {
        Load.loadStart(_this);
        that.HBUploadImgLimit(_this, path, (url) => {
          formData.append("image", url);
          Base.upload(formData).then((res) => {
            Load.loadEnd(_this);
            if (res.code == 1) {
              callback(res.data);
            } else {
              mui.toast(res.msg);
              return;
            }
          });
        });
      });
    } catch (e) {}
  }

  /**
   * 暂时闲置
   */
  update() {
    let _this = this;
    try {
      if (plus) {
        _this.getVersion();
      } else {
        document.addEventListener("plusready", _this.getVersion(), false);
      }
    } catch (e) {}
  }
  /**
   * 获取当前app的版本号
   */
  async getVersion(callback) {
    let _this = this;
    // 获取本地应用资源版本号
    try {
      await plus.runtime.getProperty(plus.runtime.appid, function (inf) {
        _this.wgtVer = inf.version;
        callback(_this.wgtVer);
        console.log("当前应用版本：" + _this.wgtVer);
      });
    } catch (e) {}
  }
  /**
   * 检查版本号
   */
  checkVersion() {
    let _this = this;
    try {
      plus.nativeUI.showWaiting("检测更新...");
      Base.getVersion().then((res) => {
        if (res.code == 1) {
          plus.nativeUI.closeWaiting();
          if (Number(res.data) > Number(_this.wgtVer)) {
            plus.nativeUI.confirm("点击确定更新到最新版本", (e) => {
              if (e.index == 0) {
                _this.download();
              }
            });
          } else plus.nativeUI.alert("无新版本可更新！");
        } else {
          mui.toast(res.msg);
          return;
        }
      });
    } catch (e) {
      mui.confirm("客官，请移步至App~", () => {});
    }
  }
  /**
   * 自动检测更新下载
   */
  autoUpdate() {
    let _this = this;
    try {
      plus.runtime.getProperty(plus.runtime.appid, function (inf) {
        _this.wgtVer = inf.version;
        console.log("当前应用版本：" + _this.wgtVer);
        plus.nativeUI.showWaiting("检测更新...");
        Base.getVersion().then((res) => {
          if (res.code == 1) {
            plus.nativeUI.closeWaiting();
            if (Number(res.data) > Number(_this.wgtVer)) {
              _this.download();
            } else console.log("无新版本可更新！");
          } else {
            mui.toast(res.msg);
            return;
          }
        });
      });
    } catch (e) {
      // mui.confirm('客官，请移步至App~',()=>{})
    }
  }
  /**
   * 下载更新资源
   */
  download() {
    let _this = this;
    try {
      plus.nativeUI.showWaiting("下载资源文件...");
      plus.downloader
        .createDownload(_this.wgtUrl, { filename: "_doc/update/" }, function (
          d,
          status
        ) {
          if (status == 200) {
            console.log("下载资源文件成功：" + d.filename);
            _this.installWgt(d.filename); // 安装wgt包
          } else {
            console.log("下载资源文件失败！");
            plus.nativeUI.alert("下载资源文件失败！");
          }
          plus.nativeUI.closeWaiting();
        })
        .start();
    } catch (e) {}
  }
  /**
   * 安装资源包
   * @param {资源包的路径} path
   */
  installWgt(path) {
    try {
      plus.nativeUI.showWaiting("更新资源文件...");
      plus.runtime.install(
        path,
        {},
        function () {
          plus.nativeUI.closeWaiting();
          console.log("更新资源文件成功！");
          plus.nativeUI.alert("应用资源更新完成！", function () {
            plus.runtime.restart();
          });
        },
        function (e) {
          plus.nativeUI.closeWaiting();
          console.log("更新资源失败[" + e.code + "]：" + e.message);
          plus.nativeUI.alert(e.code + "：" + e.message + ",请稍后重试！");
        }
      );
    } catch (e) {}
  }
})();

export const Secret = new (class {
  constructor() {
    this.key = "ljda_dj@.dv?sjdf";
  }
  /**
   * aes加密
   * @param {加密的数据} data
   */
  aesEncrypt(data) {
    //  aes192  aes-128-ecb aes-256-cbc
    //  hex base64
    const cipher = crypto.createCipher("aes-128-ecb", this.key);
    var crypted = cipher.update(data, "utf8", "base64");
    crypted += cipher.final("base64");
    return crypted;
  }
  /**
   * aes解密
   * @param {解密的数据} encrypted
   */
  aesDecrypt(encrypted) {
    const decipher = crypto.createDecipher("aes-128-ecb", this.key);
    var decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
  /**
   * aes加密 cryptJS --本项目使用---
   * @param {加密的数据} data
   */
  encrypt(data) {
    return CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(this.key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
  }
  /**
   * aes解密 cryptJS --本项目使用---
   * @param {解密的数据} data
   */
  decrypt(data) {
    return CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(this.key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
  }
})();

export const Share = new (class {
  constructor() {
    this.sharewx = null;
  }
  /**
   * 初始化分享服务
   */
  // _initShare() {
  //   let _this = this;
  //   try {
  //     if (plus) {
  //       plus.share.getServices(
  //         (res) => {
  //           _this.sharewx = res;
  //         },
  //         (err) => {
  //           console.log(err);
  //         }
  //       );
  //     }
  //   } catch (e) {}
  // }
  		/**
		 * 初始化分享服务
		 */
		_initShare(){
			let _this = this;
            try{
                if(plus){
                    plus.share.getServices(res=>{
                      for(var i in res){
                        if('weixin'==res[i].id){
                          this.sharewx=res[i];
                        }
                      }
                      // _this.shareList = res;
                      console.log(res,"初始化分享服务")
                              },err=>{
                                  console.log(err)
                              });
                }
            }catch(e){}
    }
  /**
   * 分享类型选择
   */
  actionSheet(title,conHref) {
    if(!this.sharewx) {
      return mui.toast("未安装微信，无法分享");
    }
    let _this = this;
    try {
      plus.nativeUI.actionSheet(
        {
          // title:"Plus is ready!",
          cancel: "取消",
          buttons: [
            {
              title: "微信好友",
            },
            {
              title: "微信朋友圈",
            },
            // {
            //   title: "新浪微博",
            // },
          ],
        },
        function (e) {
          console.log("User pressed: " + e.index);
          switch (String(e.index)) {
            case "1":
              // _this.sendShare(1, "WXSceneSession", imgSrc);
              _this.sendShare(1, "WXSceneSession", title,conHref);
              break;
            case "2":
              _this.sendShare(1, "WXSceneTimeline", title,conHref);
              break;
            // case "3":
            //   _this.sendShare(1, "WXSceneSession", imgSrc);
            //   break;
          }
        }
      );
    } catch (e) {}
  }
  /**
   * 调用分享
   * @param {分享的类型} index 1 为微信
   * @param {平台的类型} scene   "WXSceneSession"分享到微信的“我的好友”； "WXSceneTimeline"分享到微信的“朋友圈”中； "WXSceneFavorite"分享到微信的“我的收藏”中。 默认值为"WXSceneSession"。
   * @param {imgSrc} imgSrc 图片分享
   */
  sendShare(index,scene,title,conHref) {
    // let obj = { type: "image", pictures: [imgSrc] };
    let obj = {title:"蓓汀美",content:title,href:conHref}
    if (scene) {
      obj.extra = { scene };
    }
    this.sharewx.send(
      obj,
      function () {
        plus.nativeUI.alert("分享成功！");
      },
      function (e) {
        plus.nativeUI.alert("分享失败：" + e.message);
      }
    );
  }
})();
/**
 * 使用方法
 * 1.支付页面created执行支付初始化方法 Pay.init();
 * 2.调用支付方法 Pay.pay(id)  id为 支付宝：alipay  微信：wxpay
 */
export const AppPay = new (class {
  constructor() {
    this.ALIPAYSERVER =
      store.state.API + "/addons/litestore/api.order/alipay_pay?order_no="; //支付宝支付
    this.WXPAYSERVER =
      store.state.API + "/addons/litestore/api.order/wechat_pay?order_no="; //微信支付
    this.channel = null; //当前支付方式
    this.channels = null; //所有支持的支付方式 支付宝和微信
  }

  /**
   * 支付初始化
   */
  init() {
    let that = this;
    document.addEventListener("plusready", that.plusReady(), false);
    return that;
  }
  /**
   * 加载支付方式
   */
  plusReady() {
    // 获取支付通道
    let that = this;
    plus.payment.getChannels(
      function (channels) {
        that.channels = channels;
        if (that.channels[0].id != "alipay")
          that.channels = that.channels.reverse();
      },
      function (e) {
        alert("获取支付通道失败：" + e.message);
      }
    );
  }
  /**
   * 调起app支付
   * @param {支付方式的id 1.alipay 2.wxpay} id
   */
  pay(id, order_no, callback) {
    // 从服务器请求支付订单
    let that = this;
    var PAYSERVER = "";
    if (id == "alipay") {
      that.channel = that.channels[0];
      PAYSERVER =
        this.ALIPAYSERVER +
        order_no +
        "&token=" +
        localStorage.getItem("cookie");
    } else if (id == "wxpay") {
      that.channel = that.channels[1];
      PAYSERVER =
        this.WXPAYSERVER +
        order_no +
        "&token=" +
        localStorage.getItem("cookie");
    } else {
      plus.nativeUI.alert("不支持此支付通道！", null, "捐赠");
      return;
    }
    var xhr = new XMLHttpRequest(); //uni-app中请使用uni的request api联网
    xhr.onreadystatechange = function () {
      switch (xhr.readyState) {
        case 4:
          if (xhr.status == 200) {
            plus.payment.request(
              that.channel,
              xhr.responseText,
              function (result) {
                plus.nativeUI.alert("支付成功！", callback);
                // plus.nativeUI.alert("支付成功！",function(){
                //     back();
                // });
              },
              function (error) {
                // plus.nativeUI.alert("支付失败：" + error.code + ":" + JSON.stringify(error));
                plus.nativeUI.alert(error.message);
              }
            );
          } else {
            alert("获取订单信息失败！");
          }
          break;
        default:
          break;
      }
    };
    // console.log(PAYSERVER, "PAYSERVER")
    xhr.open("GET", PAYSERVER);
    xhr.send();
  }
})();

import Vue from "vue";
import axios from 'axios';
import store from '../../store/index';
import html2canvas from "html2canvas";

//html转canvas插件
Vue.prototype.html2canvas = html2canvas;

Vue.prototype.getValueType = function(value){
    let string = Object.prototype.toString.call(value);
    return string.slice(8,string.length-1).toLowerCase();
};

//将姓名和身份证号进行处理，按照规则隐藏中间信息:参数type是 隐藏类型"name"或"ID"
Vue.prototype.hiddenString = function(type,str){
    if(!type||!str){
        return "请检查参数是否存在。";
    }
    let newString = "";
    if(type==="name"){
        newString =  [].map.call(str,function(e,index,arr){
            if(arr.length===2){
                if(index>0){
                    return "*";
                }else{
                    return e;
                }
            }else if(arr.length<7){
                if(index>0&&index<arr.length-1){
                    return "*";
                }else{
                    return e;
                }
            }else{
                if(index>3){
                    return "*";
                }else{
                    return e;
                }
            }
        });
    }else if(type==="ID"){
        newString =  [].map.call(str,function(e,index,arr){
            if(index>5&&index<arr.length-2){
                return "*";
            }else{
                return e;
            }
        });
    }else{
        newString = ["error"];
    }
    return newString.join("");
};
//上传文件方法，包括对文件的大小的验证等
Vue.prototype.uploadFile = function(event,fileType){
    let e = event||window.event;
    let Api ="/upload";
    let file = e.target.files[0];
    if(file.size>1024*1024){
        this.$dialog.closeBox();
        this.$dialog.infoBox({
            content:'上传的图片不能大于1M哦~'
        })
    }else{
        let data = new FormData();
        data.append("file",file);
        event.target.value="";//将value值设置为空然后下一次触发change事件
        return axios.post(Api+"?type="+fileType,data).then(function(res){
            return res.data;
        });
    }
};

Vue.prototype.isWechat = function () {
    let ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
};

/*获取更换的主题资源*，这个请求无论如何都不能返回无效的session报错，否则拦截器将会拦截刷新页面*/
Vue.prototype.getThemeInfo = function(session,code){
    let c = code?code:"";
    let Api = "/theme/get_theme";
    return axios.get(Api+"?code="+c).then(function(res){
        // console.log(res);
        return res.data;
    });
};

/*替换模板*/
Vue.prototype.replaceStyle = function(themeColor,assistColor1,assistColor2){
    let newTemplate =
        ".btn-theme{" +
        "    border:1px solid @theme-color@;color: @theme-color@;" +
        " }" +
        ".btn-theme.btn-full{" +
        "    background-color: @theme-color@;" +
        "}" +
        ".text-theme{" +
        "    color: @theme-color@;" +
        "}" +
        ".text-assist1{" +
        "    color: @assist-color1@;" +
        "}" +
        ".text-assist2{" +
        "    color: @assist-color2@;" +
        "}" +
        ".border-theme{" +
        "    border-color: @theme-color@;" +
        "}" +
        ".bg-theme{" +
        "    background-color: @theme-color@;" +
        "}" +
        ".panel .panel-header .panel-title{" +
        "    border-left:3px solid @theme-color@;"+
        "}"+
        ".gradient-h-theme-assist1{" +
        "    background-image: linear-gradient(to right,@theme-color@,@assist-color1@);" +
        "}" +
        ".gradient-v-theme-assist1{" +
        "    background-image: linear-gradient(to bottom,@theme-color@,@assist-color1@);" +
        "}" +
        ".gradient-h-assist1-theme{" +
        "    background-image: linear-gradient(to right,@assist-color1@,@theme-color@);" +
        "}" +
        ".gradient-v-assist1-theme{" +
        "    background-image: linear-gradient(to bottom,@assist-color1@,@theme-color@);" +
        "}" +
        ".gradient-h-theme-assist2{" +
        "    background-image: linear-gradient(to right,@theme-color@,@assist-color2@);" +
        "}" +
        ".gradient-v-theme-assist2{" +
        "    background-image: linear-gradient(to bottom,@theme-color@,@assist-color2@);" +
        "}" +
        ".gradient-h-assist2-theme{" +
        "    background-image: linear-gradient(to right,@assist-color2@,@theme-color@);" +
        "}" +
        ".gradient-v-assist2-theme{" +
        "    background-image: linear-gradient(to bottom,@assist-color2@,@theme-color@);" +
        "}" +
        ".gradient-h-assist1-assist2{" +
        "    background-image: linear-gradient(to right,@assist-color1@,@assist-color2@);" +
        "}" +
        ".gradient-v-assist1-assist2{" +
        "    background-image: linear-gradient(to bottom,@assist-color1@,@assist-color2@);" +
        "}" +
        ".gradient-h-assist2-assist1{" +
        "    background-image: linear-gradient(to right,@assist-color2@,@assist-color1@);" +
        "}" +
        ".gradient-v-assist2-assist1{" +
        "    background-image: linear-gradient(to bottom,@assist-color2@,@assist-color1@);" +
        "}" +
        ".gradient-h-assist1-white{" +
        "    background-color: @assist-color1@;" +
        "    background-image: linear-gradient(to right,rgba(255,255,255,0),rgba(255,255,255,0.5));" +
        "}" +
        ".gradient-v-assist1-white{" +
        "    background-color: @assist-color1@;" +
        "    background-image: linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,0.5));" +
        "}" +
        ".gradient-h-white-assist1{" +
        "    background-color: @assist-color1@;" +
        "    background-image: linear-gradient(to right,rgba(255,255,255,0.8),rgba(255,255,255,0));" +
        "}" +
        ".gradient-v-white-assist1{" +
        "    background-color: @assist-color1@;" +
        "    background-image: linear-gradient(to bottom,rgba(255,255,255,0.8),rgba(255,255,255,0));" +
        "}" +
        ".gradient-h-assist2-white{" +
        "    background-color: @assist-color2@;" +
        "    background-image: linear-gradient(to right,rgba(255,255,255,0),rgba(255,255,255,0.5));" +
        "}" +
        ".gradient-v-assist2-white{" +
        "    background-color: @assist-color2@;" +
        "    background-image: linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,0.5));" +
        "}" +
        ".gradient-h-white-assist2{" +
        "    background-color: @assist-color2@;" +
        "    background-image: linear-gradient(to right,rgba(255,255,255,0.8),rgba(255,255,255,0));" +
        "}" +
        ".gradient-v-white-assist2{" +
        "    background-color: @assist-color2@;" +
        "    background-image: linear-gradient(to bottom,rgba(255,255,255,0.8),rgba(255,255,255,0));" +
        "}";
    if(store.state.themeInfo){
        console.log(store.state.themeInfo);
        newTemplate +=
            "#loginPage,#registerPage{" +
            "    background-image:url("+store.state.themeInfo.loginBackPicName+");" +
            "}"+
            "#index{" +
            "    background-image:url("+store.state.themeInfo.indexBackPicName+");" +
            "}"+
            "#index .insureBox .uploadImageBox .imageBox{" +
            "    background-image:url("+store.state.themeInfo.indexUploadPicName+");" +
            "}";
    }
    if(themeColor){
        newTemplate =newTemplate.replace(/@theme-color@/g,themeColor);
    }if(assistColor1){
        newTemplate =newTemplate.replace(/@assist-color1@/g,assistColor1);
    }if(assistColor2){
        newTemplate =newTemplate.replace(/@assist-color2@/g,assistColor2);
    }
    return newTemplate;
};
/*替换主题*/
Vue.prototype.replaceTheme = function(themeColor,assistColor1,assistColor2){
    let styleDom = document.head.querySelector("#themeStyle")?document.head.querySelector("#themeStyle"):document.createElement("style");
    styleDom.id="themeStyle";
    styleDom.innerHTML = this.replaceStyle(themeColor,assistColor1,assistColor2);
    document.head.appendChild(styleDom);
};
/*进行身份认证识别获取主题值*/
Vue.prototype.identify = function($router,$route){
    console.log("[DEV]: vue.identify")
    let query = $route.query;
    let themeCode = query.themeCode;
    if(themeCode) {
        //存储在sessionStorage中，在认证失败的情况下，登录页面仍然可以获取themeCode
        window.sessionStorage.setItem("themeCode", themeCode);
    }
    if(query.session){
        let themeInfo = store.state.themeInfo;
        if(!themeInfo){
            Vue.prototype.getThemeInfo(query.session).then(function(res){
                if (!this.isEmpty(res)&&(res.code===null||res.code===undefined)&&(res.code!==0)) {
                    store.commit('saveThemeInfo',res);
                    Vue.prototype.replaceTheme(res.themeColor,res.assistColor1,res.assistColor2);
                    if(Vue.prototype.isWechat()){
                        Vue.prototype.loadJsapiTicketSign();
                    }
                }
            }.bind(this));
        }else{
            Vue.prototype.replaceTheme(themeInfo.themeColor,themeInfo.assistColor1,themeInfo.assistColor2);
        }
        store.commit('saveSession',query.session);
        return true;
    }else{
        //如果URL上面不带session 则说明是通过URL直接进来的，或者是通过单页应用跳转进来
        /*没有query值，判断session是否存储在store中，若在store中依然有session，那么说明是通过登录进来的页面*/
        if(!store.state.session){
            /*微信端*/
            if(Vue.prototype.isWechat()){
                Vue.prototype.wechatAuth();
            }else{
                $router.push({
                    name:"login"
                });
                // console.log(window.location.href.split("#")[0]);
                window.location.href = window.location.href.split("#")[0];
            }
        }else{
            let themeInfo = store.state.themeInfo;
            /*在有session值并且主题变量不存在的情况下,通过session获取theme的信息*/
            if(!themeInfo){
                // console.log(store.state.session);
                Vue.prototype.getThemeInfo(store.state.session).then(function(res){
                    if (!this.isEmpty(res)&&(res.code===null||res.code===undefined)&&(res.code!==0)) {
                        store.commit('saveThemeInfo',res);
                        Vue.prototype.replaceTheme(res.themeColor,res.assistColor1,res.assistColor2);
                        if(Vue.prototype.isWechat()){
                            Vue.prototype.loadJsapiTicketSign();
                        }
                    }
                }.bind(this));
            }
            return false;
        }
    }
};
/*单纯进行微信授权*/
Vue.prototype.wechatAuth = function(){
    console.log("run: wechatAuth")
    let returnUrl = window.location.href;
    let code = store.state.weChatCode;
    // let loginUrl="http://test.hybao.cc/newhybao/#/loans/login";
    let loginUrl = "http://192.168.199.233:9000/#/login";
    //loginUrl="https://api.hybao.cc/loans/#/loans/login";
    //开发环境
    //loginUrl="http://192.168.199.63/#/loans/login";
    let loginUrlComponent = window.encodeURIComponent(loginUrl);
    let returnUrlComponent = window.encodeURIComponent(returnUrl);
    //生产环境
    let url = process.env.WECHAT_CODE_API+code+"&loginUrl="+loginUrlComponent+"&returnUrl="+returnUrlComponent;
    // let url = "http://test.hybao.cc/oauth/code?code="+code+"&loginUrl="+loginUrlComponent+"&returnUrl="+returnUrlComponent;
    // let url ="https://api.hybao.cc/oauth/code?code="+code+"&loginUrl="+loginUrl+"&returnUrl="+returnUrl;
    window.location.href = url;
};
/*判断值是否为null undefined 或者 "" 或者数组是否为空*/
Vue.prototype.isEmpty = function(val){
    if(!val){
        return true;
    }else if(val instanceof Array && val.length===0){
        /*数组*/
        return true;
    }else if(JSON.stringify(val)==="{}"){
        return true;
    }else{
        return false;
    }
};
/*推算日期，向前或向后推算日期*/
Vue.prototype.calculateDate = function(time,number,date){
    let day = date&&date instanceof Date?date:new Date();
    if(time && number){
        if(time.toLowerCase()==="y"){
            day.setFullYear(day.getFullYear()+ number);
        }else if (time.toLowerCase() === "m"){
            day.setMonth( day.getMonth()+ number);
        }else if(time.toLowerCase() === "d"){
            day.setDate( day.getDate() + number);
        }else if(time.toLowerCase() === "h"){
            day.setHours(day.getHours() + number);
        }
    }
    return day;
};
/*日期中格式必须是2017-01-01，而不能是2017-1-1*/
Vue.prototype.formatDate = function(num){
    if(num<10){return "0"+num;}
    else{return num;}
};
/*页面初始化时进行插件注册*/
Vue.prototype.loadJsapiTicketSign = function(){
    console.log("run: loadJsapiTicketSign");
    let code = store.state.weChatCode;
    let location  = window.location.href.split("#")[0];
    let Api ="/weixin/load_jsapi_ticket_sign";
    return axios.post(Api,{url:location,code:code}).then(function(res){
        let obj = res.data;
        if(res.data.msg){
            alert(res.data);

        }else{
            Vue.prototype.config(obj);
        }
        return res.data;
    });
};

Vue.prototype.config = function(obj){
    console.log("wx.config")
    wx.config({
        debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId : obj.appId, // 必填，公众号的唯一标识
        timestamp : obj.timestamp, // 必填，生成签名的时间戳
        nonceStr : obj.nonceStr, // 必填，生成签名的随机串
        signature : obj.signature,// 必填，签名，见附录1
        jsApiList : [
            // 分享部分
            'onMenuShareTimeline', 'onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone','updateAppMessageShareData','updateTimelineShareData '
            // 录音部分
            ,'startRecord','stopRecord','onVoiceRecordEnd','playVoice','pauseVoice','stopVoice','onVoicePlayEnd','uploadVoice','downloadVoice'
            // 地理位置
            ,'openLocation','getLocation'
            // 上传图片
            ,'chooseImage','previewImage','uploadImage','downloadImage'
            //微信扫一扫
            ,'scanQRCode'
            //支付
            ,'chooseWXPay'
            //卡券
            ,'addCard','chooseCard','openCard'
            // 显示隐藏按钮
            ,'hideOptionMenu','showOptionMenu','hideMenuItems','showMenuItems','hideAllNonBaseMenuItem','showAllNonBaseMenuItem'
        ]// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
};
Vue.prototype.shareTo = function(obj){
    // wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
    //     wx.updateAppMessageShareData({ 
    //         title: obj.title, // 分享标题
    //         desc: obj.desc, // 分享描述
    //         link: obj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //         imgUrl: obj.imgUrl, // 分享图标
    //         success: function (res) {
    //           // 设置成功
    //           console.log(res)
    //         }
    //     });
    // })
        wx.onMenuShareAppMessage({
            title:  obj.title, // 分享标题
            desc: obj.desc, // 分享描述
            link: obj.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: obj.imgUrl, // 分享图标
            success: obj.success
        });
};
/*上传图片*/
Vue.prototype.chooseImgUpload = function(vue,type,callback){
    let code = this.$store.state.weChatCode;
    let Api = "/recognition";
    wx.chooseImage({
        count:1, // 默认9
        sizeType:['original','compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType:['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
        error : function(res) {
            alert("res-->>"+res);
        },
        success: function (res) {
            vue.$dialog.selfBox({id:"loading"});
            let localId = res.localIds[0];
            wx.uploadImage({
                localId: localId,  // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    let serverId = res.serverId; // 返回图片的服务器端ID
                    vue.loadingMsg = "正在上传，请耐心等待。";
                    axios.get(Api+"?type="+type+"&mediaId="+serverId+"&wechatCode="+code).then(function(res){
                        if(res.data) {
                            //执行回调
                            if (res.data.msg) {
                                vue.$dialog.closeBox("loading");
                                vue.$dialog.infoBox({
                                    content: JSON.stringify(res.data.msg)
                                });
                            } else {
                                callback(res.data);
                            }
                        }
                    });
                },
                error:function(){
                    console.log("上传失败");
                }
            });
        }
    });
};
//默认的验证方法，用于验证 独立的数据 格式的正确性  type:[String|Object]; data:要验证的数据
Vue.prototype.defaultValFunction = function(type,data){
    if(type&&(typeof type)==='string'){
        switch(type){
            case 'required':
                var redRequired = new RegExp('^\s$');
                if(data == undefined || data.length===0 ||redRequired.test(data)){
                    return false;
                }else{
                    return true;
                }
            case 'mobile'://正常情况下，空也是可以匹配的，只匹配输入的数据是否正确，不匹配数据是否填写，是否填写由required来进行判断
                var regMobile = new RegExp('(^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$)|^\s$');
                if(data===null||data===undefined){
                    return true;//数据为空的情况下也算通过，只有在数据不为空的情况下进行数据匹配
                }else{
                    return regMobile.test(data);
                }
            case 'mail':
                var regMail = new RegExp('(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$)|^\s$');
                if(data===null||data===undefined){
                    return true;
                }else{
                    return regMail.test(data);
                }
            case 'IDNumber':
                var regIDNumber = new RegExp('(^[1-9][0-9]{5}[1-3][0-9]{7}[0-9]{3}([0-9]|X)$)|^\s$',"i");
                if(data===null||data===undefined){
                    return true;
                }else{
                    return regIDNumber.test(data);
                }
            case 'plateNum':
                var regPlateNum = new RegExp('(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)|^\s$',"i");
                if(data===null||data===undefined){
                    return true;
                }else{
                    return regPlateNum.test(data);
                }
        }
    }else if(type&&(typeof type) === 'object'){
        if(type['pattern']){
            var reg = new RegExp(type['pattern'].trim().replace(/^\/|\/$/g,""),'g');//消除开头和结尾的'/'
            return reg.test(data);
        }else if(type['max']){
            return (data.length <= type['max']);
        }else if(type['min']){
            return (data.length >= type['min']);
        }
    }else{
        alert('验证参数必须为键值对对象或字符串。');
    }
};
//
Vue.prototype.getRootUrl = function(folderUrl){
    //开发环境
    if(store.state.rootApi==="/api"){
        return "../../../static/images/"+folderUrl;
        //生产环境
    }else if(Vue.prototype.isEmpty(store.state.rootApi)){
        return "../static/images/"+folderUrl;
    }
};

//格式化日期
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
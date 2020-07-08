/*****
 * option参数：{
 *    title:"this is title"
      content:"this is body"
      OKbtn:string       //按钮名
      cancelbtn:string   //按钮名
      ok:function        //ok按钮回调函数（右边）
      cancel:function    //cancel按钮回调函数(左边)
      closeAuto:boolean  //true点击遮罩时关闭弹框，false点击遮罩不关闭弹框(默认)
   }
 * ***/
//init insert mask
export default {
    install: function (Vue) {
        let hasalert = false;//弹框是否开启，只允许有一个弹框
        //全局的事件监听函数
        let listener = function(event){
            if(event.target.id === "_dialog-root"){
                Vue.prototype.$dialog.closeBox();
            }
        };
        Vue.prototype.$dialog = {
            /*创建遮罩层*/
            createMask: function () {
                let root = document.getElementById("app");
                if (document.getElementById("_dialog-root") === null) {
                    let mask = document.createElement("div");
                    mask.className = "_dialog-mask";
                    mask.id = '_dialog-root';
                    root.appendChild(mask);
                }
            },
            //confirm框---->包含header-body--footer，footer中包含  OK按钮和cancel按钮
            confirm: function (options) {
                if(hasalert){
                    return;
                }
                let Opts = {
                    title: options.title ? options.title : '请确认',
                    content: options.content ? options.content : '请输入内容',
                    OKbtn: options.OKbtn ? options.OKbtn : '确定',
                    cancelbtn: options.cancelbtn ? options.cancelbtn : "取消",
                    ok: options.ok ? options.ok : null,
                    cancel: options.cancel ? options.cancel : null,
                    closeAuto:!Vue.prototype.isEmpty(options.closeAuto)?options.closeAuto:false,
                };
                //没有弹框的状态才执行后面的语句
                Vue.prototype.$dialog.createMask();
                hasalert = true;//设置弹框开启
                let mask = document.getElementById("_dialog-root");
                let ok = function () {
                    mask.classList.remove('_dialog-show');//移除弹框
                    hasalert = false;
                    if (Opts.ok) {
                        Opts.ok();
                    }
                    hasalert = false;//设置弹框关闭
                };
                let cancel = function () {
                    mask.classList.remove('_dialog-show');
                    hasalert = false;
                    if (Opts.cancel) {
                        Opts.cancel();
                    }
                    hasalert = false;
                };
                let confirm =
                    "<div class='_dialog-box'>" +
                        "<header class='_dialog-box-header'>" + Opts.title + "</header>" +
                        "<section class='_dialog-box-body'>" + Opts.content + "</section>" +
                        "<footer class='_dialog-box-footer'>" +
                            "<button id='_dialog-confBox-cancel' class='_dialog-confBox-cancel'>" + Opts.cancelbtn + "</button>" +
                            "<button id='_dialog-confBox-ok' class='_dialog-confBox-ok'>" + Opts.OKbtn + "</button>" +
                        "</footer>" +
                    "</div>";
                mask.innerHTML = confirm;
                mask.classList.add("_dialog-show");
                let cancelbtn = mask.querySelector('#_dialog-confBox-cancel');
                let okbtn = mask.querySelector('#_dialog-confBox-ok');
                cancelbtn.addEventListener("click", cancel, false);
                cancelbtn.addEventListener("touchstart", function (event) {
                    event.currentTarget.classList.add('touch');
                }, false);
                cancelbtn.addEventListener("touchend", function (event) {
                    event.currentTarget.classList.remove('touch');
                }, false);
                okbtn.addEventListener("click", ok, false);
                okbtn.addEventListener("touchstart", function (event) {
                    event.currentTarget.classList.add('touch');
                }, false);
                okbtn.addEventListener("touchend", function (event) {
                    event.currentTarget.classList.remove('touch');
                }, false);
                Vue.prototype.$dialog.bindCloseEvent(Opts.closeAuto);
            },
            //information框---->只拿来弹出提示信息，或者弹出一个包含input框的盒子，
            //注意，最多只允许拥有一个input，若有input，OK按钮的回调函数中的参数为该input的value值
            infoBox: function (options) {
                if (hasalert) {
                    return;
                }
                let Opts = {
                    title: options.title ? options.title : '提示',
                    content: options.content ? options.content : '请输入内容',
                    OKbtn: options.OKbtn ? options.OKbtn : '确定',
                    cancelbtn: options.cancelbtn ? options.cancelbtn : null,
                    ok: options.ok ? options.ok : null,
                    cancel: options.cancel ? options.cancel : null,
                    closeAuto:!Vue.prototype.isEmpty(options.closeAuto)?options.closeAuto:false,
                };
                Vue.prototype.$dialog.createMask();
                hasalert = true;//设置弹框开启
                let mask = document.getElementById("_dialog-root");
                let ok = function () {
                    let input = mask.querySelector('._dialog-box-body input');
                    mask.classList.remove('_dialog-show');
                    hasalert = false;
                    if (Opts.ok) {
                        if (input) {
                            Opts.ok(input.value);
                        } else {
                            Opts.ok();
                        }
                    }
                    hasalert = false;//设置弹框关闭
                };
                let cancel = function () {
                    mask.classList.remove('_dialog-show');
                    hasalert = false;
                    if (options.cancel) {
                        options.cancel();
                    }
                    hasalert = false;//设置弹框关闭
                };
                let information ="";
                if(Opts.cancelbtn){
                    information  =
                    "<div class='_dialog-box'>" +
                        "<header class='_dialog-box-header'>" + Opts.title + "</header>" +
                        "<section class='_dialog-box-body'>" + Opts.content + "</section>" +
                        "<footer class='_dialog-box-footer'>" +
                            "<button id='_dialog-confBox-cancel' class='_dialog-confBox-cancel'>" + Opts.cancelbtn + "</button>" +
                            "<button id='_dialog-infoBox-ok' class='_dialog-infoBox-ok'>" + Opts.OKbtn + "</button>" +
                        "</footer>" +
                    "</div>";
                }else{
                    information  =
                        "<div class='_dialog-box'>" +
                            "<header class='_dialog-box-header'>" + Opts.title + "</header>" +
                            "<section class='_dialog-box-body'>" + Opts.content + "</section>" +
                            "<footer class='_dialog-box-footer'>" +
                                "<button id='_dialog-infoBox-ok' class='_dialog-infoBox-ok'>" + Opts.OKbtn + "</button>" +
                            "</footer>" +
                        "</div>";
                }
                mask.innerHTML = information;
                mask.classList.add("_dialog-show");
                let cancelbtn = mask.querySelector('#_dialog-confBox-cancel');
                let okbtn = mask.querySelector('#_dialog-infoBox-ok');
                if(cancelbtn){
                    cancelbtn.addEventListener("click", cancel, false);
                    cancelbtn.addEventListener("touchstart", function (event) {
                        event.currentTarget.classList.add('touch');
                    }, false);
                    cancelbtn.addEventListener("touchend", function (event) {
                        event.currentTarget.classList.remove('touch');
                    }, false);
                }
                okbtn.addEventListener("click", ok, false);//即使不定义OK按钮的回调函数，按钮也会默认绑定关闭弹框事件
                okbtn.addEventListener("touchstart", function (event) {
                    event.currentTarget.classList.add('touch');
                }, false);
                okbtn.addEventListener("touchend", function (event) {
                    event.currentTarget.classList.remove('touch');
                }, false);
                Vue.prototype.$dialog.bindCloseEvent(Opts.closeAuto);
            },
            //自定义弹框，参数为id字符串或者参数对象,id为需要弹出的div或者其他块级元素的id值,不需要带#号
            selfBox: function (options) {
                if (hasalert) {
                    return;
                }
                let id = (typeof options)==="string"?options:(typeof options)==="object"?options.id:null;
                if(id===null){
                    console.error("请输入字符串类型id或对象参数。");
                    return;
                }
                let Opts = {
                    id: options.id ? options.id : null,
                    closeAuto:!Vue.prototype.isEmpty(options.closeAuto)?options.closeAuto:false,
                };
                hasalert = true;                                        //设置弹框开启
                Vue.prototype.$dialog.createMask();                     //創建遮罩
                let mask = document.getElementById("_dialog-root");
                let root = document.getElementById("app");              //页面根节点
                let box = root.querySelector("#" + id);
                mask.innerHTML = "";                                    //先清空已设置的弹出框
                mask.classList.add("_dialog-show");                     //显示弹框
                box.classList.add("_dialog-selfBox-show");
                Vue.prototype.$dialog.bindCloseEvent(Opts.closeAuto);
            },
            //为弹框绑定点击遮罩自动关闭事件
            bindCloseEvent:function(auto){
                let root = document.getElementById("_dialog-root");
                if(auto){
                    root.addEventListener("click",listener,false);
                }else{
                    root.removeEventListener("click",listener,false);
                }
            },
            //统一关闭弹框,关闭所有正在显示的遮罩弹框
            closeBox: function () {
                let self = document.getElementsByClassName("_dialog-selfBox-show");
                if (self&&self.length>0) {
                    self[0].classList.remove("_dialog-selfBox-show");
                }
                let mask = document.getElementById("_dialog-root");
                if(mask){
                    mask.classList.remove('_dialog-show');
                    hasalert = false;//设置弹框关闭
                }else{
                    console.warn("当前没有需要关闭的弹框");
                }
            },
            //打开loading图
            loading: function () {
                Vue.prototype.$dialog.selfBox("loading");
            },
            //关闭loading
            closeLoading: function () {
                Vue.prototype.$dialog.closeBox();
            }
        };
    }
};





import Vue from "vue";
import { Validates } from "@/assets/commonjs/utils.js";

//绑定点击改变颜色事件,改事件只是添加了一个touch样式，具体样式要在全局样式中设置
Vue.directive("touch", {
  bind: function (el, binding) {
    el.addEventListener(
      "touchstart",
      function (event) {
        el.classList.add("touch");
      },
      false
    );
    el.addEventListener(
      "touchend",
      function (event) {
        el.classList.remove("touch");
      },
      false
    );
  },
});
//滑动指令，用在panel面板上面，点击后将面板隐藏
//原理，在panel-header上面绑定点击事件，设置panel-body的height属性值，然后添加hdSlide隐藏动画类---》实际上就是在全局样式上添加了一个animation动画
Vue.directive("hdSlide", {
  bind: function (el, binding) {
    let hd = el.querySelector(".panel-header");
    let body = el.querySelector(".panel-body");
    let modifiers = binding.modifiers; //属性值VUE "指令.xxx" 时传过来的值’{xxx：true}‘
    let ht = 0;
    //设定传参，有三种情况，
    //1、当参数是函数时，执行完滑动组件动画后执行回调函数
    //2、当参数是boolean时，true为滑动展开，false为隐藏,，每次参数发生变化时会执行
    //3、当参数是obj时，格式必须为{bl:xx,fn:xx}，前一个为boolean值，控制伸缩，后一个为回调函数，当伸缩完毕后执行回调函数
    let param = binding.value;
    let fn = null;
    let boolean = null;
    let t = Object.prototype.toString.call(param).match(/\[object (.*?)\]/)[1];
    let type = t.toLowerCase();
    if (type === "object") {
      fn = param.fn; //回调函数
      boolean = param.boolean; //boolean值
    } else if (type === "function") {
      fn = param;
    } else if (type === "boolean") {
      boolean = param;
    }
    let transitionEnd = undefined;
    //动画结束事件的兼容性处理
    let transitions = {
      WebkitTransition: "webkitTransitionEnd",
      OTransition: "oTransitionEnd",
      MozTransition: "transitionend",
      MsTransition: "msTransitionEnd",
      transition: "transitionend",
    };
    for (let i in transitions) {
      if (body.style[i] !== undefined) {
        transitionEnd = transitions[i];
        break;
      }
    }
    Vue.nextTick(function () {
      ht = body.offsetHeight; //该元素高度
      if (!body.getAttribute("data-height")) {
        body.setAttribute("data-height", ht);
      }
      //初始化元素高度(hidden时为0)，hidden参数决定了初始时隐藏盒子
      if (modifiers.hidden) {
        body.style.height = "0px";
        body.style.visibility = "hidden";
      } else {
        body.style.height = ht + "px"; //设置初始高度
        body.style.visibility = "visible";
      }
      body.classList.remove("vHidden");
    });
    //如果boolean为空则表示使用click事件控制伸缩，否则使用boolean值控制伸缩
    if (boolean === null || typeof boolean !== "boolean") {
      hd.addEventListener(
        "click",
        function () {
          if (body.style.height === "0px") {
            body.style.height = ht + "px";
            body.style.visibility = "visible";
          } else {
            body.style.height = "0px";
            body.style.visibility = "hidden";
          }
        },
        false
      );
    }
    if (fn && typeof fn === "function") {
      //动画结束后执行回调函数
      hd.addEventListener(transitionEnd, fn, false);
    }
  },
  /*在bind之前，会先执行component*/
  componentUpdated: function (el, binding) {
    let body = el.querySelector(".panel-body");
    if (body.offsetHeight > 0) {
      body.setAttribute("data-height", body.offsetHeight);
    }
    let ht = body.getAttribute("data-height");
    let param = binding.value;
    let boolean = null;
    let t = Object.prototype.toString.call(param).match(/\[object (.*?)\]/)[1];
    let type = t.toLowerCase();
    if (type === "object") {
      boolean = param.boolean;
    } else if (type === "boolean") {
      boolean = param;
    }
    if (boolean !== null && typeof boolean === "boolean") {
      //有可能输入的bl值为其它类型，这个时候都认为值无效
      if (boolean) {
        body.style.height = ht + "px";
        body.style.visibility = "visible";
      } else {
        body.style.height = "0px";
        body.style.visibility = "hidden";
      }
    }
  },
});
//检测鼠标滚动事件，滚动到底端执行回调函数
Vue.directive("lazy-load", {
  bind: function (el, binding) {
    let scrollTimeout;
    let callback = binding.value;
    el.addEventListener("scroll", function () {
      if (!scrollTimeout) {
        scrollTimeout = setTimeout(function () {
          scrollTimeout = null;
          if (el.scrollHeight - el.scrollTop < el.clientHeight + 30) {
            callback();
          }
        }, 500);
      }
    });
  },
});

// 获取焦点
Vue.directive("focus", {
  inserted(el) {
    el.focus();
  },
  bind(el) {
    el.focus();
  },
});

// 图片限定范围拖拽
Vue.directive("move", {
  inserted: function (el, binding) {
    const initOffsetL = el.offsetLeft;
    const initOffsetT = el.offsetTop;
    const initParentH = el.offsetHeight;
    const initParentW = el.offsetWidth + 2 * initOffsetL;
    // console.log('initOffsetL:'+initOffsetL+'initOffsetT:'+initOffsetT+'initParentH:'+initParentH+'initParentW:'+initParentW)
    el.addEventListener(
      "touchstart",
      function (eventS) {
        eventS.preventDefault();
        let startHeight = el.offsetHeight;
        let startOWidth = el.offsetWidth;
        let startOffsetL = el.offsetLeft;
        let startOffsetT = el.offsetTop;
        let startX = eventS.targetTouches[0].pageX;
        let startY = eventS.targetTouches[0].pageY;
        el.addEventListener(
          "touchmove",
          function (eventM) {
            let moveX = eventM.targetTouches[0].pageX;
            let moveY = eventM.targetTouches[0].pageY;
            let resultX = moveX - startX;
            let resultY = moveY - startY;
            let resultOffsetL = startOffsetL + resultX;
            let resultOffsetT = startOffsetT + resultY;
            if (resultOffsetL >= 0)
              // el.style.left = resultOffsetL>(startOWidth-initOffsetL)?startOWidth-initOffsetL+'px':resultOffsetL+'px';
              el.style.left =
                resultOffsetL > initOffsetL
                  ? initOffsetL + "px"
                  : resultOffsetL + "px";
            if (resultOffsetL < 0) {
              if (startOffsetL == initOffsetL) {
                el.style.left =
                  resultOffsetL < initParentW - startOWidth
                    ? (initParentW - startOWidth) / 2 + "px"
                    : resultOffsetL + "px";
              } else {
                el.style.left =
                  resultOffsetL < initParentW - startOWidth
                    ? initParentW - startOWidth + "px"
                    : resultOffsetL + "px";
              }
            }

            if (resultOffsetT >= 0)
              el.style.top =
                resultOffsetT > initOffsetT
                  ? initOffsetT + "px"
                  : resultOffsetT + "px";
            if (resultOffsetT < 0)
              el.style.top =
                resultOffsetT < initParentH - startHeight
                  ? initParentH - startHeight + "px"
                  : resultOffsetT + "px";
          },
          false
        );
      },
      false
    );
    el.addEventListener(
      "mousedown",
      function (eventS) {
        eventS.preventDefault();
        let startHeight = el.offsetHeight;
        let startOWidth = el.offsetWidth;
        let startOffsetL = el.offsetLeft;
        let startOffsetT = el.offsetTop;
        let startX = eventS.pageX;
        let startY = eventS.pageY;
        el.addEventListener(
          "mousemove",
          function (eventM) {
            let moveX = eventM.pageX;
            let moveY = eventM.pageY;
            let resultX = moveX - startX;
            let resultY = moveY - startY;
            let resultOffsetL = startOffsetL + resultX;
            let resultOffsetT = startOffsetT + resultY;
            if (resultOffsetL >= 0)
              // el.style.left = resultOffsetL>(startOWidth-initOffsetL)?startOWidth-initOffsetL+'px':resultOffsetL+'px';
              el.style.left =
                resultOffsetL > initOffsetL
                  ? initOffsetL + "px"
                  : resultOffsetL + "px";
            if (resultOffsetL < 0) {
              if (startOffsetL == initOffsetL) {
                el.style.left =
                  resultOffsetL < initParentW - startOWidth
                    ? (initParentW - startOWidth) / 2 + "px"
                    : resultOffsetL + "px";
              } else {
                el.style.left =
                  resultOffsetL < initParentW - startOWidth
                    ? initParentW - startOWidth + "px"
                    : resultOffsetL + "px";
              }
            }

            if (resultOffsetT >= 0)
              el.style.top =
                resultOffsetT > initOffsetT
                  ? initOffsetT + "px"
                  : resultOffsetT + "px";
            if (resultOffsetT < 0)
              el.style.top =
                resultOffsetT < initParentH - startHeight
                  ? initParentH - startHeight + "px"
                  : resultOffsetT + "px";
          },
          false
        );
      },
      false
    );
  },
});

/**
 * 正则指令
 * rules:{
 *      phone:{
 *          rule:[
 *              {val:'required',msg:'请输入****'},
 *          ],
 *          msg:null
 *      }
 *
 * }
 */
Vue.directive("vals", {
  bind(el, binding) {
    el.addEventListener("blur", (event) => {
      binding.value.rule
        ? binding.value.rule.forEach((item) => {
            Validates._isValidate(item.val, event.target.value)
              ? (binding.value.msg = null)
              : (binding.value.msg = item.msg);
          })
        : "";
    });
  },
});
Vue.directive("focus", {
  bind(el, binding) {
    el.addEventListener("focus", (event) => {
      el.style.backgroundColor = "white";
      el.style.border = "1px solid blue";
    });
    el.addEventListener("blur", (event) => {
      el.style.backgroundColor = "transparent";
      el.style.border = "1px solid #585858";
    });
  },
});

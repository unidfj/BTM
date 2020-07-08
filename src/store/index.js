import Vue from 'vue';
import Vuex from 'vuex';
import storePlugin from '../assets/commonjs/storePlugin';
import {Secret } from '../assets/commonjs/utils';
//注册Vuex插件
Vue.use(Vuex);

//设置全局变量
export default new Vuex.Store({
    state:{
        session:null,                               //从服务器端返回的登录信息
        userInfo:null,                              //登录用户信息
        navIndex:1,   //底部导航栏的index
        API:process.env.API+process.env.PORT,     //总api 开发
        // API:process.env.API,     //总api  打包
        browserUrl:null,   //浏览器地址
        custom:null, //客服
        storeBg:null, //商城图片
        userInfo:null,  //用户信息
        userID:null, //用户id
        isreal:null,  // 是否实名  
        tempData:null, //临时数据
        sTempData:null,  //加密临时数据
        cookie:null, //登录的cookie
        version:null, //版本号
        appId:"H559D41BA", //appid
        screenH:null,  //屏幕高度,
        coinTxt:null,  //币种名称
        bannerSrc:null, //banner
        proData:null, //基础信息

    },
    mutations:{
        saveSession (state,session) {
            state.session = session;
        },
        saveUserInfo(state,info){
            state.userInfo = info;
        },
        saveNavInd(state,ind){
            state.navIndex = ind;
        },
        saveBrowser(state,url){
            state.browserUrl = url;
        },
        saveCustom(state,string){
            state.custom = string;
        },
        saveStoreBg(state,url){
            state.storeBg = url;
        },
        saveUserInfo(state,obj){
            state.userInfo = obj;
        },
        saveUserID(state,obj){
            state.userID = obj;
        },
        saveTemp(state,obj){
            state.tempData = obj;
        },
        saveSTemp(state,obj){
            state.sTempData = obj;
        },
        saveVersion(state,str){
            state.version = str;
        },
        saveCoinTxt(state,obj){
            state.coinTxt = obj;
        },
        saveBanner(state,str){
            state.bannerSrc = str;
        },
        saveProData(state,obj){
            state.proData = obj;
        },

    },
    getters:{
      getSession (state) {
        return state.session;
      },
      userInfo(state){
          if(!state.userInfo){
            state.userInfo =  JSON.parse(Secret.decrypt(localStorage.getItem('userInfo')));
            return state.userInfo;
          }else {
              return state.userInfo;
          }
      },
      uid(state){
          if(!state.userID){
            state.userID =  JSON.parse(Secret.decrypt(localStorage.getItem('userInfo'))).id;
            return state.userID;
          }else {
              return state.userID;
          }
      },
      isreal(state){
        if(!state.userInfo){
            state.userInfo =  JSON.parse(localStorage.getItem('userInfo'));
            return state.userInfo.isreal;
          }else {
              return state.userInfo.isreal;
          }
      },
      api(state){
          return state.API
      },
      temp(state){
          if(!state.tempData){
              state.tempData = JSON.parse(localStorage.getItem('temp'));
              return state.tempData;
          }else {
              return state.tempData;
          }
      },
      stemp(state){
          if(!state.sTempData){
              state.sTempData = JSON.parse(Secret.decrypt(localStorage.getItem('stemp')));
              return state.sTempData;
          }else {
              return state.sTempData;
          }
      },
      version(state){
          if(!state.version){
            state.version = localStorage.getItem('version');
            return state.version;
          }else
            return state.version
      },
      screenH(state){
        if(!state.screenH){
            state.screenH = window.screen.height || window.screen.availHeight ||window.innerHeight;
            return state.screenH
        }else {
            return state.screenH
        }
    },
    coinTxt(state){
        if(!state.coinTxt){
            state.coinTxt = JSON.parse(localStorage.getItem('coinTxt'));
            return state.coinTxt;
        }else 
            return state.coinTxt;
    },
    bannerSrc(state){
        return state.bannerSrc
    },
    proData(state){
        if(!state.proData){
            state.proData = JSON.parse(localStorage.getItem('proData'));
            return state.proData;
        }else 
            return state.proData;
    }
    },
    // plugins:[storePlugin]
})

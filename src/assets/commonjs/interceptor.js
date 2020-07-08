import Vue from "vue";
import axios from 'axios';
import store from '../../store/index';

//设置请求超时时间（30s）
// axios.defaults.timeout = 30000;
// axios.defaults.withCredentials=true;
axios.interceptors.request.use(
    //发送请求时即进行拦截，session为null的情况下不发送请求
    function(config){
        if(process.env.NODE_ENV == 'development'){
            config.url = process.env.proxy+config.url+'?token='+localStorage.getItem('cookie');
        }else {
            config.url = process.env.API+process.env.PORT+config.url+'?token='+localStorage.getItem('cookie');
        }
        return config;
    },function(error){
        return Promise.reject(error);
    }
);

/*拦截器,对于响应的拦截器*/
axios.interceptors.response.use(
    function(response){
        let location = window.location.href.split("#")[0];
        let code = response.data.code;
        if(parseInt(code) === 401||parseInt(code) === 10){//session无效
            mui.toast(response.data.msg);
            localStorage.clear();
            // store.commit("saveUserID",null);
            setTimeout(() => {
                window.location.href = location;//刷新页面，将由公共方法判断是跳转至登录页面还是微信认证，刷新页面时会去除URL中的session等参数
            }, 1000);
            Promise.reject(response);
        }else if(parseInt(code) === 9999){
            mui.toast(response.data.msg);
            localStorage.clear();
            window.location.href = location+'#/login';
            Promise.reject(response);
        }
        return response;
    },function(error){
        let location = window.location.href.split("#")[0];
        if(error.response){
            switch(error.response.status){//404，网络错误，地址有问题。
                case 404:
                    alert("网络错误！");
                    break;
                case 401:
                    // console.log(error.response.data.msg);debugger;
                    mui.toast(error.response.data.msg);
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.href = location;//刷新页面，将由公共方法判断是跳转至登录页面还是微信认证，刷新页面时会去除URL中的session等参数
                    }, 1000);
                    break;
            }
        }else{
            let errorMsg = error.message;
            if(error.message.indexOf("timeout")>-1){
                errorMsg = "请求超时";
            }
            return Promise.resolve({//在报错的时候传回一个正常的promise对象，错误可以交到正常处理
                data:{code:1,msg:error.message,extmsg:errorMsg}
            });
        }

    }
);
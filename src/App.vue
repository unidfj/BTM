<template>
    <div id="app">
        <!-- <transition name="slide-fade"> -->
        <transition>
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
        </transition>
        <!-- <transition name="slide-fade"> -->
        <transition>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
         </transition>
    </div>
</template>
<script>
import VConsole from 'vconsole';
import {HB} from '@/assets/commonjs/utils.js';
import {Base} from '@/server/server.js';
import {mapMutations} from 'vuex';
export default {
    name: 'app',
    data () {
        return{
            userName:" ",
        }
    },
    mounted:function(){
        // let vConsole = new VConsole();
        // this.getData();
        setTimeout(() => {
            HB.autoUpdate();
        }, 3000);
    },
    methods:{
        ...mapMutations(['saveProData']),
        async getData(){
            await Base.getData().then(res=>{
                if(res.code ==1){
                    this.saveProData(res.data);
                    localStorage.setItem('proData',JSON.stringify(res.data));
                }else
                mui.toast(res.msg||'加载项目信息失败！')
            })
        }
    }
}
</script>
<style lang="less">
    @import "./assets/style/common.less";
</style>
<style lang="less">
    /* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(5px);
  opacity: 0;
}
</style>

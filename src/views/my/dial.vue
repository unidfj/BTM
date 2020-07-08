<template>
    <div class="page">
        <m-header title="幸运转盘" :canback="Boolean(1)"></m-header>
        <section class="body">
            <div class="dial">
                <div class="bg" :style="'-webkit-transform:rotate('+rotate+'deg);-webkit-transition:all '+time+'s ease-in-out;'">
                    <img class="img" src="../../assets/images/gzlz/zhuanpan_bg2.png" alt="">
                    <div class="item item1">
                        <span >{{dialData?dialData.list[0].title:'暂无'}}</span>
                        <img class="icon" :src="dialData && dialData.list[0].rewardimg?api+dialData.list[0].rewardimg:defaultSrc" alt="">
                    </div>
                    <div class="item item2">
                        <span >{{dialData?dialData.list[1].title:'暂无'}}</span>
                        <img class="icon" :src="dialData && dialData.list[1].rewardimg?api+dialData.list[1].rewardimg:defaultSrc" alt="">
                    </div>
                    <div class="item item3">
                        <span >{{dialData?dialData.list[2].title:'暂无'}}</span>
                        <img class="icon" :src="dialData && dialData.list[2].rewardimg?api+dialData.list[2].rewardimg:defaultSrc" alt="">
                    </div>
                    <div class="item item4">
                        <span >{{dialData?dialData.list[3].title:'暂无'}}</span>
                        <img class="icon" :src="dialData && dialData.list[3].rewardimg?api+dialData.list[3].rewardimg:defaultSrc" alt="">
                    </div>
                    <div class="item item5">
                        <span >{{dialData?dialData.list[4].title:'暂无'}}</span>
                        <img class="icon" :src="dialData && dialData.list[4].rewardimg?api+dialData.list[4].rewardimg:defaultSrc" alt="">
                    </div>
                    <div class="item item6">
                        <span >{{dialData?dialData.list[5].title:'暂无'}}</span>
                        <img class="icon" :src="dialData && dialData.list[5].rewardimg?api+dialData.list[5].rewardimg:defaultSrc" alt="">
                    </div>
                    <div class="item item7">
                        <span >{{dialData?dialData.list[6].title:'暂无'}}</span>
                        <img class="icon" :src="dialData && dialData.list[6].rewardimg?api+dialData.list[6].rewardimg:defaultSrc" alt="">
                    </div>
                </div>
                <img class="shot" src="../../assets/images/gzlz/icon_zhizheng.png" alt="">

            </div>
            <p class="data">
                <span>当前抽奖券：<i>{{dialData?dialData.total:0}}</i></span>
                <span>可抽奖次数：<i>{{dialData?dialData.total:0}}</i></span>
            </p>
            <button class="btn btn-blue" @click="run">立即抽奖</button>
            <p class="title">活动规则：</p>
            <p class="content">
                <span v-for="(item,index) in ruleArr" :key="index">{{item}}<br></span>
            </p>
        </section>
    </div>
</template>
<script>
import {Owner} from '@/server/server.js';
import {mapGetters} from 'vuex';
export default {
    data(){
        return {
            rotate:0,
            time:0,
            dialData:null,
            defaultSrc:require('@/assets/images/gzlz/Icon_payment.png'),
            reward:null,
            ruleArr:null,
            flag:true
        }
    },
    mounted(){
        this.getDialList(this.uid);
    },
    computed:{
        ...mapGetters(['uid','api'])
    },
    methods:{
        /**
         * 开始抽奖
         */
        run(){
        if(this.flag){
            if(this.dialData.total == 0){
                mui.toast('当前没有抽奖次数了哦~');
                return ;
            }
            // this.flag = true;
            this.time = 0;
            this.rotate = 0;
                this.getReward(this.uid,data=>{
                    this.$nextTick(()=>{
                        this.flag = false;
                        this.dialData?this.dialData.total = this.dialData.total-1:'';
                    })
                    setTimeout(()=>{
                        this.time = 3;
                        this.rotate = 1080+ (385 - data.reward_id*50);
                    },100)
                    setTimeout(() => {
                        mui.alert(data.remark);
                        this.flag = true;
                    }, 3500);
                })
            }
        },
        /**
         * 获取奖品列表
         */
        getDialList(id){
            Owner.getDialList({id}).then(res=>{
                if(res.code == 1){
                    this.dialData = res.data;
                    this.setRule(this.dialData.rule)
                }
            })
        },
        /**
         * 获取奖品结果
         */
        getReward(id,callback){
            Owner.getReward({id}).then(res=>{
                if(res.code ==1){
                    callback(res.data)
                }else {
                    mui.toast(res.msg+'，请于客服反馈！');
                }
            })
        },
        /**
         * 规则
         */
        setRule(string){
            if(string){
                this.ruleArr = string.split(';');
            }
        }
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
    .body {
        background-color: @bg-color;
        padding: @padding-primary 50px;
        .display-flex();
        flex-direction: column;
        align-items: center;
        .dial {
            height: 272PX;
            border-radius: 50%;
            position: relative;
            .shot {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    .transform(translate(-50%,-50%));
                    width: 100px;
                }
            .bg {
                height: 272PX;
                position: relative;
                
                .img {
                    height: 100%;
                }
                .item {
                    position: absolute;
                    .display-flex();
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: fit-content;
                    font-size: 24px;
                    font-weight: 700;
                    .icon {
                        width: 50px;
                    }
                }
                .item1 {
                    top: 40PX;
                    right: 90PX;
                    .transform(rotate(30deg))
                }
                .item2 {
                    top: 95PX;
                    right: 40PX;
                    .transform(rotate(80deg))
                }
                .item3 {
                    top: 160PX;
                    right: 58PX;
                    .transform(rotate(130deg))
                }
                .item4 {
                    top: 195PX;
                    right: 120PX;
                    .transform(rotate(180deg))
                }
                .item5 {
                    bottom: 65PX;
                    left: 58PX;
                    .transform(rotate(230deg))
                }
                .item6 {
                    bottom: 128PX;
                    left: 40PX;
                    .transform(rotate(280deg))
                }
                .item7 {
                    top: 46PX;
                    left: 85PX;
                    .transform(rotate(330deg))
                }
            }
        }
        .data {
            .display-flex();
            width: 100%;
            justify-content: space-around;
            margin: 60px 0 40px;
            font-size: 24px;
            i {
                color: red;
            }
        }
        .btn {
            width: 100%;
        }
        .title {
            color: @primary-color;
            font-size: 32px;
            width: 100%;
            margin: 60px 0 30px;
        }
        .content {
            // text-indent: 40px;
            font-size: 24px;
            width: 100%;
            padding-left: @padding-primary;
        }
    }
</style>


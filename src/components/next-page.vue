<!-- 
    分页加载尾部 （全局注册组件）
        noMore（boolean） 有无分页表示  true 没有下一下 false 有下一页
        调用
            Load.loadNext(this);  mounted 钩子函数调用即可

-->
<template>
    <div >
        <section class="body" v-show="layer">
            <div class="loading">
                <img :src="img" alt="" v-show="!nomore">
                <p class="no-more" v-show="nomore">没有更多了呢</p>
            </div>
        </section>
    </div>
</template>
<script>
export default {
    props:{
        nomore:{
            type:Boolean,
            default(){
                return false;
            }
        }
    },
    data () {
        return {
            layer:false,
            img:require('../assets/images/loading1.gif')
        }
    },
    methods:{
        open(){
            this.layer = true;
        },
        close(){
            this.layer = false;
        }
    }
}
</script>

<style scoped lang="less">
@import '~link-less';
.body {
    .loading {
        width: 100%;
        text-align: center;
        .no-more {
            color: #999;
            position: relative;
            padding: 20px 0;
            &::before {
                content: '';
                position: absolute;
                width: 10%;
                left: 20%;
                top: 50%;
                .transform(translateY(-50%));
                height: 1px;
                background-color: #999;
            }
            &::after {
                content: '';
                position: absolute;
                width: 10%;
                right: 20%;
                top: 50%;
                .transform(translateY(-50%));
                height: 1px;
                background-color: #999;
            }
        }
    }
}
</style >


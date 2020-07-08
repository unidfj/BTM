<!-- 
    需要选择支付方式的上传组件

-->
<template>
    <div >
        <section class="body" v-show="layer">
            <div class="small-alert">
                <header class="header"><span>上传支付凭证</span><i class="iconfont iconclose close" @click.stop="close"></i></header>
                <section class="content">
                    <input class="file" type="file" @change="upload($event)">
                    <img class="img" :src="payproof" alt="">
                    <ul class="mui-table-view mui-table-view-radio radioNav">
                        <li class="mui-table-view-cell" @click="savePaytype(2)">
                            <a class="mui-navigate-right">支付宝</a>
                        </li>
                        <li class="mui-table-view-cell mui-selected" @click="savePaytype(1)">
                            <a class="mui-navigate-right">微信</a>
                        </li>
                        <li class="mui-table-view-cell" @click="savePaytype(3)">
                            <a class="mui-navigate-right">银联</a>
                        </li>
                    </ul>
                    <slot name="content"></slot>
                </section>
                <footer>
                    <button class="btn-confirm" @click.stop="confirm">{{btntext}}</button>
                    <!-- <button class="btn-confirm" @click.stop="confirm">{{btntext}}</button> -->
                </footer>
            </div>
        </section>
    </div>
</template>
<script>
import {Util} from '@/assets/commonjs/utils.js';
export default {
    props:{
        btntext:{
            type:String,
            default(){
                return '确定'
            }
        }
    },
    data () {
        return {
            layer:false,
            payproof:require('../assets/images/chuji.png'),//null
            paytype:1
        }
    },
    methods:{
        open(){
            this.layer = true;
        },
        close(){
            this.layer = false;
        },
        confirm(){
            if(this.payproof){
                this.$emit('confirm',{paytype:this.paytype,payproof:this.payproof});
            }else {
                mui.toast('请上传支付凭证！')
            }
        },
        upload(event){
            let _This = this;
            Util.uploadImg(this,event.target.files[0],(base64)=>{
                _This.payproof = base64;
            })
        },
        savePaytype(paytype){
            this.paytype = paytype;
        }
    }
}
</script>

<style scoped lang="less">
// @import '~link-less';
@import '~link-less';
.body {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    .small-alert {
        position: absolute;
        width: 90%;
        // height: 500px;
        // padding-bottom: 80px;
        border-radius: 20px;
        background-color: white;
        left: 50%;
        top: 20%;
        text-align: center;
        .transform(translateX(-50%));
        .header {
            .display-flex();
            border-bottom: 1px solid #f3f3f3;
            padding: 10px;
            >span{
                flex: 1;
                font-weight: 700;
            }
            .close {
                font-size: 50px;
                opacity: .3;
            }
        }
        .content {
            position: relative;
            margin-top: 100px;
            font-size: 28px;
            i {
                color: @btn-primary-color;
                font-size: 32px;
            }
            .img {
                width: 90%;
                height: 300px;
                position: relative;
            }
            .file {
                position: absolute;
                left: 5%;
                width: 90%;
                height: 300px;
                opacity: 0;
                z-index: 1;
            }
            .radioNav{
                .display-flex();
                justify-content: space-between;
                width: 90%;
                margin-left: 5%;
                a {
                    text-overflow: unset;
                }
            }
        }
        .btn-confirm {
            .btm-btn-primary();
            border-radius: 0;
            margin: 0;
            width: 100%;
            margin-top: 100px;
            border-bottom-left-radius: 20px;
            border-bottom-right-radius: 20px;
            background: @base-blue;
        }
    }
}
</style >



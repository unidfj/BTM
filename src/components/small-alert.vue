<template>
    <div >
        <section class="body" v-show="layer">
            <div class="small-alert">
                <header class="header"><i class="iconfont iconclose close" @click.stop="close"></i></header>
                <section class="content">
                    <!-- 您购买的{{name}}<br>需要<i>{{price}}</i>GK -->
                    <slot name="content"></slot>
                </section>
                <footer>
                    <button class="btn-buy" @click.stop="buy">{{btntext}}</button>
                </footer>
            </div>
        </section>
    </div>
</template>
<script>
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
        }
    },
    methods:{
        open(){
            this.layer = true;
        },
        close(){
            this.layer = false;
        },
        buy(){
            this.layer = false;
            this.$emit('go');
        }
    }
}
</script>

<style scoped lang="less">
// @import '~link-less';
@import '~link-less';
.body {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    .small-alert {
        position: absolute;
        width: 80%;
        // height: 500px;
        padding-bottom: 80px;
        border-radius: 20px;
        background-color: white;
        left: 50%;
        top: 30%;
        text-align: center;
        .transform(translateX(-50%));
        .header {
            text-align: right;
            border-bottom: 1px solid #f3f3f3;
            padding: 10px;
            .close {
                font-size: 50px;
                opacity: .3;
            }
        }
        .content {
            // text-align: center;
            margin-top: 100px;
            font-size: 28px;
            i {
                color: @btn-primary-color;
                font-size: 32px;
            }
        }
        .btn-buy {
            background:-webkit-linear-gradient(left,rgba(39,179,255,1) 0%,rgba(4,150,230,1) 100%);
            border-radius: 50px;
            padding: 20px 80px;
            color: white;
            margin-top: @margin-primary;
        }
    }
}
</style >


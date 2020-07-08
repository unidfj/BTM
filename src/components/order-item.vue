<template>   
    <section class="section" :style="'height:'+(screenHeight-85)+'px;'">
        <ul class="list" v-lazy-load="layLoad" :style="'padding-bottom:'+pad+'px'">
            <li class="list-item" v-for="(item,index) in listdata" :key="index" @click.stop="detail(item.id)">
                <img class="head" :src="head" alt="">
                <ul class="content">
                    <li class="content-item content-top">
                        <p class="title">{{item.uuname}}</p>
                        <img class="icon" :src="head" alt="">
                        <span>{{formatDate(item.createtime)}}</span>
                    </li>
                    <li class="content-item content-middle">
                        <p class="title">GK {{item.amount2}}</p>
                        <span class="price"><i>单价</i> ￥{{item.uprice}}</span>
                    </li>
                    <li class="content-item content-bottom">
                        <p class="icon-group"><i class="iconfont iconalipay ali"></i>支付宝<i class="iconfont iconwechat wechat"></i>微信<i class="iconfont iconcard card"></i>银联</p>
                        <span v-if="!opt&&grey" class="order-type grey">{{filterState(item.state)}}</span>
                        <span v-else-if="!opt" class="order-type">{{filterState(item.state)}}</span>
                        <button v-else  class="btn-opt"  @click="opera(item.id)">{{btntext}}</button>
                    </li>
                </ul>
            </li>
        </ul>
        <img class="empty" v-if="!listdata || listdata.length==0" src="../assets/images/empty.png" alt="">
    </section>

</template>
<script>
import {Util} from '@/assets/commonjs/utils.js';
// import {mapGetters} from 'vuex';
export default {
    name: 'order-item',
    props:{
        listdata:{
            type:Array,
            // default(){
            //     return [
            //         {
            //             src:require('../assets/images/chuji.png'),
            //         },
            //         {
            //             src:require('../assets/images/chuji.png'),
            //         },
                    
            //     ]
            // }
        },
        opt:{
            type:Boolean,
            default(){
                return false;
            }
            },
        grey:{
            type:Boolean,
            default(){
                return false
            }
        },
        type:{
            type:String,
            default(){
                return 'sale'
            }
        },
        btntext:{
            type:String,
            default(){
                return ''
            }
        },
        pad:{
            type:Number,
            default(){
                return 30
            }
        }
    },
    data () {
        return {
            navIndex:0,
            baseApi:this.$store.state.API,
            head:require('../assets/images/chuji.png'),
            screenHeight:667,
        }
    },
    // computed:{
    //     ...mapGetters(['uid'])
    // },
    mounted(){
        this.screenHeight = window.screen.availHeight;
        console.log(this.screenHeight)
    },
    methods:{
        change(id){
            this.navIndex = id;
            this.$emit('change',id);
        },
        opera(value){
            this.$emit('opera',value);
        },
        detail(id){
            let tradeType = '';
            if(this.btntext){
                switch(this.btntext){
                    case '买入':
                        tradeType = 'sale';
                        break;
                    case '卖出':
                        tradeType = 'buy';
                        break;
                }
            }
            this.$router.push({name:'OrderDetail',params:{id},query:{type:this.type,tradeType}})
        },
        formatDate(datetime){
            let date  = new Date(datetime*1000);
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            if(Number(seconds)<10){
			seconds = '0'+seconds;
            };
            if(Number(minutes)<10){
                minutes = '0'+minutes;
            };
            if(Number(hours)<10){
                hours = '0'+hours;
            };
            return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
        },
        filterState(state){
            
            if(this.type == 'sale'){
                console.log('sale11111')
                 switch(state){
                    case 1:
                        return '待交易'
                        break;
                    case 2:
                        return '待付款'
                        break;
                    case 3:
                        return '待确认'
                        break;
                    case 4:
                        return '已完成'
                        break;
                }
            }else if(this.type == 'buy'){
                console.log('buy11111')
                switch(state){
                    case 1:
                        return '已创建'
                        break;
                    case 2:
                        return '待处理'
                        break;
                    case 3:
                        return '待确认'
                        break;
                    case 4:
                        return '已完成'
                        break;
                }
            }else if(this.type == 'order'){
                console.log('order11111')

                switch(state){
                    case 1:
                        return '已创建'
                        break;
                    case 2:
                        return '待付款'
                        break;
                    case 3:
                        return '待确认'
                        break;
                    case 4:
                        return '已完成'
                        break;
                }
            }else {
                console.log('trade11111')
                // switch(state){
                //     case 1:
                //         return '买入1'
                //         break;
                //     case 2:
                //         return '卖出'
                //         break;
                // }
            }
        },
        layLoad(){
            this.$emit('loadmore');
            console.log('layLoad')
        }
    }
}
</script>

<style scoped lang="less">
@import '~link-less';
    .list {
        height: 100%;
        overflow-y: auto;
        padding: @padding-primary;
        .list-item {
            .display-flex();
            padding: 20px;
            align-items: center;
            background-color: white;
            margin: 16px 0;
            .head {
                height: 80px;
                margin-right: 20px;
            }
            .content {
                flex: 1;
                .content-item {
                    .display-flex();
                    justify-content: space-between;
                }
                .content-top {
                    .title {
                        font-size: 28px;
                        font-weight: 700;
                        color: #000;
                    }
                    .icon {
                        height: 40px;
                    }
                }
                .content-middle {
                    .title {
                        font-size: 28px;
                        color: #000;
                    }
                    .price {
                        color: @font-primary-color;
                        font-size: 32px;
                        font-weight: 700;
                        i {
                            font-size: 24px;
                        }
                    }
                }
                .content-bottom {
                    color: @font-primary-color;
                    .icon-group {
                        color: @font-primary-color;
                        font-size: 24px;
                        i {
                            margin-left: 16px;
                            font-size: 24px;
                        }
                        .ali {
                            color: #21abff;
                            margin-left: 0;
                        }
                        .wechat {
                            color: #249937;
                        }
                        .card {
                            color: #dcd971;
                        }
                    }
                    .order-type {
                        font-size: 32px;
                        margin-top: 6px;
                    }
                    .grey {
                        color: #333;
                    }
                    .btn-opt {
                        font-size: 24px;
                        padding: 4px 30px;
                        border-radius: 20px;
                        border: 1px solid @font-primary-color;
                        color: @font-primary-color;
                    }
                }
            }
        }

    }
    .empty {
        width: 50%;
        margin: 0 auto;
        margin-top: 20%;
        display: block;
    }
</style >


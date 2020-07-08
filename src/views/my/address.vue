<template>
    <div class="page">
        <m-header title="地址管理" :canback="Boolean(1)"></m-header>
        <section class="body">
            <ul class="list">
                <li v-for="(v,i) in list" :key="i" @click="setdefault(v.address_id,i)">
                    <div class="left">
                        <i class="iconfont iconradio-checked" v-if="se==i"></i>
                        <i class="iconfont icondanxuanweixuanzhong" v-else></i>
                    </div>
                    <div class="center">
                        <p>{{v.name}} <span class="mobile">{{v.phone}}</span> </p>
                        <p>收货地址：{{v.Area?v.Area.province+v.Area.city+v.Area.region+v.detail:''}}</p>
                        <!-- <p>{{v.Area?Object.values(v.Area&&v.Area.Area).join('')+v.Area.detail:''}}</p> -->
                    </div>
                    <i class="iconfont iconbianji1" @click.stop="$router.push({name:'EditAddress',query:{id:v.address_id}})"></i>
                </li>
            </ul>
            <div class="top" @click="$router.push({name:'EditAddress'})">
                <!-- <i class="iconfont iconjiahao1"></i> -->
                <p>添加收货地址</p>
            </div>
        </section>
        <m-load ref="load"></m-load>
    </div>
</template>
<script>
import {Owner} from '@/server/server.js';
import {Util,Load,HB} from '@/assets/commonjs/utils.js';
import {mapGetters,mapMutations}  from 'vuex';
export default {
    data(){
        return {
            isApp:false,
            list:[],
            se:0,
        }
    },
    mounted(){
        this.lists()
        // this.getShare();
        // setTimeout(() => {
        //     this.share();
        // }, 10000);
    },
    computed:{
        ...mapGetters(['userInfo','version'])
    },
    methods:{
        ...mapMutations(['saveUserInfo','saveUserID','saveCoinTxt','saveProData','saveVersion']),
        initData(){
            
        },
        // 更改默认收货地址
        setdefault(id,i){
            Load.loadStart(this);
            Owner.setdefault({id}).then(res=>{
                Load.loadEnd(this);
                mui.toast(res.msg)
                if(res.code==1){
                    this.se = i;
                }  
            })
        },
        // 收货地址
        lists(){
            Owner.lists().then(res=>{
                if(res.code==1){
                    this.list = res.data.list;
                    if(this.list.length!==0){
                        this.list.forEach((v,i)=>{
                            if(v.isdefault=='1'){
                                this.se = i;
                            }
                        })
                    }
                }else{
                    mui.toast(res.msg)
                }
            })
        },
        // change(i){
        //     this.se = i;
        // }
        
    }
    
}
</script>
<style lang="less" scoped>
@import '~link-less';
    .body {
        background-color: @bg-color;
        color: white;
        .top{
            margin: 80px 10%;
            text-align: center;
            background-color: #00A2EA;
            border-radius: 100px;
            height: 88px;
            line-height: 88px;
            color:#fff;
            font-size: 34px;
        }
        .list{
            // width: 690px;
            // margin: 30px;
            li{
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #fff;
                // border-radius: 10px;
                border-bottom: 1px solid #eee;
                // height: 120px;
                padding: 30px 30px;
                .center{
                    flex: 1;
                    margin-left: 30px;
                    text-align: left;
                    display: inline-block;
                    >p{
                        color: #333;
                    }
                    .mobile {
                        color: #999;
                        font-size: 24px;
                    }
                }
                >.left{
                    background: #fff;
                    .iconradio-checked{
                        font-size: 38px;
                        color: #00A2EA;
                    }
                    .icondanxuanweixuanzhong {
                        font-size: 38px;
                        color: #aaa;
                    }
                }
                >i{
                    font-size: 45px;
                    color: #00A2EA;
                    display: inline-block;
                }
            }
        }
    }
</style>


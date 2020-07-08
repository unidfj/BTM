<template>
    <div class="page">
        <m-header :title="type=='zt'?'我的直推':'我的间推'" :canback="Boolean(1)"></m-header>
        <section class="body">
            <ul class="list" v-if="list">
               <li class="item" v-for="(item,index) in list[type]" :key="index">
                   <p>
                       <span>{{item.username}}</span>
                       <span>{{item.mobile}}</span>
                   </p>
                   </li>
            </ul>
            <next v-show="type&&list&&(type=='zt'&& list[type].length==0)||(type=='jt'&& list[type].length==0)" ref="next" :nomore="true"></next>
        </section>
    </div>
</template>
<script>
import {Owner} from '@/server/server.js';
import {mapGetters} from 'vuex';
import {Load,Secret} from '@/assets/commonjs/utils.js';
export default {
    name:"PayInfo",
    data(){
        return {
            type:null,
            list:null,
        }
    },
    mounted(){
        this.initData();
        this.getTeam(this.uid);
    },
    computed:{
        ...mapGetters(['uid'])
    },
    methods:{
        initData(){
            this.type = this.$route.query.type;
            setTimeout(() => {
                Load.loadNext(this);
            }, 0);
        },
        /**
         * 团队信息
         */
        getTeam(uid){
            Owner.getTeam({uid}).then(res=>{
                if(res.code == 1){
                    this.list = JSON.parse(Secret.decrypt(res.data));
                }else {
                    mui.toast(res.msg);
                    return ;
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
    .body {
        background-color: @bg-color;color: white;
        padding: @padding-primary;
        .list {
            .item {
                .display-flex();
                flex-direction: column;
                padding: @padding-primary 0 ;
                border-bottom: 1px solid #ddd;
                >p {
                    &:first-child{
                        .display-flex();
                        justify-content: space-between;
                    }
                    &:last-child {
                        text-align: right;
                        margin-top: 12px;
                    }
                }
            }
        }
    }
</style>

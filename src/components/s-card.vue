<template>
    <section >
        <div class="record"  v-for="(item,index) in listData" :key="index" >
            <div class="item" >
                <p>矿机：<i class="data">{{item.status==0?'-'+item.credit1:item.credit1}}</i></p>
                <button v-if="btntxt" :class="{'btn':true,'btn-blue':item.status==2,'btn-default':item.status==1,'btn-origin':item.status==0}">{{item.status==0?'预约成功':item.status==1?'已回退':'抢购成功'}}</button>
                <slot name="other"></slot>
            </div>
            <div class="item">
                <p>级别：<i class="data">{{item.level}}</i></p>
                <p>{{formatDate(item.createtime)}}</p>
            </div>
        </div>
    </section>
</template>

<script>
import {Util} from '@/assets/commonjs/utils.js';
export default {
    props:{
        btntxt:{
            type:Boolean,
            default(){
                return false;
            }
        },
        type:{
            type:Number,
            default(){
                return 0
            }
        },
        data:{
            type:Array,
            // default(){
            //     return [
            //         {
            //             createtime: 1554288616,
            //             credit1: "2.00",
            //             id: 11,
            //             level: 1,
            //             periods: "2019040320501",
            //             status: 0,
            //             username: "cs1012",
            //         }
            //     ]
            // }
        }
    },
    data(){
        return {
            btnClass:'btn-default',
            btnType:0,
            className:'btn-default',
            listData:[
                // {
                //         createtime: 1554288616,
                //         credit1: "2.00",
                //         id: 11,
                //         level: 1,
                //         periods: "2019040320501",
                //         status: 0,
                //         username: "cs1012",
                //     }
            ]
        }
    },
    mounted(){
        setTimeout(() => {
            this.listData = this.data;
        }, 500);
    },
    methods:{
        detail(){
            this.$emit('detail')
        },
        setLevel(level){
            switch(level){
                case 1 :
                    return '普通';
                case 2 :
                    return '勇者';
                case 3 :
                    return '卓越';
                case 4 :
                    return '稀有';
            }
        },
        formatDate(date){
            Util.formatDate(date)
        }
    }
}
</script>

<style lang="less" scoped>
@import '~link-less';
.record {
    padding: @padding-primary;
    background-color: @bg-card-color;
    margin: @margin-primary 0;
    .item {
        .display-flex();
        font-size: 32px;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
    }
}

</style>


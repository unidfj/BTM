<template>
    <section v-if="listData">
        <div :class="{'record':true,'no-bg':nobg}" v-for="(item,index) in listData" :key="index">
            <ul class="data">
                <li>编号：{{item.periods}}</li>
                <!-- <li class="name">{{setLevel(item.level)}}</li> -->
                <li class="name">{{item.levelname}}</li>
                <li>采矿时间：15:00-16:00</li>
                <li>预约/即抢采矿机：{{parseInt(2)}}/{{parseInt(4)}}</li>
                <li>智能合约收益：{{item.days}}天/{{parseInt(item.per)}}%</li>
                <li>可挖Mine：{{parseInt(item.credit2)}}枚</li>
                <li>可挖DOGE：收益{{parseInt(20)}}%</li>
                <li v-show="nobg">状态：<i class="state">待确认</i></li>
                <li v-show="nobg">取消理由：124646464</li>
            </ul>
            <div class="btn-groug">
                <button  class="btn btn-detail btn-origin" v-for="(item,index) in btnlist" :key="index" @click.stop="onEvent(item.type)">{{item.name}}</button>
                <!-- <button class="btn btn-detail btn-blue">预约</button> -->
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props:{
        nobg:{
            type:Boolean,
            default(){
                return false;
            }
        },
        btnlist:{
            type:Array,
            default(){
                return [
                    {
                        name:'详情',
                        type:'detail'
                    }
                ]
            }
        },
        data:{}
    },
    data(){
        return {
             listData:null
        }
    },
    mounted(){
        setTimeout(() => {
            this.listData = this.data;
        }, 1000);
    },
    methods:{
        onEvent(type){
            // console.log(type)
            this.$emit('event',type)
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
    }
}
</script>

<style lang="less" scoped>
@import '~link-less';
.record {
    // padding: @padding-primary;
    margin: @margin-primary 0;
    background-color: @bg-card-color;
    color: white;
    .display-flex();
    border-radius: 8px;
    .data {
        padding: 20px @padding-primary;
        flex: 1;
        font-size: 24px;
        .name {
            color: @primary-color;
            font-size: 32px;
            margin: 12px 0;
        }
        >li {
            margin: 2px 0;
        }
    }
    .btn-groug {
        text-align: right;
        padding:@margin-primary;
        width: 200px;
        height: 100%;
    }
    .state-red {
        color: red;
    }
    .state-green {
        color: green;
    }
}
.no-bg {
    background-color: transparent;
}

</style>


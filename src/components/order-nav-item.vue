<!-- 
    顶部tab 
        navlist tab数组
        start 默认选中tab  初始值默认为0
 -->
<template>   
    <nav >
        <ul class="nav">
            <li :class="{'nav-item':true,'nav-active':navIndex == item.id}" v-for="(item,index) in navlist" :key="index" @click="change(item.id)">{{item.name}}</li>
        </ul>
    </nav>

</template>
<script>
import {Util} from '@/assets/commonjs/utils.js'
export default {
    name: 'order-item',
    props:{
        navlist:{
            type:Array,
            default(){
                return [
                    {
                        id:0,
                        name:'全部'
                    },
                    {
                        id:1,
                        name:'已创建'
                    },
                    {
                        id:2,
                        name:'待处理'
                    },
                    {
                        id:3,
                        name:'已完成'
                    },
                ]
            }
        },
        start:{
            type:Number,
            default(){
                return 0;
            }
        }
    },
    mounted(){
        this.navIndex = this.start||0;
    },
    data () {
        return {
            navIndex:0
        }
    },
    methods:{
        change(id){
            this.navIndex = id;
            this.$emit('change',id)
        }
    }
}
</script>

<style scoped lang="less">
@import '~link-less';
    .nav {
        .display-flex();
        height: 58px;
        line-height: 58px;
        align-items: center;
        justify-content: space-between;
        background-color: @bg-card-color;
        color: white;
        font-size: 30px;
        border-radius: 8px;
        .nav-item {
            flex: 1;
            text-align: center;
            height: 100%;
            border-right: 1px solid @deep-black;
            &:first-child{
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
            }
            &:last-child{
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;
            }
        }
        .nav-active {
            background-color: @primary-color;
        }
    }

</style >


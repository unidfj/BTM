<template>   
    <div class="info">
        <img class="head-img" src="../assets/images/touxiang.png" alt="">
        <!-- <input class="file" type="file" @change="change($event)"> -->
        <div class="content">
            <span class="name">{{userInfo.username}}</span>
            <a href="javascript://" @click="certify"><span>完善实名</span> <i class="iconfont iconright"></i> </a>
        </div>
        <!-- <div class="rank">
            <img class="rank-icon" src="../assets/images/icon_shixi.png" alt="">
            <p class="rank-name">实习机主</p>
        </div> -->
    </div>

</template>
<script>
import {Util} from '@/assets/commonjs/utils.js';
import {mapGetters} from 'vuex';

export default {
    name: 'info-card',
    data () {
        return {
            baseApi:this.$store.state.API
        }
    },
    methods:{
        change(event){
            let _This = this;
            Util.uploadImg(this,event.target.files[0],(result)=>{
                _This.$emit('change',result);
            })
        },
        certify(){
            this.$router.push({name:'Certification'})
        }
    },
    computed:{
        ...mapGetters(['userInfo'])
    },
}
</script>

<style scoped lang="less">
@import '~link-less';
    .info {
        .display-flex();
        background:linear-gradient(-30deg,rgba(4,150,230,1) 0%,rgba(39,178,255,1) 100%);
        border-radius:8px;
        margin: @margin-primary;
        padding: @padding-primary;
        .head-img {
            width: 124px;
            height: 124px;
            border-radius: 50%;
            margin-right: @margin-primary;
        }
        .file {
            position: absolute;
            width: 124px;
            height: 124px;
            border-radius: 50%;
            opacity: 0;
        }
        .content {
            color: white;
            .display-flex();
            flex: 1;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            font-size: 24px;
            .name {
                font-size: 32px;
                margin-bottom: 16px;
            }
            >a{
                span,i {
                    vertical-align: middle;
                }
            }
        }
        .rank {
            position: relative;
            display: -webkit-flex;
            align-items: center;
            .rank-icon {
                position: absolute;
                left: -30px;
                width: 60px;
                height: 60px;
            }
            .rank-name {
                height: 48px;
                line-height: 48px;
                background-color: white;
                color: #0596E6;
                border-radius: 24px;
                font-size: 24px;
                padding: 0 40px;
            }
        }
    }
</style >


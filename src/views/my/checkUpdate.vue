<template>
    <div class="page">
        <m-header title="关于" :canback="Boolean(1)"></m-header>
        <section class="body">
            <!-- <img class="icon" src="../../assets/images/gzlz/logo.png" alt=""> -->
            <p class="text">当前版本 v{{version?version:'1.0'}}</p>
            <button class="btn btn-blue" @click="checkUpdate">检查更新</button>
        </section>
    </div>
</template>
<script>
import {mapGetters,mapMutations} from 'vuex';
import {Util,HB} from '@/assets/commonjs/utils.js';

export default {
    data(){
        return {
        }
    },
    mounted(){
        HB.getVersion(data=>{
            localStorage.setItem('version',data);
            this.saveVersion(data);
        })
    },
    computed:{
        ...mapGetters(['uid','api','version'])
    },
    methods:{
        ...mapMutations(['saveVersion']),
        checkUpdate(){
            HB.checkVersion();
        },
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
    .body {
        background-color: @bg-color;
        padding: @padding-primary 50px;
        .display-flex();
        flex-direction: column;
        align-items: center;
        .icon {
            width: 50%;
        }
        .text {
            margin-top: 20px;
        }
        .btn-blue {
            margin-top: 100px;
            width: 100%;
        }
    }
</style>


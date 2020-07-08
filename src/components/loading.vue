<!-- 
    加载框
    调用：
        Load.loadStart(this);
        Load.loadEnd(this);
-->
<template>
    <div >
        <section class="body" v-show="layer">
            <div class="loading">
                <img :src="img" alt="">
            </div>
        </section>
    </div>
</template>
<script>
export default {
    data () {
        return {
            layer:false,
            img:require('../assets/images/loading1.gif')
        }
    },
    methods:{
        open(){
            this.layer = true;
        },
        close(){
            this.layer = false;
        }
    }
}
</script>

<style scoped lang="less">
@import '~link-less';
.body {
    .display-flex();
    justify-content: center;
    align-items: center;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    .loading {
        width: 40%;
        text-align: center;
        background: rgba(255,255,255,1);
        border-radius: 10px;
        padding: 20px 0;
    }
}
</style >


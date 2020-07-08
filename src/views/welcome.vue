<template>
  <div class="page">
      <!-- <div class="content">
        <div class="rate">
            <div class="inner-rate"></div>
        </div>
      </div> -->
  </div>
</template>
<script>
    export default {
        name:"page404",
        mounted(){
            setTimeout(() => {
                this.$router.replace({name:'Login'})
            }, 1500);
        }
    }
</script>
<style scoped lang="less">
@import '~link-less';
    .page {
        background-image: url(../assets/images/gzlz/invate_bg.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        .content {
            text-align: right;
            .rate {
                position: relative;
                display: inline-block;
                right: 20px;
                top: 40px;
                background-color: red;
                width: 50PX;
                height: 50PX;
                border-radius: 50%;
                clip: rect(0 50PX 50PX 0);
                .inner-rate {
                    width: 40PX;
                    height: 40PX;
                    top: 50%;
                    left: 50%;
                    position: absolute;
                    .transform(translate(-50%,-50%));
                    background-color: black;
                    border-radius: 50%;

                }
            }
        }
    }
</style>

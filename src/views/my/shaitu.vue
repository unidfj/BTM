<template>
    <div class="page">
        <m-header title="晒图奖励" :canback="Boolean(1)"></m-header>
        <section class="body">
            <form class="tj-form">
                <div class="form-item">
                    <label class="mar" for="upload">请上传截图</label>
                    <input type="file" class="file" accept="image/*" @change="change($event)">
                    <img class="img" :src="upladSrc" alt="">
                </div>
                <button type="button" class="btn-submit btn-blue" @click="shaitu">确定</button>
            </form>
        </section>
        <m-load ref="load"></m-load>

    </div>
</template>
<script>
import {Util,Load} from '@/assets/commonjs/utils.js';
import {Owner,Base} from '@/server/server.js';
import {mapGetters}  from 'vuex';
export default {
    name:'shaitu',
    data(){
        return {
            upladSrc:require('@/assets/images/gzlz/upload.png'),
            formData:{
                id:this.uid,
                type:1,
                img:null
            }
        }
    },
    computed:{
        ...mapGetters(['api','uid'])
    },
    methods:{
        /**
         * 上传
         */
        change(event){
            // Util.uploadByUrl(event.target.files[0]).then(res=>{
            //     [this.upladSrc,this.formData.img] = [this.api+res,res]
            // })
            let _This = this;
            let formData = new FormData();
            Load.loadStart(_This);            
            // this.formData.image = event.target.files[0];
            Util.uploadImgLimit(event.target.files[0],url=>{
                formData.append('image',url);
                Base.upload(formData).then((res)=>{
                    Load.loadEnd(_This);
                    if(res.code == 1){
                        this.upladSrc = this.api+res.data;
                        this.formData.img = res.data;
                    }else {
                        mui.toast(res.msg);
                        return ;
                    }
                })
            })
        },
        /**
         * 晒图
         */
        shaitu(){
// console.log(this.formData);
// return;
            let params = Object.assign({},this.formData,{id:this.uid});
            let msg = Util.isValidate(params);
            if(msg){
                mui.toast(msg);
                return ;
            };
            Owner.shaitu(params).then(res=>{
                if(res.code == 1){
                    mui.toast(res.msg);
                    setTimeout(() => {
                        this.$router.go(-1);
                    }, 1000);
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
        background-color: @bg-color;
        color: white;
        .tj-form {
            .img {
                width: 100%;
                height: 448px;
            }
            .file {
                width: 100%;
                height: 448px;
            }
            .btn-submit {
                margin-top: 10%;
            }
        }
    }
</style>

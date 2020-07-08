<template>
    <div class="page">
        <m-header title="实名认证" :canback="Boolean(1)"></m-header>
        <section class="body">
            <form class="form tj-form">
                <div class="form-item" v-if="userInfo.isreal==0">
                    <label for="name">真实姓名</label>
                    <input type="text" placeholder="请输入真实姓名" v-model="formData.realname" >
                </div>
                <div class="form-item" v-else>
                    <label for="name">真实姓名</label>
                    <input type="text" :value="userInfo?userInfo.realname:''" readonly>
                </div>
                <div class="form-item" v-if="userInfo.isreal==0">
                    <label for="name">身份证号</label>
                    <input type="text" placeholder="请输入身份证号" v-model="formData.creditid" @blur="IsCertifyCard($event)" maxlength="18" :readonly="userInfo.isreal==1">
                    <span class="error" v-show="!rule.isCertifyCard.validate"><i class="iconfont iconerror1">{{rule.isCertifyCard.msg}}</i></span>
                </div>
                <div class="form-item" v-else>
                    <label for="name">身份证号</label>
                    <input type="text" :value="userInfo?userInfo.creditid:''" readonly>
                </div>
                <div class="form-item" v-if="userInfo.isreal==0">
                    <label for="name">交易密码</label>
                    <input type="password" placeholder="请输入6位数字交易密码" v-model="formData.paypwd" maxlength="6">
                    <!-- <span class="error" v-show="!rule.isCertifyCard.validate"><i class="iconfont iconerror1">{{rule.isCertifyCard.msg}}</i></span> -->
                </div>
                <!-- <div class="form-item" v-if="userInfo.isreal==0">
                    <label for="name">手机验证码</label>
                    <div class="item-flex code">
                        <input type="number" placeholder="请输入验证码" oninput="if(value.length>4)value=value.slice(0,4)" v-model="formData.captcha">
                        <button type="button" class="btn btn-blue" :disabled="seconds>0" @click="getCode">{{seconds==0?"点击获取":"已发送("+seconds+"s)"}}</button>
                    </div>
                </div> -->
                <button v-if="userInfo.isreal==0" type="button" class="btn-submit btn-blue" @click="real">确认提交</button>
            </form>
        </section>
    </div>
</template>
<script>
import {Init,Base} from '@/server/server.js';
import {mapGetters}  from 'vuex';
import {Util} from '@/assets/commonjs/utils.js';
export default {
    name:"invite",
    data(){
        return {
            seconds:0,
            formData:{
                id:null,
                realname:null,
                creditid:null,
                // captcha:null,
                mobile:null,
                paypwd:null
            },
            rule:{
                isCertifyCard:{
                    validate:true,
                    msg:'请输入正确的身份证号码！'
                }
            }
        }
    },
    mounted(){
        this.initData();
    },
    computed:{
        ...mapGetters(['uid','userInfo'])
    },
    methods:{
        initData(){
            this.formData.id = this.uid;
            this.formData.mobile = this.userInfo.mobile;
        },
        /**
         * 短信验证码
         */
        getCode(){
            this.seconds = 60;
            let get =  setInterval(()=>{
                this.$nextTick(()=>{
                    this.seconds = this.seconds-1;
                    if(this.seconds<=0){
                        clearInterval(get);
                    }
                })
            },1000);
            // todo:号码更换
            Base.sendCode({mobile:this.userInfo.mobile}).then((res)=>{
                mui.toast(res.msg);
            })
        },
        real(){
// console.log(this.formData)
// return ;
            // if(!this.isValidate()){
            //   mui.toast('请正确填写信息！');
            //   return ;
            // }
            // if(Util.filterData(this.formData)){
                let msg = Util.isValidate(this.formData);
                if(msg){
                    mui.toast(msg);
                    return ;
                }
                this.toReal(this.formData)
            // }else {
            //     mui.toast('请完整填写信息!');
            // }
        },
        /**
         * 去实名
         */
        toReal(params){
            Init.toReal(params).then(res=>{
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
        },
        IsCertifyCard(event){
            let regex = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/i;
            if (event.target.value.match(regex)) {
                this.rule.isCertifyCard.validate = true;
            } else {
                this.rule.isCertifyCard.validate = false;            
            }
        },
        isValidate(){
          if(!Util.formValidate(this.rule)|| !Util.filterData(this.formData)){
              return false;
            }else{
              return true;
            }
        } 
    }
}
</script>
<style lang="less" scoped>
@import '~link-less';
.body {
    background-color: @bg-color;
    color: white;
}
</style>

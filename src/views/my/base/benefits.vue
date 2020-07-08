<template>
  <div class="page">
    <m-header title="上传朋友圈截图" :canback="Boolean(1)"></m-header>
    <section class="body">
      <!-- <van-uploader v-if="!upladsrc" :after-read="onRead" accept="image/*">
        <div class="imgbox">
          <img class="icon" :src="src" alt />
          上传照片
        </div>
        <div class="text">上传朋友圈截图</div>
      </van-uploader>
      <div v-else class="uploadImg">
        <img :src="api+upladsrc" alt />
      </div>-->
      <div class="status" v-if="examine != null">上次提交结果：{{examine.status ==0?'审核中':examine.status == 1?'已通过':examine.reject_reason}}</div>
      <div class="wrap">
        <div class="upload-text" v-show="!image">
          <img src='../../../assets/images/btm/ico_scico.png'/>
          <div>上传图片</div>
        </div>
        <img :src='api+image' class="img" v-show="image"/>
        <input type="file" class="inp" @change="upload($event)" :disabled=type />
      </div>
      <div class="friend">上传朋友圈截图</div>
      <button class="btn" @click="shareApply" v-if="!examine || examine.status == -1">提交审核</button>
    </section>
    <m-load ref="load"></m-load>
  </div>
</template>
<script>
import { Util, Load } from "@/assets/commonjs/utils.js";
import { Owner, Base } from "@/server/server.js";
import { mapGetters } from "vuex";
import { Uploader } from "vant";

// import Vue from "vue";
// Vue.use(Uploader);
export default {
  data() {
    return {
      src: require("@/assets/images/btm/ico_scico.png"),
      upladsrc: "",
      image: null,
      examine: null,
      type: false
    };
  },
  computed: {
    ...mapGetters(["api"])
  },
  created () {
    this.shareLog();
  },
  methods: {
    shareLog() {
      Owner.shareLog().then(res => {
        console.log(res)
        if(res.code == 1) {
          if(res.data) {
            this.examine = res.data;
            this.image = res.data.img;
            this.type = this.examine.status == 0 || this.examine.status ==1
          }
        }
      })
    },
    shareApply() {
      Load.loadStart(this);
      Owner.shareApply({img:this.image}).then(res => {
        Load.loadEnd(this);
        mui.toast(res.msg);
        if(res.code == 1) {
          this.$router.go(-1)
        }
      })
    },
    upload(event) {
      let _This = this;
      if(event.target.value == '')return
      let formData = new FormData();
      Load.loadStart(_This);
      Util.uploadImgLimit(event.target.files[0], url => {
        formData.append("image", url);
        Base.upload(formData).then(res => {
          Load.loadEnd(_This);
          if (res.code == 1) {
            this.image = res.data;
            // this.src = res.data;
          } else {
            mui.toast(res.msg);
            return;
          }
        });
      });
    },


    onRead(file) {
      Load.loadStart(this);
      let formData = { image: file.content };
      Base.upload(formData).then(res => {
        Load.loadEnd(this);
        if (res.code == 1) {
          this.upladsrc = res.data;
        } else mui.toast("失败请重试");
      });
    },

    shaitu() {
      if (!this.upladsrc) {
      mui.toast("请先上传图片,再提交审核");
        return;
      }
      this.disabled = true;
      Owner.shareapply({ img: this.upladsrc }).then(res => {
        console.log(res);
        if (res.data.code == 1) {
         mui.toast(res.data.msg);
          setTimeout(() => {
            this.$router.go(-1);
          }, 1500);
        } else mui.toast(res.data.msg);
      });
      setTimeout(() => {
        this.disabled = false;
      }, 2000);
      // console.log(this.formData);
      // return;
      //   let params = Object.assign({}, this.formData, { id: this.uid });
      //   let msg = Util.isValidate(params);
      //   if (msg) {
      //     mui.toast(msg);
      //     return;
      //   }
      //   Owner.shaitu(params).then(res => {
      //     if (res.code == 1) {
      //       mui.toast(res.msg);
      //       setTimeout(() => {
      //         this.$router.go(-1);
      //       }, 1000);
      //     } else {
      //       mui.toast(res.msg);
      //       return;
      //     }
      //   });
    },

  },
};
</script>
<style lang="less" scoped>
@import "~link-less";
.body {
  background-color: @bg-color;
  text-align: center;
  .status {
    padding: 20px;
    color: #666;
  }
  .wrap {
    width: 280px;
    height: 280px;
    background: #fff;
    position: relative;
    margin: 90px auto 0 auto;
    .upload-text {
      width: 280px;
      height: 280px;
      padding-top: 18%;
    }
    // &::after {
    //   content: '上传图片';
    //   font-size: 30px;
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   right: 0;
    //   margin: auto;
    //   line-height: 280px;
    // }
    .img {
      width: 280px;
      height: 280px;
    }
    .inp {
      position: absolute;
      top: 0;
      left: 0;
      width: 280px;
      height: 280px;
      opacity: 0;
    }
  }
  .friend {
    margin: 50px 0;
    color: #999;
  }
  .btn {
    width: 80%;
  }
}
// .imgbox {
//   margin: 90px auto 40px;
//   width: 280px;
//   height: 280px;
//   background: #fff;
//   .display-flex();
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
//   font-size: 30px;
// }
// .icon {
//   width: 60px;
//   height: 60px;
//   margin-bottom: 20px;
// }
// .text {
//   font-size: 26px;
//   font-family: PingFangSC-Regular, PingFang SC;
//   color: rgba(153, 153, 153, 1);
// }
// .btn-submit {
//   margin-top: 10%;
//   width: 600px;
//   height: 88px;
//   background: rgba(0, 162, 234, 1);
//   border-radius: 44px;
// }
// .uploadImg {
//   width: 80%;
//   margin: 20px auto;
//   border-radius: 20px;
//   overflow: hidden;
//   font-style: 32px;
// }
</style>

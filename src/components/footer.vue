<!-- 
  底部组件（全局注册组件）
  navInd：导航的默认值
-->
<template>
    <footer class="index_footer">
      <nav>
        <a v-for="(item,index) in navNameList" @click="goTo(index)" :class="{'nav-bg':navInd == index}" :key="index">
          <i :class="'iconfont'+' '+iconList[index]"></i>
          <span>{{item.name}}</span>
        </a>
        <!-- <a v-for='(item, i) in proData&&proData.home_bottom_nav' :key='i' @click="goTo(i+1)" :class="{'nav-bg':navInd == i + 1}">
          <img :src="navInd == i + 1 ? item.activeImg : item.passiveImg" alt="">
          <span>{{item.txt}}</span>
        </a> -->
      </nav>
    </footer>
</template>

<script>
import {mapGetters} from 'vuex';
export default{
  data(){
    return {
        navInd:0,
        iconList:['iconshouye1','iconshangpin','iconai66','icongerenzhongxin'],
        routeName:['Index','Shop','Cart','My'],
        navNameList:[
          {
            name:'商城'
          },
          {
            name:'全部商品'
          },
          {
            name:'购物车'
          },
          {
            name:'个人中心'
          },
        ]
    }
  },
  mounted(){
        this.activeNav();
  },
  computed:{
        ...mapGetters(['proData'])
  },
  methods:{
    goTo(index){
        this.navInd = index;
        // sessionStorage.setItem('btmNav',index);
        this.$router.push({name:this.routeName[index]});
    },
    activeNav(){
        if(sessionStorage.getItem('btmNav')){
            let index = sessionStorage.getItem('btmNav');
            this.navInd = index;
        }
    }
  }
}

</script>
<style scoped lang="less">
@import '~link-less';
  nav {
    box-sizing: border-box;
    width: 100%;height: 50PX;
    color:#999;background-color: #fff;
    .display-flex();
    justify-content: space-between;
    a {
      flex: 1;
      display: -webkit-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12PX;
      i {
        font-size: 20PX;
      }
      img {
        width: 20PX;
      }
    }
    .nav-bg {
      color: #00A2EA;
    }
  }

</style>

<template> 
  <div class="headbar" :style="{'background':themeColor}" 
    :class="$store.state.app.collapse?'position-collapse-left':'position-left'">
    <!-- 导航收缩 -->
    <span class="hamburg">
      <el-menu class="el-menu-demo" :background-color="themeColor" text-color="#fff" :active-text-color="themeColor" mode="horizontal">
        <el-menu-item index="1" @click="onCollapse"><hamburger :isActive="collapse"></hamburger></el-menu-item>
      </el-menu>
    </span>
    <!-- 导航菜单 -->
    <span class="navbar">
      <!-- <el-menu :default-active="activeIndex" class="el-menu-demo" 
          :background-color="themeColor" text-color="#fff" active-text-color="#ffd04b" mode="horizontal" @select="selectNavBar()">
        <el-menu-item index="1" @click="$router.push('/')"><i class="fa fa-home fa-lg"></i>  </el-menu-item>
        <el-menu-item index="2" @click="openWindow('https://gitee.com/liuge1988/kitty')">{{$t("common.projectRepo")}}</el-menu-item>
        <el-menu-item index="3" @click="openWindow('https://gitee.com/liuge1988/kitty/wikis/Home')">{{$t("common.doc")}}</el-menu-item>
        <el-menu-item index="4" @click="openWindow('https://www.cnblogs.com/xifengxiaoma/')">{{$t("common.blog")}}</el-menu-item>
      </el-menu> -->
      <el-menu :default-active="activeIndex" class="el-menu-demo" 
          :background-color="themeColor" text-color="#fff" active-text-color="#ffd04b" mode="horizontal">
        <el-menu-item v-for="i in newNavTree" :key="i.id" :index="i.url" @click="handleRoute(i)">{{i.name}}</el-menu-item>
      </el-menu>
    </span>
    
    <!-- 工具栏 -->
    <span class="toolbar">
      <el-menu class="el-menu-demo" :background-color="themeColor" :text-color="themeColor" :active-text-color="themeColor" mode="horizontal">

        <!-- 主题切换 -->
        <!-- <el-menu-item index="1">
          <theme-picker class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
        </el-menu-item> -->
        <!-- 语言切换 -->
        <!-- <el-menu-item index="2" v-popover:popover-lang>
          <li style="color:#fff;" class="fa fa-language fa-lg"></li>
          <el-popover ref="popover-lang" placement="bottom-start" trigger="click" v-model="langVisible">
            <div class="lang-item" @click="changeLanguage('zh_cn')">简体中文</div>
            <div class="lang-item" @click="changeLanguage('en_us')">English</div>
          </el-popover>
        </el-menu-item> -->
        <!-- 我的私信 -->
        <!-- <el-menu-item index="3" v-popover:popover-message>
          <el-badge :value="5" :max="99" class="badge" type="success">
            <li style="color:#fff;" class="fa fa-envelope-o fa-lg"></li>
          </el-badge>
          <el-popover ref="popover-message" placement="bottom-end" trigger="click">
            <message-panel></message-panel>
          </el-popover>
        </el-menu-item> -->
        <!-- 系统通知 -->
        <!-- <el-menu-item index="4" v-popover:popover-notice>
          <el-badge :value="4" :max="99" class="badge" type="success">
            <li style="color:#fff;" class="fa fa-bell-o fa-lg"></li>
          </el-badge>
          <el-popover ref="popover-notice" placement="bottom-end" trigger="click">
            <notice-panel></notice-panel>
          </el-popover>
        </el-menu-item> -->
        <!-- 用户信息 -->
        <el-menu-item index="5" v-popover:popover-personal>
          <span class="user-info"><img :src="user.avatar" />{{user.name}}</span>
          <el-popover ref="popover-personal" placement="bottom-end" trigger="click" :visible-arrow="false">
            <personal-panel :user="user"></personal-panel>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </span>
    <div class="call">
      <el-form :inline="true" size="mini" class="call-header">
        <el-form-item style="width: 200px;">
            <el-autocomplete
                v-model="phone"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入拨打号码"
                @select="handleSelect"
            ></el-autocomplete>
          <!-- <el-input v-model="phone" placeholder="请输入拨打号码" class="input"></el-input> -->
          <!-- <el-select
            class="input"
            v-model="customerPhone"
            @change="selectCusFunc"
            filterable
            remote
            reserve-keyword
            allow-create
            placeholder="输入客户电话号码"
            :remote-method="remoteMethod"
            :loading="loading"
            size="small"
            style="height: 30px;padding-top: 4px">
              <el-option
                      v-for="item in optionsCustomer"
                      :key="item.id"
                      :label="item.phone"
                      :value="item.id">
              </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button size="medium" type="success" icon="el-icon-phone" class="btn" @click="openCall=!openCall" circle></el-button>
        </el-form-item>
      </el-form>
      <div class="call-tool" v-show="openCall">
        <div>
          <ul class="call-fun">
            <li><el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button><br/><span>转接</span></li>
            <li><el-button type="success" icon="el-icon-check" size="mini" circle></el-button><br/><span>静音</span></li>
            <li><el-button type="warning" icon="el-icon-message" size="mini" circle></el-button><br/><span>示忙</span></li>
            <li><el-button type="danger" icon="el-icon-message" size="mini" circle></el-button><br/><span>挂机</span></li>
          </ul>
          <div class="call-content">
            <h5>转接通话</h5>
            <p>
              <el-input size="mini" style="width:170px;" placeholder="手机号或坐席号"></el-input>
              <el-button size="mini" type="primary" style="padding:7px;">转接</el-button>
            </p>
            <h5>坐席号</h5>
            <ul class="call-table">
              <li>esaycall--1020 <el-button size="mini" class="btn">转接</el-button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import mock from "@/mock/index"
import Hamburger from "@/components/Hamburger"
import ThemePicker from "@/components/ThemePicker"
import LangSelector from "@/components/LangSelector"
import Action from "@/components/Toolbar/Action"
import NoticePanel from "@/views/Core/NoticePanel"
import MessagePanel from "@/views/Core/MessagePanel"
import PersonalPanel from "@/views/Core/PersonalPanel"
export default {
  components:{
    Hamburger,
    ThemePicker,
    LangSelector,
    Action,
    NoticePanel,
    MessagePanel,
    PersonalPanel
  },
  data() {
    return {
        user: {
            name: "Louis",
            avatar: "",
            role: "超级管理员",
            registeInfo: "注册时间：2018-12-20 "
        },
        langVisible: false,
        newNavTree: [],
        loading: false,
        customerPhone: '',
        optionsCustomer: [],
        phone: '',
        openCall: false
    }
  },
  
  watch: {
    // $route(){
    //   this.activeIndex = this.$route.path.split("/")[1];
    // }
  },
  methods: {
    remoteMethod(phone){
        
        if(phone.trim()){
            return;
            // 暂时无此接口
            this.$api.pageCustomer({size: 999, phone}).then((resp) => {
                this.optionsCustomer = resp.data.list;
                this.loading = true;
            })
        }
    },
    selectCusFunc(data){

    },
    querySearchAsync(phone, cb){
        //if(!phone.trim()) return; // 此函数不能直接用return
        if(phone.trim()){
            let arrData = [{value:1}];
            let result = arrData.filter((i) => phone == i.value)
            console.log("结果---->",result)
            cb(result)
        }else{
          cb([])
        }
        
    },
    handleSelect(){
        alert("选择")
    },

    openWindow(url) {
      window.open(url)
    },
    selectNavBar(key, keyPath) {
      console.log(key, keyPath)
    },
    // 折叠导航栏
    onCollapse: function() {
      this.$store.commit('onCollapse')
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    },
    // 语言切换
    changeLanguage(lang) {
      lang === '' ? 'zh_cn' : lang
      this.$i18n.locale = lang
      this.langVisible = false
    },
    // 切换路由
    handleRoute(menu){
      let url = menu.children[0].url;
      if(!url){
        alert("无路由")
      }
      console.log("/" + url);
      this.$router.push("/" + url);
    }
  },
  mounted() {
    this.newNavTree = JSON.parse(JSON.stringify(this.navTree));
    this.newNavTree.forEach((i) => {
      if(i.children && i.children.length>0){
        let url = i.children.find((item) => item).url
        i.url = url.split("/")[0]
      }
    })
    

    this.sysName = "Kitty Platform"
    var user = sessionStorage.getItem("user")
    if (user) {
      this.user.name = user
      this.user.avatar = require("@/assets/user.png")
    }
  },
  computed:{
    ...mapState({
      themeColor: state=>state.app.themeColor,
      collapse: state=>state.app.collapse,
      navTree: state=>state.menu.navTree
    }),
    activeIndex(){
      return this.$route.path.split("/")[1];
    }
  }
}
</script>

<style scoped lang="scss">
.headbar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1030;
  height: 60px;
  line-height: 60px;
  border-color: rgba(180, 190, 190, 0.8);
  border-left-width: 1px;
  border-left-style: solid;
}
.hamburg, .navbar {
  float: left;
}
.toolbar {
  float: right;
}
.lang-item {
  font-size: 16px;
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
}
.lang-item:hover {
  font-size: 18px;
  background: #b0d6ce4d;
}
.user-info {
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin: 10px 0px 10px 10px;
    float: right;
  }
}
.badge {
  line-height: 18px;
}
.position-left {
  left: 200px;
}
.position-collapse-left {
  left: 75px;
}


.el-input--mini .el-input__inner{
  height: 30px !important;
}
.call{
  width: 240px;
  float: right;
  line-height: 1.5;
  margin-top: 10px;
  .call-header{
    height: 36px;
    border-radius: 18px;
    text-align: left;
    background: #43a0a9;
    position: relative;
    z-index: 2;
    .el-input{
      margin-top: 3px;
      input{
        background:transparent;
        border: none;
      }
    }
    .el-form-item{
      margin-bottom: 0;
      margin-right: 0;
    }
  }
  .call-tool{
    position: relative;
    top: -16px;
    z-index: 1;
    background: white;
    padding-top: 30px;
    box-shadow: 2px 2px 2px 0 #ccc;
    .call-fun{
      display: flex;
      justify-content: space-around;
      li{
        //flex: 1;
        text-align: center;
        span{
          color: #999;
          font-size: 12px;
        }
      }
    }
  }
  .call-content{
    padding: 0px 10px 10px 10px;
    h5{
      padding: 8px 0;
    }
  }
  .call-table{
    border-top: 1px solid #ddd;
    padding-top: 2px;
    li{
      padding-top: 3px;
    }
    .btn{
      padding:3px 5px;
      float: right;
    }
  }
}
.call-header /deep/{
  .el-input input{
    background:transparent;
    border: none;
    color: white;
  }
}
</style>

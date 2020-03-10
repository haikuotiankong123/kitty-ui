<template> 
  <div class="headbar" 
    :class="{'position-collapse-left':collapse,'position-left':!collapse, 'is': !isCallout, 'is-white-nav':isCallout}" >

    <div class="call-time" v-if="isCallout">
        <div class="call">
            <el-form :inline="true" size="mini" :class="{'call-header':true,'is-callout': isCallout}">
                <el-form-item style="width: 150px;">
                    <!-- <el-input v-if="callStatus" v-model="customerDetail.phone" placeholder="来话处理"></el-input> -->
                    <el-autocomplete
                        v-model="searchPhone"
                        :fetch-suggestions="querySearchAsync"
                        placeholder="请输入拨打号码"
                        @select="handleSelect">
                        <template slot-scope="{item}">
                            <span>{{item.phone}}</span>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <el-form-item style="float:right;">
                    <el-button type="success"
                        :disabled="!searchPhone"
                        icon="el-icon-phone" 
                        size="small" 
                        style="margin: 2px 2px 0 0;" 
                        @click="editCommandCallFunc()" round>拨打</el-button>
                </el-form-item>
            </el-form>
        </div>
        <span><i class="el-icon-warning one"></i>离线 00:00:00</span>
        <span><i class="el-icon-phone two"></i>今天通话 00:00:00</span>
    </div>
    
    <div class="call-tool" v-show="callStatus">
        <div>
            <p class="num">
                <span class="call-num"><i @click="onTemp" class="el-icon-phone-outline"></i> 13602714551</span> 
                <span class="call-duration">00:00:00</span>
            </p>
            <ul class="call-fun">
                <li v-for="(i, index) in callHandle" :key="index" @click="handleChange(index)" :class="{'active':curToolIndex == index}">
                    <el-button :icon="i.icon" size="mini" circle></el-button><br/><span>{{i.value}}</span>
                </li>
            </ul>
            <div class="call-content">
                <div v-show="curToolIndex==0">
                    <h5>转接通话</h5>
                    <p>
                        <el-input size="mini" style="width:170px;" v-model="shiftPhone" placeholder="输入手机号或坐席号"></el-input>
                        <el-button size="mini" type="primary" style="padding:7px;" :disabled="!shiftPhone">转接</el-button>
                    </p>
                    <h5>坐席号</h5>
                    <ul class="call-table">
                        <li>admin--1010 <el-button size="mini" class="btn">转接</el-button></li>
                        <li>esaycall--1020 <el-button size="mini" class="btn">转接</el-button></li>
                    </ul>
                </div>
                <p v-show="curToolIndex==1">
                    静音中
                </p>
                <p v-show="curToolIndex==2">
                    挂机中
                </p>
            </div>
        </div>
    </div>

    <!-- 导航菜单 -->
    <span class="navbar" v-if="!isCallout">
      <el-menu :default-active="activeIndex" class="el-menu-demo" 
          :background-color="themeColor" text-color="#fff" active-text-color="#ffd04b" mode="horizontal">
        <el-menu-item v-for="i in newNavTree" :key="i.id" :index="i.url" @click="handleRoute(i)">
            <i :class="'navicon '+i.icon"></i><br/>
            <span class="title">{{i.name}}</span>            
        </el-menu-item>
      </el-menu>
    </span>
    
    <div style="display:flex; height:100%; align-items: center; float:right">

    <div class="" style="float:right; padding-right:15px;">
        <el-button  
            v-if="acountInfo.isBusy === 1"
            type="warning" 
            size="small" 
            icon="el-icon-remove-outline" 
            @click="editCallStatusFunc" round>示忙</el-button>
        <el-button 
            v-if="acountInfo.isBusy === 2"
            type="danger" 
            size="small" 
            icon="el-icon-more"
            @click="editCallStatusFunc" round>示闲</el-button>
    </div>
    
    <!-- 工具栏 -->
    <span :class="{'toolbar':true,'is-callout':isCallout}">
      <el-menu class="el-menu-demo" :text-color="themeColor" :active-text-color="themeColor" mode="horizontal">
        <!-- 用户信息 -->
        <el-menu-item index="5" v-popover:popover-personal>
          <span :class="{'user-info':true}"><img src="@/assets/images/picture.jpg" /><!-- <img :src="user.avatar" /> -->{{user.name}}</span>
          <el-popover ref="popover-personal" placement="bottom-end" trigger="click" :visible-arrow="false">
            <personal-panel :user="user"></personal-panel>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </span>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Hamburger from "@/components/Hamburger"
import PersonalPanel from "@/views/Core/PersonalPanel"
import ThemePicker from "@/components/ThemePicker"
export default {
    components:{
        Hamburger,
        PersonalPanel,
        ThemePicker
    },
    data() {
        return {
            user: {
                name: "Louis",
                avatar: "",
                role: "超级管理员",
                registeInfo: "注册时间：2018-12-20 "
            },
            shiftPhone: '',
            newNavTree: [],
            loading: false,
            openCall: false,
            searchPhone: '',
            searchPhoneArr: [],
            callHandle: [
                {type: 'primary', icon:'el-icon-edit', value:'转接'},
                {type: '', icon:'el-icon-close-notification', value:'静音'},
                {type: '', icon:'el-icon-message', value:'挂机'}
            ],
            curToolIndex: null
        }
    },
  
    watch: {
        $route(data){
            
        },
        navTree(){
            // 组件加载和导航数据加载并发的，所以监控导航数据
            this.loadData()
        }
    },
    computed:{
        ...mapState({
            themeColor: state=>state.app.themeColor,
            collapse: state=>state.app.collapse,
            navTree: state=>state.menu.navTree,
            
            customerDetail: state=>state.app.customerDetail,
            callStatus: state=>state.app.callStatus,
            acountInfo: state=>state.app.acountInfo,
            uuid: state=>state.app.uuid,
            routeInfo: state => state.app.routeInfo,
            isCallout: state => state.app.isCallout
        }),
        activeIndex(){
            return this.$route.path.split("/")[1];
        }
    },
    mounted() {
        
        this.loadData()
        
        this.sysName = "Kitty Platform"
        var user = sessionStorage.getItem("user")
        if (user) {
        this.user.name = user
        this.user.avatar = require("@/assets/user.png")
        }

        /* setTimeout(()=>{
            this.$store.commit('setThemeColor', this.themeColor)
        },1000) */
        
    },
    methods: {
        // 临时
        onTemp(){
            this.$store.commit("setCallStatus", false)
        },
        handleChange(index){
            this.curToolIndex = index;
        },
        // 切换主题
        onThemeChange: function(themeColor) {
            this.$store.commit('setThemeColor', themeColor)
        },
        loadData(){
            this.newNavTree = JSON.parse(JSON.stringify(this.navTree));
            this.newNavTree.forEach((i) => {
                if(i.children && i.children.length>0){
                    let url = i.children.find((item) => item).url
                    i.url = url.split("/")[0]
                }
            })
            
        },
        // 转接
        onShift(){
            //无
            return
            if(this.shiftPhone){
                let params = {
                    toPhone: this.shiftPhone,
                    uuid: this.uuid
                }
                this.$api.editCallDeflect(params)
            }else{
                this.$message('输入转接号码')
            }
        },
        // 页面挂机
        onHook(){
            // 无
            return
            const uuid = this.uuid;
            api.editHangup({uuid});
            //this.hangupResetData();
        },
        editCallStatusFunc(){
            let status = this.acountInfo.isBusy = this.acountInfo.isBusy == 1 ? 2 :1;
            // 无
            return;
            this.$api.editCallStatus({status})
        },
        // 获取客户列表
        querySearchAsync(phone, cb){
            
            if(phone && phone.trim()){
                let params = {
                    size: 999,
                    phone
                }
                let customerList = []
                // 无
                /* this.$api.pageCustomer(params).then((resp) => {
                    customerList = resp.data.list
                }).catch( (err)=>{
                    this.$messge.error(err)
                }) */

                let arrData = [{a9: "男",
                    companyId: 0,
                    configValueList: [],
                    createId: 82122,
                    createTime: "2019-04-15 09:52:56",
                    creator: {empty: false, id: 82122},
                    empty: false,
                    gender: 0,
                    id: 1248542,
                    name: "老铁",
                    phone: "1",
                    taskId: 0,
                    type: 1}];
                //let arrData = [{value: '1', name: 'one'},{value: '1', name: 'two'}]
                this.searchPhoneArr = arrData.filter((i) => phone == i.phone)
                
                cb(this.searchPhoneArr)
            }else{
                this.searchPhoneArr = []
                cb([])
            }
        },
        // 选择客户
        handleSelect(item){
            
            this.$store.commit("setCustomerDetail", item)
            this.searchPhone = item.phone
        },

        // 拨打按钮
        async editCommandCallFunc() {
            this.openCall=!this.openCall
            // 临时
            this.$store.commit('setCallStatus', true)

            let id = this.searchPhoneArr.length ? this.searchPhoneArr[0].id : null;
            // 无
            return;
            if (id) {
                // 无
                this.$api.editCommandCall({customerId:id}).then(resp => {
                    if(resp.success){
                        this.$store.commit('setCallStatus', true)
                    }
                })
            }else{
                let params = {
                    phone: this.searchPhone,
                    name: this.searchPhone,
                    assign: 1,
                    result: 1
                }
                // 无
                let newCustomer = await this.$api.editCustomer(params)
                this.$store.commit('setCustomerDetail', newCustomer)
                let customerId = newCustomer.data.id
                // 无
                await this.$api.editCommandCall({customerId}).then(resp => {
                    if(resp.success){
                        this.$store.commit('setCallStatus', true)
                    }
                })
            }
        },

        // 折叠导航栏
        onCollapse: function() {
            this.$store.commit('onCollapse')
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
    }
}
  

</script>

<style scoped lang="scss">
@import "@/assets/package/src/common/global.scss";

.headbar {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1030;
    height: 70px;
    //line-height: 70px;
    box-shadow: 0 4px 4px #bfbfbf;
    background: $--color-primary;
    /* border-color: rgba(180, 190, 190, 0.8);
    border-left-width: 1px;
    border-left-style: solid; */
    &.is-white-nav{
        background: white;
        height:60px;
        box-shadow:none;
    }
}
.call-time{
    display: flex;
    align-items: center;
    float:left;
    height: 100%;
    padding-left: 10px;
    &>span{
        //display: inline-block;
        padding: 0 10px;
        i{
            font-size: 17px;
            margin-right: 5px;
            &.one{
                color: $--color-danger;
            }
            &.two{
                color: $--color-success;
            }
        }
    }
}
.hamburg, .navbar {
  float: left;
}
.navbar{
    .el-menu{
        border-left: 1px solid rgba(0, 0, 0, .2);
        border-right: 1px solid rgba(255, 255, 255, .2);
        li{
            height: 70px;
            line-height: 1.5;
            text-align: center;
            padding: 0 30px;
            border-right: 1px solid rgba(0, 0, 0, .2);
            border-left: 1px solid rgba(255, 255, 255, .2);
            .navicon{
                display: inline-block;
                height: 30px;
                line-height: 30px;
                color: white;
                font-size: 22px;
                padding-top: 5px;
            }
            &.is-active{
                background: rgba(0,0,0,0.2) !important;
                .navicon{
                    color: rgb(255, 208, 75);
                }
            }
            .title{
                
            }
        }
    }
}
.toolbar {
    float: right;
    .el-menu--horizontal>.el-menu-item.is-active{
        border-bottom: 2px solid transparent;
    }
    .el-menu{
        background: none;
    }
    &.is-callout{
        background: white;
        .user-info{
            color: #333;
        }
    }
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
.is{
  &.position-left{
    left: 220px;
  }  
  &.position-collapse-left{
    left: 65px;
  }
}
.position-left {
  //left: 200px;
  left: 230px;
}
.position-collapse-left {
  left: 75px;
}


.el-input--mini .el-input__inner{
  height: 30px !important;
}
.call{
  width: 240px;
  line-height: 1.5;
  margin: 0 10px 0 0;
  position: relative;
  .call-header{
    height: 36px;
    border-radius: 18px;
    text-align: left;
    // background: #43a0a9;
    background: rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 2;
    &.is-callout{
        background: none;
        border: 1px solid #E4E7ED;
        /deep/ input{
            color: #333;
        }
    }
    .el-form-item{
      margin-bottom: 0;
      margin-right: 0;
    }
  }
}


.call-tool{
    width: 235px;
    position: fixed;
    top: 15px;
    left: 50%;
    z-index: 1;
    background: white;
    box-shadow: 0px 0 5px 3px rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    overflow: hidden;
    .num{
        padding: 10px 8px;
        background: $--color-success;
        color: white;
        .call-num{}
        .call-duration{
            float: right;
        }
    }
    .call-fun{
      display: flex;
      justify-content: space-around;
      border-bottom: 1px solid $--border-color-lighter;
      padding: 9px 0;
      li{
          &.active{
              .el-button{
                  background: $--color-primary;
                  border-color: $--color-primary;
                  color: white;
              }
              & > span{
                  color: $--color-primary;
                  //font-weight: bold;
              }
          }
        //flex: 1;
        text-align: center;
        cursor: pointer;
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
      padding: 10px 0 8px 0;
    }
}
.call-table{
    
    li{
      padding: 3px 0;
      .el-button{
          float: right;
          padding: 3px 5px;
      }
    }
}

.call-header{
    /deep/ .el-input{
        margin-top: 5px;
        input{
            background:transparent;
            border: none;
            color: white;
        }
    } 
    .el-button{
        padding: 9px 12px;
    }
}
</style>

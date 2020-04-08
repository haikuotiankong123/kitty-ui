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
                        placeholder="请输入坐席号或手机号"
                        @select="handleSelect">
                        <template slot-scope="{item}">
                            <span>{{item.phone}}</span>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <!--  -->
                <el-form-item style="float:right;">
                    <el-button type="success"
                        :disabled="!searchPhone || !!callState.type"
                        icon="el-icon-phone" 
                        size="small" 
                        style="margin: 2px 2px 0 0;" 
                        @click="directCall()" round>拨打</el-button>
                </el-form-item>
            </el-form>
        </div>
        <span><i class="el-icon-warning one"></i>离线 00:00:00</span>
        <span><i class="el-icon-phone two"></i>今天通话 00:00:00</span>
    </div>
    
    <!--  -->
    <div class="call-tool" v-if="callState.type">
        <div>
            <p class="num">
                <span class="call-num">
                    <i class="el-icon-phone-outline" @click="onJoin('1006')"></i> 
                    <template v-if="callState.isVisitor">
                        <i>{{callState.data && callState.data.from}}</i>
                    </template>
                    <template v-else>
                        <i>{{callState.data && callState.data.to}}</i>
                    </template>
                </span> 
                <span class="call-duration">{{countTime}}</span>
            </p>
            <div class="call-fun">
                <el-button 
                    size="mini" 
                    icon="el-icon-message" 
                    :class="{'btn-item':true,'active':curIndex == 0}" 
                    :disabled="callState | callControl"  
                    @click="onKeepCall()" 
                    circle>
                        <i v-show="cmd1 == 'Hold'">取消</i>呼叫保持
                </el-button>
                <el-button 
                    size="mini" 
                    icon="el-icon-edit" 
                    :class="{'btn-item':true,'active':curIndex == 1}" 
                    :disabled="callState | callControlIs" 
                    @click="onTransfer()" 
                    circle >
                        转接
                </el-button>
                <el-button 
                    size="mini" 
                    icon="el-icon-message" 
                    :class="{'btn-item':true,'active'
                    :curIndex == 2}" :disabled="callState | callControlIs" 
                    @click="onThreeCall()" 
                    circle >
                        咨询通话
                </el-button>
                <el-button 
                    size="mini" 
                    icon="el-icon-close-notification" 
                    :class="{'btn-item':true,'active':curIndex == 3}" 
                    :disabled="callState | callControl" 
                    @click="onMute()" 
                    circle >
                        <i v-show="cmd2 == 'Mute'">取消</i>静音
                </el-button>
                <el-button 
                    size="mini" 
                    icon="el-icon-message" 
                    :class="{'btn-item':true,'active':curIndex == 4}" 
                    :disabled="callState | callControlIs"
                     @click="onHangup()" 
                    circle>
                        挂机
                </el-button>
            </div>
            <!-- :style="{'pointer-events': callState.data ? 'inherit' : 'none'}" -->
            <!-- <ul class="call-fun" >
                <li :class="{'active':curIndex == 0}" @click="onKeepCall()">
                    <el-button icon="el-icon-message" size="mini" circle></el-button><br/>
                    <span><i v-show="cmd == 'Hold'">取消</i>呼叫保持</span>
                </li>
                <li :class="{'active':curIndex == 1}" @click="onTransfer()">
                    <el-button icon="el-icon-edit" size="mini" circle></el-button><br/>
                    <span>转接</span>
                </li>
                <li :class="{'active':curIndex == 2}" @click="onThreeCall()">
                    <el-button icon="el-icon-message" size="mini" circle></el-button><br/>
                    <span>咨询通话</span>
                </li>
                <li :class="{'active':curIndex == 3}" @click="onMute()">
                    <el-button icon="el-icon-close-notification" size="mini" circle></el-button><br/>
                    <span><i v-show="cmd == 'Mute'">取消</i>静音</span>
                </li>
                <li :class="{'active':curIndex == 4}" @click="onHangup()">
                    <el-button icon="el-icon-message" size="mini" circle></el-button><br/>
                    <span>挂机</span>
                </li>
            </ul> -->
            
            <div class="call-content">
                <div v-show="curIndex == 0">{{cmd1 == 'Hold' ? '呼叫保持中...' : '已取消呼叫保持'}}</div>
                <div v-show="curIndex == 1">
                    <p style="padding: 0 0 15px 10px;">
                    
                        <el-select v-model="transferType" size="mini" @change="getTransType($event)" style="width:120px;">
                            <el-option 
                                v-for="(i, index) in transferTypeList" 
                                :label="i.value"
                                :value="i"
                                :key="index"></el-option>
                        </el-select>
                        <template v-if="transParam.trans == 'ext' || transParam.trans == 'outer' || transParam.trans == 'queue'">
                            <el-input size="mini" style="width:120px;" v-model="transferPhone" placeholder="请输入号码"></el-input>
                            <el-button size="mini" type="primary" style="padding:7px;" :disabled="!transferPhone" @click="onTransferFunc()">转接</el-button>
                        </template>
                        <template v-if="transParam.trans == 'menu'">
                            <el-select style="width:120px;" size="mini" v-model="menuVal" @change="ivrFunc($event)">
                                <el-option 
                                    v-for="(i, index) in queryMenu.list" 
                                    :label="i.voiceFile"
                                    :value="i"
                                    :key="index"></el-option>
                            </el-select>
                        </template>
                        <template v-if="transParam.trans == 'group'">
                            <el-select style="width:120px;" size="mini" v-model="groupVal" @change="ivrFunc($event)">
                                <el-option 
                                    v-for="(i, index) in queryGroup.list" 
                                    :label="i.id"
                                    :value="i"
                                    :key="index"></el-option>
                            </el-select>
                        </template>                      
                    </p>
                    <div style="padding-top:15px; border-top: 1px dashed #c9ccd2;">
                        <ul class="call-table">
                            <li v-for="i in allExt" :key="i.id">
                                {{i.id}}
                                <el-button size="mini" class="btn" 
                                    :disabled="transParam.trans != 'ext' && transParam.trans != 'queue'" 
                                    @click="onTransferFunc(i.id)">转接</el-button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-show="curIndex == 2"> 
                    <el-input size="mini" style="width:120px;" v-model="joinExtNum" placeholder="请输入分机号"></el-input>
                    <el-button size="mini" type="primary" style="padding:7px;" :disabled="!joinExtNum" @click="onJoin()">加入咨询</el-button>

                    <div style="padding-top:15px; border-top: 1px dashed #c9ccd2;">
                        <ul class="call-table">
                            <li v-for="i in allExt" :key="i.id">
                                {{i.id}}
                                <el-button size="mini" class="btn"
                                    @click="onJoin(i.id)">加入</el-button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-show="curIndex == 3">{{cmd2 == 'Mute' ? '静音中...' : '已取消静音'}}</div>
                <div v-show="curIndex == null">从哪里来的</div>
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
            v-if="assignExt.noDisturb === 'yes'"
            type="warning" 
            size="small" 
            icon="el-icon-remove-outline" 
            @click="assignExtFunc" round>取消免打扰</el-button>
        <el-button 
            v-else
            type="danger" 
            size="small" 
            icon="el-icon-more"
            @click="assignExtFunc" round>开启免打扰</el-button>
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
import util from "@/utils/util"
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
            transferPhone: '',
            newNavTree: [],
            loading: false,
            openCall: false,
            searchPhone: '13602714551',
            searchPhoneArr: [],
            callHandle: [
                {type: '', icon:'el-icon-message', value:'呼叫保持'},
                {type: '', icon:'el-icon-message', value:'咨询通话'},       // 加入分机
                {type: 'primary', icon:'el-icon-edit', value:'转接'},
                {type: '', icon:'el-icon-close-notification', value:'静音'},
                {type: '', icon:'el-icon-message', value:'挂机'}
                
            ],

            countTime: '',
            timer: null,
            curIndex: null,
            /**
             * 去电和来电的转接： 1：总机 | 2：挂断 | 3：分机 | 4：分机列表 | 5：分机组 | 6：IVR | 7：播放语音 | 8：转外部电话
             * 所对应的字段名称： default | clear  | ext_id  |  ext_id    | grou_id  | menu_id|  voicfile  | outer_to
             */
            transferTypeList: [
                //{id: 1, trans:"default", value:"总机"},
                //{id: 2, trans:"clear", value:"挂断"},
                {id: 3, trans:"ext", value:"分机"},
                {id: 4, trans:"queue", value:"分机列表"},
                {id: 5, trans:"group", value:"分机组"},
                {id: 6, trans:"menu", value:"IVR"},
                //{id: 7, trans:"voicefile", value:"播放语音"},
                {id: 8, trans:"outer", value:"转外部电话"},
            ],
            
            tempBoo: true,
            transferType: "",
            transParam: {},
            cmd: '',
            cmd1: '',
            cmd2: '',
            menuVal: '',
            groupVal: '',
            joinExtNum: ''
        }
    },
    filters: {
        callControl(callState){
            return !callState.data || !callState.data.id //|| !callState.isVisitor 
        },
        callControlIs(callState){
            return !callState.data || !callState.data.id 
        }
    },
    watch: {
        $route(data){
            
        },
        navTree(){
            // 组件加载和导航数据加载并发的，所以监控导航数据
            this.loadData()
        },
        extState(data){
            if(data.type == 'EXT_IDLE') this.closeTimer()
        },
        callState(data){
            
            if(data.type){
                this.countTimeFunc()
            }else{
                this.cmd = ''
                this.cmd1 = ''
                this.cmd2 = ''
                this.transferType = ''
                this.transParam = {}
                this.curIndex = null
                this.menuVal = ''
                this.groupVal = ''
                this.transferPhone = ''
            }
        }
    },
    computed:{
        ...mapState({
            themeColor: state=>state.app.themeColor,
            collapse: state=>state.app.collapse,
            navTree: state=>state.menu.navTree,
            assignExt: state=>state.assignExt,
            queryExt: state=>state.queryExt,
            callState: state => state.callState,
            extState: state => state.extState,
            allExt: state => state.allExt,
            queryGroup: state=>state.queryGroup,
            queryMenu: state=>state.queryMenu,
            
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
        
    },
    methods: {
        loadData(){
            this.newNavTree = JSON.parse(JSON.stringify(this.navTree));
            this.newNavTree.forEach((i) => {
                if(i.children && i.children.length>0){
                    let url = i.children.find((item) => item).url
                    i.url = url.split("/")[0]
                }
            })  
  
        },
        showIndex(index){
            let i = this.curIndex;
            this.curIndex = i==index ? null : index ;
        },
        cmdFunc(obj){
            let param = {
                ext_id: this.queryExt.id,
                ...obj
            }
            this.$api.controlCmd(param).then(resp => {
                if(resp.success){
                    this.$message(resp.message)
                }else{
                    this.$message(resp.message)
                }
            })
        },
        getTransType(e){
            this.transParam = {trans: e.trans, transCode: e.id}
            console.log("--->", this.transParam);
            if(e.trans == 'default'){
                this.onTransferFunc()
            }
        },
        groupFunc(e){
            console.log('------>', e)
        },
        // 转vir
        ivrFunc(e){
            let id = e.id
            if(!id) return '无id'
            this.onTransferFunc(id)
        },
        // 呼叫保持
        onKeepCall(){
            this.showIndex(0)
            let cmd = this.cmd1
            this.cmd1 = cmd == 'Hold' ? 'Unhold' : 'Hold' ;
            this.cmdFunc({cmd: this.cmd1})
        },
        // 静音
        onMute(){
            this.showIndex(3)
            let cmd = this.cmd2
            this.cmd2 = cmd == 'Mute' ? 'Unmute' : 'Mute' ; 
            this.cmdFunc({cmd: this.cmd2})
        },
        // 转接
        onTransfer(){
            this.showIndex(1)
        },
        // 三方通话
        onThreeCall(){
            this.showIndex(2)
        },
        onJoin(extId){
            let num = extId || this.joinExtNum;
            let param = {
                ext_id: num
            }
            this.$api.connectConference(param).then(resp => {
                if(resp.success){
                    util.message(resp.message)
                }
            }).catch(err => {
                util.error(err.message)
            })
        },
        // 挂断
        onHangup(){
            let ext_id = this.queryExt.id
            this.showIndex(4)
            this.transParam = {trans: 'clear'}
            this.onTransferFunc(ext_id)
        },
        
        closeTimer(){
            clearInterval(this.timer)
            this.countTime = '00:00:00'
        },
        countTimeFunc(){
            this.closeTimer()
            let  total=0;
            this.timer = setInterval(()=>{
                let s, m, h;
                total++;
                s = parseInt(total%60);
                m = parseInt((total/60)%60);
                h = parseInt(total/3600)
                s = s < 10 ? '0'+s : s;
                m = m < 10 ? '0'+m : m;
                h = h < 10 ? '0'+h : h;
                this.countTime = h +':'+ m +':'+ s 
            },1000)
        },
        
        // 来电转接
        visitorFunc(num){
            let data = this.callState.data
            
            if(!data || !data.id){
                this.$message.error("来电id不能为空！")
                return
            }
            let param = {
                visitor_id: data.id,
                transValue: num,
                ...this.transParam
            }
            this.$api.connectVisitor(param).then(resp => {
                if(resp.success){
                    this.$message("操作成功")
                }
            }).catch(er => {
                this.$message.error(er.message);
            })
        },
        // 去电转接
        outerFunc(num){
            
            let data = this.callState.data
            
            if(!data || !data.id){
                this.$message.error("去电id不能为空！")
                return
            }
            let param = {
                outer_id: data.id,
                transValue: num,
                ...this.transParam
            }
            
            this.$api.connectOuter(param).then(resp => {
                if(resp.success){
                    this.$message("操作成功")
                }
            }).catch(er => {
                this.$message.error(er.message);
            })
        },
        // 转接
        onTransferFunc(extId){
            
            let isVisitor = this.callState.isVisitor
            let num = extId || this.transferPhone

            if(isVisitor){
                this.visitorFunc(num)
            }else{
                this.outerFunc(num)
            }
        },
        
        assignExtFunc(){
            let param =  this.assignExt
            let val = param.noDisturb
            param.noDisturb = val  == 'yes' ? 'no' : 'yes';
            console.log('参数---->', param)
            this.$api.assignExt(param).then((resp)=>{
                if(resp.success){
                    this.$store.commit('setAssignExt',resp.data)
                    this.$message(resp.message);
                    console.log('分机编辑--->', this.assignExt)
                }
            })
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
        // 直接拨打
        directCall(){
            
            let ext_id = this.queryExt.id
            let num = this.searchPhone
            let prop = {}
            /* /^1[3456789]\d{9}$/.test(num) */
            if(num.length <= 4){
                prop = {ext_id_2:num}
            }else{  
                prop = {outer_to: num}
            }
            let params = {ext_id,...prop}
            this.$api.connectExt(params).then((resp) => {

            }).catch((err) => {
                this.$message.error(err.message)
            })
        },

        // 拨打按钮
        async editCommandCallFunc() {
            this.openCall=!this.openCall
            // 临时
            let b = this.callStatus ? false : true ;
            this.$store.commit('setCallStatus', b)

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
        // 切换主题
        onThemeChange: function(themeColor) {
            this.$store.commit('setThemeColor', themeColor)
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
    width: 335px;
    position: fixed;
    top: 15px;
    left: 50%;
    z-index: 1;
    background: white;
    box-shadow: 0px 0 5px 3px rgba(0, 0, 0, 0.15);
    border-radius: 5px;
    overflow: hidden;
    .num{
        padding: 10px;
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
      padding: 12px 10px 30px 10px;
      .btn-item{
            position: relative;
            &.active{
                background: $--color-primary;
                border-color: $--color-primary;
                color: white;
            }
            /deep/ &.active>span{
                color: $--color-primary;
            }
      }
      /deep/ .btn-item>i{
          font-size: 16px;
      }
      /deep/ .btn-item>span{
          position: absolute;
          top: 100%;
          left: 50%;
          margin: 5px 0 0 0;
          transform: translate(-50%, 0);
      }
      /* li{
          flex: 1;
          &.active{
              .el-button{
                  background: $--color-primary;
                  border-color: $--color-primary;
                  color: white;
              }
              & > span{
                  color: $--color-primary;
              }
          }
        text-align: center;
        cursor: pointer;
        span{
          color: #999;
          font-size: 12px;
        }
      } */
    }
}
.call-content{
    height: 240px;
    padding: 20px 10px 10px 10px;
    h5{
      padding: 10px 0 8px 0;
    }
}
.call-table{
    max-height: 150px;
    overflow: auto;
    li{
        &:nth-child(odd){
            background: #fafafa;
        }
      padding: 8px 20px;
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

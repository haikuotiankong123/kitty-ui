<template>
	<div class="menu-bar-container">
        <div class="shrink" @click="onCollapse">
            <i :class="{'rotate':collapse}" class="el-icon-arrow-left"></i>
        </div>
        <!-- logo -->
        <!-- <div class="logo" :style="{'background-color':themeColor}" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
        @click="$router.push('/')">
            <img v-if="collapse" src="@/assets/logo.png"/> <div>{{collapse?'':appName}}</div>
        </div> -->

        <!-- <div class="logo" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
        @click="$router.push('/')">
            <img src="@/assets/images/logo.jpg" /><span class="logo-name">智信通 &emsp;</span>
        </div> -->
        <div class="logo" :class="{'menu-bar-collapse-width':collapse,'menu-bar-width':!collapse, 'is': !isCallout}">
            <img v-if="isCallout" src="@/assets/images/logo.jpg" />
            <img v-else src="@/assets/images/logo.png" style="margin-top:15px;" />
            <span class="logo-name">智信通 &emsp;</span>
        </div>
        
        <!-- 坐席信息 -->
        <template v-if="!collapse">
            <header class="acount" v-if="routeInfo.name == '任务外呼' || routeInfo.name == '工作台'">
                <div class="picture">
                    <img src="@/assets/images/picture.jpg" />
                </div><br/>
                <p class="name">{{acountInfo.name}}</p><br/>
                <!-- <p @click="dialogFormVisible=true" style="cursor:pointer;"><i class="el-icon-setting"></i> </p><br/> -->
                <p class="internal">坐席号:{{queryExt.id}}</p>&ensp;
                <p class="internal">状态:
                    <template v-if="extState.type">{{extState.name}}</template>
                    <template v-else>
                        <span v-if="queryExt.state == 'ready'">空闲</span>
                        <span v-if="queryExt.state == 'active'">通话中</span>
                        <span v-if="queryExt.state == 'progress'">拨号过程中</span>
                        <span v-if="queryExt.state == 'offline'">分机离线</span>
                        <span v-if="queryExt.state == 'offhook'">模拟分机听催挂音时的状态</span>
                    </template>
                </p>
            </header>
        </template>

        <!-- 导航菜单 -->
        <el-menu ref="navmenu" default-active="1" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
        :collapse="collapse" :collapse-transition="false" :unique-opened="true  "
        @open="handleopen" @close="handleclose" @select="handleselect">
            <!-- 导航菜单树组件，动态加载菜单 -->
            <menu-tree v-for="item in leftNavTree" :key="item.id" :menu="item"></menu-tree>
        </el-menu>
        
        <!-- 底部介绍 -->
        <template v-if="!collapse">
            <footer class="footer" v-if="routeInfo.name == '任务外呼' || routeInfo.name == '工作台'">
                <p> 
                    <span @click="dialogFormVisible=true" style="cursor:pointer;">设置</span>  帮助 关于 
                    <span style="cursor: pointer;" @click="$router.push('/callCenter/omExt')">后台</span>
                </p>
                <p style="font-size: 12px; margin-top:10px;">广州智信通网络科技有限公司 <br/>版权所有</p>
            </footer>
        </template>
        
        <!-- 弹框 -->
        <el-dialog title="个人信息" :visible.sync="dialogFormVisible" class="ext-form">
            <el-form :model="queryExt" size="small">
                <el-form-item label="坐席号" :label-width="formLabelWidth">
                    <el-input v-model="queryExt.id" disabled autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="绑定手机" :label-width="formLabelWidth" >
                    <el-input v-model="queryExt.mobile" autocomplete="off" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="转移方式" :label-width="formLabelWidth">
                    <el-select v-model="queryExt.fwdType" placeholder="请选择" style="width:100%">
                        <el-option 
                            v-for="i in transfer" 
                            :key="i.value"
                            :value="i.value"
                            :label="i.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="queryExt.fwdType != 0" label="转移至号码" :label-width="formLabelWidth">
                    <el-input v-model="queryExt.fwdNumber" autocomplete="off" placeholder="请输入转移至号码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="queryExt.email" autocomplete="off" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="是否保存数据库" :label-width="formLabelWidth" >
                    <el-radio-group v-model="queryExt.is_save">
                        <el-radio label="true">是</el-radio>
                        <el-radio label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否录音" :label-width="formLabelWidth" >
                    <el-radio-group v-model="queryExt.record">
                        <el-radio label="on">是</el-radio>
                        <el-radio label="off">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="subExtForm">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

	</div>
</template>

<script>
import { mapState } from 'vuex'
import MenuTree from "@/components/MenuTree"
export default {
    data(){
        return {
            leftNavTree: [],
            transfer: [{
                value: 0,
                label: '关闭'
            },{
                value: 1,
                label: '全转'
            },{
                value: 2,
                label: '遇忙时或无应答转'
            }],
            transferVal: '1',

            dialogFormVisible: false,
            extForm: {},
            formLabelWidth: '120px'
        }
    },
    components:{
            MenuTree
    },
    computed: {
        ...mapState({
            appName: state=>state.app.appName,
            themeColor: state=>state.app.themeColor,
            collapse: state=>state.app.collapse,
            navTree: state=>state.menu.navTree,
            isCallout: state=>state.app.isCallout,
            routeInfo: state => state.app.routeInfo,
            acountInfo: state => state.app.acountInfo,

            assignExt: state => state.assignExt,
            queryExt: state => state.queryExt,
            extState: state => state.extState
        }),
        mainTabs: {
            get () { return this.$store.state.tab.mainTabs },
            set (val) { this.$store.commit('updateMainTabs', val) }
        },
        mainTabsActiveName: {
            get () { return this.$store.state.tab.mainTabsActiveName },
            set (val) { this.$store.commit('updateMainTabsActiveName', val) }
        },
        
    },
    watch: {
        //$route: 'handleRoute'
        $route(){
            this.handleRoute(this.$route);
            this.handleLeftNav();
        }
    },
    created () {
        this.handleRoute(this.$route)
    },
    mounted(){
        
        this.handleLeftNav();
    },
    methods: {
       
        //左侧导航
        handleLeftNav(){
            let parentId = this.$route.meta.parentId;
            console.log('导航父级id----->', parentId);
            if(!parentId) {
                this.leftNavTree = []    
                return;
            }
            this.leftNavTree = this.navTree.find((i) => i.id == parentId).children;
        },
        handleopen() {

            console.log('handleopen')
        },
        handleclose() {
            console.log('handleclose')
        },
        handleselect(a, b) {
            console.log('handleselect')
        },
        assignExtFunc(obj){
            let extForm = obj || this.queryExt
            
            return this.$api.assignExt(extForm).then((resp)=>{
                if(resp.success){
                    this.$store.commit('setAssignExt', resp.data)
                    if(!obj) this.$message(resp.message)
                }
            }).catch((err)=>{
                this.$message.error(err.message);
            })
        },
        
        // 提交分机
        subExtForm(){
            this.assignExtFunc()
            this.dialogFormVisible = false;
        },

        // 路由操作处理
        handleRoute (route) {
            console.log('this.mainTabs----->', this.mainTabs)
            // tab标签页选中, 如果不存在则先添加
            var tab = this.mainTabs.filter(item => item.name === route.name)[0]
            if (!tab) {
                tab = {
                name: route.name,
                title: route.name,
                icon: route.meta.icon
                }
                this.mainTabs = this.mainTabs.concat(tab)
            }
            this.mainTabsActiveName = tab.name
            // 切换标签页时同步更新高亮菜单
            if(this.$refs.navmenu != null) {
                this.$refs.navmenu.activeIndex = '' + route.meta.index
                this.$refs.navmenu.initOpenedMenu()
            }
        },
         // 折叠导航栏
        onCollapse: function() {
            this.$store.commit('onCollapse')
        },
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/package/src/common/global.scss";

.ext-form{
    /deep/ .el-form-item__label{
        text-align: left;
    }
    /deep/ .el-dialog__body{
        padding: 30px 50px;
    }    
}

.menu-bar-container {
    position: absolute;
    top: 0px;
    left: 0;
    bottom: 0;
    //z-index: 1020;
    background: white;
    &>*{
        //width: 200px;
    }
    .el-menu{
        .el-menu-item{
            height: 50px;
            line-height: 50px;
        }
    }
    .shrink{
        position: absolute;
        top: 40%;
        right: 0;
        width: 15px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: white;
        z-index: 2;
        border: 1px solid $--border-color-base;
        cursor: pointer;
        box-shadow: 0px 0px 1px $color-primary;
        i{
            transform-origin: 50% 50%;
            transform: rotate(0deg);
            transition: 0.38s;
            color: $color-primary;
            &.rotate{
                transform: rotate(180deg);
            }
        }
    }
    .acount{
        padding: 10px 0;
        border-bottom: 1px solid #E4E7ED;
        margin-bottom: 10px;
        text-align: center;
        p{
            display: inline-block;
            padding: 5px 0;
            &.name{
                font-size: 16px;
                font-weight: bold;
                line-height: 1;   
            }
        }
        .picture{
            width: 115px;
            height: 115px;
            border-radius: 50%;
            border: 4px solid #E4E7ED;
            overflow: hidden;
            display: inline-block;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .footer{
        position: absolute;
        left: 0; 
        bottom: 10px;
        width: 100%;
        p{
            text-align: center;
        }
    }
  .el-menu {
    /* position:absolute;
    top: 60px;
    bottom: 0px; */
    text-align: left;
    border-right: none;
    // background-color: #2968a30c;
  }
  .logo {
    /* position:absolute;
    top: 0px; */
    height: 60px;   
    line-height: 60px;
    background: white;
    cursor:pointer;
    text-align: center;
    box-shadow: none;
    &.is{
        background: $--color-primary;   
        height: 70px;
        line-height: 70px;
        box-shadow: 0 4px 4px #bfbfbf;
        position: relative;
        z-index: 2;
        .logo-name{
            color: white;
        }
    }
    .logo-name{
        font-size: 20px;
        font-weight: bold;
        color: #627987;
        vertical-align: top;
    }
    img {
        width: 40px;
        height: 40px;
        border-radius: 0px;
        margin: 10px 10px 10px 10px;
        //float: left;
    }
    div {
      font-size: 25px;
      color: white;
      text-align: left;
      padding-left: 20px;
    }
  }
  .menu-bar-width {
    //width: 200px;
    width: 220px;
  }
  .menu-bar-collapse-width {
    width: 65px;
  }
}

</style>
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
            <header class="acount" v-if="routeInfo.name == '任务外呼'">
                <div class="picture">
                    <img src="@/assets/images/picture.jpg" />
                </div><br/>
                <p class="name">{{acountInfo.name}}</p><br/>
                <p @click="dialogFormVisible=true" style="cursor:pointer;"><i class="el-icon-setting"></i> 个人信息</p><br/>
                <p class="internal">坐席号：{{acountInfo.internal && acountInfo.internal.account}}</p><br/>
                <p class="internal">坐席状态：
                    <span v-if="acountInfo.isBusy == 1"> 示忙</span>
                    <span v-if="acountInfo.isBusy == 2"> 空闲</span>
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
            <footer class="footer" v-if="routeInfo.name == '任务外呼'">
                <p> 帮助 关于</p>
                <p style="font-size: 12px; margin-top:10px;">广州智信通网络科技有限公司 <br/>版权所有</p>
            </footer>
        </template>
        
        <!-- 弹框 -->
        <el-dialog title="个人信息" :visible.sync="dialogFormVisible">
            <el-form :model="extForm" class="ext-form">
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="extForm.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" :label-width="formLabelWidth">
                    <el-input v-model="extForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="转移至号码" :label-width="formLabelWidth">
                    <el-input v-model="extForm.fwdNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="subExtForm">确 定</el-button>
                </el-form-item>
            </el-form>
            <!-- <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="subExtForm">确 定</el-button>
            </div> -->
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

            dialogFormVisible: false,
            extForm: {},
            formLabelWidth: '90px'
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
            acountInfo: state => state.app.acountInfo
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
        
        this.assignExtFun({'lineid': 'IPPhone 17'})

        this.handleLeftNav();
        
    },
    methods: {
        //左侧导航
        handleLeftNav(){
            let parentId = this.$route.meta.parentId;
            if(!parentId) return;
            this.leftNavTree = this.navTree.find((i) => i.id == parentId).children;
            // console.log("一级菜单id------>", this.$route.meta.parentId)
            // console.log("一级菜单子级------>", this.leftNavTree)
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
        assignExtFun(obj){
            let extForm = obj || this.extForm
            let param = {}
            for(let key in extForm){
                param['extForm.'+key] = extForm[key]
            }
            this.$api.assignExt(param).then((resp)=>{
                if(resp.success){
                    this.extForm = resp.data
                }
            })
        },
        // 提交分机
        subExtForm(){
            this.assignExtFun()
            this.dialogFormVisible = false;
        },

        // 路由操作处理
        handleRoute (route) {
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
        padding: 15px 0;
        border-bottom: 1px solid #E4E7ED;
        margin-bottom: 10px;
        text-align: center;
        p{
            display: inline-block;
            padding: 5px 0;
            &.name{
                font-size: 16px;
                font-weight: bold;
                line-height: 2;   
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
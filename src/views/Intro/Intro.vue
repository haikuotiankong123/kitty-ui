<template>
  <div class="page-container" style="width:99%; height:100%;">
    <!-- <div class="left-task">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
        <el-form-item label="请选择任务">
          <el-input v-model="formInline.user" placeholder="选择任务"></el-input>
        </el-form-item>
      </el-form>
      <el-tabs type="border-card">
        <el-tab-pane label="未拨">

          <el-form :inline="true" size="mini" :model="formSearch" class="form-search">
            <el-form-item>
              <el-input v-model="formSearch.phone" placeholder="请输入号码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-date-picker
                style="width:125px;"
                v-model="formSearch.lastUpdateTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="tableData"
            size="mini"
            style="width: 100%">
            <el-table-column
              prop="phone"
              label="号码">
              <template slot-scope="scope">
                <span style="width:20px; height:20px; text-align:center; display: inline-block; background: #409EFF; border-radius: 50%; color: white;">
                  <i class="el-icon-phone"></i>
                </span>
                {{scope.row.phone}}
              </template>
            </el-table-column>
            <el-table-column
              prop="lastUpdateTime"
              label="最后呼叫时间">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已拨">已拨</el-tab-pane>
        <el-tab-pane label="待回拨">待回拨</el-tab-pane>
      </el-tabs>
    </div>
    <div class="customer">
      <h5 class="h5">客户资料</h5>
      <el-form :inline="true" :show-message="false" label-width="100px"
              class="query-container" size="mini" :model="customerDetail" ref="customerDetail">
        
        <el-form-item label="客户姓名：" prop="name">
            <el-input :disabled="isEditable" v-model="customerDetail.name" class="e-input"> </el-input>
        </el-form-item>
        
        <el-form-item label="电话：" prop="phone">
            <el-input :disabled="isEditable" v-model="customerDetail.phone" class="e-input"> </el-input>
        </el-form-item>
        
        <el-form-item label="邮箱：" prop="a3">
            <el-input :disabled="isEditable" v-model="customerDetail.a3" class="e-input"> </el-input>
        </el-form-item>

        <el-form-item label="微信：" prop="a5">
            <el-input :disabled="isEditable" v-model="customerDetail.a5" class="e-input"> </el-input>
        </el-form-item>
        
        <el-form-item label="地址：" prop="address">
            <el-input :disabled="isEditable" v-model="customerDetail.address" class="e-input" > </el-input>
        </el-form-item>
        
        <el-form-item label="QQ：" prop="a4">
            <el-input :disabled="isEditable" v-model="customerDetail.a4" class="e-input" > </el-input>
        </el-form-item>

        <el-form-item label="性别：" prop="a9">
          <el-radio-group :disabled="isEditable" class="e-input" v-model="customerDetail.a9">
              <el-radio-button label="男">男</el-radio-button>
              <el-radio-button label="女">女</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注：" prop="remark" class="block">
          <el-input :disabled="isEditable" type="textarea" v-model="customerDetail.remark"></el-input>
        </el-form-item>

        <el-form-item label=" " class="block">
          <el-button :disabled="isEditable" type="primary" @click="submitForm('customerDetail')">保存客户资料</el-button>
          <el-button :disabled="!isEditable" type="primary" @click="isEditable = !isEditable">编辑资料</el-button>
        </el-form-item>

      </el-form>

      <el-tabs class="tabs" v-model="activeName">
        <el-tab-pane label="开场话术" name="first">开场话术</el-tab-pane>
        <el-tab-pane label="问卷调查" name="second">问卷调查</el-tab-pane>
      </el-tabs>

    </div> -->

    <el-carousel :interval="3000" type="card" height="450px" class="carousel">
      <el-carousel-item class="carousel-item-intro">
        <h2>项目介绍</h2>
        <ul>
          <li>基于 Spring Boot、Spring Cloud、Vue、Element 的 Java EE 快速开发平台</li>
          <li>旨在提供一套简洁易用的解决方案，帮助用户有效降低项目开发难度和成本</li>
          <li>博客提供项目开发过程同步系列教程文章，手把手的教你如何开发同类系统</li>
        </ul>
        <div><img src="@/assets/logo_kitty_blue.png" style="width:200px;height:120px;padding-top:15px;" /></div>
      </el-carousel-item>
      <el-carousel-item class="carousel-item-func">
        <h2>功能计划</h2>
        <ul>
          <li>✔ 系统登录：系统用户登录，系统登录认证（token方式）</li>
          <li>✔ 用户管理：新建用户，修改用户，删除用户，查询用户</li>
          <li>✔ 机构管理：新建机构，修改机构，删除机构，查询机构</li>
          <li>✔ 角色管理：新建角色，修改角色，删除角色，查询角色</li>
          <li>✔ 菜单管理：新建菜单，修改菜单，删除菜单，查询菜单</li>
          <li>✔ 系统日志：记录用户操作日志，查看系统执行日志记录</li>
          <li>✔ 数据监控：定制Druid信息，提供简洁有效的SQL监控</li>
          <li>✔ 聚合文档：定制在线文档，提供简洁美观的API文档</li>
          <li>✔ 备份还原：系统备份还原，一键恢复系统初始化数据</li>
          <li>✔ 主题切换：支持主题切换，自定主题颜色，一键换肤</li>
          <li>✔ 服务治理：集成Spring Cloud，实现全方位服务治理</li>
          <li>✔ 服务监控：集成Spring Boot Admin，实现微服务监控</li>
          <li>...</li>
        </ul>
      </el-carousel-item>
      <el-carousel-item class="carousel-item-env">
        <h2>开发环境</h2>
        <ul>
          <li>IDE : eclipse 4.6.x。     JDK : JDK 1.8.x。</li>
          <li>Maven : Maven 3.5.x。   MySQL: MySQL 5.7.x。</li>
          <li>IDE : VS Code 1.27。    Webpack：webpack 3.2.x。</li>
          <li>NODE: Node 8.9.x。      NPM : NPM 6.4.x。</li>
        </ul>
        <h2>技术选型</h2>
        <ul>
          <li>核心框架：Spring Boot 2.x。  服务治理：Spring Cloud。</li>
          <li>视图框架：Spring MVC 5.x。   持久层框架：MyBatis 3.x。</li>
          <li>数据库连接池：Druid 1.x。    安全框架：Shiro 1.4.x。</li>
          <li>前端框架：Vue.js 2.x。       页面组件：Element 2.x。</li>
          <li>状态管理：Vuex.js 2.x。      后台交互：axios 0.18.x。</li>
          <li>...</li>
        </ul>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
export default {
  data(){
    return {
      activeName: 'first',
      customerDetail: {
        id: '',
        phone: '',
        remark: '',
        address: '',
        taskId: '',
        result: '',
        a1: '',
        a2: '',
        a3: '',
        a4: '', 
        a5: '',
        a6: '', 
        a7: '',
        a8: '',
        a9: ''
      },
      isEditable: true,
      isBtn: false,
      tableData: [
        {phone: "13602714551", lastUpdateTime: "2019-05-02"},
        {phone: "13602714551", lastUpdateTime: "2019-05-02"},
        {phone: "13602714551", lastUpdateTime: "2019-05-02"},
        {phone: "13602714551", lastUpdateTime: "2019-05-02"},
        {phone: "13602714551", lastUpdateTime: "2019-05-02"},
        {phone: "13602714551", lastUpdateTime: "2019-05-02"},
        {phone: "13602714551", lastUpdateTime: "2019-05-02"},
        {phone: "13602714551", lastUpdateTime: "2019-05-02"},
        {phone: "13602714551", lastUpdateTime: "2019-05-02"},
        {phone: "13602714551", lastUpdateTime: "2019-05-02"},
        {phone: "13602714551", lastUpdateTime: "2019-05-02"}
      ],
      formInline: {
        user:''
      },
      formSearch:{
        phone: '',
        lastUpdateTime: ''
      },
      pageRequest: {pageNum:1, pageSize:10},
      pageResult: {},
      columns: [],
      filterColumns: [],
      showOperation: false
    }
  },
  components:{
    KtTable
  },
  methods :{
    findPage(data){
      if(data !== null){

      }
      this.$api.user.findPage(this.pageRequest).then((res)=>{
        this.pageResult = res.data
      }).then(data!=null?data.callback:'')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    initColumns(){
      // this.columns = [
      //   {prop: "id", label: "ID", minWidth: 50},
      //   {prop: "name", label: "姓名", minWidth: 50},
      //   {prop: "mobile", label: "手机"}
      // ];
      this.columns = [
        //{prop:"id", label:"ID", minWidth:50},
        {prop:"name", label:"用户名", minWidth:120},
        {prop:"mobile", label:"手机", minWidth:100},
        // {prop:"deptName", label:"机构", minWidth:120},
        // {prop:"roleNames", label:"角色", minWidth:100},
        // {prop:"email", label:"邮箱", minWidth:120},
        // {prop:"status", label:"状态", minWidth:70},
        // {prop:"createBy", label:"创建人", minWidth:120},
        // {prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
        // {prop:"lastUpdateBy", label:"更新人", minWidth:100},
        // {prop:"lastUpdateTime", label:"更新时间", minWidth:120, formatter:this.dateFormat}
      ]
      this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      //this.filterColumns = JSON.parse(JSON.stringify(this.columns))
    },
    onSubmit() {
      console.log('submit!');
    }
  },
  mounted(){
    this.initColumns()
  }
}
</script>

<style scoped lang="scss">
// .page-container{
//   display: flex;
//   background: #f2f2f2;
  
//   .left-task{
    
//     height: calc(100% - 20px);
//     flex-shrink: 0;
//     flex-grow: 0;
//     width: 370px;
//     margin-right: 10px;
//     background: white;
//     padding: 10px;

//     .form-search /deep/ .el-form-item{
//       margin-right: 2px;
//       .el-input__inner{
//         width: 125px;
//       }
//     }
//   }
//   .customer{
//     flex: 1;
//     min-width: 865px;
//     background: white;
//     height: calc(100%-20px);
//     padding: 20px;
//     .h5{
//       font-size: 15px;
//       padding-bottom: 10px;
//     }
//     {
//       padding: 10px;
//       /deep/{
//         .el-form-item{
//           width: 33%;
//           margin-right: 0;
//         }
//         .block{
//           width: 100%;
//           .el-form-item__content{
//             //width: calc(100% - 200px);
//             width: 50%;
//           }
//         }
//       } 
//     }
//     .tabs{
//       /deep/ .el-tabs__item{
//         font-size: 15px;
//         font-weight: bold;
//       }
//     }
//   }
// }






.carousel {
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 20px;
}
.carousel h2 {
  color: #475669;
  font-size: 22px;
  opacity: 1.75;
  line-height: 100px;
  margin: 0;
}
.carousel ul {
  color: #475669;
  font-size: 15px;
  opacity: 1.75;
  line-height: 40px;
  margin: 0;
}
.carousel-item-intro h2 {
  color: #ffffff;
  font-size: 22px;
  opacity: 1.75;
  line-height: 80px;
  margin: 0;
}
.carousel-item-intro ul {
  color: #ffffff;
  font-size: 15px;
  opacity: 1.75;
  line-height: 65px;
  padding: 5px;
  margin: 0;
}
  .carousel-item-func h2 {
  color: #3f393b;
  font-size: 22px;
  opacity: 1.75;
  line-height: 50px;
  margin: 0;
}
.carousel-item-func ul {
  color: #3f393b;
  font-size: 15px;
  opacity: 1.75;
  line-height: 30px;
  text-align: left;
  padding-left: 90px;
  margin: 0;
}
.carousel-item-env h2 {
  color: #475669;
  font-size: 22px;
  opacity: 1.75;
  line-height: 50px;
  margin: 0;
}
.carousel-item-env ul {
  color: #475669;
  font-size: 15px;
  opacity: 1.75;
  line-height: 35px;
  text-align: left;
  padding-left: 110px;
  margin: 0;
}
.carousel-item-intro {
  background-color: #19aaaf73;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  -moz-border-radius: 15px;
  background-clip: padding-box;
  box-shadow: 0 0 25px #a3b3b965;
}
.carousel-item-func {
  background-color: #19aaaf73;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  -moz-border-radius: 15px;
  background-clip: padding-box;
  box-shadow: 0 0 25px #a3b3b965;
}
.carousel-item-env {
  background-color: #19aaaf73;
  -webkit-border-radius: 25px;
  border-radius: 25px;
  -moz-border-radius: 15px;
  background-clip: padding-box;
  box-shadow: 0 0 25px #a3b3b965;
}
.carousel-item-intro {
  background-color: #b95e5e;
}
.carousel-item-func {
  background-color: #52c578;
}
.carousel-item-env {
  background-color: #41a7b9;
}
</style>
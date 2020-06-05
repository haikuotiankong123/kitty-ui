<template>
  <div class="page-container" style="width:99%; height:100%;">
    <div class="left-task">
        <!-- <i class="icons icon-baobiao7"></i> -->
        <el-form :inline="true" :model="formInline" class="select-task" size="small">
            <el-form-item label="请选择任务">
                <el-select v-model="taskName" value-key="id" placeholder="请选择任务" @change="changeTask($event)" style="width:380px;">
                    <el-option
                    v-for="item in listTasks"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="call-tabs">
            <ul>
                <li v-for="(i, index) in tabArr" 
                    :key="index" 
                    @click="onSwitchTab(i)">
                    <el-badge v-if="index == 2" :value="2" class="item" type="warning">
                        <span :class="{active:i.type == currentCusType.type}">{{i.value}}</span>
                    </el-badge>
                    <span v-else :class="{active:i.type == currentCusType.type}">{{i.value}}</span>
                </li>
            </ul>
            <div class="call-tabs-content">
                <el-form :inline="true" size="mini" :model="formSearch" class="form-search">
                    <el-form-item >
                        <el-date-picker
                        style="width:200px"
                        v-model="formSearch.lastUpdateTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                        <!-- <el-date-picker
                            style="width:125px;"
                            v-model="formSearch.lastUpdateTime"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker> -->
                    </el-form-item>
                    <el-form-item>
                        <el-input style="width:140px;" v-model="formSearch.phone" placeholder="请输入号码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit" style="" plain>查询</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    border
                    :data="listTaskCustomer"
                    size="mini"
                    style="width: 100%">
                    <el-table-column
                    prop="phone"
                    label="电话">
                    <template slot-scope="scope">
                        <span @click="editCommandCallFunc(scope.row)" class="icon">
                        <i class="el-icon-phone"></i>
                        </span>
                        {{scope.row.phone}}
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="createTime"
                    label="最后呼叫时间">
                    </el-table-column>
                </el-table>
                <el-pagination
                    style="margin-top:100px;"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-size="15"
                    layout="total, prev, pager, jumper"
                    :total="listTaskCustomer.length">
                    </el-pagination>
            </div>
        </div>

    </div>

    <div class="customer">
        <h5 class="h5"><span class="active">客户资料</span></h5>
        <div class="user-container">
            <el-form :inline="true" :show-message="false" label-width="90px" :rules="rules"
                    size="small" :model="customerDetail" ref="customerDetail">
                <el-form-item label="客户姓名" prop="name">
                    <el-input :disabled="isEditable" placeholder="请输入客户姓名" v-model="customerDetail.name" class="e-input"> </el-input>
                </el-form-item>
                
                <el-form-item label="电话" prop="phone">
                    <el-input :disabled="isEditable" placeholder="请输入电话" v-model="customerDetail.phone" class="e-input"> </el-input>
                </el-form-item>
                
                <el-form-item label="邮箱" prop="a3">
                    <el-input :disabled="isEditable" placeholder="请输入邮箱" v-model="customerDetail.a3" class="e-input"> </el-input>
                </el-form-item>

                <el-form-item label="微信" prop="a5">
                    <el-input :disabled="isEditable" placeholder="请输入微信" v-model="customerDetail.a5" class="e-input"> </el-input>
                </el-form-item>
                
                <el-form-item label="地址" prop="address">
                    <el-input :disabled="isEditable" placeholder="请输入地址" v-model="customerDetail.address" class="e-input" > </el-input>
                </el-form-item>
                
                <el-form-item label="QQ" prop="a4">
                    <el-input :disabled="isEditable" placeholder="请输入QQ" v-model="customerDetail.a4" class="e-input" > </el-input>
                </el-form-item>

                <el-form-item label="性别" prop="a9">
                    <el-radio-group :disabled="isEditable" class="e-input" v-model="customerDetail.a9">
                        <el-radio-button label="男">男</el-radio-button>
                        <el-radio-button label="女">女</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                
                <!-- <template v-for="(i,index) in customerDetail.configValueList">
                    <el-form-item
                        v-if="i.status"
                        :key="index"
                        :label="i.label"
                        :rules="{ required: i.isRequired, message: '必填', trigger: i.type == 4 ? 'change': 'blur'  }"
                        :prop="'configValueList.' + index + '.jsonValue'">
                        <el-input v-if="i.type == 1"  
                            :disabled="isEditable" 
                            :placeholder="'请输入' + i.label" 
                            v-model="i.jsonValue" 
                            class="e-input"> </el-input>
                        <el-select v-if="i.type == 4"
                            :disabled="isEditable"
                            v-model="i.jsonValue" 
                            :placeholder="'请选择' + i.label" 
                            class="e-input"
                            style="width:200px;">
                            <el-option v-for="k in JSON.parse(i.jsonData)" 
                                :label="k"
                                :value="k"
                                :key="k"></el-option>
                        </el-select>
                    </el-form-item>
                </template> -->

                <el-form-item label="备注" prop="remark" class="block">
                    <el-input :disabled="isEditable" type="textarea" placeholder="请输入备注" v-model="customerDetail.remark"></el-input>
                </el-form-item>

                <el-form-item label=" " class="block" style="margin:10px 0 0 0;">
                    <el-button :disabled="isEditable" type="primary" @click="submitForm('customerDetail')">保存客户资料</el-button>
                    <el-button :disabled="!isEditable" type="primary" @click="isEditable = !isEditable">编辑资料</el-button>
                </el-form-item>

            </el-form>

        </div>

        <div class="skill">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="开场话术" name="first">
                    <div class="skill-content">
                        <p class="p">您好，老师，这是我们刚到的最新款，我来给您介绍……（正确）老师，您好，这款是今年最流行的欧式风格，装在家里显得您家中非常大气，这边请！我为您详细介绍。（正确）先生，您眼光真好，这款板材是我们公司最新研发的新款，非常适合您这样的高级人士，您不防感受一下；（正确）</p>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="话务小结" name="three">
                    <el-form size="small" status-icon label-width="100px" style="padding-right: 20px;margin-bottom: 10px" v-if="listMessageGroup.length>0">
                        <!--v-if="msgTemplate.flag===1"-->
                        <el-form-item label="模板">
                            <el-radio-group v-model="customerDetail.resultText" size="mini">
                                <el-radio :key="msgTemplate.id"
                                            v-for="msgTemplate in listMessageGroup[0].msgTemplate"
                                            :label="msgTemplate.resultText" border/>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="发送信息">
                            <el-input type="textarea" 
                                :row="1" 
                                v-model="customerDetail.resultMsg" 
                                readonly></el-input>
                        </el-form-item>
                        <el-form-item label="备注信息">
                            <el-input type="textarea" 
                                :row="2" 
                                v-model="customerDetail.resultRemark"
                                placeholder="请输入备注信息"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" @click="submitMemo">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>

                <el-tab-pane label="问卷调查" name="second">
                    <div class="question" v-for="(item,index) in listQuestion" :key="index" style="margin: 0 20px">
                            <p class="title">{{index+1}}. {{item.title}}</p>
                            <el-radio-group v-model="item.answerId" v-show="item.questionType === 0" size="mini">
                                <el-radio v-for="(answerItem) in item.answerList" :key="answerItem.id"
                                          @click.native.prevent="handleQuestionChange(index,answerItem.id) "
                                          :label="answerItem.id" border>
                                    {{answerItem.text}}
                                </el-radio>
                            </el-radio-group>
                            <el-input v-show="item.questionType===1" v-model="item.answerText" placeholder="请输入文本"/>
                        </div>
                </el-tab-pane>
            </el-tabs>

        </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from "vuex"
import KtTable from "@/views/Core/KtTable"
import {listQuestion} from "@/mock/modules/listQuestion.js"
import util from "@/utils/util.js"
export default {
    data(){
        return {
            
            listTasks: [],
            taskName: '',
            currentTask: {},
            listTaskCustomer:[],
            tabArr: [{value:'待回拨',type:1} , {value:'通话记录', type:2}],
            currentCusType: {value:'通话记录', type:1},
            listQuestion: [],

            activeName: 'first',
            customerDetail: {resultMsg: '', jsonValueMap: {}},
            isEditable: true,
            isBtn: false,
            
            formInline: {
                user:''
            },
            formSearch:{
                phone: null,
                lastUpdateTime: null
            },
            pageRequest: {pageNum:1, pageSize:10},
            pageResult: {},
            filterColumns: [],
            showOperation: false,
            timer: null,
            callTime: "0",
            rules:  {},
            jsonValueMap: {},
            listMessageGroup:[]
        }
    },
    components:{
        KtTable
    },
    computed:{
        ...mapState({
            //customerDetail: state=>state.app.customerDetail
            acountInfo: state => state.acountInfo,
        })
    },
    watch:{
        'customerDetail.resultText': function (to, from) {
            this.selectResFunc(to)
        },
        acountInfo(){
            this.taskFunc()
        }
    },
    mounted(){
        
        this.loadData();
        this.$api.usrCustomerRequired.findByCompanyId().then(resp => {
            this.isRequiredRule(resp.data)
        });
        /* this.$api.usrCustomerConfig.findAll().then(resp => {
            let data = resp.data
            this.$set(this.customerDetail, 'configValueList', data)
        }); */

    },
    methods :{
        isRequiredRule(obj = {}){
            for(let k in obj){
                let rule = {required: obj[k], message: '必填', trigger: 'blur'}
                this.$set(this.rules, k, rule)
            }
        },

        submitMemo(){
            let data = {
                'id': this.customerDetail.id,
                'customerId': this.customerDetail.customerId,
                'taskId': this.taskid,
                'resultRemark': this.customerDetail.resultRemark,
                resultText: this.customerDetail.resultText,
                'projectName': this.projectName,
                resultMsg: this.customerDetail.resultMsg,
                //nextDatetime,
            };
            console.log("小结数据----》", data)
            this.$api.taskCustomer.save(data)
        },

        selectResFunc: function (val) {
            if (this.listMessageGroup.length > 0) {
                var temp = this.listMessageGroup[0].msgTemplate;
                if (temp.length > 0) {
                    for (var i = 0; i < temp.length; i++) {
                        if (temp[i].resultText === val) {
                            this.customerDetail.resultMsg = temp[i].content;
                            console.error("wwwww", this.customerDetail)
                            break;
                        }
                    }
                }
            }
        },

        handleQuestionChange(inx, id) {
            this.listQuestion[inx].answerId = id == this.listQuestion[inx].answerId ? 0 : id
        },
        handleClick(){},
        onSwitchTab(item){
            this.currentCusType = item;
            //this.listTaskCustomerFunc()
        },
        changeTask(item){
            this.currentTask = item
            this.listTaskCustomerFunc()
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
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
                    this.$confirm('确认提交吗？', '提示', {}).then(()=>{
                        let form = Object.assign({}, this.customerDetail)
                        this.$api.taskCustomer.save(form).then((res)=>{
                            if(res.code == 200){
                                util.success('操作成功')
                                this.$refs[formName].resetFields()
                                this.isEditable = true
                            }else{
                                util.error("操作失败")
                            }
                        });
                    })
                } 
            });
        },
        
        editCommandCallFunc(row){
            this.customerDetail = Object.assign({}, row)
            console.log("8888row------>", this.customerDetail)
        },

        countTime() {
            this.callTime = "00:00:00"
            let hour, minute, second;//时 分 秒
            hour = minute = second = 0;//初始化
            let millisecond = 0;//毫秒
            this.callTime && window.clearInterval(this.timer);
            this.timer = setInterval(() => {
                
                second = second + 1;
                if (second >= 60) {
                    second = 0;
                    minute = minute + 1;
                }
                if (minute >= 60) {
                    minute = 0;
                    hour = hour + 1;
                }
                let h = hour.toString().length < 2 ? "0" + hour : hour
                let m = minute.toString().length < 2 ? "0" + minute : minute
                let s = second.toString().length < 2 ? "0" + second : second
                this.callTime = h + ":" + m + ":" + s;
            }, 1000);
            
        },

        onSubmit() {
        console.log('submit!');
        },
        async addAndCall(){
            // 
            let param = {
                phone: '',
                name: ''
            }
            // 无
            let data = await this.$api.editCustomer(param)
            let customerId = data.id 
            // 无
            this.$api.editCommandCall({customerId})
        },
        // 问卷调查请求
        listQuestionFunc(){
            let questionGroupId = this.currentTask.project && this.currentTask.project.questionGroupId;
            if(!questionGroupId) return '没有调查问卷模板'
            // 无
            this.$api.listQuestion({questionGroupId}).then((resp) => {
                this.listQuestion = resp.data
            })
        },
        listTaskCustomerFunc(){
            let taskId = this.currentTask.id;
            let param = {
                columnFilterMap: {taskId:taskId},
                pageNum: 1,
                pageSize: 15,
            }
            this.$api.taskCustomer.findPage(param).then(res => {
                this.listTaskCustomer = res.data.content
            })
        },
        loadData(){
            
            this.$api.messageGroup.findAll().then(res => {
                if(res.data[0] && res.data[0].msgTemplate){
                    this.listMessageGroup = res.data
                }
            })
            this.taskFunc()
            setTimeout(()=>{
                this.listQuestion = listQuestion().data
                console.log("问卷调查----->", this.listQuestion)
            }, 3000*Math.random())
        },
        taskFunc(){
            let memberId = this.acountInfo.id;
            if(!memberId) return "无账号id"
            this.$api.task.getTaskByMemberId({memberId}).then(res => {
                this.listTasks = res.data    
                if(res.data[0]){
                    this.currentTask = res.data[0]
                    this.taskName = this.currentTask.name;
                    this.listTaskCustomerFunc()
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import "@/assets/package/src/common/global.scss";
.page-container{
  display: flex;
  background: #f2f2f2;
  
  .left-task{
    
    // 此处设置flex-shrink,flex-grow 是告诉flex, 既不要给我放大，也不要缩小，我要设置自己的宽度
    flex-shrink: 0;
    flex-grow: 0;
    width: 450px;
    margin-right: 10px;
    background: white;
    .select-task{
        padding: 20px 10px 0 17px;
        /deep/ .el-form-item__label{
            font-size: 16px;
            font-weight: bold;
        }
    }
    .call-tabs{
        position: relative;
        height: calc(100% - 150px);
        ul{
            background: $color-background-base;
            li{
                display: inline-block;
                height: 38px;
                line-height: 38px;
                color: #333;
                cursor: pointer;
                span{
                    padding: 0 25px;
                    display: inline-block;
                    &.active{
                        position: relative;
                        color: white;
                        background: $color-primary;
                        &::after{
                            position: absolute;
                            bottom: 0;
                            left: 42%;
                            content: '';
                            height: 0;
                            width: 0;
                            border: 6px solid transparent;
                            border-bottom: 6px solid #fff;
                        }
                    }
                }
                /deep/ .el-badge__content.is-fixed{
                    right: 28px;
                    top: 6px;
                }
            }
        }
        .call-tabs-content{
            padding: 20px;
            .el-table /deep/{
                th{
                    background: $color-background-base;
                }
            }
        }
        .el-pagination{
            position: absolute;
            bottom: 10px;
        }
    }
    .el-tabs{
      height: 90%;
    }
    .icon{
      width:20px; 
      height:20px; 
      text-align:center; 
      display: inline-block; 
      background: #409EFF; 
      border-radius: 50%; 
      color: white;
      cursor: pointer;
    }
    .form-search /deep/ .el-form-item{
      margin-right: 2px;
      .el-input__inner{
        //width: 190px;
      }
    }
  }
  .customer{
    flex: 1;
    min-width: 920px;
    background: white;
    //height: calc(100%-20px);
    overflow: auto;
    padding: 0 10px;
    .h5{
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      font-weight: 400;
      border-bottom: 1px solid $--border-color-light;
      span{
          margin-right: 25px;
      }
      .active{
          display: inline-block;
          border-bottom: 1px solid $color-primary;
          font-weight: bold;
      }
    }
    .skill{
        /deep/ .el-tabs__item{
            font-size: 16px;
        }
        /deep/ .el-tabs__item.is-active{
            color: #484a4d;
            font-weight: bold;
        }
        /deep/ .el-tabs__nav-wrap::after{
            height: 1px;
        }
        /deep/ .el-tabs__active-bar{
            height: 1px;
        }
        .title{
            padding: 20px 0 10px 0;
        }
    }
    .skill-content{
        margin: 20px;
        padding: 20px;
        border: 1px solid $--border-color-lighter;
    }
    .user-container{
      margin: 25px 10px;
      padding: 25px 0;
      border: 1px solid $--border-color-lighter;
      /deep/{
        .el-form-item{
          width: 33%;
          margin-right: 0;
        }
        .el-form-item__content{
            //width: 220px;
        }
        .block{
          width: 100%;
          .el-form-item__content{
            //width: calc(100% - 200px);
            width: 50%;
          }
        }
      } 
    }

  }
}


</style>
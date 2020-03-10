<template>
  <div class="page-container" style="width:99%; height:100%;">
    <div class="left-task">
        <el-form :inline="true" :model="formInline" class="select-task" size="small">
            <el-form-item label="请选择任务">
                <el-select v-model="taskName" placeholder="请选择任务" @change="changeTask($event)" style="width:380px;">
                    <el-option
                    v-for="item in listTasks"
                    :key="item.name"
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
        <el-form :inline="true" :show-message="false" label-width="75px"
                class="query-container" size="small" :model="customerDetail" ref="customerDetail">
            
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

            <el-form-item label="备注" prop="remark" class="block">
            <el-input :disabled="isEditable" type="textarea" placeholder="请输入备注" v-model="customerDetail.remark"></el-input>
            </el-form-item>

            <el-form-item label=" " class="block" style="margin:10px 0 0 0;">
            <el-button :disabled="isEditable" type="primary" @click="submitForm('customerDetail')">保存客户资料</el-button>
            <el-button :disabled="!isEditable" type="primary" @click="isEditable = !isEditable">编辑资料</el-button>
            </el-form-item>
        </el-form>
        <div class="skill">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="开场话术" name="first">
                    <div class="skill-content">
                        <p class="p">您好，老师，这是我们刚到的最新款，我来给您介绍……（正确）老师，您好，这款是今年最流行的欧式风格，装在家里显得您家中非常大气，这边请！我为您详细介绍。（正确）先生，您眼光真好，这款板材是我们公司最新研发的新款，非常适合您这样的高级人士，您不防感受一下；（正确）</p>
                    </div>
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
import {listTask,listTaskCustomer} from "@/mock/modules/task.js"
import {listQuestion} from "@/mock/modules/listQuestion.js"
export default {
    data(){
        return {
            
            listTasks: [],
            taskName: '',
            currentTask: {},
            listTaskCustomer:[],
            tabArr: [{value:'未拨', type:1},{value:'已拨',type:2} ,{value:'待回拨',type:3} ],
            currentCusType: {value:'未拨', type:1},
            listQuestion: [],

            activeName: 'first',
            /* customerDetail: {
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
            }, */
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
            callStatus: false,
            timer: null,
            callTime: "0"
        }
    },
    components:{
        KtTable
    },
    computed:{
        ...mapState({
            customerDetail: state=>state.app.customerDetail
        })
    },
    mounted(){
        
        this.loadData();
        
        window.vm.$on('onOutgoing', (data)=>{
            // 呼叫做...
        })
        window.vm.$on('answer', (data)=>{
            // 接听做...
        })
        window.vm.$on('hangup', (data)=>{
            // 挂机做...
        })
    },
    methods :{
        handleQuestionChange(inx, id) {
            this.listQuestion[inx].answerId = id == this.listQuestion[inx].answerId ? 0 : id
        },
        handleClick(){},
        onSwitchTab(item){
            this.currentCusType = item;
            this.listTaskCustomerFunc()
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
                    alert('submit!');
                    this.isEditable = true
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        
        editCommandCallFunc(row){
            
            this.$store.commit("setCustomerDetail", row.customer)

            if (this.callStatus) {
                this.callStatus = false;
                return;
            }
            if (!row.id) {
                console.log("客户为空")
                //util.notify("客户为空")
                return;
            }
            
            // 无
            return;
            this.$api.editCommandCall({customerId: row.id})
            this.callStatus = true
            this.customerDetail.phone = row.phone;

            /* this.$store.state.editCommandCallForm.customerId = row.id;
            this.editCommandCallClick();
            this.callStatus = true
            this.customerDetail.phone = row.phone;
            this.countTime() */
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
            if(!taskId) return '无任务id'
            
            let type = this.currentCusType.type
            let isFinished = (type==1 || type==2) ? type : undefined;
            let hasNextDatetime = type ===3 ? 1 : undefined;
            let params = {
                page: 1,
                size: 15,
                taskId,
                isFinished,
                hasNextDatetime,
                ...this.formSearch
            }

            console.log('参数---》', params)
            let resp = listTaskCustomer(params);
            this.listTaskCustomer = resp.data.length ? resp.data : [];
        },
        loadData(){
            setTimeout(()=>{
                this.listTasks = listTask().data.map(i=> {
                    i.value = i.name
                    return i
                });
                this.currentTask = this.listTasks[2]
                this.taskName = this.currentTask.name
                this.listTaskCustomerFunc()
                this.listQuestion = listQuestion().data
                console.log("问卷调查----->", this.listQuestion)
            }, 3000*Math.random())
            
            
            // 无
            // this.$api.listTask().then((resp) => {})
            /* api.listTask().then((resp) => {
                if (!resp.data) {
                    util.error('查无任务')
                    return
                }
                this.$store.state.listTask = resp.data
            }); */
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
    .query-container{
      margin: 25px 10px;
      padding: 25px 0;
      border: 1px solid $--border-color-lighter;
      /deep/{
        .el-form-item{
          width: 33%;
          margin-right: 0;
        }
        .el-form-item__content{
            width: 220px;
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
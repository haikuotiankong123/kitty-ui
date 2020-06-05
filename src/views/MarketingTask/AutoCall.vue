<template>
    <div class="table-container">
        <div class="query-container">
            <el-form :inline="true" size="mini">
                <!-- <el-form-item label="电话号码">
                    <el-input v-model="dataForm.phone" placeholder="请输入电话号码"></el-input>
                </el-form-item> -->

                <el-form-item>
                    <el-button type="primary" @click="findPageFunc(null)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">增加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <om-table :data="dataResp"
            :columns="filterColumns"
            :handleWidth="handleWidth"
            @findPage="findPageFunc"
            @handleDelete="handleDelete"
            @handleEdit="handleEdit">
            <template v-slot:project="{row}">
                <span>{{row.project.name}}</span>
            </template>
            <template v-slot:time="{row}">
                {{/00:00:00$/.test(row.beginDate) ? row.beginDate.slice(0, 10) : row.beginDate}} 到
                {{/00:00:00$/.test(row.endDate) ? row.endDate.slice(0, 10) : row.endDate}} 
            </template>
            <template v-slot:status="{row}">
                <el-tag size="mini" :type="row.status | filterStatus('type')">
                    {{row.status | filterStatus }}
                </el-tag>
            </template>
            <template v-slot:ratio="{row}">
                <span>{{row.success}}/{{row.total}}</span>
            </template>
            <template v-slot:noAssign="{row}">
                <span>{{row.total - row.assign}}</span>
            </template>
            <template v-slot:handle="{row}">
                <el-button 
                    :size="size" 
                    type="text"
                    @click="customerFunc(row.id)">客户管理</el-button>
                <!-- <el-button 
                    v-if="row.project.type == 1"
                    :size="size" 
                    type="text"
                    @click="assignFunc(row.id)">分配</el-button> -->
                <el-button 
                    :size="size" 
                    type="text"
                    @click="historyFunc(row.id)">呼叫历史</el-button>
                <el-button 
                    v-if="row.status==1 || row.status==4"
                    :size="size" 
                    type="text"
                    @click="editStatus(row.id, 2)">结束</el-button>
                <el-button 
                    v-if="row.status==2 || row.status==4"
                    :size="size" 
                    type="text"
                    @click="editStatus(row.id, 1)">开始</el-button>
                <el-button 
                    v-if="row.status==1"
                    :size="size" 
                    type="text"
                    @click="editStatus(row.id, 4)">暂停</el-button>
            </template>
        </om-table>

        <el-dialog class="" :title="operation?'新增':'编辑'" width="60%"  :visible.sync="dialogVisible" :close-on-click-modal="false">
            
            <el-form label-width="100px" size="small" :model="editDataForm" :rules="rules" ref="editDataForm">
                <el-form-item label="任务名称" prop="name">
                    <el-input v-model="editDataForm.name"  placeholder="请输入任务名称"></el-input>
                </el-form-item>
                <el-form-item label="任务状态">
                    <el-radio-group v-model="editDataForm.status">
                        <el-radio-button label="0">未开始</el-radio-button>
                        <el-radio-button label="1">进行中</el-radio-button>
                        <el-radio-button label="4">已暂停</el-radio-button>
                        <el-radio-button label="2">已完成</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                
                <el-form-item label="任务周期">
                    <el-date-picker v-model="editDataForm.beginDate"
                                    type="date" format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    placeholder="开始日期"/>
                    至
                    <el-date-picker v-model="editDataForm.endDate"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    placeholder="截止日期"/>
                </el-form-item>

                <el-form-item label="拨打时段">
                    <el-checkbox v-model="weekday" :label="1">周一</el-checkbox>
                    <el-checkbox v-model="weekday" :label="2">周二</el-checkbox>
                    <el-checkbox v-model="weekday" :label="3">周三</el-checkbox>
                    <el-checkbox v-model="weekday" :label="4">周四</el-checkbox>
                    <el-checkbox v-model="weekday" :label="5">周五</el-checkbox>
                    <el-checkbox v-model="weekday" :label="6">周六</el-checkbox>
                    <el-checkbox v-model="weekday" :label="7">周日</el-checkbox>
                </el-form-item>

                <el-form-item>
                    <el-time-select
                        :picker-options="{start: '00:00',step: '00:15',end: '24:00',format:'HH:mm'}"
                        v-model="editDataForm.beginTime"
                        placeholder="开始时间"
                        style="width: 50%;float:left;"
                    />
                    <el-time-select
                        :picker-options="{start: '00:00',step: '00:15',end: '24:00',format:'HH:mm'}"
                        v-model="editDataForm.endTime"
                        placeholder="结束时间"
                        style="width: 50%;float:left;"
                    />
                </el-form-item>

                <el-form-item label="选择账号">
                    <el-select multiple v-model="editDataForm.memberArray">
                        <el-option v-for="i in acountList"
                            :key="i.id"
                            :label="i.name"
                            :value="i.id"></el-option>
                    </el-select>
                    <!-- <el-select v-model="extAll" style="width:100%">
                        <el-option v-for="i in queryAllExt" 
                            :key="i.extId"
                            :label="i.extId"
                            :value="i.extId"></el-option>
                    </el-select> -->
                </el-form-item>

                <el-form-item label="备注">
                    <el-input type="textarea" v-model="editDataForm.remark"></el-input>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click.native="submitForm" :loading="editLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {pageTask} from "@/mock/modules/pageTask"
import OmTable from "@/components/omTable"
import omSelect from "@/components/omSelect"
import util from "@/utils/util"
import {mapActions, mapState} from 'vuex'
export default {
    components: {
        OmTable,
        omSelect
    },
    data(){
        return {
            weekday: [1, 2, 3, 4, 5],
            param: 1,
            dayArray: [],
            rules: {
                title: [
                    {required: true, message: '请输入', trigger: 'blur'},
                ], required: [
                    {required: true, message: '请输入', trigger: 'blur'},
                ], questionType: [
                    {required: true, message: '请输入', trigger: 'blur'},
                ],
            },
            
            filterColumns: [],
            handleWidth: 400,
            columns: [],
            timeRange: [],
            pageRequest: { pageNum: 1, pageSize: 15 },
            size: 'mini',
            operation: false, // true:新增, false:编辑
            dialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            dataFormRules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				]
            },
            
            // 新增编辑界面数据
            editDataForm: {
                status: "0"
            },
            amTitle: '',
            extAll: '',
            acountList: []
        }
    },
    filters:{
        filterStatus(val, type){
            
            if(val == 0) return type ? '' : '未开始' 
            if(val == 1) return type ? 'success' : '进行中'
            if(val == 2) return type ? 'warning' : '已完成'
            if(val == 4) return type ? 'info' : '已暂停'
            return '';
        }
    },
    mounted(){
        this.initColumns();
        this.projectAll();

        this.$api.user.findAll().then(res => {
			this.acountList = res.data;
		})
    },
    computed:{
        ...mapState('task', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
        }),
        ...mapState({
            selectProject: state=>state.taskProject.findAll,
            queryAllExt: state => state.queryAllExt,
        })
    },
    methods:{
        ...mapActions('task', ['findPage', 'findAll', 'save', 'delete']),
        ...mapActions('taskProject', {
            projectAll: 'findAll'
        }),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {

			this.columns = [
                {prop:"name", label:"任务名称", minWidth:100},
                /* {prop:"project", label:"所属项目", isSlot: true, minWidth:100}, */
                {prop:"time", label:"任务周期", isSlot: true, minWidth:100},
                {prop:"status", label:"状态", isSlot: true, minWidth:100},

                {prop:"ratio", label:"已完成/总数", isSlot: true, minWidth:100},
                /* {prop:"noAssign", label:"未分配", isSlot: true, minWidth:100}, */
                
            ]
            this.filterColumns = this.columns
      	},

        // 批量删除
		handleDelete(data) {
            this.delete(data.params).then(data!=null?data.callback:'')
        },

        // 获取分页数据
		findPageFunc(data) {
            /* this.dataResp = pageTask()
            data.callback() */

			if(data !== null) {
				this.pageRequest = data.pageRequest
            }
            this.dataForm.type = 2  // type：2 为自动外呼
			this.findPage(this.pageRequest).then((res) => {

			}).then(data!=null?data.callback:'')
        },
        // 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.editDataForm = {
				id: null,
				title: null,
				remark: null,
				status: 0,
			}
        },
        // 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
            this.operation = false
            let member = params.row.memberArray
            member && (params.row.memberArray = JSON.parse(member))
			this.editDataForm = Object.assign({}, params.row)
        },
        // 编辑
		submitForm: function () {
			this.$refs.editDataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.editDataForm)
                        params.type = 2 // 2为自动外呼
                        params.memberArray = JSON.stringify(params.memberArray)
						this.save(params).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['editDataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.findPageFunc(null)
						})
					})
				}
			})
        },
        
        customerFunc(taskId){
            this.$router.push({path:'/marketingTask/taskCustomer', query:{taskId}})
        },
        assignFunc(){},
        historyFunc(){},
        editStatus(row, status) {
            api.editTask(Object.assign(row, {status}))
                .then(this.pageTaskClick).catch(util.error)
        },

        removeAnswerFunc(answer, index, answerList) {
            // 无
            return;
            api.removeAnswer(answer).then(() => {
                answerList.splice(index, 1)
            })

        },
        addQuestFunc: function () {
            let that = this
            api.editQuestion({
                'groupId': that.$store.state.editQuestionGroupForm.id
            }).then(function (resp) {
                let list = that.$store.state.editQuestionGroupForm.questionList;

                if (!list) {
                    list = []
                    Vue.set(that.$store.state.editQuestionGroupForm, 'questionList', list)

                }
                let data = resp.data;

                Vue.set(data, 'questionType', 0)
                Vue.set(data, 'required', 0)
                list.push(data)
                that.$store.state.editQuestionForm = data

            })
        },
        addAnswerFunc: function (l) {
            console.log('addAnswerFunc', l)
            // 无
            return;
            api.editAnswer({
                questionId: l.id
            }).then(function (resp) {
                let list = l.answerList;

                if (!list) {
                    list = []
                    Vue.set(l, 'answerList', list)
                }
                console.log('list = ', list, resp.data)
                list.push(resp.data)
            })
        },
        removeQuestionFunc: function (listQuestion, index) {
            let that = this
            api.removeQuestion({
                'id': listQuestion.id
            }).then(function (resp) {
                that.$store.state.editQuestionGroupForm.questionList.splice(index, 1);
            })
        },
        removeQuestionGroupFunc: function (q) {
            var that = this;
            console.error('removeQuestionGroupFunc', q)
            if (that.$store.state.editQuestionGroupForm.newId > 0) {
                api.removeQuestionGroup({
                    id: q.id
                }).then(function (resp) {
                    that.pageQuestionGroupClick();
                }).catch(util.error)
            }
        },
        editQuestionGroupFunc: function (questionGroup, questionList) {
            let that = this;
            //提交问题
            for (let i in questionList) {
                if (questionList[i].title.indexOf(".") !== -1) {
                    alert(questionList[i].title + " 包含非法字符 ' . '")
                    return
                }

                api.editQuestion(questionList[i]);
                //提交答案
                let answerListTemp = questionList[i].answerList;
                for (let j in answerListTemp) {
                    api.editAnswer(answerListTemp[j]);
                }
            }
            //提交问卷
            api.editQuestionGroup(this.$store.state.editQuestionGroupForm)
                .then((res) => {
                    that.pageQuestionGroupClick();
                    that.$store.state.editQuestionGroupVisible = false
                }).catch(util.error)

        }
    }
}
</script>

<style lang="scss" scoped>


</style>
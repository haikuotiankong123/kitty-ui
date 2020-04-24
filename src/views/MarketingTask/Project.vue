<template>
    <div class="table-container">
        <div class="query-container">
            <el-form :inline="true" size="mini">
                <el-form-item label="电话号码">
                    <el-input v-model="dataForm.phone" placeholder="请输入电话号码"></el-input>
                </el-form-item>

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
            <template v-slot:ratio="{row}">
                <span>{{row.success}}/{{row.total}}</span>
            </template>
            <template v-slot:time="{row}">
                <span>{{row.beginTime}}-{{row.endTime}}</span>
            </template>
            <template v-slot:status="{row}">
                <el-tag size="mini" :type="row.status | status('type')">
                    {{row.status | status }}
                </el-tag>
            </template>
            <template v-slot:handle="{row}">
                <el-button 
                    :size="size" 
                    type="text"
                    @click="taskFunc(row)">任务管理</el-button>
                <el-button 
                    :size="size" 
                    type="text"
                    @click="setFunc(row)">流程设置</el-button>
            </template>
        </om-table>

        <!--新增编辑界面-->
        <el-dialog class="" :title="operation?'新增':'编辑'" width="90%"  :visible.sync="dialogVisible" :close-on-click-modal="false">
            
            <div class="col-two">
                <el-form label-width="100px" size="small" :model="editDataForm" :rules="rules">
                    <el-form-item label="项目标题" prop="name">
                        <el-input v-model="editDataForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="问卷模板">
                        <!-- <ag-select v-model="editDataForm.questionGroupId"
                                    :data="$store.state.listQuestionGroup"></ag-select> -->
                    </el-form-item>
                    <el-form-item label="项目整理模板">
                        <!-- <ag-select v-model="editDataForm.messageGroupId"
                                    :data="$store.state.listMessageGruop"></ag-select> -->
                    </el-form-item>

                    <el-form-item label="拨打设置">

                        <el-select v-model="editDataForm.type" placeholder="请选择">
                            <el-option key="1" label="人工" :value=1></el-option>
                            <el-option key="2" label="机器" :value=2></el-option>
                            <el-option key="0" label="未设置" :value=0></el-option>
                        </el-select>

                    </el-form-item>

                    <el-form-item label="TTS语速">
                        <el-slider size="mini" v-model="editDataForm.ttsSpeed"></el-slider>
                    </el-form-item>

                    <el-form-item label="TTS语调">
                        <el-slider size="mini" v-model="editDataForm.ttsPitch"></el-slider>
                    </el-form-item>

                </el-form>
            </div>

            <div class="col-two">
                <el-form label-width="100px" size="small" :model="editDataForm" :rules="rules">

                    <el-form-item label="拨打时段">
                        <el-checkbox v-model="dayArray" :label="1">周一</el-checkbox>
                        <el-checkbox v-model="dayArray" :label="2">周二</el-checkbox>
                        <el-checkbox v-model="dayArray" :label="3">周三</el-checkbox>
                        <el-checkbox v-model="dayArray" :label="4">周四</el-checkbox>
                        <el-checkbox v-model="dayArray" :label="5">周五</el-checkbox>
                        <el-checkbox v-model="dayArray" :label="6">周六</el-checkbox>
                        <el-checkbox v-model="dayArray" :label="7">周日</el-checkbox>

                    </el-form-item>

                    <el-form-item>
                        <el-time-select :picker-options="{start: '00:00',step: '00:15',end: '24:00',format:'HH:mm'}"
                                        v-model="editDataForm.beginTime" placeholder="开始时间"
                                        style="width: 50%;float:left;"/>
                        <el-time-select :picker-options="{start: '00:00',step: '00:15',end: '24:00',format:'HH:mm'}"
                                        v-model="editDataForm.endTime" placeholder="结束时间"
                                        style="width: 50%;float:left;"/>
                    </el-form-item>
                    <el-form-item label="项目状态">
                        <el-radio-group v-model="editDataForm.status">
                            <el-radio-button label="0">未开始</el-radio-button>
                            <el-radio-button label="1">进行中</el-radio-button>
                            <el-radio-button label="2">已完成</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" v-model="editDataForm.remark"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click.native="submitForm" :loading="editLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {pageProject} from "@/mock/modules/pageProject"
import OmTable from "@/components/omTable"
import util from "@/utils/util"
import {mapActions, mapState} from 'vuex'
export default {
    components: {
        OmTable
    },
    data(){
        return {
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
            dataResp:{
                content: []
            },
            dataForm:{},

            filterColumns: [],
            handleWidth: 300,
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
			editDataForm: {}
        }
    },
    filters:{
        status(val, type){
            
            if(val == 0) return type ? '' : '未发布' 
            if(val == 1) return type ? 'success' : '使用中'
            if(val == 2) return type ? 'error' : '已取消'
            return '';
        }
    },
    mounted(){
        this.initColumns();
        
    },
    computed:{
        /* ...mapState('omBlacklist', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
        }) */
    },
    methods:{
        //...mapActions('omBlacklist', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                {prop:"name", label:"项目标题", minWidth:100},
                {prop:"questionGroupName", label:"问卷模板", minWidth:100},
                {prop:"messageGroupName", label:"项目整理模板", minWidth:100},

                {prop:"ratio", label:"进行中/总数", isSlot: true, minWidth:100},
                {prop:"time", label:"拨打时段", isSlot: true, minWidth:100},
                {prop:"status", label:"状态", isSlot: true, minWidth:100}
            ]
            this.filterColumns = this.columns
      	},

        // 批量删除
		handleDelete(data) {
            //this.delete(data.params).then(data!=null?data.callback:'')
        },

        // 获取分页数据
		findPageFunc(data) {
            this.dataResp = pageProject()
            data.callback()

			/* if(data !== null) {
				this.pageRequest = data.pageRequest
            }

			this.findPage(this.pageRequest).then((res) => {

			}).then(data!=null?data.callback:'') */
        },
        // 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.editDataForm = {
				id: null,
				title: null,
				remark: null,
				status: null
			}
        },
        // 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.editDataForm = Object.assign({}, params.row)
        },
        // 编辑
		submitForm: function () {
			this.$refs.editDataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.editDataForm)

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
        
        taskFunc(){},
        setFunc(){},


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
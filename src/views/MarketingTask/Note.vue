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
            @findPage="findPageFunc"
            @handleDelete="handleDelete"
            @handleEdit="handleEdit">
            <template v-slot:status="{row}">
                <el-tag size="mini" :type="row.status | status('type')">
                    {{row.status | status }}
                </el-tag>
            </template>
        </om-table>

        <!--新增编辑界面-->
        <el-dialog class="" :title="operation?'新增':'编辑'" width="600px"  :visible.sync="dialogVisible" :close-on-click-modal="false">
            
            <el-form :model="editDataForm" label-width="110px" v-if="dialogVisible" ref="editDataForm" :size="size"
                label-position="right">

                <el-form-item label="模板名称" prop="title" >
                    <el-input v-model="editDataForm.title" ></el-input>
                </el-form-item>
                <el-form-item label="模板说明" prop="remark" >
                    <el-input v-model="editDataForm.remark" ></el-input>
                </el-form-item>
                
                <el-form-item label="模板状态" prop="status" >
                    <el-input v-model="editDataForm.status" ></el-input>
                </el-form-item>
            
            </el-form>

            <div class="question-list" v-if="editDataForm.id >0">
                <div v-for="(list,index) in editDataForm.msgTemplate" :key="index" class="question-item">
                    <el-button title="删除沟通结果" 
                        @click="removeFunc(list.id, index)"
                        class="del icon-wrong icons"
                        type="text"></el-button>

                    <el-form label-width="100px" :size="size" class="msg">
                        <el-form-item label="快捷方式">
                        <el-radio-group v-model="list.flag" :size="size">
                                <el-radio-button label="1">是</el-radio-button>
                                <el-radio-button label="2">否</el-radio-button>
                        </el-radio-group>
                        </el-form-item>
                        <el-form-item label="沟通结果">
                            <el-input v-model="list.resultText" style="width:80%"> </el-input>
                        </el-form-item>
                        <el-form-item label="话务整理模版">
                            <el-input v-model="list.content" style="width:80%" type="textarea"> </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <el-button @click="addMsgTemplate()" size="small" type="text">+ 添加沟通结果</el-button>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click.native="submitForm" :loading="editLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {pageMsg} from "@/mock/modules/pageMsg"

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
            if(val == 0) return type ? '' : '未发布' ;
            if(val == 1) return type ? 'success' : '使用中'
            if(val == 2) return type ? 'error' : '已停用'
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
                {prop:"title", label:"模板名称", minWidth:100},
                {prop:"createTime", label:"创建时间", minWidth:100},
                {prop:"remark", label:"模板说明", minWidth:100},
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
            
            this.dataResp = pageMsg()
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

        },
        //删除结果
        removeFunc: function (id, index) {

            util.confirm('确定删除?', () => {
                api.removeMsgTemplate({id})
                    .then((res) => {
                        this.$store.state.editMsgForm.msgTemplate.splice(index, 1);
                    }).catch(util.error)
            })
        },
        //添加结果
        addMsgTemplate: function () {
            let msgTemplate = {
                groupId: this.$store.state.editMsgForm.id,
                flag: 1
            };
            this.$store.state.editMsgForm.msgTemplate.push(msgTemplate);
        },
    }
}
</script>

<style lang="scss" scoped>
.question-list{
    .question-item{
        background: #f5f5f5;
        padding: 15px 10px 0 10px;
        margin-bottom: 10px;
        position: relative;
        .del{
            position: absolute;
            top: 0;
            right: 10px;
            font-size: 16px;
            z-index: 2;
        }
    }
    .right{
        float: right;
    }
}

</style>
<template>
    <div>

        <h1>问卷管理</h1>
        <el-button @click="temp"> 显示</el-button>

        <el-dialog :visible.sync="visible" top="5vh">

			<span slot="title">
					<i class="icon iconfont icon-bianji"></i>
					<span>编辑问卷模板  <p class="edit-dialog">添加/编辑问卷模板信息，包含模板名称、状态及问题与答案信息 </p></span>
			</span>

            <div>
                <div>
                    <el-form label-width="100px" :model="editDataForm" :rules="rules">
                        <el-form-item label="模板名称" prop="title">
                            <el-input v-model="editDataForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="模板状态">
                            <el-radio-group v-model="editDataForm.status" size="small">
                                <el-radio-button label=0>未发布</el-radio-button>
                                <el-radio-button label=1>使用中</el-radio-button>
                                <el-radio-button label=2>已取消</el-radio-button>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="模板说明">
                            <el-input v-model="editDataForm.remark"
                                      type="textarea"
                                      :rows="2"></el-input>
                        </el-form-item>
                    </el-form>
                </div>

                <div class="question-list">
                    <div v-for="(item,index) in editDataForm.questionList"
                         :key="item.id"
                         style="margin-top: 10px">
                        <el-form label-width="100px" size="small" :model="item" :rules="rules" ref="item">
                            <div>
                                <label>第 {{index+1}} 题</label>
                                <a class="right del" @click="removeQuestionFunc(item,index)">- 删除问题</a>
                            </div>

                            <el-form-item label="题目描述" prop="title" required>
                                <el-input v-model="item.title"></el-input>
                            </el-form-item>
                            <el-form-item label="是否必填" prop="required" required>
                                <el-radio-group v-model="item.required" prop="required" size="small">
                                    <el-radio-button label="0">是</el-radio-button>
                                    <el-radio-button label="1">否</el-radio-button>
                                </el-radio-group>
                            </el-form-item>

                            <el-form-item label="问题类型" prop="questionType" required>
                                <el-radio-group v-model="item.questionType" size="small">
                                    <el-radio-button :label="0">单选</el-radio-button>
                                    <el-radio-button :label="1">文本</el-radio-button>
                                </el-radio-group>
                            </el-form-item>

                            <el-radio-group v-if="item.questionType === 0"
                                            v-for="(itemAnswer,indexAnswer) in item.answerList"
                                            :key="itemAnswer.id" v-model="item.answerId" style="display: block">

                                <el-form-item>
                                    <template slot="label">
                                        答案 {{indexAnswer + 1}}
                                    </template>
                                    <input v-model="itemAnswer.text" class="answer"/>
                                    <label class="">
                                        <el-radio :label="itemAnswer.id">正确答案</el-radio>
                                    </label>
                                    <a class="right del"
                                       @click="removeAnswerFunc(itemAnswer,indexAnswer,item.answerList)">- 删除答案</a>
                                </el-form-item>
                            </el-radio-group>

                            <div v-if="item.questionType === 0">
                                <a @click="addAnswerFunc(item)">+ 添加答案</a>
                            </div>

                        </el-form>

                    </div>
                </div>

                <div v-show="editDataForm.id > 0">
                    <a @click="addQuestFunc">+ 添加问题</a>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
				<button
                        @click="$store.state.editQuestionGroupVisible=false;removeQuestionGroupFunc(editDataForm)"
                        class="cancel">取 消</button>
				<button
                        @click="editQuestionGroupFunc(editDataForm,editDataForm.questionList)"
                        class="sure">确 定</button>
			</span>
        </el-dialog>

    </div>
    
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            editDataForm: {},

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
        }
    },
    components: {
        headTop
    },
    computed: {
        
    },
    mounted: function () {
        //this.listDictionaryClick();
        //this.pageQuestionGroupClick();
    },
    methods: {
        temp(){
            this.visible = true
        },



        
        editQuestionGroupClick: function () {
            let that = this;
            api.editQuestionGroup(this.editDataForm)
                .then(function (res) {
                    that.$store.state.editQuestionGroupVisible = false
                    that.pageQuestionGroupClick();
                }).catch(util.error)
        },
        remove: function (id) {
            var that = this;
            util.confirm('确定删除?', function () {
                api.removeQuestionGroup({
                    id
                })
                    .then(function (res) {
                        that.pageQuestionGroupClick();
                    }).catch(util.error)
            })
        },
        removeAnswerFunc(answer, index, answerList) {

            api.removeAnswer(answer).then(() => {
                answerList.splice(index, 1)
            })

        },
        addQuestFunc: function () {
            let that = this
            api.editQuestion({
                'groupId': that.editDataForm.id
            }).then(function (resp) {
                let list = that.editDataForm.questionList;

                if (!list) {
                    list = []
                    Vue.set(that.editDataForm, 'questionList', list)

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
                that.editDataForm.questionList.splice(index, 1);
            })
        },
        removeQuestionGroupFunc: function (q) {
            var that = this;
            console.error('removeQuestionGroupFunc', q)
            if (that.editDataForm.newId > 0) {
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
            api.editQuestionGroup(this.editDataForm)
                .then((res) => {
                    that.pageQuestionGroupClick();
                    that.$store.state.editQuestionGroupVisible = false
                }).catch(util.error)

        }
    }
}
</script>

<style>

</style>
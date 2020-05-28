<template>
    <div class="table-container">
        <div class="query-container">
            <el-form :inline="true" size="mini">
                <el-form-item label="语音文件名称">
                    <el-input v-model="dataForm.voiceName" placeholder="请输入语音文件名称"></el-input>
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
            <!-- <template v-slot:handle="{scope}"></template> -->
        </om-table>

        <!--新增编辑界面-->
        <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editDataForm" label-width="120px" v-if="dialogVisible" :rules="dataFormRules" ref="editDataForm" :size="size"
                label-position="right">
                <el-form-item label="语音文件名称" prop="voiceName">
                    <el-input v-model="editDataForm.voiceName" auto-complete="off" placeholder="请输入语音文件名称"></el-input>
                </el-form-item>
                <el-form-item label="语音文件描述" prop="voiceDesp">
                    <el-input v-model="editDataForm.voiceDesp" auto-complete="off" placeholder="请输入语音文件描述"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click.native="dialogVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click.native="submitForm" :loading="editLoading">提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import OmTable from "@/components/omTable"
import util from "@/utils/util"
import {mapActions, mapState} from 'vuex'
export default {
    components: {
        OmTable
    },
    data(){
        return {
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
			editDataForm: {
                phone: '',
                remark: ''
			},
        }
    },
    mounted(){
        this.initColumns();
    },
    computed:{
        ...mapState('omVoicefile', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
        })
    },
    methods:{
        ...mapActions('omVoicefile', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                {prop:"voiceName", label:"语音文件名称", minWidth:100},
                {prop:"voiceDesp", label:"语音文件描述", minWidth:100},
            ]
            this.filterColumns = this.columns
      	},

        // 批量删除
		async handleDelete(data) {
            let voicefile = data.row.voiceName;
            
            if(!voicefile) return '无语音文件'

            let result = await this.$api.removeVoicefile({voicefile}).catch(err => util.error(err.message))
            if(result.success) this.delete(data.params).then(data!=null?data.callback:'')
        },

        // 获取分页数据
		findPageFunc(data) {

			if(data !== null) {
				this.pageRequest = data.pageRequest
            }

            //this.$store.state.omVoicefile.dataForm.createTimeStart = util.dateFormat(this.timeRange[0], "yyyy-MM-dd HH:mm:ss")
            //this.$store.state.omVoicefile.dataForm.createTimeEnd = util.dateFormat(this.timeRange[1], "yyyy-MM-dd HH:mm:ss")
            
			this.findPage(this.pageRequest).then((res) => {

			}).then(data!=null?data.callback:'')
        },
        // 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.editDataForm = {
                voiceName: '',
                voiceDesp: ''
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
		}
    }
}
</script>

<style>

</style>
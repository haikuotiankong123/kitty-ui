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
            <!-- <template v-slot:handle="{scope}"></template> -->
        </om-table>

        <!--新增编辑界面-->
        <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editDataForm" label-width="80px" v-if="dialogVisible" :rules="dataFormRules" ref="editDataForm" :size="size"
                label-position="right">

			<el-form-item label="" prop="id" >
				<el-input v-model="editDataForm.id" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="companyId" >
				<el-input v-model="editDataForm.companyId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="label" >
				<el-input v-model="editDataForm.label" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="1文本 2数字 3日期 4枚举单选 5枚举多选" prop="type" >
				<el-input v-model="editDataForm.type" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="1启用 2禁用" prop="status" >
				<el-input v-model="editDataForm.status" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="1必填 0非必填" prop="isRequired" >
				<el-input v-model="editDataForm.isRequired" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="json枚举数据{1:'a'}" prop="jsonData" >
				<el-input v-model="editDataForm.jsonData" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="remark" >
				<el-input v-model="editDataForm.remark" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="默认值" prop="jsonValue" >
				<el-input v-model="editDataForm.jsonValue" auto-complete="off"></el-input>
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
				id: null,
				companyId: null,
				label: null,
				type: null,
				status: null,
				isRequired: null,
				jsonData: null,
				remark: null,
				jsonValue: null,
			},
        }
    },
    mounted(){
        this.initColumns();
    },
    computed:{
        ...mapState('usrCustomerConfig', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
        })
    },
    methods:{
        ...mapActions('usrCustomerConfig', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                {prop:"id", label:"", minWidth:100},
                {prop:"companyId", label:"", minWidth:100},
                {prop:"label", label:"", minWidth:100},
                {prop:"type", label:"1文本 2数字 3日期 4枚举单选 5枚举多选", minWidth:100},
                {prop:"status", label:"1启用 2禁用", minWidth:100},
                {prop:"isRequired", label:"1必填 0非必填", minWidth:100},
                {prop:"jsonData", label:"json枚举数据{1:'a'}", minWidth:100},
                {prop:"remark", label:"", minWidth:100},
                {prop:"jsonValue", label:"默认值", minWidth:100},
            ]
            this.filterColumns = this.columns
      	},

        // 批量删除
		handleDelete(data) {

            this.delete(data.params).then(data!=null?data.callback:'')
        },

        // 获取分页数据
		findPageFunc(data) {

			if(data !== null) {
				this.pageRequest = data.pageRequest
            }

            //this.$store.state.omBlacklist.dataForm.createTimeStart = util.dateFormat(this.timeRange[0], "yyyy-MM-dd HH:mm:ss")
            //this.$store.state.omBlacklist.dataForm.createTimeEnd = util.dateFormat(this.timeRange[1], "yyyy-MM-dd HH:mm:ss")

			this.findPage(this.pageRequest).then((res) => {

			}).then(data!=null?data.callback:'')
        },
        // 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.editDataForm = {
				id: null,
				companyId: null,
				label: null,
				type: null,
				status: null,
				isRequired: null,
				jsonData: null,
				remark: null,
				jsonValue: null,
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
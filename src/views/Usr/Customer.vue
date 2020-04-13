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

			<el-form-item label="编号" prop="id" >
				<el-input v-model="editDataForm.id" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="客户名称" prop="name" >
				<el-input v-model="editDataForm.name" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="电话号码" prop="phone" >
				<el-input v-model="editDataForm.phone" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="代理商" prop="gender" >
				<el-input v-model="editDataForm.gender" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="result" >
				<el-input v-model="editDataForm.result" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark" >
				<el-input v-model="editDataForm.remark" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="createId" >
				<el-input v-model="editDataForm.createId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="createTime" >
				<el-input v-model="editDataForm.createTime" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="所属公司" prop="companyId" >
				<el-input v-model="editDataForm.companyId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="动态字段1" prop="a1" >
				<el-input v-model="editDataForm.a1" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="动态字段2" prop="a2" >
				<el-input v-model="editDataForm.a2" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="a3" >
				<el-input v-model="editDataForm.a3" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="a4" >
				<el-input v-model="editDataForm.a4" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="a5" >
				<el-input v-model="editDataForm.a5" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="a6" >
				<el-input v-model="editDataForm.a6" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="a7" >
				<el-input v-model="editDataForm.a7" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="a8" >
				<el-input v-model="editDataForm.a8" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="a9" >
				<el-input v-model="editDataForm.a9" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="a10" >
				<el-input v-model="editDataForm.a10" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="uuid" >
				<el-input v-model="editDataForm.uuid" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="省份" prop="province" >
				<el-input v-model="editDataForm.province" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="城市" prop="city" >
				<el-input v-model="editDataForm.city" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="区" prop="area" >
				<el-input v-model="editDataForm.area" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="地址" prop="address" >
				<el-input v-model="editDataForm.address" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="客户类型，1：正式客户，2：任务客户" prop="type" >
				<el-input v-model="editDataForm.type" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="任务编号" prop="taskId" >
				<el-input v-model="editDataForm.taskId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="用于机器流程标记" prop="flag" >
				<el-input v-model="editDataForm.flag" auto-complete="off"></el-input>
			</el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
                <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">提交</el-button>
            </div>
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
				name: null,
				phone: null,
				gender: null,
				result: null,
				remark: null,
				createId: null,
				createTime: null,
				companyId: null,
				a1: null,
				a2: null,
				a3: null,
				a4: null,
				a5: null,
				a6: null,
				a7: null,
				a8: null,
				a9: null,
				a10: null,
				uuid: null,
				province: null,
				city: null,
				area: null,
				address: null,
				type: null,
				taskId: null,
				flag: null,
			},
        }
    },
    mounted(){
        this.initColumns();
    },
    computed:{
        ...mapState('usrCustomer', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
        })
    },
    methods:{
        ...mapActions('usrCustomer', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                {prop:"id", label:"编号", minWidth:100},
                {prop:"name", label:"客户名称", minWidth:100},
                {prop:"phone", label:"电话号码", minWidth:100},
                {prop:"gender", label:"代理商", minWidth:100},
                {prop:"result", label:"", minWidth:100},
                {prop:"remark", label:"备注", minWidth:100},
                {prop:"createId", label:"", minWidth:100},
                {prop:"createTime", label:"", minWidth:100},
                {prop:"companyId", label:"所属公司", minWidth:100},
                {prop:"a1", label:"动态字段1", minWidth:100},
                {prop:"a2", label:"动态字段2", minWidth:100},
                {prop:"a3", label:"", minWidth:100},
                {prop:"a4", label:"", minWidth:100},
                {prop:"a5", label:"", minWidth:100},
                {prop:"a6", label:"", minWidth:100},
                {prop:"a7", label:"", minWidth:100},
                {prop:"a8", label:"", minWidth:100},
                {prop:"a9", label:"", minWidth:100},
                {prop:"a10", label:"", minWidth:100},
                {prop:"uuid", label:"", minWidth:100},
                {prop:"province", label:"省份", minWidth:100},
                {prop:"city", label:"城市", minWidth:100},
                {prop:"area", label:"区", minWidth:100},
                {prop:"address", label:"地址", minWidth:100},
                {prop:"type", label:"客户类型，1：正式客户，2：任务客户", minWidth:100},
                {prop:"taskId", label:"任务编号", minWidth:100},
                {prop:"flag", label:"用于机器流程标记", minWidth:100},
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
				name: null,
				phone: null,
				gender: null,
				result: null,
				remark: null,
				createId: null,
				createTime: null,
				companyId: null,
				a1: null,
				a2: null,
				a3: null,
				a4: null,
				a5: null,
				a6: null,
				a7: null,
				a8: null,
				a9: null,
				a10: null,
				uuid: null,
				province: null,
				city: null,
				area: null,
				address: null,
				type: null,
				taskId: null,
				flag: null,
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
.query-container{
    padding-top:10px;padding-left:15px;
}
</style>
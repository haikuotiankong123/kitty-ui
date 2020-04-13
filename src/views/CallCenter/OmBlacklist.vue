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
            <template v-slot:type="{row}">
                {{row.type | valToName(type)}}
            </template>
            <template v-slot:state="{row}">
                {{row.state | valToName(state)}}
            </template>
            <!-- <template v-slot:handle="{scope}"></template> -->
        </om-table>

        <!--新增编辑界面-->
        <el-dialog class="" :title="operation?'新增':'编辑'" width="50%"  :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editDataForm" label-width="110px" v-if="dialogVisible" :rules="dataFormRules" ref="editDataForm" :size="size"
                label-position="right">

			<el-form-item label="电话号码" prop="phone" >
				<el-input v-model="editDataForm.phone" ></el-input>
			</el-form-item>
			<el-form-item label="描述" prop="remark" >
				<el-input v-model="editDataForm.remark" ></el-input>
			</el-form-item>
            <!-- ，1：来电，2：去电 -->
			<el-form-item label="黑名单类型" prop="type" >
				<el-input v-model="editDataForm.type" ></el-input>
			</el-form-item>
            <!-- ，1：生效，2：失效 -->
			<el-form-item label="状态" prop="state" >
				<el-input v-model="editDataForm.state" ></el-input>
			</el-form-item>
			<!-- <el-form-item label="创建人" prop="createBy" >
				<el-input v-model="editDataForm.createBy" ></el-input>
			</el-form-item>
			<el-form-item label="修改人" prop="lastUpdateBy" >
				<el-input v-model="editDataForm.lastUpdateBy" ></el-input>
			</el-form-item> -->

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click.native="submitForm" :loading="editLoading">确 定</el-button>
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
            type: [
                {value: '1', label: '来电'},
                {value: '2', label: '去电'}
            ],
            state: [
                {value: '1', label: '生效'},
                {value: '2', label: '失效'}
            ],
            // 新增编辑界面数据
			editDataForm: {
				id: null,
				phone: null,
				remark: null,
				type: null,
				state: null,
				createBy: null,
				createTime: null,
				lastUpdateBy: null,
				lastUpdateTime: null,
            }
        }
    },
    mounted(){
        this.initColumns();
    },
    computed:{
        ...mapState('omBlacklist', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
        })
    },
    methods:{
        ...mapActions('omBlacklist', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                {prop:"id", label:"编号", minWidth:100},
                {prop:"phone", label:"电话号码", minWidth:100},
                {prop:"remark", label:"描述", minWidth:100},
                {prop:"type", label:"黑名单类型", isSlot: true, minWidth:100},
                {prop:"state", label:"状态", isSlot: true, minWidth:100},
                {prop:"createBy", label:"创建人", minWidth:100},
/*                 {prop:"createTime", label:"创建时间", minWidth:100},
                {prop:"lastUpdateBy", label:"修改人", minWidth:100},
                {prop:"lastUpdateTime", label:"修改时间", minWidth:100}, */
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
				phone: null,
				remark: null,
				type: null,
				state: null,
				createBy: null,
				createTime: null,
				lastUpdateBy: null,
				lastUpdateTime: null,
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
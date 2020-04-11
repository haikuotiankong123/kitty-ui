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
			<el-form-item label="语音菜单编号" prop="menuId" >
				<el-input v-model="editDataForm.menuId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="语音菜单名称" prop="menuName" >
				<el-input v-model="editDataForm.menuName" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="语音菜单描述" prop="menuDesp" >
				<el-input v-model="editDataForm.menuDesp" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="语音文件" prop="voiceFile" >
				<el-input v-model="editDataForm.voiceFile" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="重复次数" prop="repeat" >
				<el-input v-model="editDataForm.repeat" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="是否直拨分机号" prop="direct" >
				<el-input v-model="editDataForm.direct" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="拨号检测长度" prop="infoLength" >
				<el-input v-model="editDataForm.infoLength" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="按键结束符" prop="exit" >
				<el-input v-model="editDataForm.exit" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="createBy" >
				<el-input v-model="editDataForm.createBy" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="createTime" >
				<el-input v-model="editDataForm.createTime" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="lastUpdateBy" >
				<el-input v-model="editDataForm.lastUpdateBy" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="" prop="lastUpdateTime" >
				<el-input v-model="editDataForm.lastUpdateTime" auto-complete="off"></el-input>
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
				menuId: null,
				menuName: null,
				menuDesp: null,
				voiceFile: null,
				repeat: null,
				direct: null,
				infoLength: null,
				exit: null,
				createBy: null,
				createTime: null,
				lastUpdateBy: null,
				lastUpdateTime: null,
			},
        }
    },
    mounted(){
        this.initColumns();
    },
    computed:{
        ...mapState('omMenu', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
        })
    },
    methods:{
        ...mapActions('omMenu', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                {prop:"id", label:"", minWidth:100},
                {prop:"menuId", label:"语音菜单编号", minWidth:100},
                {prop:"menuName", label:"语音菜单名称", minWidth:100},
                {prop:"menuDesp", label:"语音菜单描述", minWidth:100},
                {prop:"voiceFile", label:"语音文件", minWidth:100},
                {prop:"repeat", label:"重复次数", minWidth:100},
                {prop:"direct", label:"是否直拨分机号", minWidth:100},
                {prop:"infoLength", label:"拨号检测长度", minWidth:100},
                {prop:"exit", label:"按键结束符", minWidth:100},
                {prop:"createBy", label:"", minWidth:100},
                {prop:"createTime", label:"", minWidth:100},
                {prop:"lastUpdateBy", label:"", minWidth:100},
                {prop:"lastUpdateTime", label:"", minWidth:100},
            ]
            this.filterColumns = this.columns
            /* let showColumn = ['id', 'phone'] // 自定义显示表头
            this.filterColumns = showColumn.map(i => {
                    return this.columns.find(obj => obj.prop == i)
                }) */
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
				menuId: null,
				menuName: null,
				menuDesp: null,
				voiceFile: null,
				repeat: null,
				direct: null,
				infoLength: null,
				exit: null,
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
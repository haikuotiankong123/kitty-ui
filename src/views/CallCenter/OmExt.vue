<template>
    <div class="table-container">
        <div class="query-container">
            <el-form :inline="true" size="mini">
                <el-form-item label="分机号">
                    <el-input v-model="dataForm.extId" placeholder="请输入分机号"></el-input>
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
			<template v-slot:state="{row}">
				{{row.state | valToName(extState)}}
			</template>
            <!-- <template v-slot:handle="{row}"></template> -->
        </om-table>

        <!--新增编辑界面-->
        <el-dialog class="column-three" :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editDataForm" label-width="120px" v-if="dialogVisible" :rules="dataFormRules" ref="editDataForm" :size="size"
                label-position="right">

			<!-- <el-form-item label="编号" prop="id" >
				<el-input v-model="editDataForm.id" auto-complete="off"></el-input>
			</el-form-item> -->
			<el-form-item label="分机号" prop="extId" >
				<el-input v-model="editDataForm.extId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="线路编号" prop="lineid" >
				<el-input v-model="editDataForm.lineid" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="工号" prop="satffid" >
				<el-input v-model="editDataForm.satffid" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="分机组" prop="groups" >
				<el-input v-model="editDataForm.groups" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="排队语音文件" prop="voicefile" >
				<el-input v-model="editDataForm.voicefile" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="邮箱地址" prop="email" >
				<el-input v-model="editDataForm.email" auto-complete="off"></el-input>
			</el-form-item>
			
			<el-form-item label="代接权限" prop="callPickup" >
				<el-input v-model="editDataForm.callPickup" auto-complete="off"></el-input>
			</el-form-item>
			
			<el-form-item label="呼叫转移方式" prop="fwdType" >
				<el-select v-model="editDataForm.fwdType">
					<el-option v-for="(i) in fwdType"
						:key="i.value"
						:label="i.label"
						:value="i.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="呼叫转移号码" prop="fwdNumber" >
				<el-input v-model="editDataForm.fwdNumber" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="同振号码" prop="fork" >
				<el-input v-model="editDataForm.fork" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="手机号码" prop="mobile" >
				<el-input v-model="editDataForm.mobile" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="录音开关" prop="record" >
				<el-radio-group v-model="editDataForm.record">
					<el-radio-button label="on">开</el-radio-button>
					<el-radio-button label="off">关</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="api功能开关" prop="api" >
				<el-input v-model="editDataForm.api" auto-complete="off"></el-input>
			</el-form-item>
			<!-- <el-form-item label="线路状态" prop="state" >
				<el-input v-model="editDataForm.state" auto-complete="off"></el-input>
			</el-form-item> -->
			<el-form-item label="注册IP" prop="registerIp" >
				<el-input v-model="editDataForm.registerIp" auto-complete="off"></el-input>
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
			extState: [
                {
                    value:'Ready',
                    label: '空闲'
                },{
                    value:'Active',
                    label: '振铃'
                },{
                    value:'Progress',
                    label: '拨号中'
                },{
                    value:'Offline',
                    label: '离线'
                },{
                    value:'Offhook',
                    label: '听催挂音'
                }
			],
			fwdType: [
				{value: 0, label: '关闭'},
				{value: 1, label: '全转'},
				{value: 2, label: '遇忙或无应答转'}
			],
            dataFormRules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				]
			},
            // 新增编辑界面数据
			editDataForm: {
				id: null,
				extId: null,
				lineid: null,
				satffid: null,
				groups: null,
				voicefile: null,
				email: null,
				callRestriction: null,
				callPickup: null,
				noDisturb: null,
				fwdType: null,
				fwdNumber: null,
				fork: null,
				mobile: null,
				record: null,
				api: null,
				state: null,
				registerIp: null
			}
        }
	},
    mounted(){
        this.initColumns();
    },
    computed:{
        ...mapState('omExt', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
        })
    },
    methods:{
        ...mapActions('omExt', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                {prop:"id", label:"编号", minWidth:100},
				{prop:"extId", label:"分机号", minWidth:100},
				{prop:"state", label:"线路状态", minWidth:100, isSlot: true},
                {prop:"lineid", label:"线路编号", minWidth:100},
                {prop:"groups", label:"分机组", minWidth:100},
                {prop:"voicefile", label:"排队语音文件", minWidth:100},
                {prop:"noDisturb", label:"是否免打扰", minWidth:100},
                
				/* 
				{prop:"callRestriction", label:"呼叫权限", minWidth:100},
				{prop:"fwdType", label:"呼叫转移方式", minWidth:100},
                {prop:"fwdNumber", label:"呼叫转移号码", minWidth:100},
				{prop:"fork", label:"同振号码", minWidth:100},
                {prop:"mobile", label:"手机号码", minWidth:100},
				{prop:"satffid", label:"工号", minWidth:100},
				{prop:"email", label:"邮箱地址", minWidth:100},
				{prop:"callPickup", label:"代接权限", minWidth:100},
				{prop:"record", label:"录音开关", minWidth:100},
				{prop:"api", label:"api功能开关", minWidth:100},
                {prop:"registerIp", label:"注册IP", minWidth:100} */
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
				extId: null,
				lineid: null,
				satffid: null,
				groups: null,
				voicefile: null,
				email: null,
				callRestriction: null,
				callPickup: null,
				noDisturb: null,
				fwdType: null,
				fwdNumber: null,
				fork: null,
				mobile: null,
				record: null,
				api: null,
				state: null,
				registerIp: null
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
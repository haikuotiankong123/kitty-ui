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
            </el-form>
			<div class="right">
                <el-button size="mini" type="success" @click="pullOm">从OM拉取</el-button>
            </div>
        </div>
        <om-table :data="dataResp"
			:showBatchDelete="false"
			:showDelete="false"
            :columns="filterColumns"
            @findPage="findPageFunc"
            @handleDelete="handleDelete"
            @handleEdit="handleEdit">
			<template v-slot:state="{row}">
				{{row.state | valToName(extState)}}
			</template>
			<template v-slot:noDisturb="{row}">
				<el-tag v-if="row.noDisturb == 'no'" size="mini" type="success">启用</el-tag>
				<el-tag v-if="row.noDisturb == 'yes'" size="mini" type="danger">禁用</el-tag>
			</template>
            <!-- <template v-slot:handle="{row}"></template> -->
        </om-table>

        <!--新增编辑界面 class="column-two"-->
        <el-dialog  :title="operation?'新增':'编辑'" width="60%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogClose">
            <el-form :model="editDataForm" label-width="120px" v-if="dialogVisible" :rules="dataFormRules" ref="editDataForm" :size="size"
                label-position="right">

				<div style="float:left; width:45%;">
					<p class="subtitle">基本信息</p>
					<el-form-item label="线路编号" prop="lineid" >
						<el-input v-model="editDataForm.lineid" auto-complete="off" disabled></el-input>
					</el-form-item>
					<el-form-item label="分机号" prop="extId" >
						<el-input v-model="editDataForm.extId" auto-complete="off" disabled></el-input>
					</el-form-item>
					<el-form-item label="分机组" prop="groups" >
						<el-select multiple v-model="tempGroup" @change="changeGroup"  style="width:100%;" placeholder="请选择">
							<el-option v-for="i in omGroupAll" 
								:key="i.groupId"
								:label="i.groupId"
								:value="i.groupId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="工号" prop="staffid" >
						<el-input v-model="editDataForm.staffid" auto-complete="off" placeholder="请输入工号"></el-input>
					</el-form-item>
					<el-form-item label="手机号码" prop="mobile" >
						<el-input v-model="editDataForm.mobile" auto-complete="off" placeholder="请输入手机号码"></el-input>
					</el-form-item>
					<el-form-item label="邮箱地址" prop="email">
						<el-input v-model="editDataForm.email" auto-complete="off" placeholder="请输入邮箱地址"></el-input>
					</el-form-item>
				</div>
				
				<div style="float:left; width:45%; border-left: 1px dashed #0066cc; padding-left:2%; margin-left:4%;">
					<p class="subtitle">属性设置</p>
					<el-form-item label="同振号码" prop="fork" >
						<el-input v-model="editDataForm.fork" auto-complete="off" placeholder="请输入同振号码"></el-input>
					</el-form-item>
					
					<el-form-item label="呼叫转移方式" prop="fwdType" >
						<el-select v-model="editDataForm.fwdType" @change="changeType($event, editDataForm)" style="width:100%;" placeholder="请选择">
							<el-option v-for="(i) in fwdType"
								:key="i.value"
								:label="i.label"
								:value="i.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="呼叫转移号码" prop="fwdNumber" v-if="isNumber">
						<el-input v-model="editDataForm.fwdNumber" auto-complete="off" placeholder="请输入呼叫转移号码"></el-input>
					</el-form-item>

					<el-form-item label="排队语音文件" prop="voicefile" >
						<el-select v-model="editDataForm.voicefile" style="width:100%;" placeholder="请选择">
							<el-option v-for="(i, index) in queryVoicefile" 
								:key="index"
								:label="i"
								:value="i">
							</el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="代接权限" prop="callPickup" >
						<el-radio-group v-model="editDataForm.callPickup">
							<el-radio label="yes">允许</el-radio>
							<el-radio label="no">不允许</el-radio>
						</el-radio-group>
					</el-form-item>

					<el-form-item label="录音开关" prop="record" >
						<el-radio-group v-model="editDataForm.record">
							<el-radio label="on">开</el-radio>
							<el-radio label="off">关</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="状态" prop="noDisturb" >
						<el-radio-group v-model="editDataForm.noDisturb">
							<el-radio label="no">启用</el-radio>
							<el-radio label="yes">禁用</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
			
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
				<!-- :loading="editLoading" -->
                <el-button size="small" type="primary" @click.native="submitForm" >确 定</el-button>
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
			tempGroup: [],
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
				staffid: null,
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
			},
			isNumber: true
        }
	},
    mounted(){
		this.initColumns();		
	},
	filters: {
		filterGruop(val){
			return [val]
		}
	},
    computed:{
		...mapState({
            dataResp: state => state.omExt.dataResp,
			dataForm: state => state.omExt.dataForm,

            omExtAll: state => state.omExt.findAll,
            omGroupAll: state => state.omGroup.findAll,
			omMenuAll: state => state.omMenu.findAll,
			queryVoicefile: state => state.queryVoicefile
		})
    },
    methods:{
        ...mapActions('omExt', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
				/* {prop:"id", label:"编号", minWidth:100}, 
				{prop:"state", label:"线路状态", minWidth:100, isSlot: true},*/
				{prop:"lineid", label:"线路编号", minWidth:100},
				{prop:"extId", label:"分机号", minWidth:100},
				
                {prop:"groups", label:"分机组", minWidth:100},
                {prop:"voicefile", label:"排队语音文件", minWidth:100},
                {prop:"noDisturb", label:"状态", isSlot: true, minWidth:100},
                
				/* 
				{prop:"callRestriction", label:"呼叫权限", minWidth:100},
				{prop:"fwdType", label:"呼叫转移方式", minWidth:100},
                {prop:"fwdNumber", label:"呼叫转移号码", minWidth:100},
				{prop:"fork", label:"同振号码", minWidth:100},
                {prop:"mobile", label:"手机号码", minWidth:100},
				{prop:"staffid", label:"工号", minWidth:100},
				{prop:"email", label:"邮箱地址", minWidth:100},
				{prop:"callPickup", label:"代接权限", minWidth:100},
				{prop:"record", label:"录音开关", minWidth:100},
				{prop:"api", label:"api功能开关", minWidth:100},
                {prop:"registerIp", label:"注册IP", minWidth:100} */
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
				extId: null,
				lineid: null,
				staffid: null,
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
			let groups = params.row.groups;
			if(groups.length > 0) this.tempGroup = groups.split(',').map(i => parseInt(i))
			if(params.row.fwdType == 0) this.isNumber = false

			this.dialogVisible = true
			this.operation = false
			this.editDataForm = Object.assign({}, params.row)
		},
		changeType(val, item){
			if(val === 0){
				this.isNumber = false;
				item.fwdNumber = null
			}else{
				this.isNumber = true;
			}
		},
		dialogClose(){
			this.tempGroup = []
		},
        // 编辑
		submitForm: function () {
			this.$refs.editDataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						this.editDataForm.groups = this.tempGroup
						let params = Object.assign({}, this.editDataForm)
						
						this.$api.assignExt(params).then((res) => {
							this.editLoading = false
							if(res.success) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['editDataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.findPageFunc(null)
						}).catch(err => {
							util.error(err.message)
						})
						this.tempGroup = []
					})
				}
			})
		},
		changeGroup(){
			
		},
		pullOm(){
				
            this.$api.queryAllExt({is_save: 'true'}).then(resp => {
				if(resp.success){
					this.$message({ message: '操作成功', type: 'success' })
					this.findPage(this.pageRequest)
				}
            }).catch(err => {
				util.error(err.message)
			})
        }
    }
}
</script>

<style lang="scss" scoped>
.subtitle{
	font-weight: bold; 
	margin-top:-10px;
	padding-bottom: 10px;
}
</style>
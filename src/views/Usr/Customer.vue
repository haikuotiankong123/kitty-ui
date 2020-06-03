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
					<el-button type="primary" @click="importFunc">导入客户</el-button>
					<el-button type="primary" @click="exportFunc">导出客户</el-button>
                </el-form-item>
            </el-form>
        </div>
		<div>
			<el-checkbox-group v-model="selectedCheckbox" class="checkbox">
				<el-checkbox v-for="(i, index) in columns" 
					:key="index"
					@change="changeCheckbox(i, $event)"
					:label="i.label"
					:disabled="i.isShow"></el-checkbox>
			</el-checkbox-group>
		</div>
        <om-table :data="dataResp"
            :columns="filterColumns"
            @findPage="findPageFunc"
            @handleDelete="handleDelete"
            @handleEdit="handleEdit">
			<template v-for="(i, index) in configList" v-slot:[i.prop]="{row}">
				{{row.configValueList[index] && row.configValueList[index].jsonValue}}
			</template>	
			
            <!-- <template v-slot:handle="{row}"></template> -->
        </om-table>

        <!--新增编辑界面-->
        <el-dialog class="column-three" :title="operation?'新增':'编辑'" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editDataForm" label-width="80px" v-if="dialogVisible" :rules="rules" ref="editDataForm" :size="size"
                label-position="right">

				<el-form-item label="客户名称" prop="name" >
					<el-input v-model="editDataForm.name" auto-complete="off" placeholder="请输入客户名称"></el-input>
				</el-form-item>
				<el-form-item label="电话号码" prop="phone" >
					<el-input v-model="editDataForm.phone" auto-complete="off" placeholder="请输入电话号码"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="a3" >
					<el-input v-model="editDataForm.a3" auto-complete="off" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item label="QQ" prop="a4" >
					<el-input v-model="editDataForm.a4" auto-complete="off" placeholder="请输入QQ"></el-input>
				</el-form-item>
				<el-form-item label="微信" prop="a5" >
					<el-input v-model="editDataForm.a5" auto-complete="off" placeholder="请输入微信"></el-input>
				</el-form-item>
				<el-form-item label="性别" prop="a9" >
					<el-input v-model="editDataForm.a9" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="address" >
					<el-input v-model="editDataForm.address" auto-complete="off" placeholder="请输入地址"></el-input>
				</el-form-item>
				
				<template v-for="(i,index) in configList">
                    <el-form-item
                        v-if="i.status"
                        :key="index"
                        :label="i.label"
						:prop="'jsonValueMap.'+i.id" 
						:rules="{ required: i.isRequired, message: '必填', trigger: i.type == 4 ? 'change': 'blur'  }">
                        <el-input v-if="i.type == 1"   
                            :placeholder="'请输入' + i.label" 
                            v-model="editDataForm.jsonValueMap[i.id+'']" 
                            class="e-input"> </el-input>
                        <el-select v-if="i.type == 4"
                            v-model="editDataForm.jsonValueMap[i.id+'']" 
                            :placeholder="'请选择' + i.label" 
                            class="e-input"
                            style="width:200px;">
                            <el-option v-for="k in JSON.parse(i.jsonData)" 
                                :label="k"
                                :value="k"
                                :key="k"></el-option>
                        </el-select>
                    </el-form-item>
                </template>

				<!-- <el-form-item label="客户类型" prop="type" >
					<el-input v-model="editDataForm.type" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="备注" prop="remark" style="width:89%">
					<el-input type="textarea" v-model="editDataForm.remark" auto-complete="off" placeholder="请输入备注"></el-input>
				</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button size="small" @click.native="dialogVisible = false">取消</el-button>
					<el-button size="small" type="primary" @click.native="submitForm" :loading="editLoading">提交</el-button>
				</span>
        </el-dialog>

		<!-- 导入客户弹窗 -->
		<el-dialog title="导入客户" :visible.sync="importVisible" :close-on-click-modal="false">
			<el-form size="small">
				<el-form-item label="数据文件：">
					<el-upload
						name="file"
						:action="uploadUrl"
						ref="upload"
						:limit="1"
						accept=".xls"
						:on-success="uploadSuccess"
						:before-upload="beforeUpload"
						:auto-upload="true">
						<el-button slot="trigger" size="small" type="primary">请选择文件</el-button>
						<!-- <el-checkbox style="margin-left:15px;" v-model="ownAssign">分配给自己</el-checkbox> -->
                        <div slot="tip" class="el-upload__tip"> 请选择本地Excel文件，文件小于10m</div>
					</el-upload>
					<div>说明：导入数据将自动分配至所属话务组</div>
                    <p @click="generateTemplate" style="cursor: pointer;color: #3a8ee6">生成并下载客户模板文件</p>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click.native="dialogVisible = false">取消</el-button>
				<el-button size="small" type="primary" @click.native="submitImpot">提交</el-button>
			</span>
		</el-dialog>
    </div>
</template>

<script>
import OmTable from "@/components/omTable"
import util from "@/utils/util"
import {uploadUrl} from "@/http/env"
import {mapActions, mapState} from 'vuex'
import XLSX from 'xlsx'
export default {
    components: {
        OmTable
    },
    data(){
        return {
			/* lists: [
				{label: "客户姓名", value: 0, key: "name"},
				{label: "电话", value: 0, key: "phone"},
				{label: "策略", value: 0, key: "a6"},
				{label: "客户昵称", value: 0, key: "a1"},
				{label: "邮箱", value: 0, key: "a3"},
				{label: "品牌", value: 0, key: "a7"},
				{label: "客户等级", value: 0, key: "a2"},
				{label: "QQ", value: 0, key: "a4"},
				{label: "分公司", value: 0, key: "a8"},
				{label: "性别", value: 0, key: "a9"},
				{label: "微信", value: 0, key: "a5"},
				{label: "地址", value: 1, key: "address"},
				{label: "备注", value: 1, key: "remark"},

			], */
			selectedCheckbox:['客户名称', '电话号码'],
            filterColumns: [],
            columns: [],
            timeRange: [],
            pageRequest: { pageNum: 1, pageSize: 15 },
            size: 'mini',
            operation: false, // true:新增, false:编辑
            dialogVisible: false, // 新增编辑界面是否显示
            editLoading: false,
            
            // 新增编辑界面数据
			editDataForm: {
				configValueList: [],
				jsonValueMap: {}
			},
			configList: [],
			rules: {},
			importVisible: false,
			uploadUrl,
			file:'',
        }
    },
    mounted(){
		this.loadData();
    },
    computed:{
        ...mapState('usrCustomer', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
		})
    },
    methods:{
        ...mapActions('usrCustomer', ['findPage', 'findAll', 'save', 'delete', 'importCustomer']),

		async loadData(){
			
			await this.$api.usrCustomerConfig.findByCompanyId().then(resp => {
				this.configList = resp.data
			})

			this.initColumns();

			this.$api.usrCustomerRequired.findByCompanyId().then(resp => {
				this.isRequiredRule(resp.data)
			});
		},
		isRequiredRule(obj = {}){
            for(let k in obj){
                let rule = {required: obj[k], message: '必填', trigger: 'blur'}
                this.$set(this.rules, k, rule)
            }
		},

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			let customerConfig = []
			this.configList = this.configList.map((i, index)=>{
				i.prop = 'config'+index;
				customerConfig.push({
					prop: 'config'+index,
					label: i.label,
					isSlot: i.isRequired,
					minWidth:100,
				})
				return i;
			})

			this.columns = [
				{prop:"name", label:"客户名称", minWidth:100, isShow:true},
				{prop:"phone", label:"电话号码", minWidth:100,isShow:true},
				...customerConfig,
				{prop:"a3", label:"邮箱", minWidth:100},
				{prop:"a4", label:"QQ", minWidth:100},
				{prop:"a9", label:"性别", minWidth:100},
				{prop:"address", label:"地址", minWidth:100}
			].map((i, index)=>{
				i.selfIndex = index
				return i;
			})
			
            this.filterColumns = this.columns.filter(i => {
				return ['客户名称','电话号码'].findIndex(j => j == i.label) > -1
			})
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
			this.editDataForm = {
				configValueList: []
			}
			this.dialogVisible = true
			this.operation = true
			this.$set(this.editDataForm, "jsonValueMap", {})
			
        },
        // 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			let row = params.row;
			let configValueList = row.configValueList;
			this.$set(row, 'jsonValueMap', {})
			
			configValueList.forEach(i=>{
				this.$set(row.jsonValueMap, i.configId+'', i.jsonValue)
			})
			this.editDataForm = Object.assign({}, row)
		},
        // 编辑
		submitForm: function () {
			
			this.$refs.editDataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true

						let form = Object.assign({}, this.editDataForm)
						let valList = form.configValueList
						let len = valList.length;
						let id = form.id
						for(let confId in form.jsonValueMap){
							let val = form.jsonValueMap[confId]
							if(len == 0){
								valList.push({configId:confId, jsonValue:val, customerId:id})
							}else{
								valList = valList.map(i=> {
									if(confId==i.configId) i.jsonValue = val;
									return i;
								})	
							}
						}
						form.jsonValueMap = JSON.stringify(form.jsonValueMap)
						this.save(form).then((res) => {
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
		changeCheckbox(item,bShow){
			let label = item.label
			let selfIndex = item.selfIndex
			if(bShow){
				let index = this.filterColumns.findIndex(i => i.selfIndex > selfIndex);
				let len = this.filterColumns.length;
				index = index == -1 ? len : index;
				this.filterColumns.splice(index,0, item)
			}else{
				let index = this.filterColumns.findIndex(i=>i.label == label)
				if(index>-1) this.filterColumns.splice(index, 1);
			}
		},
		importFunc(){
			this.importVisible = true;
		},
		uploadSuccess(resp){
			this.file = resp.data;
		},
		beforeUpload(){},
		generateTemplate: function () {
			this.$api.usrCustomerConfig.findAll().then(resp => {
				let data = resp.data
				let con = []
				let o = Object.assign({}, {
					客户名称: undefined,
					电话号码: undefined,
					备注: undefined,
					邮箱: undefined,
					QQ: undefined,
					微信: undefined,
				})

				data.forEach(function (item, index) {
					if (item.status == 0) {
						return
					}
					o[item.label] = undefined
				})
				con.push(o)
				console.error(con)
				let ws = XLSX.utils.json_to_sheet(con);
				let wb = XLSX.utils.book_new()
				XLSX.utils.book_append_sheet(wb, ws, "");
				XLSX.writeFile(wb, "客户模板.xls");

			})
		},
		submitImpot(){
			this.importCustomer({
				file: this.file
			}).then(resp => {
				this.importVisible = false;
				util.success("导入客户成功");
				this.findPageFunc(null)
			})
		},
		exportFunc(){
			
			let param = { pageNum: 1, pageSize: 99999 }
			util.message("如果导出数据过多，时间可能比较长，请勿重复点击")
			//this.loading = true
			this.findPage(param).then((res) => {
				let data = res.data.content;
				let o = data.map(i =>{
					let conf = {}
					i.hasOwnProperty("configValueList") && i.configValueList.forEach(val => {
						if (val.configCustomer.status !== 0) {
							conf[val.configCustomer.label] = val.jsonValue
						}
					})

					return Object.assign({
						姓名: i.name,
						电话: i.phone,
						创建人: i.creator != undefined ? i.creator.name : "",
						QQ: i.a4,
						创建时间: i.createTime,
						备注: i.remark,
					}, conf)
				})
				let ws = XLSX.utils.json_to_sheet(o);
				let wb = XLSX.utils.book_new()
				XLSX.utils.book_append_sheet(wb, ws, "");
				XLSX.writeFile(wb, "客户数据.xls");
			})
		}
    }
}
</script>

<style lang="scss" scoped>
.checkbox{
	text-align: right;
	padding-right: 20px;
	padding-bottom: 5px;
	.el-checkbox{
		margin-right: 20px;
	}
	.el-checkbox__label{
		padding-left: 6px;
	}
}
</style>
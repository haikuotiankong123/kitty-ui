<template>
    <div class="table-container">
        <div class="query-container">
            <el-form :inline="true" size="mini">
                <el-form-item label="语音菜单编号">
                    <el-input v-model="dataForm.menuId" placeholder="请输入语音菜单编号"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="findPageFunc(null)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">增加</el-button>
                </el-form-item>
            </el-form>
			<div class="right">
                <el-button size="mini" type="success" @click="pullOm">从OM拉取</el-button>
				<el-button size="mini" type="success" @click="uploadOm">上传到OM</el-button>
            </div>
        </div>
        <om-table :data="dataResp"
			:showBatchDelete="false"
            :columns="filterColumns"
            @findPage="findPageFunc"
            @handleDelete="handleDelete"
            @handleEdit="handleEdit">
            <!-- <template v-slot:handle="{scope}"></template> -->
        </om-table>

        <!--新增编辑界面-->
        <el-dialog :title="operation?'新增':'编辑'" width="820px" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="closeDialogFunc">
            <el-form :model="editDataForm" label-width="120px" v-if="dialogVisible" :rules="dataFormRules" ref="editDataForm" :size="size"
                label-position="right">
				<el-form-item label="语音菜单名称" prop="menuName" >
					<el-input v-model="editDataForm.menuName" placeholder="请输入语音菜单名称" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="语音菜单描述" prop="menuDesp" >
					<el-input v-model="editDataForm.menuDesp" placeholder="请输入语音菜单描述" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="语音文件" prop="voiceFile" >
					<el-select v-model="editDataForm.voiceFile" style="width:100%;" placeholder="请选择">
						<el-option v-for="(i, index) in queryVoicefile" 
							:key="index"
							:label="i"
							:value="i">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="语音文件" prop="voiceFile" >
					<el-input v-model="editDataForm.voiceFile" placeholder="请输入语音文件" auto-complete="off"></el-input>
				</el-form-item> -->
				<el-form-item label="重复次数" prop="repeat" >
					<el-input v-model="editDataForm.repeat" placeholder="请输入重复次数" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="拨号检测长度" prop="infoLength" >
					<el-input v-model="editDataForm.infoLength" placeholder="请输入长度" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="按键结束符" prop="exit" >
					<el-input v-model="editDataForm.exit" placeholder="请输入结束符" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>

			<div class="h" v-if="isKey">
				<span class="text">按键事件</span>&emsp;
				<!-- v-if="!eventList.length" -->
				<el-button size="mini" @click="addKey(editDataForm.menuId)" type="success" icon="el-icon-plus">增加事件</el-button>
			</div>

			<div class="key-event" v-if="isKey">
				<el-form :size="size" class="key-one">
					<template v-for="(item, index) in eventList">
						<el-form-item :label="item.dtmfKey | lastStr" :key="index" class="event-list" :class="{'show-child': showChild && index==childIndex}">
							<el-select style="width:120px;" v-model="item.dtmfType" placeholder="请选择" @change="changeTtype($event, item)">
								<el-option
									v-for="i in event"
									:key="i.value"
									:label="i.label"
									:value="i.value">
								</el-option>
							</el-select>

							<template v-if="item.dtmfType == 'outer'">
								<el-input style="width:120px;" v-model="item.dtmfValue" placeholder="请输入号码"></el-input>
							</template>
							<template v-if="item.dtmfType == 'ext' || item.dtmfType == 'queue'">
								<!-- @change="ivrFunc($event)" -->
								<el-select style="width:120px;" v-model="item.dtmfValue" >
									<el-option 
										v-for="(i, index) in queryAllExt" 
										:label="i.extId"
										:value="i.extId"
										:key="index"></el-option>
								</el-select>
							</template>
							<template v-if="item.dtmfType == 'group'">
								<el-select style="width:120px;" v-model="item.dtmfValue" @change="ivrFunc($event)">
									<el-option 
										v-for="(i, index) in queryGroup" 
										:label="i.groupId"
										:value="i.groupId"
										:key="index"></el-option>
								</el-select>
							</template>
							<template v-if="item.dtmfType == 'menu'">
								<el-select style="width:120px;" v-model="item.dtmfValue" @change="showChild = false">
									<el-option 
										v-for="(i, index) in omMenuAll" 
										:label="i.menuName"
										:value="i.menuId + ''"
										:key="index"></el-option>
								</el-select>
							</template>
							<template v-if="item.dtmfType == 'menu' && item.dtmfValue">
								<span v-if="showChild && index == childIndex"  @click="closeChildFunc(index)"  style="cursor: pointer">《</span>
								<span v-else @click="showChildFunc(index, item.dtmfValue)" style="cursor: pointer">》</span>
							</template>
						</el-form-item>
					</template>
				</el-form>

				<el-form :inline="true" size="mini" class="key-two" v-if="showChild">
					<p :key="i.id" v-for="i in childKeys">
						<el-form-item>
							<el-input v-if="i.dtmfKey" v-model="i.dtmfKey" style="width:40px;" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-if="i.dtmfType" v-model="i.dtmfType" style="width:100px;" readonly></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-if="i.dtmfValue" v-model="i.dtmfValue" style="width:100px;" readonly></el-input>
						</el-form-item>
					</p>
				</el-form>
            
			</div>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click.native="closeDialog">取消</el-button>
				<!-- :loading="editLoading" -->
                <el-button size="small" type="primary" @click.native="submitForm" >提交</el-button>
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
			event: [
				{label:'总机', value:'default'},
				{label:'挂断', value:'clear'},
				{label:'分机', value:'ext'},
				{label:'分机队列', value:'queue'},
				{label:'分机组', value:'group'},
				{label:'语音菜单', value:'menu'},
				{label:'播放语音', value:'voicefile'},
				{label:'转外部电话', value:'outer'}
			],
			eventList: [],
			selectedEventList: [],
			omMenuAll: [],
			
			childKeys: [],
			showChild: false,
			childIndex: null, 


            VIRList: [],
            filters: {
                name:''
			},
			isKey: false
        }
	},
	filters:{
		lastStr(val){
            return '按键 ' + val
        }
	},
	watch:{
		
	},

    mounted(){
		this.initColumns();
		this.findAll().then(resp => {
			this.omMenuAll = resp.data
		})
    },
    computed:{
        ...mapState('omMenu', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
		}),
		...mapState(['queryVoicefile', 'queryGroup', 'queryAllExt']),
    },
    methods:{
        ...mapActions('omMenu', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                /* {prop:"id", label:"", minWidth:100}, */
                {prop:"menuId", label:"语音菜单编号", minWidth:100},
                {prop:"menuName", label:"语音菜单名称", minWidth:100},
                {prop:"menuDesp", label:"语音菜单描述", minWidth:100},
                {prop:"voiceFile", label:"语音文件", minWidth:100},
                {prop:"repeat", label:"重复次数", minWidth:100},
                {prop:"infoLength", label:"拨号检测长度", minWidth:100},
                {prop:"exit", label:"按键结束符", minWidth:100}
            ]
            this.filterColumns = this.columns
      	},
		closeDialogFunc(){
			this.showChild = false
			this.childIndex = null
		},
		closeDialog(){
			this.dialogVisible = false
		},
        // 批量删除
		handleDelete(data) {
			
			this.delete(data.params).then(data!=null?data.callback:'')
			this.$api.assignMenu({menu_id: data.row.menuId})	// 删除OM上的
        },
		ivrFunc(){},
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
			this.isKey = false;
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
			this.isKey = true;
			this.dialogVisible = true
			this.operation = false
			this.editDataForm = Object.assign({}, params.row)
			
			let menuId = params.row.menuId
			this.getKey(menuId).then(resp => {
				this.eventList = resp
			});
			
		},
		
		async getKey(menuId){
			if(!menuId) return;
			let param = {
				columnFilterMap: {menuId},
				pageSize:20
			}
			let resp = await this.$api.omMenuDtmf.findPage(param);
			return this.keySort(resp.data.content)
		},
		keySort(arr){
			if(!arr) return;
			return arr.sort((a, b)=>{
					return parseInt(a.dtmfKey) - parseInt(b.dtmfKey)
				})
		},
		changeTtype(type, item){
			if(!item || !type || type == 'default' || type == 'clear') return;
			item.dtmfValue = ''
		},
		showChildFunc(index, menuId){
			if(!menuId) return;
			this.showChild = true;
			this.childIndex = index;
			this.getKey(menuId).then(resp => {
				this.childKeys = resp
				console.log('索引---》',index)
				console.log('menuId---》',menuId)
			})
			
		},
		closeChildFunc(index){
			this.showChild = false
		},
		addKey(menuId){
			if(!menuId) return;
			for(let i=0; i<10; i++){
				if(this.eventList.find(item => item.dtmfKey ==i)) continue;
				this.eventList.splice(i,0,{menuId, dtmfKey: i, dtmfValue: ''})
				//this.eventList.push({menuId, dtmfKey: i, dtmfValue: ''})
			}
			console.log('按键---->', this.eventList)
		},
        // 编辑
		submitForm: function () {
			this.$refs.editDataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let form = this.editDataForm
							form.menu_id = form.menuId
							form.menu_name = form.menuName
							if(form.exit == '#') form.exit = '%23'	// url字符转义 %23就是#
						
						let params = Object.assign({}, form)
						console.log('参数-----》', params)
						this.$api.assignMenu(params).then((res) => {
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

						this.eventList.forEach(i => {
							if((i.dtmfType != 'clear' || i.dtmfType != 'defalut') && !i.dtmfValue) return;
							this.$api.omMenuDtmf.save(i)
						})
						this.eventList = []
					})
				}
			})
		},
		pullOm(){
			this.$api.queryMenu({is_save: 'true'}).then(resp => {
				if(resp.success){
					util.success('操作成功')
					this.findPage(this.pageRequest)
				}
			}).catch(err => {
				util.error(err.message)
			})
		},
		uploadOm(){
			this.$api.assignAllMenu().then(resp => {
				if(resp.success){
					util.success(resp.message)
				}
			}).catch(err => {
				util.error(err.message)
			})
		}
    }
}
</script>

<style lang="scss" scoped>
.event-list.show-child{
	position: relative;
	&>::after{
		position: absolute;
		top: 15px;
		right: 0;
		height: 1px;
		width: 45px;
		background: #666;
	}
}
.h{
	.text{
		font-weight: bold;
		color: #333;
	}
	border-bottom: 1px dashed #0066cc;
	padding-bottom: 10px;
	margin-bottom: 15px;
}
.key-event{
	display: flex;
	position: relative;
	&>.key-one{
		width: 360px;
		padding-left: 68px;
	}
	&>.key-two{
		flex: 1;
		border-left: 1px solid #666;
		padding: 10px 0 10px 20px;
		background: #f7f7f7;
		/deep/ .el-form-item{
			margin-right: 0;
		}
	}
	
}

</style>
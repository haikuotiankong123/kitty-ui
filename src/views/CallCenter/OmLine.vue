<template>
    <div class="table-container">
        <div class="query-container">
            <el-form :inline="true" size="mini">
                <el-form-item label="线路号码">
                    <el-input v-model="dataForm.trunkId" placeholder="请输入线路号码"></el-input>
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
            :columns="filterColumns"
            :showBatchDelete="false"
            :showDelete="false"
            @findPage="findPageFunc"
            @handleDelete="handleDelete"
            @handleEdit="handleEdit">
            <template v-slot:flag="{row}">
                {{row.flag | filterFlag}}
            </template>
            <template v-slot:transferType="{row}">
                {{row.transferType | valToName(transferType)}}
            </template>
            <template v-slot:transferValue="{row}">
                {{tValue(row.transferValue, row.transferType)}}
            </template>
            <!-- <template v-slot:handle="{row}"></template> -->
        </om-table>

        <!--新增编辑界面-->
        <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editDataForm" label-width="80px" v-if="dialogVisible" :rules="dataFormRules" ref="editDataForm" :size="size"
                label-position="right">

                <el-form-item label="线路号码" prop="trunkId" >
                    <el-input v-model="editDataForm.trunkId" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="线路编号" prop="lineId" >
                    <el-input v-model="editDataForm.lineId" auto-complete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="接入方式" prop="transferType" >
                    <el-select v-model="editDataForm.transferType" @change="changeType">
                        <el-option v-for="(i, index) in transferType" 
                            :key="index"
                            :label="i.label"
                            :value="i.value"></el-option>
                    </el-select>
                    <el-select class="tempClass" v-model="editDataForm.transferValue" placeholder="请选择分机号" v-if="editDataForm.transferType == 'queue'">
                        <el-option v-for="i in omExtAll" 
                            :label="i.extId"
                            :value="i.extId"
                            :key="i.extId"></el-option>
                    </el-select>
                    <el-select class="tempClass" v-model="editDataForm.transferValue" placeholder="请选择语音菜单" v-if="editDataForm.transferType == 'menu'">
                        <el-option v-for="i in omMenuAll" 
                            :label="i.menuName"
                            :value="i.menuId"
                            :key="i.menuId">
                        </el-option>
                    </el-select>
                    <el-select class="tempClass" v-model="editDataForm.transferValue" placeholder="请选择分机组" v-if="editDataForm.transferType == 'group'">
                        <el-option v-for="i in omGroupAll"
                            :key="i.groupId"
                            :label="i.groupId"
                            :value="i.groupId"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="接入值" prop="transferValue"  v-if="editDataForm.transferType">
                    <template v-if="editDataForm.transferType == 'ext' || editDataForm.transferType == 'queue'">
                        <el-select filterable v-model="editDataForm.transferValue" placeholder="请选择">
                            <el-option v-for="i in omExtAll" 
                                :label="i.extId"
                                :value="i.extId"
                                :key="i.extId"></el-option>
                        </el-select>
                    </template>
                    <template v-if="editDataForm.transferType == 'menu'">
                        <el-select v-model="editDataForm.transferValue" placeholder="请选择">
                            <el-option v-for="i in omMenuAll" 
                                :label="i.menuName"
                                :value="i.menuId"
                                :key="i.menuId">
                            </el-option>
                        </el-select>
                    </template>
                    <template v-if="editDataForm.transferType == 'group'">
                        <el-select filterable v-model="editDataForm.transferValue" placeholder="请选择">
                            <el-option v-for="i in omGroupAll"
                                :key="i.groupId"
                                :label="i.groupId"
                                :value="i.groupId"></el-option>
                        </el-select>
                    </template>
                </el-form-item> -->
                <el-form-item label="状态" prop="flag" >
                    <el-radio-group v-model="editDataForm.flag">
                        <el-radio-button :label="1">启用</el-radio-button>
                        <el-radio-button :label="0">禁用</el-radio-button>
                    </el-radio-group>
                </el-form-item>
			
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
                <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">提交</el-button>
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
				trunkId: null,
				lineId: null,
				state: null,
				transferType: null,
				transferValue: null
            },
            lineState: [
                {
                    value:'ready',
                    label: '可用'
                },{
                    value:'active',
                    label: '摘机、振铃或通话中'
                },{
                    value:'unwired',
                    label: '未接线'
                },{
                    value:'offline',
                    label: '离线'
                }
            ],
            transferType: [
                {
                    value:'menu',
                    label: '语音菜单'
                },{
                    value:'group',
                    label: '分机组'
                },{
                    value:'queue',
                    label: '分机队列'
                },
                /* {
                    value:'ext',
                    label: '分机'
                },{
                    value:'outer',
                    label: '外部电话'
                } */
            ]
        }
    },
    mounted(){
        this.initColumns();
        setTimeout(()=>{
            console.log('所有分机----》', this.omExtAll)
            console.log('所有分机组---》', this.omGroupAll)
            console.log('所有菜单----》', this.omMenuAll)
        },3000)
        
    },
    filters: {
        filterFlag(val){
            if(val==1) return '启用'
            if(val==0) return '禁用'
        },
        filterValue(val, type){
            if(type == 'menu'){
                
            }else{
                return val;
            }
        }
    },
    computed:{
        ...mapState({
            dataResp: state => state.omLine.dataResp,
            dataForm: state => state.omLine.dataForm,

            omExtAll: state => state.omExt.findAll,
            omGroupAll: state => state.omGroup.findAll,
            omMenuAll: state => state.omMenu.findAll,
        }),
        tValue(){
            return (val, type)=>{
                if(type == 'menu'){
                    let menuId = parseInt(val)
                    let result = this.omMenuAll.find(i => i.menuId == menuId)
                    return result ? result.menuName : '';
                }else{
                    return val;
                }
            }
        }
    },
    methods:{
        ...mapActions('omLine', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                {prop:"trunkId", label:"线路号码", minWidth:100},
                {prop:"lineId", label:"线路编号", minWidth:100},
                {prop:"transferType", label:"接入方式", isSlot: true, minWidth:100},
                {prop:"transferValue", label:"接入值", isSlot: true, minWidth:100},
                {prop:"flag", label:"状态", isSlot: true, minWidth:100},
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
				trunkId: null,
				lineId: null,
				state: null,
				transferType: null,
				transferValue: null
			}
        },
        // 显示编辑界面
		handleEdit: function (params) {
            if(params.row.transferType == "menu") params.row.transferValue = parseInt(params.row.transferValue)
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
        },
        changeType(item){
            this.editDataForm.transferValue = ''
            this.$nextTick(()=>{
                document.querySelector('.tempClass').click()
            })
            console.log('------>', item)
        },
        pullOm(){
            this.$api.queryAllTrunk({is_save: 'true'}).then(resp => {
                if(resp.success){
					this.$message({ message: '同步成功', type: 'success' })
					this.findPage(this.pageRequest)
				}
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
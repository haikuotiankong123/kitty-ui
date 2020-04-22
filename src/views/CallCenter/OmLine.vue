<template>
    <div class="table-container">
        <div class="query-container">
            <el-form :inline="true" size="mini">
                <el-form-item label="中继编号">
                    <el-input v-model="dataForm.trunkId" placeholder="请输入中继编号"></el-input>
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
                {{row.state | valToName(lineState)}}
            </template>
            <template v-slot:transferType="{row}">
                {{row.transferType | valToName(transferType)}}
            </template>
            <!-- <template v-slot:handle="{row}"></template> -->
        </om-table>

        <!--新增编辑界面-->
        <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="editDataForm" label-width="80px" v-if="dialogVisible" :rules="dataFormRules" ref="editDataForm" :size="size"
                label-position="right">

			<el-form-item label="中继编号" prop="trunkId" >
				<el-input v-model="editDataForm.trunkId" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="中继编号" prop="lineId" >
				<el-input v-model="editDataForm.lineId" auto-complete="off"></el-input>
			</el-form-item>
			<!-- <el-form-item label="中继状态" prop="state" >
                <el-select v-model="editDataForm.state">
                    <el-option v-for="(i, index) in lineState" 
                        :key="index"
                        :label="i.label"
                        :value="i.value"></el-option>
                </el-select>
			</el-form-item> -->
			<el-form-item label="转接类型" prop="transferType" >
                <el-select v-model="editDataForm.transferType" @change="changeType">
                    <el-option v-for="(i, index) in transferType" 
                        :key="index"
                        :label="i.label"
                        :value="i.value"></el-option>
                </el-select>
			</el-form-item>
			<el-form-item label="转接值" prop="transferValue"  v-if="editDataForm.transferType">
				<!-- <el-input v-model="editDataForm.transferValue" auto-complete="off"></el-input> -->
                <template v-if="editDataForm.transferType == 'ext'"></template>
                <template v-if="editDataForm.transferType == 'outer'"></template>

                <template v-if="editDataForm.transferType == 'menu'"></template>
                <template v-if="editDataForm.transferType == 'group'"></template>
                <template v-if="editDataForm.transferType == 'queue'"></template>
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
                    value:'ext',
                    label: '分机'
                },{
                    value:'menu',
                    label: '语音菜单'
                },{
                    value:'outer',
                    label: '外部电话'
                },{
                    value:'group',
                    label: '分机组'
                },{
                    value:'queue',
                    label: '分机队列'
                }
            ],
            omGroup: [],
            omExt: [],
            omMenu: [],
            omQueue: []
        }
    },
    mounted(){
        this.initColumns();
    },
    
    computed:{
        ...mapState('omLine', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
        })
    },
    methods:{
        ...mapActions('omLine', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                {prop:"id", label:"编号", minWidth:100},
                {prop:"trunkId", label:"中继编号", minWidth:100},
                {prop:"lineId", label:"中继编号", minWidth:100},
                {prop:"state", label:"中继状态", isSlot: true, minWidth:100},
                {prop:"transferType", label:"转接类型", isSlot: true, minWidth:100},
                {prop:"transferValue", label:"转接值", minWidth:100},
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
            console.log('这条数据------》', params.row);
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
            console.log('项目----》', item)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
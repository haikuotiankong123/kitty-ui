<template>
    <div class="table-container">
        <div class="query-container">
            <el-form :inline="true" size="mini">
                <el-form-item label="分机组ID">
                    <el-input v-model="dataForm.groupId" placeholder="请输入分机组ID"></el-input>
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
            :columns="filterColumns"
            @findPage="findPageFunc"
            @handleDelete="handleDelete"
            @handleEdit="handleEdit">
            <template v-slot:distribution="{row}">
                {{row.distribution | valToName(distribution)}}
            </template>
            <template v-slot:exts="{row}">
                {{row.exts | filterExts}}
            </template>
            <!-- <template v-slot:handle="{scope}"></template> -->
        </om-table>

        <!--新增编辑界面-->
        <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="dialogClose">
            <el-form :model="editDataForm" label-width="100px" v-if="dialogVisible" :rules="dataFormRules" ref="editDataForm" :size="size"
                label-position="right">
			<el-form-item label="分机组编号" prop="groupId" >
				<el-input v-model="editDataForm.groupId" auto-complete="off"></el-input>
			</el-form-item>
            <el-form-item label="分机">
                <el-select multiple v-model="exts" placeholder="请选择" style="width:100%;">
                    <el-option v-for="i in omExtAll" 
                        :label="i.extId"
                        :value="i.extId"
                        :key="i.id"></el-option>
                </el-select>
            </el-form-item>
			<el-form-item label="语音文件" prop="voicefile" >
				<el-input v-model="editDataForm.voicefile" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="有效值" prop="distribution" >
                <el-select v-model="editDataForm.distribution" placeholder="请选择" style="width:100%;">
                    <el-option v-for="(i, index) in distribution"
                        :label="i.label"
                        :value="i.value"
                        :key="index"></el-option>
                </el-select>
			</el-form-item>
			
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="dialogVisible = false">取消</el-button>
                <!-- :loading="editLoading" -->
                <el-button :size="size" type="primary" @click.native="submitForm" >提交</el-button>
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
				groupId: null,
				voicefile: null,
				distribution: null,
				createBy: null,
				createTime: null,
				lastUpdateBy: null,
				lastUpdateTime: null,
            },
            distribution: [{
                value:'sequential',
                label: '顺选'
            },{
                value: 'circular',
                label: '轮选'
            },{
                value: 'group',
                label: '群振'
            }],
            exts: []
        }
    },
    filters:{
        filterExts(exts){
            let arr = []
            exts.forEach(i => {
                arr.push(i.extId)
            })
            return arr.join(',')
        }
    },
    mounted(){
        this.initColumns();
    },
    computed:{
        /* ...mapState('omGroup', {
            dataResp: state => state.dataResp,
            dataForm: state => state.dataForm
        }), */
        ...mapState({
            dataResp: state => state.omGroup.dataResp,
            dataForm: state => state.omGroup.dataForm,

            omExtAll: state => state.omExt.findAll,
            omGroupAll: state => state.omGroup.findAll,
            omMenuAll: state => state.omMenu.findAll,
        }),
    },
    methods:{
        ...mapActions('omGroup', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                {prop:"groupId", label:"分机组编号", minWidth:100},
                {prop:"exts", label:"分机", isSlot: true, minWidth:100},
                {prop:"voicefile", label:"语音文件", minWidth:100},
                {prop:"distribution", label:"有效值", isSlot: true, minWidth:100}
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
				groupId: null,
				voicefile: null,
				distribution: null,
				createBy: null,
				createTime: null,
				lastUpdateBy: null,
				lastUpdateTime: null,
			}
        },
        // 显示编辑界面
		handleEdit: function (params) {
            console.log('参数------>', params)
            this.exts = params.row.exts.map(i => i.extId)
            
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
                        let form = JSON.parse(JSON.stringify(this.editDataForm));
                            form.exts = this.exts.join(',')
                            form.group_id = form.groupId
						let params = Object.assign({}, form)
                        
                        this.$api.assignGroup(params).then(res => {
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
					})
				}
			})
        },
        pullOm(){
            this.$api.queryGroup({is_save: 'true'}).then(resp => {
				if(resp.success){
                    util.success('操作成功')
                    this.findPage(this.pageRequest)
				}
			}).catch(err => {
				util.error(err.message)
			})
        },
        uploadOm(){
            this.$api.assignAllGroup().then(resp => {
                if(resp.success){
                    util.success(resp.message)
                }
            }).catch(err => {
                util.error(err.message)
            })
        },
        dialogClose(){}
    }
}
</script>

<style lang="scss" scoped>

</style>
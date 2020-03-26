<template>
  <div>
    <om-table :data="pageResult" :columns="filterColumns" @findPage="findPage" @handleDelete="handleDelete" :showHandle="true">
        <template v-slot:handle="{scope}">
            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="onDelete(scope.$index, scope.row)">删除</el-button>
        </template>
    </om-table>
    
    <!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" v-if="dialogVisible" :rules="dataFormRules" ref="dataForm" :size="size"
			label-position="right">
            <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="dataForm.menuName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单描述" prop="menuDesp">
                <el-input v-model="dataForm.menuDesp" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="语音名称" prop="voiceFile">
                <el-select v-model="dataForm.voiceFile" placeholder="请选择">
					<el-option
						v-for="i in voiceList"
						:key="i.id"
						:label="i.name"
						:value="i.name">
					</el-option>
				</el-select>
            </el-form-item>
            <el-form-item label="播放次数" prop="repeat">
                <el-input v-model="dataForm.repeat" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="按键检查长度" prop="infoLength">
                <el-input v-model="dataForm.infoLength" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="结束符" prop="exit">
                <el-input v-model="dataForm.exit" auto-complete="off"></el-input>
            </el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import OmTable from "@/views/Core/OmTable"
export default {
    data(){
        return {
            size: 'mini',
            editLoading: false,
            pageResult: {
                pageNum: 1,
                pageSize: 10,
                totalSize: 12,
                totalPages: 2,
                content: [{
                    id: '1',
                    menuId: '2',
                    menuName: 'ivr1',
                    menuDesp: '开场白',
                    voiceFile: 'welcome.mp3',
                    repeat: '3',
                    infoLength: '3',
                    exit: '#'
                },{
                    id: '2',
                    menuId: '3',
                    menuName: 'ivr2',
                    menuDesp: '按键2',
                    voiceFile: 'welcome.mp3',
                    repeat: '3',
                    infoLength: '3',
                    exit: '#'
                },{
                    id: '3',
                    menuId: '4',
                    menuName: 'ivr3',
                    menuDesp: '按键3',
                    voiceFile: 'welcome.mp3',
                    repeat: '3',
                    infoLength: '3',
                    exit: '#'
                }]
            },

            pageRequest: { pageNum: 1, pageSize: 10 },
            filterColumns: [],
            operation: false, // true:新增, false:编辑
            dialogVisible: false, // 新增编辑界面是否显示
            dataForm: {
                menuName: '',
                menuDesp: '',
                voiceFile: '',
                repeat: '',
                infoLength: '',
                exit: ''
            },
            dataFormRules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				]
            },
            voiceList: [
                {
                    id: '1',
                    name: '语音一'
                },
                {
                    id: '2',
                    name: '语音二'
                },
                {
                    id: '3',
                    name: '语音三'
                },
            ]
        }
    },
    components: {
        OmTable
    },
    mounted(){
        this.initColumns()
    },
    methods: {
        // 获取分页数据
		findPage: function (data) {
            console.log('获取分页数据----->', data)
            // 无
            return

			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name}}
			this.$api.user.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
				this.findUserRoles()
			}).then(data!=null?data.callback:'')
		},
        // 处理表格列过滤显示
      	initColumns: function () {
			this.columns = [
                {prop:'menuName', label: '菜单名称'},
                {prop:'menuDesp', label: '描述'},
                {prop:'voiceFile', label: '语音名称'},
                {prop:'repeat', label: '播放次数'},
                {prop:'infoLength', label: '按键检查长度'},
                {prop:'exit', label: '结束符'}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	},
        // 批量删除
		handleDelete: function (data) {
            
			// this.$api.user.batchDelete(data.params).then(data!=null?data.callback:'')
		},
        handleEdit(index, row){
            // console.log('index---->', index)
            // console.log('row----->', row)
            this.dataForm = row
            this.dialogVisible = true
        },
        onDelete(index, row){

        }
    }
}
</script>

<style>

</style>
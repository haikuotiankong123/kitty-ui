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
	<el-dialog :title="operation?'新增':'编辑'" width="800px" :visible.sync="dialogVisible" :close-on-click-modal="false" class="dialog-form">
		<el-form :model="dataForm" 
            class="data-form"
            label-width="100px" 
            v-if="dialogVisible" 
            :rules="dataFormRules" 
            ref="dataForm" 
            :size="size"
			label-position="left">
            <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="dataForm.menuName" auto-complete="off" class="w80"></el-input>
            </el-form-item>
            <el-form-item label="菜单描述" prop="menuDesp">
                <el-input v-model="dataForm.menuDesp" auto-complete="off" class="w80"></el-input>
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
                <el-input v-model="dataForm.repeat" auto-complete="off" class="w80"></el-input>
            </el-form-item>
            <el-form-item label="按键检查长度" prop="infoLength">
                <el-input v-model="dataForm.infoLength" auto-complete="off" class="w80"></el-input>
            </el-form-item>
            <el-form-item label="结束符" prop="exit">
                <el-input v-model="dataForm.exit" auto-complete="off" class="w80"></el-input>
            </el-form-item>

            <div class="h">
                <p>按键事件</p>
            </div>

            <template v-for="(item, index) in eventList">
                <el-form-item :label="item.key | lastStr" :key="index" class="event-list">
                    <el-select v-model="item.valueOne" placeholder="请选择">
                        <el-option
                            v-for="i in event"
                            :key="i.id"
                            :label="i.name"
                            :value="i.name">
                        </el-option>
                    </el-select>
                    <el-select v-model="item.valueTwo" placeholder="请选择" 
                        v-if="item.valueOne && item.valueOne != '总机' && item.valueOne != '挂断'">
                        <el-option
                            v-for="i in event"
                            :key="i.id"
                            :label="i.name"
                            :value="i.name">
                        </el-option>
                    </el-select>
                    <template v-if="item.valueTwo == 'IVR'">
                        <span>》</span>
                        <span>《</span>
                        <div style=""></div>
                        <!-- <p v-for="(eventItem) in selectedEventList">
                            <span></span>
                        </p> -->

                        <!-- <ul>
                            <li v-for="(selectedEvent, ind) in selectedEventList" :key="ind">
                                <template v-for="(eventName, inde) in  selectedEvent">
                                    <el-input 
                                    :key="inde"
                                    :size="size" 
                                    v-model="eventName" readonly></el-input>
                                </template>
                            </li>
                        </ul> -->
                    </template>
                </el-form-item>
            </template>
            
		</el-form>
		<div slot="footer" class="dialog-footer" style="padding-left: 110px;">
            <el-button type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
			<el-button @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
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
            ],


            event: [{
                id: '1',
                name: '总机'
            },{
                id: '2',
                name: '挂断'
            },{
                id: '3',
                name: '分机'
            },{
                id: '4',
                name: '分机组'
            },{
                id: '5',
                name: 'IVR'
            },{
                id: '6',
                name: '播放语音'
            }],
            eventList: [
                {key: 'key0', valueOne: '', valueTwo: ''},
                {key: 'key1', valueOne: '', valueTwo: ''},
                {key: 'key2', valueOne: '', valueTwo: ''},
                {key: 'key3', valueOne: '', valueTwo: ''},
                {key: 'key4', valueOne: '', valueTwo: ''},
                {key: 'key5', valueOne: '', valueTwo: ''},
                {key: 'key6', valueOne: '', valueTwo: ''},
                {key: 'key7', valueOne: '', valueTwo: ''},
                {key: 'key8', valueOne: '', valueTwo: ''},
                {key: 'key9', valueOne: '', valueTwo: ''},
                {key: 'key*', valueOne: '', valueTwo: ''},
                {key: 'key#', valueOne: '', valueTwo: ''},
            ],
            selectedEventList: [
                {key: 'key0', valueOne: '', valueTwo: ''},
                {key: 'key4', valueOne: '', valueTwo: ''},
                {key: 'key5', valueOne: '', valueTwo: ''},
                {key: 'key6', valueOne: '', valueTwo: ''},
                {key: 'key9', valueOne: '', valueTwo: ''},
            ],
            VIRList: [

            ]
        }
    },
    components: {
        OmTable
    },
    filters: {
        lastStr(val){
            if(!val) return;
            return '按键 ' + val.charAt(val.length-1)
        }
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

<style scoped lang="scss">
.dialog-form{
    /deep/ .el-dialog__body{
        max-height: 400px;
        overflow: auto;
        padding: 20px 50px;
        .w80{
            width: 80%;
        }
        .el-select{
            width: 120px;
        }
    }
    /deep/ .el-dialog__header{
        background: #F2F6FC;
    }
    /deep/ .el-dialog__footer{
        background: #F2F6FC;
    }
    .event-list{
        position: relative;
    }
}

.data-form{
    // max-height: 400px;
    // overflow: auto;
    .h{
        border-top: 1px dashed #999;
        margin-top: 30px;
        p{
            font-weight: bold;
            color: #04b1fe;
            line-height: 50px;
        }
    }
}
</style>
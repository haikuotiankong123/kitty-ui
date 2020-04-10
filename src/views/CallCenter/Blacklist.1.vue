<template>
    <div>
        <div class="query-container">
            <el-form :inline="true" size="mini">
                <el-form-item>
                    <el-input v-model="omBlacklistForm.phone" placeholder="请输入电话号码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="findPageFunc(null)">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <om-table :data="omBlacklist" :columns="filterColumns" @findPage="findPageFunc" @handleDelete="handleDelete" :showHandle="true">
            <!-- <template v-slot:handle="{scope}"></template> -->
        </om-table>
    </div>
</template>

<script>
import OmTable from "@/components/omTable"
import {mapActions, mapState} from 'vuex'
export default {
    components: {
        OmTable
    },
    data(){
        return {
            filterColumns: [],
            columns: [],
            pageRequest: { pageNum: 1, pageSize: 15 }
        }
    },
    mounted(){
        this.initColumns();    
    },
    computed:{
        ...mapState('omBlacklist', {
            omBlacklist: state => state.omBlacklist,
            omBlacklistForm: state => state.omBlacklistForm
        })
    },
    methods:{
        ...mapActions('omBlacklist', ['findPage', 'findAll', 'save', 'delete']),

        // 处理表格列过滤显示
        // isSlot: Boolean  是否使用插槽
      	initColumns() {
			this.columns = [
                {prop:'id', label: 'id'},
                {prop:'phone', label: '电话号码'},
                {prop:'type', label: '黑名单类型'},
                {prop:'state', label: '状态'}
            ]
            let showColumn = ['id', 'phone', 'type', 'state']
            this.filterColumns = showColumn.map(i => {
                    return this.columns.find(obj => obj.prop == i)
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

            let filters = {}
            for(let key in this.omBlacklistForm){
                let val = this.omBlacklistForm[key];
                if(val) filters[key] = val
            }
            
            this.pageRequest.columnFilterMap = {...filters, createTimeStart: '2020-04-08 15:48:43', createTimeEnd: '2020-04-11 00:00:00'};
			this.findPage(this.pageRequest).then((res) => {
				
			}).then(data!=null?data.callback:'')
		}
    }
}
</script>

<style>
.query-container{
    padding-top:10px;padding-left:15px;
}
</style>
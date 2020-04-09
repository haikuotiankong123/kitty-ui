<template>
    <div>
        <om-table :data="omBlacklist" :columns="filterColumns" @findPage="findPageFunc" @handleDelete="handleDelete" :showHandle="true">
            <template v-slot:ext="{row}">
                {{row.ext | exts}}
            </template>
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
    </div>
</template>

<script>
import OmTable from "@/views/Core/OmTable"
import OmPage from "@/views/Core/OmPage"
import {mapActions, mapState} from 'vuex'
export default {
    components: {
        OmTable,
        OmPage
    },
    data(){
        return {
            filterColumns: [],
            columns: [],
            pageRequest: { pageNum: 1, pageSize: 10 },
            filters: {
				name: ''
			},
        }
    },
    mounted(){
        this.initColumns();

        let p = {pageNum: 1, pageSize:10}
        this.findPage(p)
    },
    computed:{
        ...mapState('omBlacklist', {
            omBlacklist: state => state.omBlacklist
        })
    },
    methods:{
        ...mapActions('omBlacklist', ['findPage', 'findAll', 'save', 'delete']),

        // isSlot: 是否启动插槽
        // 处理表格列过滤显示
      	initColumns() {
			this.columns = [
                {prop:'id', label: 'id'},
                {prop:'phone', label: '电话号码'},
                {prop:'type', label: '黑名单类型'},
                {prop:'state', label: '状态'}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
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
			this.pageRequest.columnFilters = {name: {name:'name', value: this.filters.name}}
			this.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
				this.findUserRoles()
			}).then(data!=null?data.callback:'')
		}
    }
}
</script>

<style>

</style>
<template>
    <div>
        <div style="float:left;padding-top:10px;padding-left:15px;">
            <!-- <el-form size="mini" :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="IVR名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="findPage(null)">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">添加IVR</el-button>
                </el-form-item>
            </el-form> -->
            <el-form :inline="true" size="mini">
                <el-form-item>
                    <el-input v-model="queryGroupForm.group_id" placeholder="请输入分机组id"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="queryGroupForm.voicefile" placeholder="请输入语音名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="queryGroupClick">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <om-table :data="queryGroup" :columns="filterColumns" @findPage="findPage" @handleDelete="handleDelete" :showHandle="true">
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
import OmTable from "@/components/omTable"
import {mapState, mapActions} from "vuex"
import storeUtil from "@/store/storeUtil"

export default {
    components: {
        OmTable
    },
    computed: {
        ...mapState({
            queryGroup: state=>state.queryGroup,
            queryGroupForm: state=>state.queryGroupForm
        })
    },
    data(){
        return {
            filterColumns: [],
            columns: []
        }
    },
    mounted(){
        this.initColumns();
        
        // 创建20个分机组
        /* 
        for(let i=1; i<20; i++){
            let time = i*100
            setTimeout(()=> {
                let param = {
                    group_id: i,
                    exts: '1004,1005,1010',
                    voicefile: 'welcome',
                    distribution: 'circular'
                }
                this.$store.commit('setAssignGroupForm', param)
                this.assignGroupClick()
            },time)
        }
         */
    },
    filters:{
        exts(ext){
            
            let val = '';
            ext.forEach(i => val = val + i.id + ',')
            return val
        }
    },
    methods: {
        ...mapActions(storeUtil.actions),

        // isSlot: 是否启动插槽
        // 处理表格列过滤显示
      	initColumns: function () {
			this.columns = [
                // {prop:'menuName', label: '菜单名称'},
                // {prop:'menuDesp', label: '描述'},
                {prop:'id', label: 'id'},
                {prop:'voicefile', label: '语音名称'},
                {prop:'ext', label: '组成员', isSlot: true}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	},
        findPage(){
            console.log('queryGroupForm----->', this.queryGroupForm)
        },
        // 批量删除
		handleDelete: function (data) {
            
			// this.$api.user.batchDelete(data.params).then(data!=null?data.callback:'')
        },
        handleEdit(index, row){
            console.log(index, row)
        },
        onDelete(){}
    }
}
</script>

<style>

</style>
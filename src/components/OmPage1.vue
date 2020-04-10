<template>
    <el-pagination 
    style="float:right;"
    small
    layout="total, prev, pager, next, jumper"
    :total="$store.state[name] && $store.state[name][name].totalSize"
    :page-size="pageSize"
    @current-change="handleCurrentChange"
    />
</template>

<script>
export default {
    props: ['name'],
    data(){
        return {
            pageSize: 15
        }
    },
    methods: {
        handleCurrentChange(num){
            let name = this.name
            let val = name + 'Form'
            let form = this.$store.state[name][val]
            let columnFilters = {}
            for(let name in form){
                let value = form[name]
                if(value) columnFilters[name] = {name, value}
            }
            let param = {
                columnFilters,
                pageSize: 15,
                pageNum: num
            }

            this.$api[name].findPage(param).then((resp)=>{
                
                let upper = name.charAt(0).toUpperCase()+name.slice(1);
                this.$store.commit(name +'/set'+upper, resp.data)
                
            })
        }
    }
}
</script>

<style>

</style>
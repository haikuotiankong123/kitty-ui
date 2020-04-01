<template>
    <el-pagination 
    small
    layout="total, prev, pager, next, jumper"
    :total="$store.state[name] && $store.state[name].total"
    :page-size="size"
    @current-change="handleCurrentChange"
    />
</template>

<script>
export default {
    props: ['name'],
    data(){
        return {
            size: 15
        }
    },
    methods: {
        handleCurrentChange(num){
            let val = this.name + 'From'
            let from = this.$store.state[val]
            let param = {
                ...from,
                size: 15,
                page: num
            }
            this.$api[name](param)
        }
    }
}
</script>

<style>

</style>
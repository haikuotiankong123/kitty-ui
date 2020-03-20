<template>
    <div>
        <h1>分机管理</h1>
    </div>
</template>

<script>
export default {
    data(){
        return {
            assignTable: []
        }
    },
    mounted(){
        this.$api.queryDevice().then((resp) => {
            if(resp.success){
                this.assignTable = resp.data
                //console.log('分机数据----->', this.assignTable.ext)
            }
        })
    },
    method:{}
}
</script>

<style scoped lang="scss">

</style>
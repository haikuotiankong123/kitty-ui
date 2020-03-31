<template>
  <div>
      <h1>分机组</h1>
  </div>
</template>

<script>
import OmTable from "@/views/Core/OmTable"
export default {
    data(){
        return {
            table: []
        }
    },
    mounted(){
        this.$api.queryGroup().then(resp => {
            if(resp.success){
                this.table = resp.data;
                console.log('表格数据----->', this.table);
            }
        })
    }
}
</script>

<style>

</style>
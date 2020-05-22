<template>
    <div>
        <h1>项目流程</h1>
    </div>
</template>

<script>
import {selectFlowAction} from '@/mock/modules/selectFlowAction'
export default {
    data(){
        return {}
    },
    watch:{
        '$router'(){

        }
    },
    mounted(){
        this.loadData()
        console.log('测试数据-----》', selectFlowAction())
    },
    methods:{
        loadData(){
            let sign = this.$route.params.sign;
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
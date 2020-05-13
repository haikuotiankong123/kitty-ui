<template>
    <el-select :placeholder="placeholder" v-model="innerValue" :multiple="multiple" clearable>
        <el-option v-for="i in data" :key="i.id" :value="i.id" :label="i.name || i.title || i.account"></el-option>
    </el-select>
</template>

<script>
export default {
    props:['value', 'data', 'placeholder', 'multiple'],
    data(){
        return {
            innerValue: undefined
        }
    },
    watch:{
        innerValue(value){
            this.$emit('input', value)
        },
        value(value){
            this.innerValue = value || undefined;    
        }
    },
    mounted(){
        this.innerValue = this.value || undefined;
    }
}
</script>

<style>

</style>
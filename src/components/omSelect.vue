<template>
    <!--
        v-model="innerValue" 
        等同
        :value="innerValue"
        @input="innerValue = $event"
    -->
    <el-select 
        :placeholder="placeholder" 
        v-model="innerValue" 
        :multiple="multiple" 
        @change="change"
        @blur="blur"
        @focus="focus"
        @clear="clear"
        @visible-change="visibleChange"
        clearable>
        <el-option v-for="i in data" 
            :key="i.id" 
            :value="i.id" 
            :label="i.name || i.title || i.account"></el-option>
    </el-select>
</template>

<script>
export default {
    props:['value', 'data', 'placeholder', 'multiple'],
    data(){
        return {
            innerValue: undefined,
            copyData: []
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
    },
    methods:{
        change(val){
            this.$emit('change', val)
        },
        blur(val){
            this.$emit('blur', val)
        },
        focus(val){
            this.$emit('focus', val)
        },
        clear(val){
            this.$emit('clear', val)
        },
        visibleChange(val){
            this.$emit('visible-change', val)
        }
    }
}
</script>

<style>

</style>
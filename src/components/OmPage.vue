<template>
    <el-pagination 
    style="float:right;"
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
            let name = this.name
            let val = name + 'Form'
            let from = this.$store.state[val]
            let param = {
                ...from,
                size: 15,
                page: num
            }

            this.$api[name](param).then((resp)=>{
                if(resp.success){
                    let list = resp.data.map(i => {
                        i.value = i.voiceFile;
                        return i;
                    })
                    let result = {
                        list,
                        total: list.length
                    }
                    let upper = name.charAt(0).toUpperCase()+name.slice(1);
                    this.$store.commit('set'+upper, result)
                }
            })
        }
    }
}
</script>

<style>

</style>
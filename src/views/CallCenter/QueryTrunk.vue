<template>
    <div>
        <h1>中继管理</h1>
        <div class="trunk-table">
            <el-table
                :data="tableData.visitor | noUn">
                <el-table-column
                    prop="from"
                    label="来电号码">
                </el-table-column>
                <el-table-column
                    prop="state"
                    label="状态">
                    <template v-slot="scope">
                        {{scope}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="to"
                    label="接听号码">
                </el-table-column>
            </el-table>

            <el-table
                :data="tableData.outer | noUn">
                <el-table-column
                    prop="to"
                    label="去电号码">
                </el-table-column>
                <el-table-column
                    prop="state"
                    label="状态">
                </el-table-column>
                <el-table-column
                    prop="from"
                    label="本机号码">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
    data(){
        return {
            tableData: {
                id: '',
                lineId: 'Line 3',
                outer: [
                    {
                        callIn: '20513',
                        form: '1005',
                        id: 33,
                        state: 'talk',
                        to: '13602714551',
                        trunk: '31604149'
                    }
                ],
                visitor: [
                    {
                        callIn: '20516',
                        form: '13602714551',
                        id: 36,
                        state: 'talk',
                        to: '31604149',
                        trunk: '31604149'
                    }
                ]
            }
        }
    },
    filters:{
        noUn(val){
            alert('表格值----》')
            if(!val) return [];
            return val
        }
    },
    computed:{
        queryTrunk(){
            return this.$store.state.queryTrunk;
        }
    }
}
</script>

<style lang="scss" scoped>
.trunk-table{
    display: flex;
    &>.el-form{
        flex: 1;
    }
}
</style>
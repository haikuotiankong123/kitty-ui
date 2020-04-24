<template>
    <div>
        <el-form :size="size" style="padding:20px 0 0 20px;">
            <el-form-item label="请选择中继线">
                <el-select v-model="lineVal">
                    <el-option v-for="i in line" 
                        :key="i.id"
                        :label="i.id"
                        :value="i.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="total">
            <el-radio-group v-model="radio1" :size="size" >
                <el-radio-button label="当天"></el-radio-button>
                <el-radio-button label="当周"></el-radio-button>
                <el-radio-button label="当月"></el-radio-button>
            </el-radio-group>
            <ul class="total-num">
                <li>
                    <el-progress type="circle" :percentage="25"></el-progress><br/>
                    呼出数
                </li>
                <li>
                    <el-progress type="circle" :percentage="25"></el-progress><br/>
                    呼入数
                </li>
                <li>
                    <el-progress type="circle" :percentage="25"></el-progress><br/>
                    总数
                </li>
                <li>
                    <el-progress type="circle" :percentage="25"></el-progress><br/>
                    占用数
                </li>
            </ul>
        </div>
        <div class="trunk-table">
            <div class="table-one">
                <h3>来电</h3>
                <el-table
                    :size="size"
                    border
                    :data="tableData.visitor | noUn">
                    <el-table-column
                        prop="from"
                        label="来电号码">
                    </el-table-column>
                    <el-table-column
                        prop="state"
                        label="状态">
                    </el-table-column>
                    <el-table-column
                        prop="to"
                        label="接听号码">
                    </el-table-column>
                </el-table>
            </div>

            <div class="table-two">
                <h3>去电</h3>
                <el-table
                    :size="size"
                    border
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
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
    data(){
        return {
            size: 'small',
            tableData: {
                id: '',
                lineId: 'Line 3',
                outer: [
                    {
                        callIn: '20513',
                        from: '1005',
                        id: 33,
                        state: 'talk',
                        to: '13602714551',
                        trunk: '31604149'
                    }
                ],
                visitor: [
                    {
                        callIn: '20516',
                        from: '13602714551',
                        id: 36,
                        state: 'talk',
                        to: '31604149',
                        trunk: '31604149'
                    }
                ]
            },
            line: [
                {
                    "id": "31604149",
                    "lineId": "Line 3"
                },
                {
                    "id": "31603676",
                    "lineId": "Line 4"
                }
            ],
            lineVal: '',
            radio1: '当天'
        }
    },
    filters:{
        noUn(val){
            
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
    .table-one{
        width: 47%;
        margin-left: 1%;
        float: left;
    }
    .table-two{
        width: 47%;
        margin-right: 1%;
        float: right;
    }
    h3{
        line-height: 1.2;
        padding-left: 5px;
        border-left: 3px solid #E6A23C;
        margin-top: 20px;
        margin-bottom: 10px;
    }
}
.total{
    padding: 20px 20px 20px 20px;
    background: #F2F6FC;
}
.total-num{
    display: flex;
    padding-top: 10px;
    li{
        flex: 1;
        text-align: center;
    }
}
</style>
<template>
    <div>
        <div class="query-container">
            <el-form :size="size">
                <el-form-item label="请选择中继线">
                    <el-select v-model="lineVal" @change="changeTrunk">
                        <el-option label="全部" value="1"></el-option>
                        <el-option v-for="i in queryAllTrunk" 
                            :key="i.trunkId"
                            :label="i.trunkId"
                            :value="i.trunkId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="right">
                <el-button size="mini" type="success" @click="updateFunc">刷新</el-button>
            </div>
        </div>
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
                        label="中继号">
                        <template v-slot="scope">
                            {{scope.row.trunk || scope.row.to}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="to"
                        label="接听号码">
                        <template v-slot="scope">
                            {{(scope.row.omExt && scope.row.omExt.id) || scope.row.to}}
                        </template>
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
                        label="中继号">
                        <template v-slot="scope">
                            {{scope.row.trunk}}
                        </template>
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
            line: [],
            lineVal: '1',
            radio1: '当天'
        }
    },
    filters:{
        noUn(val){
            if(!val) return [];
            return val
        }
    },
    mounted(){
        
    },
    computed:{
        tableData(){
            let outer = this.$store.state.queryOuter;
            let visitor = this.$store.state.queryVisitor;
            
            return {outer, visitor}
        },
        ...mapState(['queryAllTrunk', 'queryOuter', 'queryVisitor']),
    },
    methods:{
        ...mapActions([ 'queryOuterClick', 'queryVisitorClick']),
        async changeTrunk(val){
            if(val == '1'){
                await this.queryOuterClick().catch(err => {})
                this.queryVisitorClick()
            }else{

                this.$api.queryTrunk({'trunk_id':val}).then(resp => {
                    this.$store.state.queryOuter = resp.data.outer;
                    this.$store.state.queryVisitor = resp.data.visitor;
                })
            }
        },
        updateFunc(){
            this.changeTrunk(this.lineVal)
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
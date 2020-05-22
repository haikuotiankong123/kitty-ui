<template>
    <div>
        <!-- class="button-container" -->
        <div>
            <audio src="@/assets/3161.mp3" type="audio/mpeg" controls id="audio" style="height:20px;"></audio>
        </div>
        
        <el-table :data="callList" v-loading="loading" size="small">
            <el-table-column prop="index" type="index" label="序号" width="70"></el-table-column>
            <el-table-column prop="caller" label="主叫号码" :show-overflow-tooltip="true"></el-table-column>

            <el-table-column prop="callee" label="被叫号码" :show-overflow-tooltip="true" width="150"></el-table-column>

            <el-table-column prop="createTime" label="时间" :show-overflow-tooltip="true" width="200"></el-table-column>

            <el-table-column prop="duration" label="通话时长" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">{{scope.row.duration+"秒"}}</template>
            </el-table-column>

            <el-table-column prop="answerTime" label="振铃时长" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    {{ scope.row.answerTime&& scope.row.createTime&& (f(scope.row.answerTime) -
                    f(scope.row.createTime))/1000 +"秒" }}
                </template>
            </el-table-column>

            <el-table-column label="呼入呼出" :show-overflow-tooltip="true">
                <!--* 参数: hangup 1主叫挂机 2被叫挂机	Integer hangup-->
                <!--* 参数:qcStatus 0未质检 1质检合格 2质检不合格	Integer qcStatus-->

                <template slot-scope="scope">
                    <span v-if="'1'==scope.row.type">呼入</span>

                    <span v-if="'2'==scope.row.type">呼出</span>
                </template>
            </el-table-column>

            <el-table-column label="通话状态" :show-overflow-tooltip="true">
                <!--* 参数: type 1呼入 2呼出	Integer type-->
                <!--* 参数: hangup 1主叫挂机 2被叫挂机	Integer hangup-->
                <!--* 参数:qcStatus 0未质检 1质检合格 2质检不合格	Integer qcStatus-->
                <template slot-scope="scope">{{formatResult(scope.row).result}}</template>
            </el-table-column>

            <!--* 参数:qcStatus 0未质检 1质检合格 2质检不合格	Integer qcStatus-->
            <!-- <el-table-column label="质检结果" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-if="'1'==scope.row.qcStatus">质检合格</span>
                    <span v-if="'2'==scope.row.qcStatus">质检不合格</span>
                    <span v-if="'0'==scope.row.qcStatus">未质检</span>
                </template>
            </el-table-column> -->

            <!-- <el-table-column prop="qcBack" label="质检退回" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-if="1==scope.row.qcBack">质检退回</span>
                </template>
            </el-table-column>
            <el-table-column prop="qcNotice" label="退回提示" :show-overflow-tooltip="true"></el-table-column> -->

            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="scope">
                    <!-- <a
                        class="button play"
                        size="mini"
                        @click="asr(scope.row)"
                        v-if="scope.row.recordUrl"
                    >
                        <i class="icon-fenxi icon iconfont" style="padding-right: 5px"></i>文本
                    </a>

                    <a
                        class="button play"
                        size="mini"
                        @click="asr(scope.row)"
                        v-else
                        style=" color: #eee;cursor: auto"
                    >
                        <i class="icon-fenxi icon iconfont" style="padding-right: 5px"></i>文本
                    </a> -->

                    <a
                        class="button play"
                        size="mini"
                        @click="playRecord(scope.row)"
                        v-if="scope.row.recordUrl"
                    >
                        <i class="icon-xiaolaba icon iconfont" style="padding-right: 5px"></i>播放
                    </a>

                    <a class="button play" size="mini" v-else style=" color: #eee;cursor: auto">
                        <i class="icon-xiaolaba icon iconfont" style="padding-right: 5px"></i>播放
                    </a>

                    <!--<a class="button edit" size="mini" @click="qC(scope.row)">-->
                    <!--<i class="icon-anquanjianchaon icon iconfont"-->
                    <!--style="padding-right: 5px"></i> 质检</a>-->

                    <!-- <a
                        class="button download"
                        size="mini"
                        v-if="scope.row.recordUrl"
                        :href="recordsUrl + scope.row.recordUrl"
                        target="_blank"
                    >
                        <i class="icon-xiazai icon iconfont" style="padding-right: 5px"></i> 下载
                    </a>

                    <a class="button download" size="mini" v-else style=" color: #eee;cursor: auto">
                        <i class="icon-xiazai icon iconfont" style="padding-right: 5px"></i> 下载
                    </a> -->
                </template>
            </el-table-column>
        </el-table>

        <!-- <ag-page name="pageCallOut" /> -->
    </div>
</template>

<script>
import { pageCallOut } from "@/mock/modules/pageCallOut.js";
export default {
    data() {
        return {
            callList: [],
            loading: false,
            src: ''
        };
    },
    mounted() {
        this.callList = pageCallOut().data;
    },
    methods:{
        f(a) {
				return new Date(Date.parse(a.substring(0, a.length).replace(/-/g, "/")));
        },
        formatResult(row) {
            //console.error("o.result", row.result)
            let o = Object.assign({}, row)
            if (o.result == "1") {
                if (o.hangup == '1') {
                    o.result = "主叫挂机"
                } else if (o.hangup == '2') {
                    o.result = "被叫挂机"
                }
            } else if (o.result == "2") {
                if (o.hangupCause == 'NORMAL_CLEARING') {
                    o.result = '正常通话'
                } else if (o.hangupCause == "NO_ANSWER") {
                    o.result = '无应答'
                } else if (o.hangupCause == "UNALLOCATED_NUMBER") {
                    o.result = '空号'
                } else if (o.hangupCause == "USER_BUSY") {
                    o.result = '用户忙'
                } else if (o.hangupCause == "ORIGINATOR_CANCEL") {
                    o.result = '主叫取消'
                } else if (o.hangupCause == "CALL_REJECTED") {
                    o.result = '被叫拒绝'
                } else if (o.hangupCause == "NO_USER_RESPONSE") {
                    o.result = '用户无应答'
                } else if (o.hangupCause == "RECOVERY_ON_TIMER_EXPIRE") {
                    o.result = '超时恢复'
                } else if (o.hangupCause == "NORMAL_TEMPORARY_FAILURE") {
                    o.result = '坐席忙'
                } else if (o.hangupCause == "NO_ROUTE_DESTINATION") {
                    o.result = ''
                } else {
                    o.result = ''
                }
            } else {
                o.result = '呼叫取消'
            }
            return o
        },
        playRecord(row) {
            /* recordsUrl */
            this.src = row.recordUrl
            setTimeout(() => {
                document.getElementById('audio').play()

            }, 500)
        }
    }
};
</script>

<style>
</style>
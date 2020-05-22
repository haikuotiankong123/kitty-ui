<template>
    <div style="padding:20px;">
        <!-- class="button-container" -->
        <div>

            <el-form :inline="true" style="margin-left: 20px;border-bottom: 1px solid #ebedf0">
                <el-form-item label="分机组：">
                    <el-select v-model="groupName" value-key="groupId" @change="changeGroup" size="small">
                        <el-option v-for="i in extGroup"
                            :key="i.groupId"
                            :label="i.groupId"
                            :value="i"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="坐席状态选择：" style="color: #0DAEAF;margin-bottom: 0">
                    <el-checkbox-group v-model="stateList">
                        
                        <el-checkbox label="未登录">
                            <i class="icons icon-zhanghu2" style="color: #B3B3B3"></i>未登录
                        </el-checkbox>
                        <el-checkbox label="空闲">
                            <i class="icons icon-zhanghu2" style="color: #3BD77D"></i>空闲
                        </el-checkbox>
                        <el-checkbox label="拨号中">
                            <i class="icons icon-zhanghu2" style="color: #F45656"></i>拨号中
                        </el-checkbox>
                        <el-checkbox label="使用中">
                            <i class="icons icon-zhanghu2" style="color: #FA9ACE"></i>使用中
                        </el-checkbox>
                        <el-checkbox label="听催挂音">
                            <i class="icons icon-zhanghu2" style="color: #B3B3B3"></i>听催挂音
                        </el-checkbox>

                    </el-checkbox-group>
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button @click="loadData" size="mini" type="success">
                        <i class="icon-refresh icons" ></i> 刷新
                    </el-button>
                </el-form-item>

            </el-form>

        </div>


        <div>
            <ul class="agent-list">
				<li v-for="(o, index) in  getExtList" :key="index" @click="onInternalDetail(o)">
					<p class="hand-portrait">
						<i class="icons icon-zhanghu2" :style="o | filterState('color')"></i>
					</p>
					<p class="agent-info">
						<span style="color:#333;">{{o.extId}}</span> <br/>
						<span>{{o.extId}}</span> <br/>
                        <span><i :class=" o | filterState('icon')" ></i> {{o | filterState('text')}}</span>
					</p>
				</li>
			</ul>
        </div>

        <!--  -->
        <div class="cur-internal" v-show="curInternalVisible">
				<p class="close" @click="onCloseInternal"><i class="icons icon-close"></i></p>
				<header>
					<p style="line-height:1;">
						<i class="icons icon-zhanghu2" style="font-size:60px;" :style="curExt | filterState('color')"></i>
					</p>
					<p style="color:#333;">{{curExt.extId}}</p>
					<p>{{curExt.extId}}</p>
                    <p><i :class=" curExt | filterState('icon')" ></i> {{curExt | filterState('text')}}</p>
					<!-- <p v-if="curExt.lastOfferedCall" v-text="'状态时间：'+formatMsgTime(curExt.lastOfferedCall * 1000)" style="font-size:12px;"></p> -->
				</header>
				<div class="cur-internal-bottom">
					<p v-show="curExt.state == 'active'">
						<el-button type="primary" size="small" @click="watchCall(curExt)">监听通话</el-button>
					</p>
					<p v-show="curExt.state == 'active'" style="padding-bottom:20px;">
						<el-button type="primary" size="small" @click="onThreeway(curExt)">强插对话</el-button><br/>
					</p>
                    <p v-show="curExt.state == 'active'" style="padding-bottom:20px;">
						<el-button type="primary" size="small" @click="closeCall(curExt)">关闭对话</el-button><br/>
					</p>
                    <p>
                        <el-button  
                            v-if="curExt.noDisturb === 'yes'"
                            type="warning" 
                            size="small" 
                            icon="el-icon-remove-outline" 
                            @click="assignExtFunc(curExt)" round>取消免打扰</el-button>
                        <el-button 
                            v-else
                            type="danger" 
                            size="small" 
                            icon="el-icon-more"
                            @click="assignExtFunc(curExt)" round>开启免打扰</el-button>
                    </p>
                    
				</div>
        </div>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
    data(){
        return {
            stateList: ["未登录", "空闲", "拨号中", "使用中", "听催挂音"],
            curExt: {},
            curInternalVisible: false,
            groupName: '',
            extMonitor: [],
            joinExt: '',
            isJoin: false
        }
    },
    mounted() {
        this.findPage();
        setTimeout(() => {
            console.log('分机--->', this.queryAllExt)
        },3000)
        //this.$api.assignGroup({group_id: '1', exts: '1004, 1010, 1005, 1006',voicefile: 'welcome',distribution: 'circular'})
    },
    filters: {
        filterState(o, type){
            
            if(!o) return;
            let state = {}
            let color = undefined
            
            // 线路状态，Ready：空闲，Active：使用中，Progress：拨号中，Offline：离线，Offhook：听催挂音
            if (o.state == "progress") {
                state = {
                    color: "color:#F45656",
                    text: '拨号中',
                    icon: 'icons icon-waihuguanli'
                }

            } else if (o.state == "active") {
                state = {
                    color: 'color:#FA9ACE',
                    text: '使用中',
                    icon: 'icons icon-baochi'
                }

            } else if (o.state == "ready") {
                state = {
                    color: 'color:#3BD77D',
                    text: '空闲',
                    icon: 'icons icon-success'
                }

            } else if (o.state == "offline") {
                state = {
                    color: 'color:#B3B3B3',
                    text: '未登录',
                    icon: 'icons icon-information'
                }

            } else if (o.state == "offhook"){
                state = {
                    color: 'color:#B3B3B3',
                    text: '听催挂音',
                    icon: 'icons icon-information'
                }
            }
            if(state[type]) return state[type];

            return state
        }
    },
    computed:{
        ...mapState('omGroup', {
            groupData: state=>state.dataResp
        }),
        ...mapState({
            queryAllExt: state => state.queryAllExt,
            queryExt: state => state.queryExt
        }),
        extGroup(){
            let data = this.$store.state.queryGroup
            setTimeout(() => {
                if(data[0]){
                    this.groupName = data[0];
                    this.changeGroup(data[0])
                }
            },1000)
            /* this.$nextTick(()=>{
                if(data[0]){
                    this.groupName = data[0];
                    this.changeGroup(data[0])
                }
            }) */
            return data;
        },
        getExtList(){
            let arr = []
            this.extMonitor.forEach((i) => {
                //["未登录", "空闲", "拨号中", "使用中", "听催挂音"],

                if ((this.stateList.indexOf("未登录") !== -1) && i.state == 'offline') {
                    arr.push(i)
                    return;
                }
                if ((this.stateList.indexOf("空闲") !== -1) && i.state == 'ready') {
                    arr.push(i)
                    return;
                }

                if ((this.stateList.indexOf("拨号中") !== -1) && i.state == 'progress') {
                    arr.push(i)
                    return;
                }

                if ((this.stateList.indexOf("使用中") !== -1) && i.state == 'active') {
                    arr.push(i)
                    return;
                }

                if ((this.stateList.indexOf("听催挂音") !== -1) && i.state == 'offhook') {
                    arr.push(i)
                    return;
                }
            })
            return arr
        },
        getStyle() {

            return function (o) {
                if(!o) return;
                let color = undefined
                console.log('------》', o.state)
                // 线路状态，Ready：空闲，Active：振铃，Progress：拨号中，Offline：离线，Offhook：听催挂音
                if (o.state == "progress") {
                    color = "#F45656"
                } else if (o.state == "active") {
                    color = "#FA9ACE"
                } else if (o.state == "ready") {
                    color = "#3BD77D"
                } else if (o.status == "offline") {
                    color = "#B3B3B3"
                }

                return {
                    fontSize: "60px",
                    color: color
                }
            }
        },
        formatMsgTime() {

            function timestampToTime(timestamp) {
                let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() + ' ';
                let h = date.getHours() + ':';
                let m = date.getMinutes() + ':';
                let s = date.getSeconds();
                return Y + M + D + h + m + s;
            }
            return function (timespan) {
                if(!timespan) return '无';
                if (timespan === undefined || timespan == 0) {
                    return ""
                }
                //timespan = new Number(timespan)
                let time = new Date(timespan)
                
                let year = time.getFullYear();
                let month = time.getMonth() + 1;
                let day = time.getDate();
                let hour = time.getHours();
                let minute = time.getMinutes();
                let second = time.getSeconds();

                let now_new = Math.round(new Date().getTime())
                let s = (now_new - time.getTime())/1000;
                let timeSpanStr;

                if (s <= 60 * 1) {
                    timeSpanStr = s + '秒前';
                } else if (60 * 1 < s && s <= 60*60) {
                    timeSpanStr = Math.round((s / (60))) + '分钟前';
                } else if (60 * 60 * 1 < s && s <= 60 * 60 *24) {
                    timeSpanStr = Math.round(s / (60 * 60)) + '小时前';
                } else if (60 * 60 * 24 < s && s <= 60 * 60 * 24 * 15) {
                    timeSpanStr = Math.round(s / (60 * 60 * 24)) + '天前';
                } else if (s > 60 * 60 * 24 * 15 && year == new Date().getFullYear()) {
                    timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
                } else {
                    timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
                }
                
                return timeSpanStr;
            }
        }
    },
    methods: {
        ...mapActions('omGroup', ['findPage', 'findAll', 'save', 'delete']),
        ...mapActions(['queryExtClick']),

        loadData(){
            this.changeGroup(this.groupName);
            this.onCloseInternal()
        },
        assignExtFunc(curExt){
            if(!(curExt && curExt.extId)) return;

            let param =  {extId: curExt.extId, lineid: curExt.lineid}
            //let val = curExt.noDisturb
            let ext_id = curExt.extId
            param.noDisturb = curExt.noDisturb == 'yes' ? 'no' : 'yes';
            
            this.$api.assignExt(param).then((resp)=>{
                if(resp.success){
                    this.curExt = resp.data
                    this.$message(resp.message);
                }
            })
        },
        changeGroup(item){
            
            if(!item) return;
            if(item.ext && item.ext.length){
                this.extMonitor = [];
                this.queryExtFunc(item.ext)
            }
        },
        queryExtFunc(arrId){
            if(!arrId) return;
            let arr = []
            arrId.forEach(async (i) => {
                // 不能使用queryExtClick请求
                await this.$api.queryExt({ext_id: i.extId}).then(resp => {
                        arr.push(resp.data)
                    }).catch(e => this.$message.error(e.message))
            })
            this.extMonitor = arr;
        },
        onCloseInternal(){
            this.curExt = {};
            this.curInternalVisible = false;
        },
        onInternalDetail(obj){
            this.curInternalVisible = true;
            this.curExt = obj;
        },
        editCallStatusFunc(int) {
            if(!(int && int.account && int.status)) return '参数有误！'
            let status, account = int.account;
            if(int.status === 'Logged Out'){
                status = 1
            }else if(int.status === 'Available'){
                status = 2;
            }
            /* api.editCallStatus({account, status}).then((res)=>{
                if(res.success){
                    status == 1 ? 
                    int.status = 'Available' :
                    int.status = 'Logged Out';
                }
            }) */
        },
        // 监听通话
        watchCall(ext){
            let param = {cmd:'monitor', ext_id: this.queryExt.extId, other_ext_id:ext.extId}
            this.$api.controlCmd(param)
        },
        // 强插对话
        onThreeway(ext){
            let param = {cmd:'bargein', ext_id: this.queryExt.extId, other_ext_id:ext.extId}
            this.$api.controlCmd(param)
        },
        // 关闭通话
        closeCall(ext){
            //let param = {cmd:'clear', ext_id: this.queryExt.extId, other_ext_id:ext.extId}
            let param = {cmd:'clear', ext_id: ext.extId}
            this.$api.controlCmd(param)
        }
    }
}
</script>

<style lang="scss" scoped >
.cur-internal{
	overflow: hidden;
	position: absolute;
	right: 10px;
	bottom: 10px;
	z-index: 111;
	width: 406px;
	height: calc(100% - 160px);
	background: #fff;
    box-shadow: 0 0 10px 0 rgba(0,0,0,.2);
    p{
        text-align: center;
    }
	header{
		height: 190px;
		padding-top: 40px;
		border-bottom: 1px solid #D9DFEA;
		line-height: 1.5;
	}
	.cur-internal-bottom{
		padding-top: 10px;
		button{
			width: 158px;
			height: 32px;
			margin-top: 20px;
		}
	}
	.close{
		position: absolute;
		left: -25px;
		top: -25px;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background: #FF4E4E;
		cursor: pointer;
		color: #fff;
		i{
			position: absolute;
			right: 5px;
			bottom: 5px;
		}
	}
}
.agent-list{
    padding: 30px 0;
	li{
		height: 100px;
		width: 240px;
		box-shadow: 0 0 5px 0 rgba(0,0,0,.1);
		display: inline-block;
		margin: 0 0 20px 20px;
		cursor: pointer;
		.hand-portrait{
			width: 60px;
			height: 60px;
			padding: 14px 10px;
            display: inline-block;
            &>i{
                font-size: 60px;   
            }
		}
		.agent-info{
			padding: 14px;
			padding: 14px 14px 14px 0;
			display: inline-block;
            color:#999;
            span{
                display: inline-block;
                padding-top: 3px;
            }
		}
	}
}
</style>
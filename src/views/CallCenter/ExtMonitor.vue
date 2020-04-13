<template>
    <div>

        <!-- v-show="curInternalVisible" -->
        <div class="cur-internal" >
				<p class="close" @click="onCloseInternal"><i class="icon iconfont icon-close"></i></p>
				<header>
					<p style="line-height:1;">
						<i class="icon iconfont icon-zhanghu2" :style="getStyle(curInternal)"></i>
					</p>
					<p style="color:#333;">{{curInternal.name}}</p>
					<p>{{curInternal.account}}</p>
					<p v-if="curInternal.lastOfferedCall" v-text="'状态时间：'+formatMsgTime(curInternal.lastOfferedCall * 1000)" style="font-size:12px;"></p>
				</header>
				<div class="cur-internal-bottom">
					<p v-show="curInternal.state == 'In a queue call'">
						<el-button type="primary" size="small" @click="watchCall(curInternal)">监听通话</el-button>
					</p>
					<p v-show="curInternal.state == 'In a queue call'">
						<el-button type="primary" size="small" @click="onThreeway(curInternal)">插入对话</el-button>
					</p>

					<el-button
						@click="editCallStatusFunc(curInternal)"
						style="background-color: #ffbc3c; padding:0;"
						v-if="curInternal.status === 'Available'"
					>
						<span style="color: white">
						<i class="iconfont icon-shimang"></i>&nbsp;&nbsp;开启免打扰
						</span>
					</el-button>
					<el-button
						@click="editCallStatusFunc(curInternal)"
						v-if="curInternal.status === 'Logged Out'"
						style="background-color: #f45656;  padding:0;"
					>
						<span style="color: white">
						<i class="iconfont icon-shixian"></i>&nbsp;&nbsp;示闲
						</span>
					</el-button>
				</div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            curInternal: {},
            curInternalVisible: false
        }
    },
    computed:{
        getStyle() {

            return function (o) {
                if(!o) return;
                let color = undefined
                
                if (o.state == "In a queue call") {
                    color = "#F45656"
                } else if (o.state == "Receiving") {
                    color = "#FA9ACE"
                } else if (o.state == "Waiting" && o.status == "Available") {
                    color = "#3BD77D"
                } else if (o.status == "Logged Out" && o.isOnline == 1) {
                    color = "#F4B356"
                } else if (o.status == "Logged Out") {
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
        onCloseInternal(){},
        editCallStatusFunc(int) {
            if(!(int && int.account && int.status)) return '参数有误！'
            let status, account = int.account;
            if(int.status === 'Logged Out'){
                status = 1
            }else if(int.status === 'Available'){
                status = 2;
            }
            api.editCallStatus({account, status}).then((res)=>{
                if(res.success){
                    status == 1 ? 
                    int.status = 'Available' :
                    int.status = 'Logged Out';
                }
            })
        },
        // 监听通话
        watchCall(int){
            if(!(int && int.account)) return '分机参数有误';
            const account = int.account
            //api.editEavesdrop({account})
        },
        // 插入对话
        onThreeway(int){
            if(!(int && int.account )) return '分机参数有误';
            const account = int.account
            //api.editThreeway({account})
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
	text-align: center;
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
</style>
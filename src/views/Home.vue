<template>
  <div class="container">
        <!-- 导航菜单栏 -->
        <nav-bar></nav-bar>
        <!-- 头部区域 -->
        <head-bar></head-bar>
        <!-- 主内容区域 -->
        <main-content></main-content>
  </div>
</template>

<script>
import {acountInfo} from '@/mock/modules/acountInfo'
import {mapState} from 'vuex'
import HeadBar from "./HeadBar/HeadBar"
import NavBar from "./NavBar/NavBar"
import MainContent from "./MainContent/MainContent"
import Cookies from "js-cookie"
import ws from "@/utils/ws"
export default {
    data(){
        return {}
    },
    watch:{
        '$route'(data){
            this.$store.commit('setRouteInfo', data)
        }
    },
    computed: {
        ...mapState({
            acountInfo: state => state.app.acountInfo,
            extState: state => state.ext.extState,
            callState: state => state.ext.callState
        })
    },
    components:{
        HeadBar,
        NavBar,
        MainContent
    },
    created(){

        //console.log('开始路由---->', this.$route)
        this.$store.commit('setRouteInfo', this.$route)
        
        // 无
        let acount = acountInfo().data
        this.$store.commit("setAcountInfo", acount)
        
        let websocketUrl = this.global.websocketUrl;
        let token = Cookies.get("token")
        console.log('ws地址------>', websocketUrl+token)
        let external
        window.ws = ws(websocketUrl+token, (resp)=>{
        
            if(resp === "连接成功") return;

            let json = JSON.parse(resp);
            let type = json.type


            // 分机状态：上线，下线，空闲，忙
            let aExtState = [
                {type:'EXT_ONLINE', name: '在线'},
                {type:'EXT_OFFLINE', name: '离线'},
                {type:'EXT_IDLE', name: '空闲'},
                {type:'EXT_BUSY', name: '忙'},
            ]
            let oState = aExtState.find(i => i.type == type)
            if(oState){
                this.$store.commit('setExtState', {...oState,...json})
                console.log('分机状态------>', this.extState)
                if(type == "EXT_IDLE") this.$store.commit('setCallState', {})
                return
            }

            // 呼叫状态
            // 振铃事件：分机呼外部，分机呼分机，来电转分机，菜单呼分机
            let aRing = ['OUTER_CALL_ARRIVED', 'EXT_CALL_ARRIVED', 'VISITOR_CALL_ARRIVED', 'MNEU_CALL_ARRITED']
            let ringIndex = aRing.indexOf(type)
            if(ringIndex > -1){
                let isVisitor;
                if(type == 'VISITOR_CALL_ARRIVED'){
                    isVisitor = true
                }else{
                    isVisitor = false
                }
                this.$store.commit('setCallState', {...json, isVisitor})
                console.log('呼叫状态------>', this.callState)
                return
            }

            // 发起呼叫
            if(json.type === 'offering'){
                external = json.fromPhone
            }

            // 呼叫
            if(json.type === 'onOutgoing'){
                let params = {
                    phone: external,
                    uuid: ''
                }
                // 无
                this.$api.listCustomerByPhone(params).then((resp)=>{
                    let data = resp.data.length == 0 ? [{phone: external}] : resp.data;
                })
                // 跳转页面
                this.$router.push('/sys/customer');

                window.vm.$emit('onOutgoing', {...json})
            }

            // 接听
            if(json.type === 'answer'){
                window.vm.$emit('answer')
            }

            // 挂机
            if(json.type === 'hangup'){
                window.vm.$emit('hangup')
            }

        },(err)=>{
            console.log(err)
        });

        // 运行websocket
        window.ws.open();
    },
    
};
</script>

<style scoped lang="scss">
  .container {
    position:absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #eef1f6;
    // background: rgba(224, 234, 235, 0.1);
  }
</style>  
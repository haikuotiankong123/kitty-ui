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
import {mapState, mapActions} from 'vuex'
import util from '@/utils/util'
import HeadBar from "@/components/HeadBar/HeadBar"
import NavBar from "@/components/NavBar/NavBar"
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
            acountInfo: state => state.acountInfo,
            extState: state => state.extState,
            callState: state => state.callState
        })
    },
    components:{
        HeadBar,
        NavBar,
        MainContent
    },
    created(){
        this.loadData();

        //console.log('开始路由---->', this.$route)
        this.$store.commit('setRouteInfo', this.$route)
        
        
        
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
                //console.log('分机状态------>', this.extState)
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
                let data  = json.data;
                
                if(toString.call(data) == "[object Object]"){
                    !data.id &&  data.recId &&  (data.id = data.recId);
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
    mounted(){},
    methods: {
        ...mapActions(['queryAllExtClick', 'queryGroupClick', 'queryAllTrunkClick', 'queryOuterClick','queryVisitorClick', 'queryVoicefileClick','queryMenuClick']),

        loadData(){
            this.acountInfoFunc()
            this.queueRequest()
        },  
        
        async queueRequest(){
            
            let h = err => {
                util.error(err.message)
            }

            // 当前分机
            let param = {ext_id: this.acountInfo.extId}
            await this.$api.queryExt(param).then((resp) => {
                        if(resp.success){
                            this.$store.commit('setQueryExt', resp.data)
                        } 
                    }).catch(h);

            // 所有分机
            await this.queryAllExtClick().catch(h)

            // 分机组
            await this.queryGroupClick().catch(h);

            // 语音菜单
            await this.queryMenuClick().catch(h);

            // 所有中继
            await this.queryAllTrunkClick().catch(h);
            
            // 查询去电
            await this.queryOuterClick().catch(h);

            // 查询来电
            await this.queryVisitorClick().catch(h)

            // 语音文件
            await this.queryVoicefileClick().catch(h);

            this.$store.dispatch('omGroup/findAll')
            this.$store.dispatch('omExt/findAll')
            this.$store.dispatch('omMenu/findAll')
            this.$store.dispatch('omLine/findAll')
        },
        // 获取账号信息
        acountInfoFunc(){
            let account = sessionStorage.getItem('user')
            this.$api.user.findByName({name: account}).then(res => {
              let data = res.data
              this.$store.commit("setAcountInfo", data)
              console.log("账号信息----》", this.$store.state.acountInfo)
            })
        }
    }
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
<template>
  <div class="container">
        <!-- 导航菜单栏 -->
        <nav-bar>
            <template slot="header" v-if="routeInfo.name == '任务外呼'">
                <header class="acount">
                    <p class="picture">
                        <img src="@/assets/images/picture.jpg" />
                    </p><br/>
                    <p class="name">{{acountInfo.name}}</p><br/>
                    <p class="internal">坐席号：{{acountInfo.internal && acountInfo.internal.account}}</p><br/>
                    <p class="internal">坐席状态：
                        <span v-if="acountInfo.isBusy == 1"> 示忙</span>
                        <span v-if="acountInfo.isBusy == 2"> 空闲</span>
                    </p>
                </header>
            </template>
            <template slot="footer" v-if="routeInfo.name == '任务外呼'">
                <footer class="footer">
                    <p> 帮助 关于</p>
                    <p style="font-size: 12px; margin-top:10px;">广州智信通网络科技有限公司 <br/>版权所有</p>
                </footer>
            </template>
        </nav-bar>
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
            routeInfo: state => state.app.routeInfo,
            acountInfo: state => state.app.acountInfo
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
        
        let external
        window.ws = ws(websocketUrl+token, (resp)=>{
        
            if(resp === "连接成功") return;

            let json = JSON.parse(resp);
        
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
        //window.ws.open();
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
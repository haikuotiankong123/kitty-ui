import api from '@/http/omapi.js'
import util from "@/utils/util.js"

let state = {}
let mutations = {}
let actions = {}

function firstUpper(str){
    if(!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

for(let i in api){
    state[i] = []
    state[i + 'Form'] = {};

    actions[i+"Click"] = function(s, p={}){
        let store = this;
        
        let param = store.state[i+'Form'];
        
        return api[i]({...param,...p}).then(resp => {
            if(resp.success){
                let mutationName = 'set' + firstUpper(i)
                let data = resp.data
                store.commit(mutationName, data)
            }
            // 更新
            if(/^assign/.test(i) && !(/All/.test(i))){
                let mothod = i.replace('assign', 'query')
                store.dispatch(mothod + "Click")
            }

            return resp
        }).catch((err)=>{
            util.error(err.message)
        })
    }
}


let aApiName = Object.keys(api)
let aMutation = [...aApiName, 'callState', 'extState', 'allExt']
aMutation.forEach(i => {
    let name = i.charAt(0).toUpperCase()+i.slice(1);
    mutations['set'+ name] = function(state, data){
        
        //if(state[i]) state[i] = data
        state[i] = data
    }
    mutations['set'+ name + 'Form'] = function(state, data){
        if(state[i + 'Form']) state[i + 'Form'] = data
    }
});


export default {
    state: {
        ...state,
        extId: '1009',
        // 呼叫状态
        callState: {},
        // 分机状态
        extState:{},

        // 分机设置
        assignExt:{},
        // 查询分机
        queryExt:{},
        // 所有分机
        allExt: [],
        // 分机组
        queryGroup: {
            data: [],
            total: 0
        },
        // 语音菜单
        queryMenu: {
            data: [],
            total: 0
        },
        // 当前账号信息
        acountInfo:{},       
    },
    mutations:{
        ...mutations,
        setAcountInfo(state, data){
            if(!data.extId) data.extId = "当前账号未绑定分机"
            state.acountInfo = data
        }
    },
    getters: {},
    actions: {
        ...actions
    }
}


import api from '@/http/omapi.js'

let state = {}
for(let key in api){
    state[key + 'From'] = {}
}


let mutations = {}
for(let k in api){
    let name = k.charAt(0).toUpperCase()+k.slice(1);
    mutations['set'+ name] = function(state, data){
        if(state[k]) state[k] = data
    }
}

export default {
    state: {
        ...state,
        // 分机设置
        assignExt:{},
        // 查询分机
        queryExt:{},
        // 分机状态
        extState:{},
        // 呼叫状态
        callState: {},
        allExt: [],
        // 分机组
        queryGroup: [],
        // 语音菜单
        queryMenu: [],
    },
    mutations,
    getters: {},
    actions: {}
}


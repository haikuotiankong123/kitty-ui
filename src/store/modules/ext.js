import api from "@/http/omapi.js"

//console.log('api----->', api)

let state = {}
let mutations = {}

for(let k in api){
    state[k] = {}
    let name = k.charAt(0).toUpperCase()+k.slice(1);
    mutations['set'+ name] = function(state, data){
        this[k] = data
    }
}
// console.log('mutation----->', mutations)

/**  ext是“分机”的英文单词extension的简写  */

export default {
    
    state: {
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
        queryMenu: []
    },
    mutations:{
        setAssignExt(state, data){
            state.assignExt = data
        },
        setQueryExt(state, data){
            state.queryExt = data
        },
        setExtState(state, data){
            state.extState = data
        },
        setCallState(state, data){
            state.callState = data
        },
        setAllExt(state, data){
            state.allExt = data
        },
        setQueryGroup(state, data){
            state.queryGroup = data
        },
        setQueryMenu(state, data){
            state.queryMenu = data
        }
    },
    getters: {},
    actions: {}
}


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
        allExt: []
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
        }
    },
    getters: {},
    actions: {}
}


export default {
    state: {
        // 分机设置
        assignExt: {},
        // 查询分机
        queryExt: {}
    },
    mutations:{
        setAssignExt(state, data){
            state.assignExt = data
        },
        setQueryExt(state, data){
            state.queryExt = data
        }
    },
    getters: {},
    actions: {}
}

export default {
    state: {
        appName: "Kitty Platform",  // 应用名称
        //themeColor: "#14889A",  // 主题颜色
        themeColor: "#04b1fe",  // 主题颜色
        oldThemeColor: "#14889A",   // 上一次主题颜色
        collapse:false,  // 导航栏收缩状态
        menuRouteLoaded:false,    // 菜单和路由是否已经加载

        callStatus: false,  // 是否在通话中
        customerDetail: {},    // 当前客户对象
        acountInfo:{},       // 当前账号信息
        uuid: null,
        routeInfo: {},       // 当前路由信息
        isCallout: false,       // 是否是外呼页面
    },
    getters: {
        collapse(state){// 对应着上面state
            return state.collapse
        }
    },
    mutations: {
        onCollapse(state){  // 改变收缩状态
            state.collapse = !state.collapse
        },
        setThemeColor(state, themeColor){  // 改变主题颜色
            state.oldThemeColor = state.themeColor
            state.themeColor = themeColor
        },
        menuRouteLoaded(state, menuRouteLoaded){  // 改变菜单和路由的加载状态
            state.menuRouteLoaded = menuRouteLoaded;
        },

        setCustomerDetail(state, newCustomer){
            state.customerDetail = newCustomer
        },
        setCallStatus(state, bCall){
            // bCall是Boolean值
            state.callStatus = bCall;
        },
        setAcountInfo(state, obj){
            state.acountInfo = obj
        },
        setUuid(state, uuid){
            state.uuid = uuid
        },
        //设置当前路由信息
        setRouteInfo(state, obj){
            state.routeInfo = obj;
            state.isCallout = state.routeInfo.name == '任务外呼' || state.routeInfo.name == '工作台'
        }

    },
    actions: {
    }
}
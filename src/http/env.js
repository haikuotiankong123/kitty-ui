/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */


/* // 后台管理系统服务器地址
export const baseUrl = 'http://localhost:8090'
//export const baseUrl = 'http://m30a183279.qicp.vip/'    // 内网穿透
// 系统数据备份还原服务器地址
export const backupBaseUrl = 'http://localhost:8002'

export default {
    baseUrl,
    backupBaseUrl
} */


let baseUrl = ""
let backupBaseUrl = ""
let websocketUrl = ""
let uploadUrl = ''
let imgUrl = ""
let host = ""
if(process.env.NODE_ENV == 'development'){
    //host = "localhost";
    host = "192.168.10.25";

    baseUrl = `http://${host}:8090`

    backupBaseUrl = 'http://localhost:8002'

    websocketUrl = `ws://${host}:8090/ws/`

    uploadUrl = baseUrl + '/api?method=upload';

}else{
    host = "192.168.1.102";

    baseUrl = `http://${host}:8090`

    backupBaseUrl = 'http://localhost:8002'

    websocketUrl = `ws://${host}:8090/ws/`

    uploadUrl = baseUrl + '/api?method=upload';
}


export {
    baseUrl,
    backupBaseUrl,
    websocketUrl,
    uploadUrl
}

export default {
    baseUrl,
    backupBaseUrl,
    websocketUrl,
    uploadUrl
}



import {post} from './post.js'


/**
 * 切记 说三遍了
 * 参数说明：<>表示必填项，[]表示可选项 （当参数值为默认值或空时，响应消息可能不携带该参数）
 */

let api = {}

/**
 * 查询OM设备信息
 */
api.queryDevice = (data) => post('QueryDevice', data)

/**
 * 查询分机
 * <ext_id>
 */
api.queryExt = (data) => post('queryExt', data)

/**
 * 查询中继
 * <trunk_id>
 */
api.queryTrunk = data => post('queryTrunk', data)

// 配置“分机，中继，语音菜单” “is_save=true”则会保存到数据库
/**
 * 查询语音菜单
 * <menu_id>
 */
api.queryMenu = data => post('queryMenu', data)

/**
 * 配置语音菜单
 * <menu_id>
 */
api.assignMenu = data => post('assignMenu', data)

/**
 * 配置分机
 * <lineid>：分机的线路编号
 */
api.assignExt = (data) =>{
    let param = {}
    for(let key in data){
        param['extForm.'+key] = data[key]
    }
    return post('assignExt', param)
} 

/**
 * 分机呼分机
 * <ext_id>: 主叫
 * <ext_id_2>: 被叫
 */
api.ConnectExt = (data) => post('ConnectExt', {...data, sender: '1004'})      // 无  临时

/**
 * 处理来电转接功能，支持转分机，转语音菜单，外部电话
 */
api.connectVisitor = (data) => post('ConnectVisitor', {...data, sender: '1004'})    // 临时

/**
 * 还没有这个接口
 */
api.connectOuter = (data) => post('ConnectOuter', {...data, sender: '1004'})        // 临时



export default api
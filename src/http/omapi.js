
import {post} from './post.js'

let tempExt = '1004'

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
 * 同步所有分机
 * is_save
 */
api.queryAllExt = data => post('QueryAllExt', data)

/**
 * 查询中继
 * <trunk_id>
 */
api.queryTrunk = data => post('queryTrunk', data)

/**
 * 同步所有中继
 * is_save
 */
api.queryAllTrunk = data => post('QueryAllTrunk', data)

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
api.assignMenu = data => {
    let param = {}
    for(let key in data){
        param['menuForm.'+key] = data[key]
    }
    return post('assignMenu', param)
}

/**
 * 配置分机
 * <lineid>：分机的线路编号
 */
api.assignExt = (data) =>{
    let param = {}
    for(let key in data){
        param['extForm.'+key] = data[key]
    }
    return post('assignExt', {...param})
} 

/**
 * 设置分机组
 */
api.assignGroup = (data) => {
    let param = {}
    for(let key in data){
        if(key == 'exts'){
            param[key] = data[key]
        }else{
            param['groupForm.'+key] = data[key]
        }
    }
    return post('AssignGroup', param)
}
/**
 * 查询分机组
 */
api.queryGroup = data => post('queryGroup', data)


/**
 * 分机呼分机
 * <ext_id>: 主叫
 * <ext_id_2>: 被叫
 */
api.connectExt = (data) => post('ConnectExt', {...data, sender: tempExt})      // 无  临时


/**
 * 去电来电转接类型： 1：总机 | 2：挂断 | 3：分机 | 4：分机列表 | 5：分机组 | 6：IVR | 7：播放语音 | 8：转外部电话
 * 所对应的字段名称： default | clear  | ext_id  |  ext_id    | grou_id  | menu_id|  voicfile  | outer_to
 */
/**
 * 处理来电转接功能，支持转分机，转语音菜单，外部电话
 */
api.connectVisitor = (data) => post('ConnectVisitor', {...data, sender: tempExt})    // 临时

/**
 * 去电转接
 */
api.connectOuter = (data) => post('ConnectOuter', {...data, sender: tempExt})        // 临时

/**
 * 保存呼叫和静音
 */
api.controlCmd = data => post('ControlCmd', data)

/**
 * 三方通话（只能邀请分机加入）
 */
api.connectConference = data => post('ConnectConference', {...data, sender: tempExt})

/**
 * 语音菜单
 */
api.queryMenu = data => post('queryMenu', data)

/**
 * 分机组
 */
api.queryGroup = data => post('queryGroup', data)

/**
 * 查询语音文件
 */
api.queryVoice = data => post('QueryVoice', data)

/**
 * 上传分机组到OM设备
 */
api.assignAllGroup = data => post('AssignAllGroup', data)


export default api
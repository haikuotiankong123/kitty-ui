
import {post} from './post.js'

let api = {}

api.queryDevice = (data) => post('QueryDevice', data)

/**
 * 查询分机
 * <ext_id>
 */
api.queryExt = (data) => post('queryExt', data)

/**
 * 配置分机
 * ext_id 必填
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
 * param: {ext_id, ext_id_2}
 * ext_id: 主叫
 * ext_id_2: 被叫
 */
api.ConnectExt = (data) => post('ConnectExt', data)

export default api